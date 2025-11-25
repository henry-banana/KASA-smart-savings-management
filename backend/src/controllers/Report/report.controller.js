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

export async function getMonthlyReport(req, res) {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Missing query parameters: month and year",
      });
    }

    const report = await reportService.getMonthlyReport(month, year);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("❌ Error generating monthly report:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getInterestReport(req, res) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Missing query parameters: startDate and endDate (YYYY-MM-DD)",
      });
    }

    const report = await reportService.getInterestReport(startDate, endDate);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("❌ Error generating interest report:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getTransactionsReport(req, res) {
  try {
    const { startDate, endDate, type } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Missing query parameters: startDate and endDate (YYYY-MM-DD)",
      });
    }

    const report = await reportService.getTransactionsReport(startDate, endDate, type);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("❌ Error generating transactions report:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getSavingBookSummary(req, res) {
  try {
    const summary = await reportService.getSavingBookSummary();

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err) {
    console.error("❌ Error generating saving book summary:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
