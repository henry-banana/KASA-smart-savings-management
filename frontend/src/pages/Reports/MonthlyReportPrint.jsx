import React from "react";
import { formatVnNumber } from "../../utils/numberFormatter";
import "./MonthlyReportPrint.css";

/**
 * MonthlyReportPrint Component
 *
 * Dedicated printable component containing ONLY the content to be printed.
 * This component is referenced via useRef and used with react-to-print.
 *
 * Props:
 *  - reportData: Array of daily report items with opened/closed/difference counts
 *  - totals: Object with totals { opened, closed, difference }
 *  - selectedDate: Date object for the selected month
 *  - savingsType: String indicating the selected savings type
 *  - savingsTypes: Array of available savings types
 *  - user: Current user object with fullName and role
 */
export const MonthlyReportPrint = React.forwardRef(
  (
    { reportData, totals, selectedDate, savingsType, savingsTypes, user },
    ref
  ) => {
    if (!reportData || !totals) {
      return null;
    }

    return (
      <div ref={ref} className="monthly-report-print">
        {/* Report Header */}
        <div className="print-header">
          <h1 className="print-title">
            BM5.2 – MONTHLY OPENING/CLOSING SAVINGS BOOKS REPORT
          </h1>

          {/* Report Metadata */}
          <div className="print-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Savings Type:</span>
              <span className="metadata-value">
                {savingsTypes.find((t) => t.value === savingsType)?.label ||
                  "All Types"}
              </span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Month:</span>
              <span className="metadata-value">
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Report Table */}
        <div className="print-table-container">
          <table className="print-table">
            {/* Table Header - Will repeat on each page */}
            <thead>
              <tr className="table-header-row">
                <th className="col-no">No.</th>
                <th className="col-date">Date</th>
                <th className="col-opened">Opened</th>
                <th className="col-closed">Closed</th>
                <th className="col-difference">Difference</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {reportData.map((row, index) => (
                <tr
                  key={index}
                  className={`table-row ${index % 2 === 0 ? "even" : "odd"}`}
                >
                  <td className="col-no">{index + 1}</td>
                  <td className="col-date">
                    {new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      row.day
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="col-opened">
                    {formatVnNumber(row.newSavingBooks ?? row.opened ?? 0)}
                  </td>
                  <td className="col-closed">
                    {formatVnNumber(row.closedSavingBooks ?? row.closed ?? 0)}
                  </td>
                  <td
                    className={`col-difference ${
                      row.difference >= 0 ? "positive" : "negative"
                    }`}
                  >
                    {row.difference >= 0 ? "+" : ""}
                    {formatVnNumber(row.difference ?? 0)}
                  </td>
                </tr>
              ))}

              {/* Total Row - Avoid splitting across pages */}
              <tr className="table-total-row">
                <td colSpan={2} className="total-label">
                  Total
                </td>
                <td className="col-opened total">
                  {formatVnNumber(totals?.opened ?? 0)}
                </td>
                <td className="col-closed total">
                  {formatVnNumber(totals?.closed ?? 0)}
                </td>
                <td
                  className={`col-difference total ${
                    (totals?.difference || 0) >= 0 ? "positive" : "negative"
                  }`}
                >
                  {(totals?.difference || 0) >= 0 ? "+" : ""}
                  {formatVnNumber(totals?.difference ?? 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Report Footer - Summary Stats */}
        <div className="print-summary">
          <div className="summary-stat opened">
            <p className="summary-label">Total Opened</p>
            <p className="summary-value">
              {formatVnNumber(totals?.opened ?? 0)}
            </p>
            <p className="summary-note">accounts this month</p>
          </div>

          <div className="summary-stat closed">
            <p className="summary-label">Total Closed</p>
            <p className="summary-value">
              {formatVnNumber(totals?.closed ?? 0)}
            </p>
            <p className="summary-note">accounts this month</p>
          </div>

          <div className="summary-stat difference">
            <p className="summary-label">Net Difference</p>
            <p className="summary-value">
              {(totals?.difference || 0) >= 0 ? "+" : ""}
              {formatVnNumber(totals?.difference ?? 0)}
            </p>
            <p className="summary-note">net growth this month</p>
          </div>
        </div>

        {/* Report Signature Section */}
        <div className="print-signature">
          <div className="signature-block">
            <div className="signature-info">
              <p className="signature-title">Prepared By</p>
              <p className="signature-name">{user?.fullName}</p>
              <p className="signature-role">{user?.role || user?.roleName}</p>
            </div>
            <div className="signature-line">
              <p className="signature-placeholder">Signature & Date</p>
            </div>
          </div>

          <div className="signature-block">
            <div className="signature-info">
              <p className="signature-title">Approved By</p>
              <p className="signature-name">____________________</p>
              <p className="signature-role">Manager</p>
            </div>
            <div className="signature-line">
              <p className="signature-placeholder">Signature & Date</p>
            </div>
          </div>
        </div>

        {/* Report Generation Info */}
        <div className="print-footer">
          <p>
            Generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>KASA Savings Management System © 2025</p>
        </div>
      </div>
    );
  }
);

MonthlyReportPrint.displayName = "MonthlyReportPrint";
