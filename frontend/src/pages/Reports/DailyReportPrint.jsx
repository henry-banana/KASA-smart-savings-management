import React from "react";
import { formatVnNumber } from "../../utils/numberFormatter";
import "./DailyReportPrint.css";

/**
 * DailyReportPrint Component
 *
 * Dedicated printable component containing ONLY the content to be printed.
 * This component is referenced via useRef and used with react-to-print.
 *
 * Props:
 *  - reportData: Object containing byTypeSaving array with daily report data
 *  - selectedDate: Date object for the selected date
 *  - totals: Object with totals { deposits, withdrawals, difference }
 *  - depositStats: Object with items array and total { count }
 *  - withdrawalStats: Object with items array and total { count }
 *  - user: Current user object with fullName and role
 */

// Helper function to get color class for difference value
const getDifferenceColorClass = (deposits, withdrawals) => {
  if (deposits > withdrawals) {
    return "difference-positive"; // More deposits
  } else if (deposits < withdrawals) {
    return "difference-negative"; // More withdrawals
  }
  return "difference-zero"; // Equal
};

export const DailyReportPrint = React.forwardRef(
  (
    { reportData, selectedDate, totals, depositStats, withdrawalStats, user },
    ref
  ) => {
    if (!reportData || !totals) {
      return null;
    }

    // Get breakdown by savings type
    const typeBreakdown =
      reportData.byTypeSaving ||
      reportData.items ||
      reportData.itemsByType ||
      [];

    return (
      <div ref={ref} className="daily-report-print">
        {/* Report Header */}
        <div className="print-header">
          <h1 className="print-title">
            BM5.1 – DAILY DEPOSITS/WITHDRAWALS SAVINGS BOOKS REPORT
          </h1>

          {/* Report Metadata */}
          <div className="print-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Selected Date:</span>
              <span className="metadata-value">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Section - Compact */}
        <div className="print-summary">
          <div className="summary-row">
            <div className="summary-item">
              <span className="stat-label">Total Deposits:</span>
              <span className="stat-value deposits">
                {formatVnNumber(totals.deposits)}
              </span>
            </div>
            <div className="summary-item">
              <span className="stat-label">Total Withdrawals:</span>
              <span className="stat-value withdrawals">
                {formatVnNumber(totals.withdrawals)}
              </span>
            </div>
            <div className="summary-item">
              <span className="stat-label">Net Difference:</span>
              <span
                className={`stat-value ${
                  totals.difference >= 0
                    ? "difference-positive"
                    : "difference-negative"
                }`}
              >
                {formatVnNumber(totals.difference)}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Statistics Section */}
        {(depositStats?.items?.length > 0 ||
          withdrawalStats?.items?.length > 0) && (
          <div className="print-table-container">
            <h2 className="table-title">Transaction Statistics</h2>
            <table className="print-table">
              <thead>
                <tr className="table-header-row">
                  <th className="col-type">Savings Type</th>
                  <th className="col-count">Deposit Transactions</th>
                  <th className="col-count">Withdrawal Transactions</th>
                </tr>
              </thead>
              <tbody>
                {typeBreakdown.map((type, index) => {
                  const depositCount =
                    depositStats?.items?.find(
                      (item) => item.typeName === type.typeName
                    )?.count || 0;
                  const withdrawalCount =
                    withdrawalStats?.items?.find(
                      (item) => item.typeName === type.typeName
                    )?.count || 0;

                  return (
                    <tr
                      key={index}
                      className={`table-row ${
                        index % 2 === 0 ? "even" : "odd"
                      }`}
                    >
                      <td className="col-type">{type.typeName || "Unknown"}</td>
                      <td className="col-count text-right">{depositCount}</td>
                      <td className="col-count text-right">
                        {withdrawalCount}
                      </td>
                    </tr>
                  );
                })}
                {/* Total Row */}
                <tr className="table-total-row">
                  <td className="col-type font-semibold">Total</td>
                  <td className="col-count text-right font-semibold">
                    {depositStats?.total?.count || 0}
                  </td>
                  <td className="col-count text-right font-semibold">
                    {withdrawalStats?.total?.count || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Report Table - By Savings Type */}
        <div className="print-table-container">
          <h2 className="table-title">Breakdown by Savings Type</h2>
          <table className="print-table">
            {/* Table Header - Will repeat on each page */}
            <thead>
              <tr className="table-header-row">
                <th className="col-type">Savings Type</th>
                <th className="col-deposits">Total Deposits</th>
                <th className="col-withdrawals">Total Withdrawals</th>
                <th className="col-difference">Difference</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {typeBreakdown.map((row, index) => (
                <tr
                  key={index}
                  className={`table-row ${index % 2 === 0 ? "even" : "odd"}`}
                >
                  <td className="col-type">{row.typeName || "Unknown"}</td>
                  <td className="col-deposits text-right">
                    {formatVnNumber(row.totalDeposits || 0)}
                  </td>
                  <td className="col-withdrawals text-right">
                    {formatVnNumber(row.totalWithdrawals || 0)}
                  </td>
                  <td className="col-difference text-right">
                    <span
                      className={getDifferenceColorClass(
                        row.totalDeposits,
                        row.totalWithdrawals
                      )}
                    >
                      {formatVnNumber(row.difference || 0)}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="table-total-row">
                <td className="col-type font-semibold">Total</td>
                <td className="col-deposits text-right font-semibold">
                  {formatVnNumber(totals.deposits)}
                </td>
                <td className="col-withdrawals text-right font-semibold">
                  {formatVnNumber(totals.withdrawals)}
                </td>
                <td className="col-difference text-right font-semibold">
                  <span
                    className={getDifferenceColorClass(
                      totals.deposits,
                      totals.withdrawals
                    )}
                  >
                    {formatVnNumber(totals.difference)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="print-footer">
          <p className="footer-text">
            Generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="mt-1">KASA Savings Management System © 2025</p>
        </div>
      </div>
    );
  }
);

DailyReportPrint.displayName = "DailyReportPrint";
