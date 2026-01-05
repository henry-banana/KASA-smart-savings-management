import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { RoleGuard } from "../../components/RoleGuard";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { MonthPicker } from "../../components/ui/month-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { FileDown, Printer, Search, Loader2 } from "lucide-react";
import { getMonthlyOpenCloseReport } from "../../services/reportService";
import { getAllTypeSavings } from "../../services/typeSavingService";
import { Skeleton } from "../../components/ui/skeleton";
import { formatVnNumber } from "../../utils/numberFormatter";
import { sortSavingsTypes } from "../../utils/savingsTypeSort";
import { ServiceUnavailablePageState } from "../../components/ServiceUnavailableState";
import { isServerUnavailable } from "@/utils/serverStatusUtils";
import { MonthlyReportPrint } from "./MonthlyReportPrint";

// Helper function to get color class for difference value
const getDifferenceColorClass = (difference) => {
  if (difference > 0) {
    return "text-green-600"; // Deposit color (positive)
  } else if (difference < 0) {
    return "text-red-600"; // Withdrawal color (negative)
  }
  return "text-blue-600"; // Blue for zero
};

export default function MonthlyReport() {
  const { user } = useAuthContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [savingsType, setSavingsType] = useState("all");
  const [reportData, setReportData] = useState(null);
  const [reportDate, setReportDate] = useState(null);
  const [reportSavingsType, setReportSavingsType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reference for the printable component
  const printComponentRef = useRef(null);

  // Handler for month/year change
  const handleMonthYearChange = (month, year) => {
    const newDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    setSelectedDate(newDate);
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // Generate array of years (from 2000 to current year)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 2000; i--) {
      years.push(i.toString());
    }
    return years;
  };

  // Check if selected month/year is in the future
  const isMonthInvalid = () => {
    const today = new Date();
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // If year is in future, it's invalid
    if (selectedYear > currentYear) return true;
    // If same year but month is in future, it's invalid
    if (selectedYear === currentYear && selectedMonth > currentMonth)
      return true;
    return false;
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const response = await getMonthlyOpenCloseReport(
        month,
        year,
        savingsType
      );

      if (response.success && response.data) {
        // Use canonical 'items' field from response
        setReportData(response.data.items || response.data.byDay);
        setReportDate(selectedDate);
        setReportSavingsType(savingsType);
      } else {
        setError("NO_DATA");
        setReportData(null);
      }
    } catch (err) {
      console.error("Report generation error:", err);
      if (isServerUnavailable(err)) {
        setError("SERVER_UNAVAILABLE");
      } else {
        setError(
          err.message || "An error occurred while generating the report"
        );
      }
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const totals = reportData
    ? reportData.reduce(
        (acc, item) => ({
          opened: acc.opened + (item.newSavingBooks || item.opened || 0),
          closed: acc.closed + (item.closedSavingBooks || item.closed || 0),
          difference: acc.difference + (item.difference || 0),
        }),
        { opened: 0, closed: 0, difference: 0 }
      )
    : null;

  const [savingsTypes, setSavingsTypes] = React.useState([
    { value: "all", label: "All Types" },
  ]);

  // Fetch savings types on mount
  React.useEffect(() => {
    const fetchSavingsTypes = async () => {
      try {
        const response = await getAllTypeSavings();
        if (response.success && response.data) {
          const types = [
            { value: "all", label: "All Types" },
            ...response.data.map((ts) => ({
              value: ts.typeSavingId,
              label: ts.typeName,
            })),
          ];
          setSavingsTypes(sortSavingsTypes(types));
        }
      } catch (err) {
        console.error("Failed to fetch savings types:", err);
      }
    };
    fetchSavingsTypes();
  }, []);

  const handleExport = useReactToPrint({
    contentRef: printComponentRef,
    documentTitle: `Monthly-Report-${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}`,
  });

  // Show server unavailable state for connection errors
  if (error === "SERVER_UNAVAILABLE") {
    return (
      <RoleGuard allow={["accountant"]}>
        <ServiceUnavailablePageState
          onRetry={() => window.location.reload()}
          loading={loading}
        />
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allow={["accountant"]}>
      <div className="space-y-6">
        {/* Report Header - Filter Controls */}
        <Card className="border border-gray-200 rounded-sm overflow-hidden print:hidden">
          <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 pb-8">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Monthly Opening/Closing Report
            </CardTitle>
            <CardDescription>
              Generate monthly savings book opening and closing report
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Savings Type</Label>
                <Select value={savingsType} onValueChange={setSavingsType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select savings type" />
                  </SelectTrigger>
                  <SelectContent>
                    {savingsTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Month & Year</Label>
                <div className="flex gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) =>
                      handleMonthYearChange(e.target.value, selectedYear)
                    }
                    className="flex-1 h-11 sm:h-12 px-4 rounded-sm border border-gray-200 bg-input-background text-gray-700 cursor-pointer focus:border-[#1A4D8F] focus:ring-2 focus:ring-[#1A4D8F]/20 text-sm sm:text-base hover:bg-gray-100 hover:border-gray-300 transition-colors"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {new Date(2024, i).toLocaleDateString("en-US", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) =>
                      handleMonthYearChange(selectedMonth, e.target.value)
                    }
                    className="flex-1 h-11 sm:h-12 px-4 rounded-sm border border-gray-200 bg-input-background text-gray-700 cursor-pointer focus:border-[#1A4D8F] focus:ring-2 focus:ring-[#1A4D8F]/20 text-sm sm:text-base hover:bg-gray-100 hover:border-gray-300 transition-colors"
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Or Pick Month</Label>
                <MonthPicker
                  date={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setSelectedMonth((date.getMonth() + 1).toString());
                      setSelectedYear(date.getFullYear().toString());
                    }
                  }}
                  placeholder="Pick a month"
                  maxDate={new Date()}
                />
              </div>
            </div>
            <Button
              onClick={handleGenerateReport}
              disabled={loading || isMonthInvalid()}
              className="w-full h-12 rounded-sm px-6 text-white border border-gray-200 hover:border border-gray-200 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : isMonthInvalid() ? (
                <>
                  <Search size={18} className="mr-2" />
                  Invalid Month
                </>
              ) : (
                <>
                  <Search size={18} className="mr-2" />
                  Generate Report
                </>
              )}
            </Button>
            {error && error !== "NO_DATA" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm">
                {error}
              </div>
            )}
            {error === "NO_DATA" && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-sm text-amber-700 text-sm">
                No data found for the selected month. Please try another month
                or savings type.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading Skeleton */}
        {loading && (
          <>
            {/* Skeleton for Print Actions */}
            <div className="flex justify-end gap-3 print:hidden">
              <Skeleton className="h-10 w-36 rounded-xs bg-gray-200" />
              <Skeleton className="h-10 w-32 rounded-xs bg-gray-200" />
            </div>

            {/* Skeleton for Main Report */}
            <div className="bg-white rounded-sm border border-gray-200 p-8">
              {/* Skeleton for Report Header */}
              <div className="mb-8 space-y-4">
                <div className="flex justify-center">
                  <Skeleton className="h-8 w-[500px] bg-gray-200" />
                </div>
                <div className="flex justify-center gap-8">
                  <Skeleton className="h-5 w-48 bg-gray-200" />
                  <Skeleton className="h-5 w-48 bg-gray-200" />
                </div>
              </div>

              {/* Skeleton for Table */}
              <div className="overflow-hidden rounded-xs border border-gray-200">
                <div className="bg-gray-100 p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-5 w-12 bg-gray-200" />
                    <Skeleton className="h-5 flex-1 bg-gray-200" />
                    <Skeleton className="h-5 w-24 bg-gray-200" />
                    <Skeleton className="h-5 w-24 bg-gray-200" />
                    <Skeleton className="h-5 w-28 bg-gray-200" />
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 animate-pulse"
                    >
                      <Skeleton className="h-4 w-10 bg-gray-200" />
                      <Skeleton className="h-4 flex-1 bg-gray-200" />
                      <Skeleton className="h-4 w-20 bg-gray-200" />
                      <Skeleton className="h-4 w-20 bg-gray-200" />
                      <Skeleton className="h-4 w-24 bg-gray-200" />
                    </div>
                  ))}
                  {/* Total Row Skeleton */}
                  <div className="flex items-center gap-4 p-3 border-t-2 border-gray-200 bg-gray-50">
                    <Skeleton className="h-5 w-24 bg-gray-300" />
                    <div className="flex-1" />
                    <Skeleton className="h-5 w-20 bg-gray-300" />
                    <Skeleton className="h-5 w-20 bg-gray-300" />
                    <Skeleton className="h-5 w-24 bg-gray-300" />
                  </div>
                </div>
              </div>

              {/* Skeleton for Summary Stats */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-xs p-6 border-l-4 border-gray-300 bg-gray-50 animate-pulse"
                  >
                    <Skeleton className="h-4 w-28 bg-gray-200 mb-2" />
                    <Skeleton className="h-10 w-20 bg-gray-200 mb-1" />
                    <Skeleton className="h-3 w-36 bg-gray-200" />
                  </div>
                ))}
              </div>

              {/* Skeleton for Signature Section */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200">
                <div className="grid grid-cols-2 gap-12">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="text-center space-y-8 animate-pulse"
                    >
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-gray-200 mx-auto" />
                        <Skeleton className="h-5 w-40 bg-gray-200 mx-auto" />
                        <Skeleton className="h-3 w-20 bg-gray-200 mx-auto" />
                      </div>
                      <div className="pt-12 border-t border-gray-300">
                        <Skeleton className="h-3 w-28 bg-gray-200 mx-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Show results only after generate */}
        {reportData && !loading && (
          <>
            {/* Print/Export Actions */}
            <div className="space-y-2">
              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="rounded-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05]"
                >
                  <Printer size={18} className="mr-2" />
                  Print Report
                </Button>
                <Button
                  onClick={handleExport}
                  className="rounded-sm border border-gray-300 bg-linear-to-r from-green-600 to-green-500 text-white hover:bg-green-700 hover:border-green-700 hover:scale-[1.05]"
                >
                  <FileDown size={18} className="mr-2" />
                  Export PDF
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-right">
                💡 Tip: For best results, disable browser headers & footers in
                Print settings.
              </p>
            </div>

            {/* Screen Display - Interactive Version with Print Styles */}
            <div className="bg-white rounded-sm border border-gray-200 p-8">
              {/* Report Header */}
              <div className="mb-8 space-y-4">
                <h1 className="text-2xl font-bold text-[#1A4D8F] text-center tracking-tight">
                  MONTHLY OPENING/CLOSING SAVINGS BOOKS REPORT
                </h1>
                {/* Report Metadata */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">
                      Savings Type:
                    </span>
                    <span className="font-semibold text-[#1A4D8F] border-b-2 border-dotted border-gray-300 px-2 min-w-[120px]">
                      {savingsTypes.find(
                        (t) => t.value === (reportSavingsType ?? savingsType)
                      )?.label || "All Types"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Month:</span>
                    <span className="font-semibold text-[#1A4D8F] border-b-2 border-dotted border-gray-300 px-2 min-w-[120px]">
                      {reportDate
                        ? reportDate.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })
                        : "No data"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Report Table */}
              <div className="overflow-hidden rounded-sm border-2 border-gray-200 border border-gray-200">
                <table className="w-full border-collapse">
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-[#1A4D8F] text-white">
                      <th
                        className="py-4 px-4 text-center font-semibold border-r border-[#2563a8]"
                        style={{ width: "10%" }}
                      >
                        No.
                      </th>
                      <th
                        className="py-4 px-6 text-left font-semibold border-r border-[#2563a8]"
                        style={{ width: "25%" }}
                      >
                        Date
                      </th>
                      <th
                        className="py-4 px-6 text-right font-semibold border-r border-[#2563a8]"
                        style={{ width: "20%" }}
                      >
                        Opened
                      </th>
                      <th
                        className="py-4 px-6 text-right font-semibold border-r border-[#2563a8]"
                        style={{ width: "20%" }}
                      >
                        Closed
                      </th>
                      <th
                        className="py-4 px-6 text-right font-semibold"
                        style={{ width: "25%" }}
                      >
                        Difference
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {reportData.map((row, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-[#F5F7FA]"
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="py-3 px-4 text-center text-gray-700 border-r border-gray-200">
                          {index + 1}
                        </td>
                        <td className="py-3 px-6 text-left text-gray-800 font-medium border-r border-gray-200">
                          {reportDate &&
                            new Date(
                              reportDate.getFullYear(),
                              reportDate.getMonth(),
                              row.day
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                        </td>
                        <td className="py-3 px-6 text-right text-green-600 font-semibold border-r border-gray-200">
                          {formatVnNumber(
                            Math.floor(row.newSavingBooks ?? row.opened ?? 0)
                          )}
                        </td>
                        <td className="py-3 px-6 text-right text-red-600 font-semibold border-r border-gray-200">
                          {formatVnNumber(
                            Math.floor(row.closedSavingBooks ?? row.closed ?? 0)
                          )}
                        </td>
                        <td
                          className={`py-3 px-6 text-right font-semibold ${getDifferenceColorClass(
                            row.difference
                          )}`}
                        >
                          {row.difference >= 0 ? "+" : ""}
                          {formatVnNumber(Math.floor(row.difference ?? 0))}
                        </td>
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="bg-linear-to-r from-gray-100 to-gray-50 border-t-2 border-[#1A4D8F]">
                      <td
                        colSpan={2}
                        className="py-4 px-6 text-left font-bold text-[#1A4D8F] uppercase tracking-wide"
                      >
                        Total
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-green-600 text-lg border-r border-gray-300">
                        {formatVnNumber(Math.floor(totals?.opened ?? 0))}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-red-600 text-lg border-r border-gray-300">
                        {formatVnNumber(Math.floor(totals?.closed ?? 0))}
                      </td>
                      <td
                        className={`py-4 px-6 text-right font-bold text-lg ${getDifferenceColorClass(
                          totals?.difference
                        )}`}
                      >
                        {(totals?.difference || 0) >= 0 ? "+" : ""}
                        {formatVnNumber(Math.floor(totals?.difference ?? 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Report Footer - Summary Stats */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xs p-6 border-l-4 border-green-500">
                  <p className="text-sm font-medium text-green-700 mb-1">
                    Total Opened
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatVnNumber(Math.floor(totals?.opened ?? 0))}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    saving books this month
                  </p>
                </div>

                <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xs p-6 border-l-4 border-red-500">
                  <p className="text-sm font-medium text-red-700 mb-1">
                    Total Closed
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {formatVnNumber(Math.floor(totals?.closed ?? 0))}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    saving books this month
                  </p>
                </div>

                <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xs p-6 border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-blue-700 mb-1">
                    Net Difference
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {(totals?.difference || 0) >= 0 ? "+" : ""}
                    {formatVnNumber(Math.floor(totals?.difference ?? 0))}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    net growth this month
                  </p>
                </div>
              </div>

              {/* Report Signature Section */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200">
                <div className="grid grid-cols-2 gap-12">
                  <div className="text-center space-y-16">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Prepared By
                      </p>
                      <p className="font-semibold text-[#1A4D8F]">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 uppercase">
                        {user?.role || user?.roleName}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-300">
                      <p className="text-xs text-gray-500">Signature & Date</p>
                    </div>
                  </div>

                  <div className="text-center space-y-16">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Approved By
                      </p>
                      <p className="font-semibold text-[#1A4D8F]">
                        ____________________
                      </p>
                      <p className="text-xs text-gray-500 uppercase">Manager</p>
                    </div>
                    <div className="pt-2 border-t border-gray-300">
                      <p className="text-xs text-gray-500">Signature & Date</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Generation Info */}
              <div className="mt-8 text-center text-xs text-gray-400">
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
                <p className="mt-1">KASA Savings Management System © 2025</p>
              </div>
            </div>

            {/* Hidden Printable Component - Positioned off-screen */}
            <div
              style={{
                position: "absolute",
                left: "-10000px",
                top: "0",
                width: "210mm",
                pointerEvents: "none",
                backgroundColor: "white",
                boxSizing: "border-box",
              }}
            >
              <MonthlyReportPrint
                ref={printComponentRef}
                reportData={reportData}
                totals={totals}
                selectedDate={selectedDate}
                savingsType={savingsType}
                savingsTypes={savingsTypes}
                user={user}
              />
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
}
