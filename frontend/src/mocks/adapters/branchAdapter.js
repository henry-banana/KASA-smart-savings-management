import { mockBranches } from "../data/branches";
import { randomDelay } from "../utils";
import { logger } from "@/utils/logger";

export const mockBranchAdapter = {
  /**
   * Get all branch names
   */
  async getBranchNames() {
    await randomDelay();
    logger.info("🎭 Mock Get Branch Names");

    return {
      message: "Branches retrieved successfully",
      success: true,
      total: mockBranches.length,
      data: mockBranches,
    };
  },
};
