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
  const today = new Date().toISOString().split("T")[0];

  // Active accounts
  const activeAccounts = mockSavingBooks.filter(
    (sb) => sb.status === "active"
  ).length;

  // Today's transactions
  const todayTransactions = mockTransactions.filter((t) =>
    t.transactionDate?.startsWith(today)
  );

  const depositsToday = todayTransactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const withdrawalsToday = todayTransactions
    .filter((t) => t.type === "withdraw")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    activeAccounts,
    depositsToday,
    withdrawalsToday,
  };
};

/**
 * Calculate weekly transaction trends
 */
export const calculateWeeklyTransactions = () => {
  const today = new Date();
  const weekData = [];

  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayTransactions = mockTransactions.filter((t) =>
      t.transactionDate?.startsWith(dateStr)
    );

    const deposits = dayTransactions
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);

    const withdrawals = dayTransactions
      .filter((t) => t.type === "withdraw")
      .reduce((sum, t) => sum + t.amount, 0);

    // Day names in Vietnamese
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const dayName = dayNames[date.getDay()];

    weekData.push({
      name: dayName,
      deposits: Math.round(deposits / 1000000), // Convert to millions
      withdrawals: Math.round(withdrawals / 1000000),
    });
  }

  return weekData;
};

/**
 * Calculate account type distribution
 */
export const calculateAccountTypeDistribution = () => {
  // Build counts keyed by typeSavingId from configured mockTypeSavings
  const counts = mockTypeSavings.reduce((acc, ts) => {
    acc[ts.typeSavingId] = 0;
    return acc;
  }, {});

  // Count active saving books per typeSavingId
  mockSavingBooks
    .filter((sb) => sb.status === "active")
    .forEach((sb) => {
      if (sb.typeSavingId && counts.hasOwnProperty(sb.typeSavingId)) {
        counts[sb.typeSavingId] += 1;
      } else {
        counts["OTHER"] = (counts["OTHER"] || 0) + 1;
      }
    });

  // Map configured types to result array with consistent colors
  const result = mockTypeSavings.map((ts) => ({
    name: ts.typeName,
    value: counts[ts.typeSavingId] || 0,
    color: getTypeChartColor(ts.typeName),
  }));

  // Append 'Other' bucket if present
  if (counts["OTHER"]) {
    result.push({ name: "Other", value: counts["OTHER"], color: "#9CA3AF" });
  }

  return result;
};

/**
 * Mock data for changes/trends (percentage changes)
 * In real app, this would be calculated from historical data
 */
export const mockChanges = {
  activeAccounts: "+12.5%",
  depositsToday: "+8.2%",
  withdrawalsToday: "-3.1%",
};

/**
 * Get recent transactions (last 5 transactions)
 * Returns raw data per OpenAPI contract (no UI formatting)
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
    // Find saving book for customer name and account code
    const savingBook = mockSavingBooks.find((sb) => sb.bookId === txn.bookId);
    const customerName = savingBook?.customerName || "Unknown Customer";
    const accountCode = savingBook?.bookId || txn.bookId;

    // Parse date and time from transactionDate
    const txnDate = new Date(txn.transactionDate || Date.now());
    const date = txnDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const hours = txnDate.getHours().toString().padStart(2, "0");
    const minutes = txnDate.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`; // HH:mm

    // Return raw contract-compliant data per OpenAPI (no emoji, color, or formatted strings)
    return {
      id: txn.transactionId,
      date,
      time,
      customerName,
      type: txn.type, // "deposit" or "withdraw" (raw value)
      amount: txn.amount, // Raw number (not formatted string)
      accountCode,
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
    stats: {
      ...stats,
      changes: mockChanges,
    },
    weeklyTransactions,
    accountTypeDistribution,
  };
};
