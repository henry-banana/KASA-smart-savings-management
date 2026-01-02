import { buildDailyReportResponse } from "../responses/dailyReport.responses";
// monthlyReport response builder removed (not used after removing legacy getMonthlyReport)
import { mockTransactions } from "../data/transactions";
import { mockSavingBooks } from "../data/savingBooks";
import { mockTypeSavings } from "../data/typeSavings";
import { randomDelay } from "../utils";
import { logger } from "@/utils/logger";

export const mockReportAdapter = {
  async getDailyReport(date) {
    await randomDelay();
    const reportDate = date || new Date().toISOString().split("T")[0];
    logger.info("🎭 Mock Daily Report", { date: reportDate });

    // Filter transactions by date
    const dailyTransactions = mockTransactions.filter((t) =>
      t.transactionDate?.startsWith(reportDate)
    );

    // Calculate deposits and withdrawals
    const totalDeposits = dailyTransactions
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = dailyTransactions
      .filter((t) => t.type === "withdraw")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate summary statistics
    // Approximate counts for opened/closed books
    const newBooksCount = mockSavingBooks.filter(
      (sb) => sb.openDate === reportDate
    ).length;

    // Count books that were closed and had a withdrawal on the report date
    const closedBooksCount = (() => {
      const withdrawalsOnDate = dailyTransactions.filter(
        (t) => t.type === "withdraw"
      );
      const closedIds = new Set(
        mockSavingBooks
          .filter((sb) => sb.status === "close")
          .map((sb) => sb.bookId)
      );
      let count = 0;
      withdrawalsOnDate.forEach((t) => {
        if (closedIds.has(t.bookId)) count += 1;
      });
      return count;
    })();

    const summary = {
      totalDeposits,
      totalWithdrawals,
      netCashFlow: totalDeposits - totalWithdrawals,
      transactionCount: dailyTransactions.length,
      depositCount: dailyTransactions.filter((t) => t.type === "deposit")
        .length,
      withdrawalCount: dailyTransactions.filter((t) => t.type === "withdraw")
        .length,
      newSavingBooks: newBooksCount,
      closedSavingBooks: closedBooksCount,
    };

    // Calculate breakdown by type saving
    const byTypeSaving = mockTypeSavings.map((type) => {
      // Get all saving books of this type
      const booksOfType = mockSavingBooks.filter(
        (sb) => sb.typeSavingId === type.typeSavingId
      );
      const bookIds = booksOfType.map((sb) => sb.bookId);

      // Get transactions for these books on this date
      const typeTransactions = dailyTransactions.filter((t) =>
        bookIds.includes(t.bookId)
      );

      const depositTransactions = typeTransactions.filter(
        (t) => t.type === "deposit"
      );
      const withdrawalTransactions = typeTransactions.filter(
        (t) => t.type === "withdraw"
      );

      const totalDeposits = depositTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );
      const totalWithdrawals = withdrawalTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );

      return {
        typeSavingId: type.typeSavingId,
        typeName: type.typeName,
        totalDeposits,
        totalWithdrawals,
        difference: totalDeposits - totalWithdrawals,
        depositCount: depositTransactions.length,
        withdrawalCount: withdrawalTransactions.length,
      };
    });

    return buildDailyReportResponse({
      date: reportDate,
      summary,
      byTypeSaving,
      // mock-extension: transaction details and new books list for UI visualization
      transactions: dailyTransactions,
      newSavingBooks: [],
    });
  },

  /**
   * Get daily transaction statistics per OpenAPI: GET /api/report/daily/transactions?date=YYYY-MM-DD
   * Mục đích: Lấy số lượng giao dịch gửi tiền và rút tiền theo từng loại sổ tiết kiệm trong ngày
   */
  async getDailyTransactionStatistics(date) {
    await randomDelay();
    const reportDate = date || new Date().toISOString().split("T")[0];
    logger.info("🎭 Mock Daily Transaction Statistics", { date: reportDate });

    // Filter transactions by date
    const dailyTransactions = mockTransactions.filter((t) =>
      t.transactionDate?.startsWith(reportDate)
    );

    // Group transactions by type and count by typeSaving
    const depositsByType = {};
    const withdrawalsByType = {};

    // Initialize all types with 0
    mockTypeSavings.forEach((type) => {
      depositsByType[type.typeSavingId] = {
        typeSavingId: type.typeSavingId,
        typeName: type.typeName,
        count: 0,
      };
      withdrawalsByType[type.typeSavingId] = {
        typeSavingId: type.typeSavingId,
        typeName: type.typeName,
        count: 0,
      };
    });

    // Count transactions by type and saving type
    dailyTransactions.forEach((transaction) => {
      const savingBook = mockSavingBooks.find(
        (sb) => sb.bookId === transaction.bookId
      );
      if (!savingBook) return;

      const typeSavingId = savingBook.typeSavingId;

      if (transaction.type === "deposit") {
        if (depositsByType[typeSavingId]) {
          depositsByType[typeSavingId].count += 1;
        }
      } else if (transaction.type === "withdraw") {
        if (withdrawalsByType[typeSavingId]) {
          withdrawalsByType[typeSavingId].count += 1;
        }
      }
    });

    // Calculate totals
    const totalDepositCount = Object.values(depositsByType).reduce(
      (sum, item) => sum + item.count,
      0
    );
    const totalWithdrawalCount = Object.values(withdrawalsByType).reduce(
      (sum, item) => sum + item.count,
      0
    );

    // Build response per OPENAPI contract
    return {
      message: "Get daily transaction statistics successfully",
      success: true,
      data: {
        date: reportDate,
        deposits: {
          items: Object.values(depositsByType).filter((item) => item.count > 0),
          total: {
            count: totalDepositCount,
          },
        },
        withdrawals: {
          items: Object.values(withdrawalsByType).filter(
            (item) => item.count > 0
          ),
          total: {
            count: totalWithdrawalCount,
          },
        },
      },
    };
  },

  /**
   * BM5.2 - Get monthly opening/closing savings books report
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @param {string} savingsType - Savings type filter ('all', 'no-term', '3-months', etc.)
   * @returns {Promise<Object>} Monthly open/close report data
   */
  async getMonthlyOpenCloseReport(month, year, savingsType = "all") {
    await randomDelay();
    const reportMonth = month || new Date().getMonth() + 1;
    const reportYear = year || new Date().getFullYear();
    logger.info("🎭 Mock Monthly Open/Close Report", {
      month: reportMonth,
      year: reportYear,
      savingsType,
    });

    const daysInMonth = new Date(reportYear, reportMonth, 0).getDate();

    // Filter saving books based on savingsType
    let filteredTypeSavings = mockTypeSavings;
    if (savingsType !== "all") {
      const typeMapping = {
        "no-term": "Không kỳ hạn",
        "3-months": "3 Tháng",
        "6-months": "6 Tháng",
        "12-months": "12 Tháng",
      };
      const typeName = typeMapping[savingsType];
      if (typeName) {
        filteredTypeSavings = mockTypeSavings.filter(
          (t) =>
            t.typeName.toLowerCase().includes(typeName.toLowerCase()) ||
            t.typeName.toLowerCase().includes(savingsType.replace("-", " "))
        );
      }
    }

    // Generate daily breakdown
    const byDay = [];
    let totalOpened = 0;
    let totalClosed = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${reportYear}-${String(reportMonth).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      // Count books opened on this day
      const openedOnDay = mockSavingBooks.filter((sb) => {
        const matchesDate = sb.openDate === dateStr;
        if (savingsType === "all") return matchesDate;
        const typeIds = filteredTypeSavings.map((t) => t.typeSavingId);
        return matchesDate && typeIds.includes(sb.typeSavingId);
      }).length;

      // Count books closed on this day (simulate some closures)
      const closedOnDay = mockSavingBooks.filter((sb) => {
        const matchesClosed =
          sb.status === "closed" && sb.closeDate === dateStr;
        if (savingsType === "all") return matchesClosed;
        const typeIds = filteredTypeSavings.map((t) => t.typeSavingId);
        return matchesClosed && typeIds.includes(sb.typeSavingId);
      }).length;

      // If no real data, generate random mock data for demonstration
      const opened = openedOnDay || Math.floor(Math.random() * 10) + 1;
      const closed = closedOnDay || Math.floor(Math.random() * 5);

      byDay.push({
        day,
        opened,
        closed,
        difference: opened - closed,
      });

      totalOpened += opened;
      totalClosed += closed;
    }

    return {
      message: "Get monthly report successfully",
      success: true,
      data: {
        month: reportMonth,
        year: reportYear,
        // Canonical fields per OpenAPI
        items: byDay.map((item) => ({
          day: item.day,
          newSavingBooks: item.opened,
          closedSavingBooks: item.closed,
          difference: item.difference,
        })),
        total: {
          newSavingBooks: totalOpened,
          closedSavingBooks: totalClosed,
          difference: totalOpened - totalClosed,
        },
        // mock-extension: savingsType filter for UI
        meta: {
          savingsType,
        },
      },
    };
  },
};
