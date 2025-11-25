import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MonthPicker } from '../../components/ui/month-picker';
import { Label } from '../../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileDown, Calendar, TrendingUp, Users, Award, BarChart3, Sparkles, Search } from 'lucide-react';
import { StarDecor, SparkleDecor } from '../../components/CuteComponents';
import { getMonthlyReport } from '../../services/reportService';
import { RoleGuard } from '../../components/RoleGuard';

export default function MonthlyReport() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if selected month is current month or in the future
  const isMonthInvalid = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    
    return selectedYear > currentYear || 
           (selectedYear === currentYear && selectedMonth >= currentMonth);
  };

  // Generate report function - only called when user clicks button
  const handleGenerateReport = async () => {
    if (isMonthInvalid()) {
      setError('Cannot generate report for current or future months. Please select a past month.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const response = await getMonthlyReport(month, year);
      
      if (!response.success || !response.data) {
        setError('No data found for the selected month. Please try another month.');
        setReportData(null);
        return;
      }
      
      setReportData(response.data);
    } catch (err) {
      console.error('Monthly report error:', err);
      setError('Failed to generate report. Please try again or select a different month.');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  // Calculate breakdown by type from reportData
  const typeBreakdown = reportData?.byTypeSaving || [];

  const lineChartData = reportData?.dailyBreakdown || [];

  const pieChartData = typeBreakdown.map(item => ({
    name: item.type || item.name,
    value: item.opened || item.newSavingBooks || 0,
    color: (item.type || item.name) === 'No Term' ? '#00AEEF' : (item.type || item.name) === '3 Months' ? '#1A4D8F' : '#8B5CF6'
  }));

  const totals = reportData?.summary ? {
    opened: reportData.summary.newSavingBooks || 0,
    closed: reportData.summary.closedSavingBooks || 0,
    difference: (reportData.summary.newSavingBooks || 0) - (reportData.summary.closedSavingBooks || 0)
  } : {
    opened: typeBreakdown.reduce((sum, item) => sum + (item.opened || item.newSavingBooks || 0), 0),
    closed: typeBreakdown.reduce((sum, item) => sum + (item.closed || item.closedSavingBooks || 0), 0),
    difference: typeBreakdown.reduce((sum, item) => sum + ((item.opened || item.newSavingBooks || 0) - (item.closed || item.closedSavingBooks || 0)), 0)
  };

  const handleExport = () => {
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    alert(`Exporting Monthly Report for ${month}/${year} to PDF...`);
  };

  return (
    <RoleGuard allow={['accountant']}>
    <div className="space-y-4 sm:space-y-6">
      {/* Report Header */}
      <Card className="overflow-hidden border-0 shadow-xl rounded-3xl">
        <CardHeader className="pb-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="flex items-center justify-center w-12 h-12 shadow-lg sm:w-14 sm:h-14 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
            >
              <Calendar size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <span>📅</span>
                Monthly Report (BM5.2)
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                View monthly account activity and trends
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-end gap-4 sm:flex-row">
            <div className="flex-1 w-full space-y-2">
              <Label htmlFor="reportMonth">Select Month</Label>
              <MonthPicker
                date={selectedDate}
                onSelect={setSelectedDate}
                placeholder="Pick a month"
                maxDate={new Date()}
              />
            </div>
            <Button
              onClick={handleGenerateReport}
              disabled={loading || isMonthInvalid()}
              className="w-full h-12 px-6 text-white transition-shadow shadow-lg sm:w-auto rounded-xl hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
            >
              <Search size={18} className="mr-2" />
              {loading ? 'Generating...' : isMonthInvalid() ? 'Invalid Month' : 'Generate Report'}
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
          {/* Report Data Card */}
          <Card className="overflow-hidden border-0 shadow-xl rounded-3xl">
            <CardHeader className="bg-linear-to-r from-cyan-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction Summary</CardTitle>
                  <CardDescription>
                    Report for {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </CardDescription>
                </div>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="shadow-sm rounded-xl hover:shadow-md"
                >
                  <FileDown size={18} className="mr-2" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
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
              <p className="mb-2 text-sm text-gray-600">New Accounts Opened</p>
              <h3 className="mb-2 text-2xl font-semibold text-transparent bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text">
                {totals.opened}
              </h3>
              <p className="text-xs text-gray-500">New accounts this month</p>
            </div>
            <div 
              className="flex items-center justify-center w-14 h-14 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
            >
              <Users className="text-white" size={24} />
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
              <p className="mb-2 text-sm text-gray-600">Accounts Closed</p>
              <h3 className="mb-2 text-2xl font-semibold text-transparent bg-linear-to-r from-red-600 to-rose-600 bg-clip-text">
                {totals.closed}
              </h3>
              <p className="text-xs text-gray-500">Accounts closed this month</p>
            </div>
            <div 
              className="flex items-center justify-center w-14 h-14 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
            >
              <FileDown className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div 
          className="relative p-6 overflow-hidden transition-all duration-300 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl"
        >
          <div 
            className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full opacity-10"
            style={{ background: 'linear-gradient(135deg, #00AEEF 0%, #1A4D8F 100%)' }}
          />
          <StarDecor className="top-3 right-3" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-2 text-sm text-gray-600">Net Growth</p>
              <h3 className="mb-2 text-2xl font-semibold text-transparent bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text">
                +{totals.difference}
              </h3>
              <p className="text-xs text-gray-500">Account growth</p>
            </div>
            <div 
              className="flex items-center justify-center w-14 h-14 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #00AEEF 0%, #1A4D8F 100%)' }}
            >
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <CardHeader className="border-b-2 bg-linear-to-r from-cyan-50 to-blue-50 border-cyan-100">
          <CardTitle className="text-xl text-gray-800">
            Detailed Report - {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-linear-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100">
                  <TableHead className="font-semibold text-gray-700">Savings Type</TableHead>
                  <TableHead className="font-semibold text-right text-gray-700">Accounts Opened</TableHead>
                  <TableHead className="font-semibold text-right text-gray-700">Accounts Closed</TableHead>
                  <TableHead className="font-semibold text-right text-gray-700">Net Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {typeBreakdown.map((row, index) => (
                  <TableRow key={index} className="transition-colors hover:bg-cyan-50">
                    <TableCell className="font-medium text-gray-700">{row.type}</TableCell>
                    <TableCell className="font-semibold text-right text-green-600">
                      {row.opened}
                    </TableCell>
                    <TableCell className="font-semibold text-right text-red-600">
                      {row.closed}
                    </TableCell>
                    <TableCell className="font-semibold text-right text-blue-600">
                      +{row.difference}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-linear-to-r from-cyan-100 to-blue-100">
                  <TableCell className="font-bold text-gray-800">Total</TableCell>
                  <TableCell className="font-bold text-right text-green-700">
                    {totals.opened}
                  </TableCell>
                  <TableCell className="font-bold text-right text-red-700">
                    {totals.closed}
                  </TableCell>
                  <TableCell className="font-bold text-right text-blue-700">
                    +{totals.difference}
                  </TableCell>
                </TableRow>
              </TableBody>
              </Table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Line Chart */}
        <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
          <CardHeader className="border-b-2 border-green-100 bg-linear-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-xl text-gray-800">Weekly Trends</CardTitle>
            <CardDescription className="text-gray-600">
              New accounts opened by week
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '2px solid #E5E7EB' }}
                />
                <Legend />
                <Line type="monotone" dataKey="No Term" stroke="#00AEEF" strokeWidth={3} dot={{ r: 5 }} name="No Term" />
                <Line type="monotone" dataKey="3 Months" stroke="#1A4D8F" strokeWidth={3} dot={{ r: 5 }} name="3 Months" />
                <Line type="monotone" dataKey="6 Months" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} name="6 Months" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
          <CardHeader className="border-b-2 border-purple-100 bg-linear-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-xl text-gray-800">Account Type Distribution</CardTitle>
            <CardDescription className="text-gray-600">
              Percentage of new accounts by type
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '2px solid #E5E7EB' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <CardHeader className="border-b-2 bg-linear-to-r from-amber-50 to-orange-50 border-amber-100">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
            <Award size={20} className="text-amber-600" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-4 space-y-2 rounded-xl bg-linear-to-br from-blue-50 to-cyan-50">
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-3xl font-bold text-transparent bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text">
                {((totals.difference / (totals.opened - totals.difference || 1)) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Growth compared to last month</p>
            </div>

            <div className="p-4 space-y-2 rounded-xl bg-linear-to-br from-green-50 to-emerald-50">
              <p className="text-sm font-medium text-gray-600">Retention Rate</p>
              <p className="text-3xl font-bold text-transparent bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text">
                {(((totals.opened - totals.closed) / totals.opened * 100) || 0).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Accounts retained</p>
            </div>

            <div className="p-4 space-y-2 rounded-xl bg-linear-to-br from-purple-50 to-pink-50">
              <p className="text-sm font-medium text-gray-600">Avg New Accounts/Day</p>
              <p className="text-3xl font-bold text-transparent bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text">
                {(totals.opened / 30).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">Average per day</p>
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