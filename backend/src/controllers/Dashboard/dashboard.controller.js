import { dashboardService } from "../../services/Dashboard/dashboard.service.js";

export async function getDashboardStats(req, res) {
  try {
    const stats = await dashboardService.getStats();

    return res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      success: true,
      data: stats
    });

  } catch (err) {
    console.error("❌ Error getting dashboard stats:", err);
    return res.status(500).json({
      message: "Failed to retrieve dashboard statistics",
      success: false,
      error: err.message
    });
  }
}

//for api get rêcnt trans
export async function getRecentTransactions(req, res) {
  try {
    const data = await dashboardService.getRecentTransactions();

    return res.status(200).json({
      message: "Recent transactions retrieved successfully",
      success: true,
      data: data,
      total: data.length
    });

  } catch (err) {
    console.error("❌ Error getting recent transactions:", err);
    return res.status(500).json({
      message: "Failed to retrieve recent transactions",
      success: false,
      error: err.message
    });
  }
}