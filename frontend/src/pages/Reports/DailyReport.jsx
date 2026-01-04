import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { DatePicker } from "../../components/ui/date-picker";
import { Label } from "../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FileDown,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
} from "lucide-react";
import {
  CuteStatCard,
  StarDecor,
  SparkleDecor,
} from "../../components/CuteComponents";
import { getDailyReport } from "../../services/reportService";
import {
  getDepositTransactionStats,
  getWithdrawalTransactionStats,
} from "../../services/transactionService";
import { RoleGuard } from "../../components/RoleGuard";
import { Skeleton } from "../../components/ui/skeleton";
import { formatVnNumber } from "../../utils/numberFormatter";
import { ServiceUnavailablePageState } from "../../components/ServiceUnavailableState";
import { isServerUnavailable } from "@/utils/serverStatusUtils";
import { DailyReportPrint } from "./DailyReportPrint";

export default function DailyReport() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [depositStats, setDepositStats] = useState(null);
  const [withdrawalStats, setWithdrawalStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reference for the printable component
  const printComponentRef = useRef(null);

  const handleExport = useReactToPrint({
    contentRef: printComponentRef,
    documentTitle: `Daily-Report-${format(selectedDate, "yyyy-MM-dd")}`,
  });

  // Check if selected date is in the future (allow today, block tomorrow onwards)
  const isDateInvalid = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return selected > today;
  };

  // Generate report function - only called when user clicks button
  const handleGenerateReport = async () => {
    if (isDateInvalid()) {
      setError(
        "Cannot generate report for future dates. You can select today or any past date."
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const dateString = format(selectedDate, "yyyy-MM-dd");

      // Fetch all data in parallel
      const [reportResponse, depositResponse, withdrawalResponse] =
        await Promise.all([
          getDailyReport(dateString),
          getDepositTransactionStats(dateString),
          getWithdrawalTransactionStats(dateString),
        ]);

      if (!reportResponse.success || !reportResponse.data) {
        setError("NO_DATA");
        setReportData(null);
        setDepositStats(null);
        setWithdrawalStats(null);
        return;
      }

      setReportData(reportResponse.data);
      setDepositStats(depositResponse.success ? depositResponse.data : null);
      setWithdrawalStats(
        withdrawalResponse.success ? withdrawalResponse.data : null
      );
    } catch (err) {
      console.error("Report error:", err);
      if (isServerUnavailable(err)) {
        setError("SERVER_UNAVAILABLE");
      } else {
        setError(
          "Failed to generate report. Please try again or select a different date."
        );
      }
      setReportData(null);
      setDepositStats(null);
      setWithdrawalStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Prefer OpenAPI fields; keep fallback for older mock shape
  const typeBreakdown =
    reportData?.byTypeSaving ||
    reportData?.items ||
    reportData?.itemsByType ||
    [];

  const chartData = typeBreakdown.map((item) => ({
    name: item.typeName,
    Deposits: item.totalDeposits / 1000000,
    Withdrawals: item.totalWithdrawals / 1000000,
    Difference: item.difference / 1000000,
  }));

  const summary = reportData?.summary || reportData?.total || {};

  const totals = {
    deposits:
      summary.totalDeposits ??
      typeBreakdown.reduce((sum, item) => sum + (item.totalDeposits || 0), 0),
    withdrawals:
      summary.totalWithdrawals ??
      typeBreakdown.reduce(
        (sum, item) => sum + (item.totalWithdrawals || 0),
        0
      ),
    difference:
      summary.difference ??
      typeBreakdown.reduce((sum, item) => sum + (item.difference || 0), 0),
  };

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
      <div className="space-y-4 sm:space-y-6">
        {/* Report Header */}
        <Card className="overflow-hidden border border-gray-200 rounded-sm">
          <CardHeader className="pb-6 border-b border-gray-100 bg-linear-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex items-center justify-center w-12 h-12 border border-gray-200 sm:w-14 sm:h-14 rounded-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <Sparkles size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <span>📊</span>
                  Daily Report
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  View daily deposits and withdrawals by savings type
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-end gap-4 sm:flex-row">
              <div className="flex-1 w-full space-y-2">
                <Label htmlFor="reportDate">Select Date</Label>
                <DatePicker
                  date={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  placeholder="Pick a date"
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date > today;
                  }}
                />
              </div>
              <Button
                onClick={handleGenerateReport}
                disabled={loading || isDateInvalid()}
                className="w-full h-12 px-6 text-white  border border-gray-200 sm:w-auto rounded-sm hover:border"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <Search size={18} className="mr-2" />
                {loading
                  ? "Generating..."
                  : isDateInvalid()
                  ? "Invalid Date"
                  : "Generate Report"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && error !== "NO_DATA" && (
          <Card className="border-2 border-red-200 bg-red-50 rounded-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-md">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-red-900">Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Data Message */}
        {error === "NO_DATA" && (
          <Card className="border-2 border-amber-200 bg-amber-50 rounded-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-md">
                  <span className="text-2xl">📭</span>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900">
                    No Data Found
                  </h4>
                  <p className="text-sm text-amber-700">
                    No data found for the selected date. Please try another
                    date.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show results only after generate */}
        {loading && (
          <>
            {/* Skeleton for Summary Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative p-6 overflow-hidden bg-white border border-gray-200 rounded-sm animate-pulse"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-4 w-24 bg-gray-200" />
                      <Skeleton className="h-8 w-40 bg-gray-200" />
                      <Skeleton className="h-3 w-32 bg-gray-200" />
                    </div>
                    <Skeleton className="w-14 h-14 rounded-sm bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

            {/* Skeleton for Data Table */}
            <div className="overflow-hidden border border-gray-200 rounded-sm bg-white">
              <div className="border-b border-gray-100 bg-gray-50 p-4">
                <Skeleton className="h-6 w-64 bg-gray-200" />
              </div>
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 border border-gray-100 rounded-md animate-pulse"
                  >
                    <Skeleton className="h-4 flex-1 bg-gray-200" />
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Skeleton for Chart */}
            <div className="overflow-hidden border border-gray-200 rounded-sm bg-white">
              <div className="border-b border-gray-100 bg-gray-50 p-4 space-y-2">
                <Skeleton className="h-6 w-48 bg-gray-200" />
                <Skeleton className="h-4 w-72 bg-gray-200" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-end h-[300px] px-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      <Skeleton
                        className="w-16 bg-gray-200 animate-pulse"
                        style={{ height: `${Math.random() * 180 + 60}px` }}
                      />
                      <Skeleton className="w-12 h-3 bg-gray-200" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skeleton for Transaction Statistics */}
            <div className="overflow-hidden border border-gray-200 rounded-sm bg-white">
              <div className="border-b border-gray-100 bg-gray-50 p-4">
                <Skeleton className="h-6 w-52 bg-gray-200" />
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="p-4 space-y-4 rounded-xs bg-gray-50 animate-pulse"
                    >
                      <Skeleton className="h-5 w-40 bg-gray-200" />
                      <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                          <div
                            key={j}
                            className="flex items-center justify-between p-2 bg-white rounded-md"
                          >
                            <Skeleton className="h-4 w-24 bg-gray-200" />
                            <Skeleton className="h-4 w-28 bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

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
                  Save as PDF
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-right">
                💡 Tip: For best results, disable browser headers & footers in
                Print settings.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-sm hover:border">
                <div
                  className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-md opacity-10"
                  style={{
                    background:
                      "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  }}
                />
                <StarDecor className="top-3 right-3" />

                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="mb-2 text-sm text-gray-600">Total Deposits</p>
                    <h3 className="mb-2 text-2xl font-semibold text-transparent bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text">
                      {formatVnNumber(totals.deposits ?? 0)}₫
                    </h3>
                    <div className="flex items-center gap-1">
                      <ArrowUpRight size={14} className="text-green-600" />
                      <span className="text-xs text-gray-500">
                        All saving book types
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    }}
                  >
                    <TrendingUp className="text-white" size={24} />
                  </div>
                </div>
              </div>

              <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-sm hover:border">
                <div
                  className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-md opacity-10"
                  style={{
                    background:
                      "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                  }}
                />
                <StarDecor className="top-3 right-3" />

                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="mb-2 text-sm text-gray-600">
                      Total Withdrawals
                    </p>
                    <h3 className="mb-2 text-2xl font-semibold text-transparent bg-linear-to-r from-red-600 to-rose-600 bg-clip-text">
                      {formatVnNumber(totals.withdrawals ?? 0)}₫
                    </h3>
                    <div className="flex items-center gap-1">
                      <ArrowDownRight size={14} className="text-red-600" />
                      <span className="text-xs text-gray-500">
                        All saving book types
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                    }}
                  >
                    <TrendingDown className="text-white" size={24} />
                  </div>
                </div>
              </div>

              <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-sm hover:border">
                <div
                  className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-md opacity-10"
                  style={{
                    background:
                      "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                  }}
                />
                <StarDecor className="top-3 right-3" />

                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="mb-2 text-sm text-gray-600">Net Difference</p>
                    <h3 className="mb-2 text-2xl font-semibold text-transparent bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text">
                      {formatVnNumber(totals.difference ?? 0)}₫
                    </h3>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} className="text-blue-600" />
                      <span className="text-xs text-gray-500">
                        Deposits - Withdrawals
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                    }}
                  >
                    <Sparkles className="text-white" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <Card className="overflow-hidden border border-gray-200 rounded-sm">
              <CardHeader className="border-b-2 border-purple-100 bg-linear-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-xl text-gray-800">
                  Detailed Report - {format(selectedDate, "dd/MM/yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-linear-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100">
                        <TableHead className="font-semibold text-gray-700">
                          Savings Type
                        </TableHead>
                        <TableHead className="font-semibold text-right text-gray-700">
                          Total Deposits
                        </TableHead>
                        <TableHead className="font-semibold text-right text-gray-700">
                          Total Withdrawals
                        </TableHead>
                        <TableHead className="font-semibold text-right text-gray-700">
                          Difference
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {typeBreakdown.map((row, index) => (
                        <TableRow
                          key={index}
                          className="transition-colors hover:bg-purple-50"
                        >
                          <TableCell className="font-medium text-gray-700">
                            {row.typeName}
                          </TableCell>
                          <TableCell className="font-semibold text-right text-green-600">
                            {formatVnNumber(row.totalDeposits ?? 0)}₫
                          </TableCell>
                          <TableCell className="font-semibold text-right text-red-600">
                            {formatVnNumber(row.totalWithdrawals ?? 0)}₫
                          </TableCell>
                          <TableCell className="font-semibold text-right text-blue-600">
                            {formatVnNumber(row.difference ?? 0)}₫
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter className="font-bold bg-linear-to-r from-purple-100 to-pink-100">
                      <TableRow>
                        <TableCell className="font-bold text-gray-800">
                          Total
                        </TableCell>
                        <TableCell className="font-bold text-right text-green-700">
                          {formatVnNumber(totals.deposits ?? 0)}₫
                        </TableCell>
                        <TableCell className="font-bold text-right text-red-700">
                          {formatVnNumber(totals.withdrawals ?? 0)}₫
                        </TableCell>
                        <TableCell className="font-bold text-right text-blue-700">
                          {formatVnNumber(totals.difference ?? 0)}₫
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Chart Visualization */}
            <Card className="overflow-hidden border border-gray-200 rounded-sm">
              <CardHeader className="border-b-2 border-blue-100 bg-linear-to-r from-cyan-50 to-blue-50">
                <CardTitle className="text-xl text-gray-800">
                  Visual Comparison
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Deposit/Withdrawal Chart by Saving Book Type (million VND)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis
                      label={{
                        value: "Amount (Million VND)",
                        angle: -90,
                        position: "insideLeft",
                        style: { fill: "#6B7280" },
                      }}
                      stroke="#6B7280"
                    />
                    <Tooltip
                      formatter={(value) =>
                        `${formatVnNumber(value, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}M₫`
                      }
                      contentStyle={{
                        borderRadius: "12px",
                        border: "2px solid #E5E7EB",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Deposits"
                      fill="url(#colorDeposits)"
                      name="Deposits"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="Withdrawals"
                      fill="url(#colorWithdrawals)"
                      name="Withdrawals"
                      radius={[8, 8, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="colorDeposits"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10B981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="#34D399"
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorWithdrawals"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#EF4444"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="#F87171"
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Transaction Statistics */}
            <Card className="overflow-hidden border border-gray-200 rounded-sm">
              <CardHeader className="border-b-2 border-green-100 bg-linear-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-xl text-gray-800">
                  Transaction Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Deposit Transactions */}
                  <div className="p-4 space-y-4 rounded-xs bg-linear-to-br from-green-50 to-emerald-50">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-green-700">
                      <TrendingUp size={16} />
                      Deposit Transactions
                    </h4>
                    <div className="space-y-3">
                      {depositStats?.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white rounded-sm border border-gray-100"
                        >
                          <span className="text-sm text-gray-700">
                            {item.typeName}
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            {formatVnNumber(item.count || 0)} transaction
                            {item.count !== 1 && item.count !== 0 ? "s" : ""}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-2 border-t-2 border-green-200">
                        <span className="text-sm font-bold text-gray-800">
                          Total
                        </span>
                        <span className="text-sm font-bold text-green-700">
                          {formatVnNumber(depositStats?.total.count || 0)}{" "}
                          transaction
                          {depositStats?.total.count !== 1 &&
                          depositStats?.total.count !== 0
                            ? "s"
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Withdrawal Transactions */}
                  <div className="p-4 space-y-4 rounded-xs bg-linear-to-br from-red-50 to-rose-50">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700">
                      <TrendingDown size={16} />
                      Withdrawal Transactions
                    </h4>
                    <div className="space-y-3">
                      {withdrawalStats?.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white rounded-sm border border-gray-100"
                        >
                          <span className="text-sm text-gray-700">
                            {item.typeName}
                          </span>
                          <span className="text-sm font-semibold text-red-600">
                            {formatVnNumber(item.count || 0)} transaction
                            {item.count !== 1 && item.count !== 0 ? "s" : ""}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-2 border-t-2 border-red-200">
                        <span className="text-sm font-bold text-gray-800">
                          Total
                        </span>
                        <span className="text-sm font-bold text-red-700">
                          {formatVnNumber(withdrawalStats?.total.count || 0)}{" "}
                          transaction
                          {withdrawalStats?.total.count !== 1 &&
                          withdrawalStats?.total.count !== 0
                            ? "s"
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hidden Printable Component - Positioned off-screen */}
            <div
              style={{
                position: "absolute",
                left: "-10000px",
                top: "0",
                width: "100%",
                pointerEvents: "none",
                backgroundColor: "white",
                boxSizing: "border-box",
              }}
            >
              <DailyReportPrint
                ref={printComponentRef}
                reportData={reportData}
                selectedDate={selectedDate}
                totals={totals}
                depositStats={depositStats}
                withdrawalStats={withdrawalStats}
                user={{ fullName: "User" }}
              />
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
}
