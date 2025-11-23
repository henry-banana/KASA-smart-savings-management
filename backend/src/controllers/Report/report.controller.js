import { reportService } from "../../services/Report/report.service.js";

export async function getDailyReport(req, res) {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Missing query parameter: date (YYYY-MM-DD)",
      });
    }

    const report = await reportService.getDailyReport(date);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("❌ Error generating daily report:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
