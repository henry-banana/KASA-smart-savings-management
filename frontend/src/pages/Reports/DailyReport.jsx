import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { DatePicker } from '../../components/ui/date-picker';
import { Label } from '../../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileDown, Search, TrendingUp, TrendingDown, DollarSign, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CuteStatCard, StarDecor, SparkleDecor } from '../../components/CuteComponents';
import { getDailyReport } from '../../services/reportService';
import { RoleGuard } from '../../components/RoleGuard';

export default function DailyReport() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if selected date is today or in the future
  const isDateInvalid = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return selected >= today;
  };

  // Generate report function - only called when user clicks button
  const handleGenerateReport = async () => {
    if (isDateInvalid()) {
      setError('Cannot generate report for today or future dates. Please select a past date.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const response = await getDailyReport(dateString);
      
      if (!response.success || !response.data) {
        setError('No data found for the selected date. Please try another date.');
        setReportData(null);
        return;
      }
      
      setReportData(response.data);
    } catch (err) {
      console.error('Report error:', err);
      setError('Failed to generate report. Please try again or select a different date.');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  // Calculate breakdown by type from reportData (canonical 'items' field)
  const typeBreakdown = reportData?.items || [];

  const chartData = typeBreakdown.map(item => ({
    name: item.typeName,
    Deposits: item.totalDeposits / 1000000,
    Withdrawals: item.totalWithdrawals / 1000000,
    Difference: item.difference / 1000000
  }));

  const totals = reportData?.total ? {
    deposits: reportData.total.totalDeposits,
    withdrawals: reportData.total.totalWithdrawals,
    difference: reportData.total.difference
  } : {
    deposits: typeBreakdown.reduce((sum, item) => sum + item.totalDeposits, 0),
    withdrawals: typeBreakdown.reduce((sum, item) => sum + item.totalWithdrawals, 0),
    difference: typeBreakdown.reduce((sum, item) => sum + item.difference, 0)
  };

  const _handleExport = () => {
    // TODO: Implement PDF export when backend provides endpoint
    alert(`Exporting Daily Report for ${format(selectedDate, 'yyyy-MM-dd')} to PDF...`);
  };

  return (
    <RoleGuard allow={['accountant']}>
    <div className="space-y-4 sm:space-y-6">
      {/* Report Header */}
      <Card className="overflow-hidden border-0 shadow-xl rounded-3xl">
        <CardHeader className="pb-6 border-b border-gray-100 bg-linear-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="flex items-center justify-center w-12 h-12 shadow-lg sm:w-14 sm:h-14 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <span>📊</span>
                Daily Report (BM5.1)
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
                  return date >= today;
                }}
              />
            </div>
            <Button
              onClick={handleGenerateReport}
              disabled={loading || isDateInvalid()}
              className="w-full h-12 px-6 text-white transition-shadow shadow-lg sm:w-auto rounded-xl hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <Search size={18} className="mr-2" />
              {loading ? 'Generating...' : isDateInvalid() ? 'Invalid Date' : 'Generate Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-2 border-red-200 bg-red-50 rounded-2xl">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h4 className="font-semibold text-red-900">No Data Found</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show results only after generate */}
      {reportData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div 
              className="relative p-6 overflow-hidden transition-all duration-300 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl"
            >
              <div 
                className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full opacity-10"
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
              />
              <StarDecor className="top-3 right-3" />
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="mb-2 text-sm text-gray-600">Total Deposits</p>
                  <h3 className="mb-2 text-2xl font-semibold text-transparent bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text">
                    ₫{totals.deposits.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight size={14} className="text-green-600" />
                    <span className="text-xs text-gray-500">All account types</span>
                  </div>
                </div>
                <div 
                  className="flex items-center justify-center w-14 h-14 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                >
                  <TrendingUp className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div 
              className="relative p-6 overflow-hidden transition-all duration-300 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl"
            >
              <div 
                className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full opacity-10"
                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
              />
              <StarDecor className="top-3 right-3" />
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="mb-2 text-sm text-gray-600">Total Withdrawals</p>
                  <h3 className="mb-2 text-2xl font-semibold text-transparent bg-linear-to-r from-red-600 to-rose-600 bg-clip-text">
                    ₫{totals.withdrawals.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1">
                    <ArrowDownRight size={14} className="text-red-600" />
                    <span className="text-xs text-gray-500">All account types</span>
                  </div>
                </div>
                <div 
                  className="flex items-center justify-center w-14 h-14 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
                >
                  <TrendingDown className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div 
              className="relative p-6 overflow-hidden transition-all duration-300 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl"
            >
              <div 
                className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full opacity-10"
                style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
              />
              <StarDecor className="top-3 right-3" />
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="mb-2 text-sm text-gray-600">Net Difference</p>
                  <h3 className="mb-2 text-2xl font-semibold text-transparent bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text">
                    ₫{totals.difference.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-blue-600" />
                    <span className="text-xs text-gray-500">Deposits - Withdrawals</span>
                  </div>
                </div>
                <div 
                  className="flex items-center justify-center w-14 h-14 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
                >
                  <Sparkles className="text-white" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <CardHeader className="border-b-2 border-purple-100 bg-linear-to-r from-blue-50 to-purple-50">
          <CardTitle className="text-xl text-gray-800">
            Detailed Report - {format(selectedDate, 'dd/MM/yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-linear-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100">
                  <TableHead className="font-semibold text-gray-700">Savings Type</TableHead>
                  <TableHead className="font-semibold text-right text-gray-700">Total Deposits</TableHead>
                  <TableHead className="font-semibold text-right text-gray-700">Total Withdrawals</TableHead>
                  <TableHead className="font-semibold text-right text-gray-700">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {typeBreakdown.map((row, index) => (
                  <TableRow key={index} className="transition-colors hover:bg-purple-50">
                    <TableCell className="font-medium text-gray-700">{row.typeName}</TableCell>
                    <TableCell className="font-semibold text-right text-green-600">
                      ₫{row.totalDeposits.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold text-right text-red-600">
                      ₫{row.totalWithdrawals.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold text-right text-blue-600">
                      ₫{row.difference.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-linear-to-r from-purple-100 to-pink-100">
                  <TableCell className="font-bold text-gray-800">Total</TableCell>
                  <TableCell className="font-bold text-right text-green-700">
                    ₫{totals.deposits.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-bold text-right text-red-700">
                    ₫{totals.withdrawals.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-bold text-right text-blue-700">
                    ₫{totals.difference.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Chart Visualization */}
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <CardHeader className="border-b-2 border-blue-100 bg-linear-to-r from-cyan-50 to-blue-50">
          <CardTitle className="text-xl text-gray-800">Visual Comparison</CardTitle>
          <CardDescription className="text-gray-600">
            Deposit/Withdrawal Chart by Account Type (million VND)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis 
                label={{ value: 'Amount (Million VND)', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
                stroke="#6B7280"
              />
              <Tooltip 
                formatter={(value) => `₫${Number(value).toFixed(1)}M`}
                contentStyle={{ borderRadius: '12px', border: '2px solid #E5E7EB' }}
              />
              <Legend />
              <Bar dataKey="Deposits" fill="url(#colorDeposits)" name="Deposits" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Withdrawals" fill="url(#colorWithdrawals)" name="Withdrawals" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#34D399" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#F87171" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transaction Statistics */}
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <CardHeader className="border-b-2 border-green-100 bg-linear-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-xl text-gray-800">Transaction Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-4 space-y-4 rounded-xl bg-linear-to-br from-green-50 to-emerald-50">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-green-700">
                <TrendingUp size={16} />
                Deposit Transactions
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-gray-700">No Term</span>
                  <span className="text-sm font-semibold text-green-600">23 transactions</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-gray-700">3 Months</span>
                  <span className="text-sm font-semibold text-green-600">15 transactions</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-gray-700">6 Months</span>
                  <span className="text-sm font-semibold text-green-600">12 transactions</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t-2 border-green-200">
                  <span className="text-sm font-bold text-gray-800">Total</span>
                  <span className="text-sm font-bold text-green-700">50 transactions</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4 rounded-xl bg-linear-to-br from-red-50 to-rose-50">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700">
                <TrendingDown size={16} />
                Withdrawal Transactions
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-gray-700">No Term</span>
                  <span className="text-sm font-semibold text-red-600">8 transactions</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-gray-700">3 Months</span>
                  <span className="text-sm font-semibold text-red-600">5 transactions</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-gray-700">6 Months</span>
                  <span className="text-sm font-semibold text-red-600">2 transactions</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t-2 border-red-200">
                  <span className="text-sm font-bold text-gray-800">Total</span>
                  <span className="text-sm font-bold text-red-700">15 transactions</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
    </RoleGuard>
  );
}
