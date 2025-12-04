import { USE_MOCK } from "@/config/app.config";
import { branchApi } from "@/api/branchApi";
import { mockBranchAdapter } from "@/mocks/adapters/branchAdapter";

// Switch between mock and real API at service layer
const branchAdapter = USE_MOCK ? mockBranchAdapter : branchApi;

export const branchService = {
  /**
   * Get all branch names
   */
  async getBranchNames() {
    const response = await branchAdapter.getBranchNames();
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list)
      ? list
      : Array.isArray(list?.data)
      ? list.data
      : [];
  },
};

// Legacy exports for backward compatibility
export const getBranchNames = () => branchService.getBranchNames();
