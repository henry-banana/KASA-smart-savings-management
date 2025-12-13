import { apiClient } from "./apiClient";
import { logger } from "@/utils/logger";

/**
 * Real customer API adapter
 * Communicates with backend API for customer operations
 * API Contract: https://api.example.com/docs/customers
 */
export const customerApi = {
  /**
   * GET /api/customers/{citizenId}
   * Lấy thông tin khách hàng theo citizenId
   *
   * @param {string|number} citizenId - The citizen ID to search for
   * @returns {Promise<Object>} Response with customer data
   *
   * @example
   * // Response format:
   * {
   *   "message": "Customer retrieved successfully",
   *   "success": true,
   *   "data": {
   *     "customer": {
   *       "fullName": "Nguyen Van Testing",
   *       "citizenId": "012345",
   *       "street": "Test",
   *       "district": "Test",
   *       "province": "Test"
   *     }
   *   }
   * }
   */
  async searchCustomerByCitizenId(citizenId) {
    try {
      logger.info("🌐 API Search Customer by Citizen ID", { citizenId });

      const response = await apiClient.get(`/api/customers/${citizenId}`);

      // API returns: { message, success, data: { customer: {...} } }
      // Pass through the entire response for service layer to handle mapping
      return {
        message: response.data.message || "Customer retrieved successfully",
        success: true,
        data: response.data.data, // This contains { customer: {...} }
      };
    } catch (error) {
      logger.error("API Search Customer Error", { citizenId, error });

      // Handle 404 Not Found
      if (error.response?.status === 404) {
        return {
          message: "Customer not found",
          success: false,
          statusCode: 404,
        };
      }

      // Handle other HTTP errors
      if (error.response?.status) {
        return {
          message: error.response.data?.message || `Error: ${error.message}`,
          success: false,
          statusCode: error.response.status,
        };
      }

      // Handle network/other errors
      return {
        message: error.message || "Failed to search customer",
        success: false,
        statusCode: 500,
      };
    }
  },

  /**
   * GET /api/customers/id/{customerId}
   * Lấy thông tin khách hàng theo customerId
   *
   * @param {string} customerId - The customer ID
   * @returns {Promise<Object>} Response with customer data
   */
  async getCustomerById(customerId) {
    try {
      logger.info("🌐 API Get Customer by ID", { customerId });

      const response = await apiClient.get(`/api/customers/id/${customerId}`);

      return {
        message: response.data.message || "Customer retrieved successfully",
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      logger.error("API Get Customer Error", { customerId, error });

      if (error.response?.status === 404) {
        return {
          message: "Customer not found",
          success: false,
          statusCode: 404,
        };
      }

      if (error.response?.status) {
        return {
          message: error.response.data?.message || `Error: ${error.message}`,
          success: false,
          statusCode: error.response.status,
        };
      }

      return {
        message: error.message || "Failed to get customer",
        success: false,
        statusCode: 500,
      };
    }
  },

  /**
   * GET /api/customers
   * Lấy danh sách tất cả khách hàng
   *
   * @returns {Promise<Object>} Response with all customers
   */
  async getAllCustomers() {
    try {
      logger.info("🌐 API Get All Customers");

      const response = await apiClient.get("/api/customers");

      return {
        message: response.data.message || "Get customers successfully",
        success: true,
        data: response.data.data,
        total: response.data.total,
      };
    } catch (error) {
      logger.error("API Get All Customers Error", { error });

      if (error.response?.status) {
        return {
          message: error.response.data?.message || `Error: ${error.message}`,
          success: false,
          statusCode: error.response.status,
        };
      }

      return {
        message: error.message || "Failed to get customers",
        success: false,
        statusCode: 500,
      };
    }
  },

  /**
   * POST /api/customers
   * Thêm khách hàng mới
   *
   * @param {Object} body - The request body
   * @param {string} body.fullName - Customer full name
   * @param {string|number} body.citizenId - Citizen ID (e.g., "012345")
   * @param {string} body.street - Street address
   * @param {string} body.district - District
   * @param {string} body.province - Province
   * @returns {Promise<Object>} Response with created customer
   *
   * @example
   * // Request:
   * {
   *   "fullName": "Nguyen Van Testing",
   *   "citizenId": "012345",
   *   "street": "Test",
   *   "district": "Test",
   *   "province": "Test"
   * }
   *
   * // Response:
   * {
   *   "message": "Customer added successfully",
   *   "success": true,
   *   "total": 1,
   *   "data": {
   *     "customer": {
   *       "customerId": 101,
   *       "fullName": "Nguyen Van Testing",
   *       "citizenId": "012345",
   *       "street": "Test",
   *       "district": "Test",
   *       "province": "Test"
   *     }
   *   }
   * }
   */
  async createCustomer(body) {
    try {
      logger.info("🌐 API Create Customer", { body });

      const response = await apiClient.post("/api/customers", body);

      return {
        message: response.data.message || "Customer added successfully",
        success: true,
        total: response.data.total || 1,
        data: response.data.data,
      };
    } catch (error) {
      logger.error("API Create Customer Error", { body, error });

      // Handle validation errors (400 Bad Request)
      if (error.response?.status === 400) {
        return {
          message: error.response.data?.message || "Validation error",
          success: false,
          statusCode: 400,
        };
      }

      // Handle conflict errors (409 Duplicate citizenId)
      if (error.response?.status === 409) {
        return {
          message: error.response.data?.message || "Citizen ID already exists",
          success: false,
          statusCode: 409,
        };
      }

      // Handle other HTTP errors
      if (error.response?.status) {
        return {
          message: error.response.data?.message || `Error: ${error.message}`,
          success: false,
          statusCode: error.response.status,
        };
      }

      // Handle network/other errors
      return {
        message: error.message || "Failed to create customer",
        success: false,
        statusCode: 500,
      };
    }
  },
};

export default customerApi;
