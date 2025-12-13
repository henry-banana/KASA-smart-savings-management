import {
  findCustomerByCitizenId,
  findCustomerById,
  mockCustomers,
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

    return buildGetCustomerByIdResponse(customer);
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
};

export default mockCustomerAdapter;
