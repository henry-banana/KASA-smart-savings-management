import {
  findCustomerByCitizenId,
  findCustomerById,
  mockCustomers,
  addCustomer,
} from "../data/customers";
import {
  buildGetCustomerByIdResponse,
  customerResponseTemplates,
} from "../responses/customer.responses";
import { randomDelay } from "../utils";
import { logger } from "@/utils/logger";

export const mockCustomerAdapter = {
  /**
   * Search customer by citizen ID
   * @param {string|number} citizenId - The citizen ID to search for
   * @returns {Promise<Object>} Response with customer data or error
   */
  async searchCustomerByCitizenId(citizenId) {
    await randomDelay();
    logger.info("🎭 Mock Search Customer by Citizen ID", { citizenId });

    if (!citizenId || String(citizenId).trim() === "") {
      throw new Error("Citizen ID is required");
    }

    const customer = findCustomerByCitizenId(citizenId);

    // DEV ONLY: Sanity check for citizenId lookup
    if (import.meta.env.DEV) {
      console.log(
        `[DEV] Customer lookup: citizenId="${citizenId}" => ${
          customer
            ? `✓ Found: ${customer.fullname} (${customer.customerid})`
            : "✗ Not found"
        }`
      );
    }

    if (!customer) {
      // Return 404-like response
      return {
        message: "Customer not found",
        success: false,
        statusCode: 404,
      };
    }

    // Map internal fields to OpenAPI contract shape
    return {
      message: "Customer retrieved successfully",
      success: true,
      data: {
        customer: {
          fullName: customer.fullname,
          citizenId: String(customer.citizenid),
          street: customer.street || customer.address || "",
          district: customer.district || "",
          province: customer.province || "",
        },
      },
    };
  },

  /**
   * Get customer by customer ID
   * @param {string} customerId - The customer ID
   * @returns {Promise<Object>} Response with customer data or error
   */
  async getCustomerById(customerId) {
    await randomDelay();
    logger.info("🎭 Mock Get Customer by ID", { customerId });

    const customer = findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    return buildGetCustomerByIdResponse(customer);
  },

  /**
   * Get all customers
   * @returns {Promise<Object>} Response with all customers
   */
  async getAllCustomers() {
    await randomDelay();
    logger.info("🎭 Mock Get All Customers");

    return {
      message: "Get customers successfully",
      success: true,
      data: mockCustomers,
      total: mockCustomers.length,
    };
  },

  /**
   * Create a new customer (mock POST /api/customers)
   * @param {Object} body - The request body
   * @param {string} body.fullName
   * @param {string|number} body.citizenId
   * @param {string} body.street
   * @param {string} body.district
   * @param {string} body.province
   * @returns {Promise<Object>} Mock response
   */
  async createCustomer(body) {
    await randomDelay();
    logger.info("🎭 Mock Create Customer", { body });

    const { fullName, citizenId, street, district, province } = body || {};

    // Basic validation
    if (!fullName || !String(fullName).trim()) {
      return {
        success: false,
        statusCode: 400,
        message: "Full name is required",
      };
    }
    if (!citizenId || String(citizenId).trim() === "") {
      return {
        success: false,
        statusCode: 400,
        message: "Citizen ID is required",
      };
    }
    if (!street || !String(street).trim()) {
      return {
        success: false,
        statusCode: 400,
        message: "Street is required",
      };
    }
    if (!district || !String(district).trim()) {
      return {
        success: false,
        statusCode: 400,
        message: "District is required",
      };
    }
    if (!province || !String(province).trim()) {
      return {
        success: false,
        statusCode: 400,
        message: "Province is required",
      };
    }

    // Duplicate check by citizenId
    const existing = findCustomerByCitizenId(citizenId);
    if (existing) {
      return {
        success: false,
        statusCode: 400,
        message: "Citizen ID already exists",
      };
    }

    // Generate incrementing numeric customerid based on current max
    const currentMax = mockCustomers.reduce((max, c) => {
      const n = parseInt(String(c.customerid).replace(/\D/g, ""), 10);
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 0);
    const newId = currentMax + 1;

    const newCustomer = {
      customerid: newId,
      fullname: String(fullName),
      citizenid: String(citizenId),
      street: String(street),
      district: String(district),
      province: String(province),
    };

    addCustomer(newCustomer);

    return {
      message: "Customer added successfully",
      success: true,
      total: 1,
      data: {
        customer: {
          customerId: newCustomer.customerid,
          fullName: newCustomer.fullname,
          citizenId: newCustomer.citizenid,
          street: newCustomer.street,
          district: newCustomer.district,
          province: newCustomer.province,
        },
      },
    };
  },
};

export default mockCustomerAdapter;
