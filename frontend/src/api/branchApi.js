import { apiClient } from "./apiClient";

/**
 * Branch API - Real API calls only
 */
export const branchApi = {
  /**
   * Get all branch names
   */
  async getBranchNames() {
    const response = await apiClient.get("/api/branch/name");
    return response.data;
  },
};
