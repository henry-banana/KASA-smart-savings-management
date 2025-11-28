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

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Expected YYYY-MM-DD",
      });
    }

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date value",
      });
    }

    const report = await reportService.getDailyReport(date);

    return res.status(200).json({
      message: "Daily report generated successfully",
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

export async function getMonthlyReport(req, res) {
  try {
    const { typeSavingId, month, year } = req.query;

    // 1. Validate Input
    if (!typeSavingId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameters: typeSavingId, month, year",
      });
    }

    const m = parseInt(month);
    const y = parseInt(year);

    if (isNaN(m) || m < 1 || m > 12 || isNaN(y) || y < 2000) {
      return res.status(400).json({
        success: false,
        message: "Invalid month or year",
      });
    }

    // 2. Gọi Service xử lý logic
    const reportData = await reportService.getMonthlyReport(typeSavingId, m, y);

    // 3. Trả về kết quả
    return res.status(200).json({
      message: "Get monthly report successfully",
      success: true,
      data: reportData,
    });

  } catch (err) {
    console.error("❌ Error generating monthly report:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

