/**
 * Mock data for Dashboard statistics
 * Aggregated data from various sources
 */

import { mockSavingBooks } from "./savingBooks";
import { mockTypeSavings } from "./typeSavings";
import { mockTransactions } from "./transactions";
import { getTypeChartColor } from "../../utils/typeColorUtils";
// import { mockCustomers } from './customers'; // Not used yet, for future enhancements

/**
 * Calculate dashboard statistics from mock data
 */
export const calculateDashboardStats = () => {
  const now = new Date();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const activeSavingBooks = mockSavingBooks.filter(
    (sb) => sb.status === "open" || sb.status === "active"
  ).length;

  const sumTransactionsInRange = (startDay, endDay) => {
    let deposits = 0;
    let withdrawals = 0;

    mockTransactions.forEach((t) => {
      const txnDate = new Date(t.transactionDate || now);
      const diffDays = (now - txnDate) / MS_PER_DAY;

      if (diffDays >= startDay && diffDays < endDay) {
        if (t.type === "deposit") deposits += t.amount || 0;
        else if (t.type === "withdraw") withdrawals += t.amount || 0;
      }
    });

    return { deposits, withdrawals };
  };

  const currentWeekTotals = sumTransactionsInRange(0, 7);
  const previousWeekTotals = sumTransactionsInRange(7, 14);

  const depositsComparePreWeek =
    currentWeekTotals.deposits - previousWeekTotals.deposits;
  const withdrawalsComparePreWeek =
    currentWeekTotals.withdrawals - previousWeekTotals.withdrawals;

  const formatPercentChange = (current, previous) => {
    if (!previous) return current ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  const changes = {
    activeSavingBooks: "+0%",
    currentDeposits: formatPercentChange(
      currentWeekTotals.deposits,
      previousWeekTotals.deposits
    ),
    currentWithdrawals: formatPercentChange(
      currentWeekTotals.withdrawals,
      previousWeekTotals.withdrawals
    ),
  };

  return {
    activeSavingBooks,
    depositsComparePreWeek,
    withdrawalsComparePreWeek,
    changes,
  };
};

/**
 * Calculate weekly transaction trends
 * Returns data in format matching backend API: name as "DD.MM", amounts in millions VND
 */
export const calculateWeeklyTransactions = () => {
  const today = new Date();
  const weekData = [];

  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayTransactions = mockTransactions.filter ((t) =>
      t.transactionDate?.startsWith(dateStr)
    );

    const deposits = dayTransactions
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);

    const withdrawals = dayTransactions
      .filter((t) => t.type === "withdraw")
      .reduce((sum, t) => sum + t.amount, 0);

    // Format as DD.MM to match backend API
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const formattedDate = `${day}.${month}`;

    weekData.push({
      name: formattedDate,
      deposits: deposits / 1000000, // Convert to millions VND (keep decimal precision)
      withdrawals: withdrawals / 1000000,
    });
  }

  return weekData;
};

/**
 * Calculate account type distribution
 * Returns data matching backend API format (no color field - handled by frontend)
 */
export const calculateAccountTypeDistribution = () => {
  // Build counts keyed by typeSavingId from configured mockTypeSavings
  const counts = mockTypeSavings.reduce((acc, ts) => {
    acc[ts.typeSavingId] = 0;
    return acc;
  }, {});

  // Count active saving books per typeSavingId
  mockSavingBooks
    .filter((sb) => sb.status === "open")
    .forEach((sb) => {
      if (sb.typeSavingId && counts.hasOwnProperty(sb.typeSavingId)) {
        counts[sb.typeSavingId] += 1;
      } else {
        counts["OTHER"] = (counts["OTHER"] || 0) + 1;
      }
    });

  // Map configured types to result array (without color - frontend handles it)
  const result = mockTypeSavings.map((ts) => ({
    name: ts.typeName,
    value: counts[ts.typeSavingId] || 0,
  }));

  // Append 'Other' bucket if present
  if (counts["OTHER"]) {
    result.push({ name: "Other", value: counts["OTHER"] });
  }

  return result;
};

/**
 * Mock data for changes/trends (percentage changes)
 * In real app, this would be calculated from historical data
 */
/**
 * Get recent transactions (last 5 transactions)
 * Returns raw data per OpenAPI contract matching backend API format
 */
export const getRecentTransactions = () => {
  // Get last 5 transactions sorted by date desc
  const recentTxns = [...mockTransactions]
    .sort((a, b) => {
      const dateA = new Date(a.transactionDate || "2025-01-01");
      const dateB = new Date(b.transactionDate || "2025-01-01");
      return dateB - dateA;
    })
    .slice(0, 5);

  return recentTxns.map((txn) => {
    // Find saving book for customer name
    const savingBook = mockSavingBooks.find((sb) => sb.bookId === txn.bookId);
    const customerName = savingBook?.customerName || "Unknown Customer";
    const accountCode = savingBook?.bookId || txn.bookId; // bookId is used as accountCode

    // Parse date and time from transactionDate
    const txnDate = new Date(txn.transactionDate || Date.now());
    const date = txnDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const hours = txnDate.getHours().toString().padStart(2, "0");
    const minutes = txnDate.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`; // HH:mm

    // Return data matching backend API format (bookId instead of accountCode)
    return {
      id: txn.transactionId,
      date,
      time,
      customerName,
      type: txn.type, // "deposit" or "withdraw"
      amount: txn.amount, // Raw number (not formatted string)
      accountCode, // Per OPENAPI spec
    };
  });
};

/**
 * Get complete dashboard data
 */
export const getDashboardData = () => {
  const stats = calculateDashboardStats();
  const weeklyTransactions = calculateWeeklyTransactions();
  const accountTypeDistribution = calculateAccountTypeDistribution();

  return {
    stats,
    weeklyTransactions,
    accountTypeDistribution,
  };
};
