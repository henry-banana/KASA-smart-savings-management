import { USE_MOCK } from "@/config/app.config";
// import { dashboardApi } from '@/api/dashboardApi'; // TODO: Create when backend is ready
import { mockDashboardAdapter } from "@/mocks/adapters/dashboardAdapter";

const dashboardAdapter = USE_MOCK ? mockDashboardAdapter : null; // TODO: Replace null with dashboardApi when ready

/**
 * Get dashboard statistics
 * TODO: Implement when backend provides dashboard stats API
 *
 * Expected response structure:
 * {
 *   success: true,
 *   data: {
 *     stats: {
 *       activeAccounts: number,
 *       depositsToday: number,
 *       withdrawalsToday: number,
 *       changes: {
 *         activeAccounts: string (e.g., "+12.5%"),
 *         depositsToday: string,
 *         withdrawalsToday: string
 *       }
 *     },
 *     weeklyTransactions: Array<{ day: string, deposits: number, withdrawals: number }>,
 *     accountTypeDistribution: Array<{ type: string, count: number }>
 *   }
 * }
 *
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboardStats = async () => {
  if (!dashboardAdapter) {
    throw new Error(
      "Dashboard API not configured. Enable USE_MOCK or configure backend API."
    );
  }

  return dashboardAdapter.getDashboardStats();
};

/**
 * Get interest rates for all saving types
 * TODO: Implement when backend provides interest rates API
 *
 * Expected response structure:
 * {
 *   success: true,
 *   data: [
 *     { type: 'no-term', name: 'No Term', rate: 2.0 },
 *     { type: '3-months', name: '3 Months', rate: 4.5 },
 *     { type: '6-months', name: '6 Months', rate: 5.5 }
 *   ]
 * }
 *
 * @returns {Promise<Object>} Interest rates data
 */
export const getInterestRates = async () => {
  if (!dashboardAdapter) {
    throw new Error(
      "Dashboard API not configured. Enable USE_MOCK or configure backend API."
    );
  }

  return dashboardAdapter.getInterestRates();
};

/**
 * Update interest rates
 * TODO: Implement when backend provides update interest rates API
 *
 * @param {Array} rates - Array of rate objects { type, rate }
 * @returns {Promise<Object>} Updated rates
 */
export const updateInterestRates = async (rates) => {
  if (!dashboardAdapter) {
    throw new Error(
      "Dashboard API not configured. Enable USE_MOCK or configure backend API."
    );
  }

  return dashboardAdapter.updateInterestRates(rates);
};

/**
 * Get regulation change history
 * TODO: Implement when backend provides change history API
 *
 * Expected response structure:
 * {
 *   success: true,
 *   data: [
 *     {
 *       date: string (YYYY-MM-DD),
 *       user: string,
 *       field: string,
 *       oldValue: string,
 *       newValue: string
 *     }
 *   ]
 * }
 *
 * @returns {Promise<Object>} Change history data
 */
export const getChangeHistory = async () => {
  if (!dashboardAdapter) {
    throw new Error(
      "Dashboard API not configured. Enable USE_MOCK or configure backend API."
    );
  }

  return dashboardAdapter.getChangeHistory();
};

/**
 * Get recent transactions
 * TODO: Implement when backend provides recent transactions API
 *
 * Expected response structure:
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: string,
 *       customer: string,
 *       type: string,
 *       amount: string,
 *       time: string,
 *       emoji: string,
 *       color: string
 *     }
 *   ]
 * }
 *
 * @returns {Promise<Object>} Recent transactions data
 */
export const getRecentTransactions = async () => {
  if (!dashboardAdapter) {
    throw new Error(
      "Dashboard API not configured. Enable USE_MOCK or configure backend API."
    );
  }

  return dashboardAdapter.getRecentTransactions();
};
