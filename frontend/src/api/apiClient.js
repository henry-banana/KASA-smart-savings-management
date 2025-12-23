import axios from "axios";
import { APP_CONFIG } from "@/config/app.config";
import { ERROR_MESSAGES } from "@/constants/messages";
import { logger } from "@/utils/logger";

export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Public endpoints that don't require token
    const publicEndpoints = [
      "/api/auth/login",
      "/api/auth/forgot-password",
      "/api/auth/verify-otp",
      "/api/auth/reset-password",
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // Add token to all non-public endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        logger.debug("Token added to request", {
          url: config.url,
          hasToken: !!token,
          tokenPreview: token?.substring(0, 20) + "...",
        });
      } else {
        logger.debug("No token found in localStorage", {
          url: config.url,
        });
      }
    }

    logger.debug("API Request", {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    logger.error("Request Error", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    logger.debug("API Response", { status: response.status });
    return response;
  },
  (error) => {
    if (!error.response) {
      logger.error("Network Error", error);
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        type: "NETWORK_ERROR",
      });
    }

    const { status, data } = error.response;
    logger.error("API Error", { status, message: data?.message, data });

    switch (status) {
      case 400:
        return Promise.reject({
          ...data,
          message: data?.message || ERROR_MESSAGES.SERVER_ERROR,
          type: "BAD_REQUEST",
        });

      case 401:
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        return Promise.reject({
          message: ERROR_MESSAGES.AUTH_ERROR,
          type: "AUTH_ERROR",
        });

      case 403:
        return Promise.reject({
          message: ERROR_MESSAGES.PERMISSION_ERROR,
          type: "PERMISSION_ERROR",
        });

      case 404:
        return Promise.reject({
          message: data?.message || ERROR_MESSAGES.NOT_FOUND,
          type: "NOT_FOUND",
        });

      default:
        return Promise.reject({
          ...data,
          message: data?.message || ERROR_MESSAGES.SERVER_ERROR,
          type: "SERVER_ERROR",
        });
    }
  }
);
