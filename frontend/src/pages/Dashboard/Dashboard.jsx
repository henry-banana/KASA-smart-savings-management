import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  getDashboardStats,
  getRecentTransactions,
} from "@/services/dashboardService";
import { getAllTypeSavings } from "@/services/typeSavingService";
import { getTypeChartColor } from "@/utils/typeColorUtils";
import { mockSavingBooks } from "@/mocks/data/savingBooks";
import { isServerUnavailable } from "@/utils/serverStatusUtils";
import { ServiceUnavailableState } from "@/components/ServiceUnavailableState";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Users,
  Wallet,
  TrendingUp,
  Search,
  FileText,
  Sparkles,
  PiggyBank,
  Coins,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CuteStatCard, StarDecor } from "../../components/CuteComponents";
import { RoleGuard } from "../../components/RoleGuard";
import { StatCardSkeleton } from "../../components/ui/loading-skeleton";
import { Skeleton } from "../../components/ui/skeleton";
import { formatVnNumber, formatPercentText } from "../../utils/numberFormatter";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for dashboard data
  const [stats, _setStats] = useState([
    {
      title: "Active Saving Books",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: <Wallet size={28} />,
      gradient: "linear-gradient(135deg, #1A4D8F 0%, #2563A8 100%)",
      iconColor: "#ffffff",
    },
    {
      title: "Current Deposits",
      value: "0₫",
      change: "+0%",
      trend: "up",
      icon: <ArrowDownIcon size={28} />,
      gradient: "linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)",
      iconColor: "#ffffff",
    },
    {
      title: "Current Withdrawals",
      value: "0₫",
      change: "0%",
      trend: "down",
      icon: <ArrowUpIcon size={28} />,
      gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
      iconColor: "#ffffff",
    },
    // Removed "Active Customers" card per request
  ]);

  const [depositWithdrawalData, _setDepositWithdrawalData] = useState([
    { name: "T2", deposits: 0, withdrawals: 0 },
    { name: "T3", deposits: 0, withdrawals: 0 },
    { name: "T4", deposits: 0, withdrawals: 0 },
    { name: "T5", deposits: 0, withdrawals: 0 },
    { name: "T6", deposits: 0, withdrawals: 0 },
    { name: "T7", deposits: 0, withdrawals: 0 },
    { name: "CN", deposits: 0, withdrawals: 0 },
  ]);

  const [accountTypeData, _setAccountTypeData] = useState([
    { name: "No term", value: 0 },
    { name: "3 Months", value: 0 },
    { name: "6 Months", value: 0 },
  ]);

  // Number of saving types configured in Admin (used for skeleton placeholders)
  const [typeCount, setTypeCount] = useState(accountTypeData.length);

  const [recentTransactions, setRecentTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setServerError(null);
        const response = await getDashboardStats();

        // Also fetch configured saving types to determine legend/skeleton length
        try {
          const typesResp = await getAllTypeSavings();
          if (typesResp?.success && Array.isArray(typesResp.data)) {
            setTypeCount((prev) => typesResp.data.length || prev);
          }
        } catch (err) {
          // fallback: keep default typeCount
          console.warn(
            "Failed to fetch saving types for dashboard legend count",
            err
          );
        }

        if (response.success && response.data) {
          const {
            stats: statsData,
            weeklyTransactions,
            accountTypeDistribution,
          } = response.data;

          // Update stats cards
          _setStats([
            {
              title: "Active Saving Books",
              value: formatVnNumber(statsData.activeSavingBooks || 0),
              change: formatPercentText(
                statsData.changes?.activeSavingBooks || "0%"
              ),
              trend: (statsData.changes?.activeSavingBooks || "").startsWith(
                "+"
              )
                ? "up"
                : "down",
              icon: <Wallet size={28} />,
              gradient: "linear-gradient(135deg, #1A4D8F 0%, #2563A8 100%)",
              iconColor: "#ffffff",
            },
            {
              title: "Current Deposits",
              value: `${formatVnNumber(
                (statsData.depositsComparePreWeek || 0) / 1_000_000,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}M₫`,
              change: formatPercentText(
                statsData.changes?.currentDeposits || "0%"
              ),
              trend: (statsData.changes?.currentDeposits || "").startsWith("+")
                ? "up"
                : "down",
              icon: <ArrowDownIcon size={28} />,
              gradient: "linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)",
              iconColor: "#ffffff",
            },
            {
              title: "Current Withdrawals",
              value: `${formatVnNumber(
                (statsData.withdrawalsComparePreWeek || 0) / 1_000_000,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}M₫`,
              change: formatPercentText(
                statsData.changes?.currentWithdrawals || "0%"
              ),
              trend: (statsData.changes?.currentWithdrawals || "").startsWith(
                "-"
              )
                ? "down"
                : "up",
              icon: <ArrowUpIcon size={28} />,
              gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
              iconColor: "#ffffff",
            },
            // Active Customers card removed
          ]);

          // Update charts
          // Backend returns dates in DD.MM format, normalize for display
          const normalizedWeeklyTransactions = (weeklyTransactions || []).map(
            (item) => {
              const rawName = item?.name;
              // Convert DD.MM to DD/MM for display
              const formattedName =
                typeof rawName === "string" && /^\d{2}\.\d{2}$/.test(rawName)
                  ? rawName.replace(".", "/")
                  : rawName;

              return { ...item, name: formattedName };
            }
          );

          _setDepositWithdrawalData(normalizedWeeklyTransactions);

          // Backend doesn't return color, add it on frontend
          const hashedAccountTypes = (accountTypeDistribution || []).map(
            (item) => {
              const label =
                item.name || item.typeName || item.typeSavingName || "Unknown";
              return {
                ...item,
                name: label,
                color: getTypeChartColor(label),
              };
            }
          );

          _setAccountTypeData(hashedAccountTypes);
        }

        // Fetch recent transactions
        try {
          const txnResponse = await getRecentTransactions();
          if (txnResponse.success && txnResponse.data) {
            setRecentTransactions(txnResponse.data);
          }
        } catch (err) {
          console.error("Failed to fetch recent transactions:", err);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        // Check if error is server unavailable
        if (isServerUnavailable(err)) {
          setServerError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show full-page error state if server unavailable
  if (serverError) {
    return (
      <ServiceUnavailableState
        variant="page"
        loading={retrying}
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  const quickActions = [
    {
      label: "Open Saving Book",
      path: "/savings/open",
      gradient: "linear-gradient(135deg, #1A4D8F 0%, #2563A8 100%)",
      icon: <PiggyBank size={32} />,
      emoji: "🏦",
      roles: ["teller"],
    },
    {
      label: "Make Deposit",
      path: "/savings/deposit",
      gradient: "linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)",
      icon: <Coins size={32} />,
      emoji: "💰",
      roles: ["teller"],
    },
    {
      label: "Make Withdrawal",
      path: "/savings/withdraw",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
      icon: <Receipt size={32} />,
      emoji: "💵",
      roles: ["teller"],
    },
    {
      label: "Search Saving Books",
      path: "/search",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
      icon: <Search size={32} />,
      emoji: "🔍",
      roles: ["teller", "accountant"],
    },
    {
      label: "Daily Report",
      path: "/reports/daily",
      gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
      icon: <FileText size={32} />,
      emoji: "📊",
      roles: ["accountant"],
    },
    {
      label: "Monthly Report",
      path: "/reports/monthly",
      gradient: "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
      icon: <FileText size={32} />,
      emoji: "📈",
      roles: ["accountant"],
    },
  ];

  const visibleActions = quickActions.filter((action) =>
    action.roles.includes(user.role)
  );

  return (
    <RoleGuard allow={["teller", "accountant"]}>
      <div className="space-y-8">
        {/* Show service unavailable state if server is down */}
        {serverError && (
          <ServiceUnavailableState
            variant="page"
            loading={retrying}
            onRetry={() => {
              setRetrying(true);
              setServerError(null);
              const fetchDashboardData = async () => {
                try {
                  const response = await getDashboardStats();
                  if (response.success && response.data) {
                    // For simplicity, reload to restore all state
                    window.location.reload();
                  }
                } catch (err) {
                  if (isServerUnavailable(err)) {
                    setServerError(err);
                  }
                } finally {
                  setRetrying(false);
                }
              };
              fetchDashboardData();
            }}
          />
        )}

        {!serverError && (
          <>
            {/* 📊 Stats Grid - Cute Cards */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {loading ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : (
                stats.map((stat, index) => (
                  <CuteStatCard key={index} {...stat} />
                ))
              )}
            </div>

            {/* 🎯 Quick Actions - Cute Menu Cards */}
            <Card className="overflow-hidden border border-gray-200">
              <CardHeader className="bg-linear-to-r from-[#E8F6FF] to-[#DFF9F4] border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 rounded-md bg-white/50" />
                <StarDecor className="top-4 right-8" />
                <CardTitle className="relative z-10 flex items-center gap-2">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                    <>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="relative p-6 overflow-hidden rounded-sm bg-white border border-gray-100 animate-pulse"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <Skeleton className="w-14 h-14 rounded-sm bg-gray-200" />
                              <Skeleton className="w-8 h-8 rounded-md bg-gray-200" />
                            </div>
                            <Skeleton className="h-5 w-32 bg-gray-200" />
                            <Skeleton className="h-4 w-24 bg-gray-200" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    visibleActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(action.path)}
                        className="relative p-6 overflow-hidden text-left transition-all cursor-pointer duration-300 border-2 border-transparent group rounded-sm hover:scale-105 hover:border hover:border-white"
                        style={{ background: action.gradient }}
                      >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 -mt-12 -mr-12 transition-transform duration-500 rounded-md bg-white/10 group-hover:scale-150" />
                        <StarDecor className="top-2 right-2" />

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center justify-center transition-transform duration-300 w-14 h-14 rounded-sm bg-white/20 backdrop-blur-sm group-hover:scale-110">
                              <div className="text-white">{action.icon}</div>
                            </div>
                            <span className="text-3xl">{action.emoji}</span>
                          </div>
                          <h4 className="text-lg font-semibold text-white">
                            {action.label}
                          </h4>
                          <p className="mt-1 text-sm text-white/80">
                            Click to access
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 📈 Charts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Bar Chart */}
              <Card className="overflow-hidden border border-gray-200 lg:col-span-2 rounded-sm">
                <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2">
                    Deposits & Withdrawals This Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-end h-[300px] px-4">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center gap-2 flex-1"
                          >
                            <Skeleton
                              className={`w-12 bg-gray-300 animate-pulse`}
                              style={{
                                height: `${Math.random() * 200 + 50}px`,
                              }}
                            />
                            <Skeleton className="w-8 h-3 bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={depositWithdrawalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="name" stroke="#64748B" />
                        <YAxis
                          label={{
                            value: "(Million VND)",
                            angle: -90,
                            position: "insideLeft",
                            style: { fill: "#64748B" },
                          }}
                          stroke="#64748B"
                        />
                        <Tooltip
                          formatter={(value) =>
                            `${formatVnNumber(Number(value), {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}M₫`
                          }
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="deposits"
                          fill="#1A4D8F"
                          name="Deposits"
                          radius={[8, 8, 0, 0]}
                        />
                        <Bar
                          dataKey="withdrawals"
                          fill="#00AEEF"
                          name="Withdrawals"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card className="overflow-hidden border border-gray-200 rounded-sm">
                <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2">
                    Saving Book Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center h-[300px]">
                        <Skeleton className="w-48 h-48 rounded-md bg-gray-300 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        {Array.from({ length: typeCount || 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Skeleton className="w-3 h-3 rounded-md bg-gray-300" />
                              <Skeleton className="h-4 w-24 bg-gray-200" />
                            </div>
                            <Skeleton className="h-4 w-20 bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={accountTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ value }) => `${formatVnNumber(value)}`}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {accountTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: "12px",
                              border: "1px solid #E5E7EB",
                            }}
                            formatter={(value) => formatVnNumber(value)}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 space-y-2">
                        {accountTypeData.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-md"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm text-gray-600">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatVnNumber(item.value)} accounts
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 🔔 Recent Transactions */}
            <Card className="overflow-hidden border border-gray-200 rounded-sm">
              <CardHeader className="bg-linear-to-r from-[#E8F6FF] to-[#DFF9F4] border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 rounded-md bg-white/50" />
                <CardTitle className="relative z-10 flex items-center gap-2">
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-sm animate-pulse"
                      >
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-12 h-12 rounded-sm bg-gray-300" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32 bg-gray-300" />
                            <Skeleton className="h-3 w-40 bg-gray-200" />
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Skeleton className="h-4 w-24 bg-gray-300" />
                          <Skeleton className="h-3 w-16 bg-gray-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <p>No recent transactions</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction, index) => {
                      // Format raw data for display
                      const isDeposit = transaction.type === "deposit";

                      // Detect if this is an opening deposit by checking if transaction date matches saving book open date
                      const savingBook = mockSavingBooks.find(
                        (sb) => sb.bookId === transaction.bookId
                      );
                      const isOpenAccount = Boolean(
                        savingBook &&
                          transaction.type === "deposit" &&
                          savingBook.openDate === transaction.date
                      );

                      let emoji = isDeposit ? "💰" : "💵";
                      let color = isDeposit ? "#00AEEF" : "#F59E0B";
                      let typeLabel = isDeposit ? "Deposit" : "Withdrawal";

                      if (isOpenAccount) {
                        emoji = "🏦";
                        color = "#1A4D8F";
                        typeLabel = "Open Saving Book";
                      }

                      const amountDisplay = isDeposit
                        ? `+${formatVnNumber(transaction.amount)}₫`
                        : `-${formatVnNumber(transaction.amount)}₫`;

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 transition-all duration-200 bg-white border border-gray-100 rounded-sm hover:border-gray-200 hover:border"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="flex items-center justify-center w-12 h-12 text-2xl border border-gray-100 rounded-sm"
                              style={{ backgroundColor: `${color}15` }}
                            >
                              {emoji}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.customerName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.bookId} • {typeLabel}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold ${
                                isDeposit ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {amountDisplay}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </RoleGuard>
  );
}
