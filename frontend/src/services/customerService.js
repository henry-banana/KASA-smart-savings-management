import { USE_MOCK } from "@/config/app.config";
import { mockCustomerAdapter } from "@/mocks/adapters/customerAdapter";
import { customerApi } from "@/api/customerApi";

const customerAdapter = USE_MOCK ? mockCustomerAdapter : customerApi;

export const customerService = {
  /**
   * Search customer by citizen ID
   * @param {string|number} citizenId - The citizen ID to search for
   * @returns {Promise<Object>} Customer data if found
   * @throws {Error} If customer not found or validation fails
   */
  async searchCustomerByCitizenId(citizenId) {
    if (!citizenId || String(citizenId).trim() === "") {
      throw new Error("Citizen ID is required");
    }

    if (!customerAdapter) {
      throw new Error("Customer API not configured");
    }

    const response = await customerAdapter.searchCustomerByCitizenId(citizenId);

    // Handle 404 response
    if (!response.success && response.statusCode === 404) {
      throw new Error("Customer not found");
    }

    if (!response.success) {
      throw new Error(response.message || "Failed to search customer");
    }

    // Map adapter response to ensure OpenAccount receives expected fields:
    // - fullname (lowercase, from API)
    // - fullName (camelCase, derived)
    // - address (always composed from street, district, province if missing)
    if (response.success && response.data) {
      // Real API wraps customer in data.customer; mock returns flat data
      const customer = response.data.customer || response.data;

      // Extract fields (handle both camelCase from API and lowercase from mock)
      const fullname = customer.fullname || customer.fullName || "";
      const street = customer.street || "";
      const district = customer.district || "";
      const province = customer.province || "";
      const address = customer.address || "";

      // Compose address from parts, skipping empty values
      const composedAddress = [street, district, province]
        .filter((s) => s && String(s).trim())
        .join(", ");

      response.data = {
        ...response.data,
        fullname,
        fullName: fullname, // Camelcase variant for compatibility
        street,
        district,
        province,
        address: address || composedAddress, // Use provided address or compose it
      };
    }

    return response;
  },

  /**
   * Get customer by customer ID
   * @param {string} customerId - The customer ID
   * @returns {Promise<Object>} Customer data
   */
  async getCustomerById(customerId) {
    if (!customerId || String(customerId).trim() === "") {
      throw new Error("Customer ID is required");
    }

    if (!customerAdapter) {
      throw new Error("Customer API not configured");
    }

    const response = await customerAdapter.getCustomerById(customerId);

    if (!response.success) {
      throw new Error(response.message || "Failed to get customer");
    }

    return response;
  },

  /**
   * Get all customers
   * @returns {Promise<Object>} List of all customers
   */
  async getAllCustomers() {
    if (!customerAdapter) {
      throw new Error("Customer API not configured");
    }

    const response = await customerAdapter.getAllCustomers();

    if (!response.success) {
      throw new Error(response.message || "Failed to get customers");
    }

    return response;
  },

  /**
   * Create a new customer
   * @param {Object} payload - { fullName, citizenId, street, district, province }
   * @returns {Promise<Object>} Created customer response
   */
  async createCustomer(payload) {
    const { fullName, citizenId, street, district, province } = payload || {};

    if (!fullName || String(fullName).trim() === "") {
      throw new Error("Full name is required");
    }
    if (!citizenId || String(citizenId).trim() === "") {
      throw new Error("Citizen ID is required");
    }
    if (!street || String(street).trim() === "") {
      throw new Error("Street is required");
    }
    if (!district || String(district).trim() === "") {
      throw new Error("District is required");
    }
    if (!province || String(province).trim() === "") {
      throw new Error("Province is required");
    }

    if (!customerAdapter) {
      throw new Error("Customer API not configured");
    }

    const response = await customerAdapter.createCustomer({
      fullName,
      citizenId,
      street,
      district,
      province,
    });

    if (!response.success) {
      throw new Error(response.message || "Failed to create customer");
    }

    // Normalize response data to ensure consistent format
    // Real API returns: { data: { customer: { customerId, fullName, ... } } }
    // Mock returns: { data: { customer: { customerId, fullName, ... } } }
    if (response.data) {
      const customer = response.data.customer || response.data;
      // Ensure we return a consistent customer object with both cases
      response.data = {
        ...response.data,
        customer: {
          customerId: customer.customerId || customer.customerid,
          fullName: customer.fullName || customer.fullname,
          citizenId: customer.citizenId || customer.citizenid,
          street: customer.street || "",
          district: customer.district || "",
          province: customer.province || "",
        },
      };
    }

    return response;
  },
};

export default customerService;
