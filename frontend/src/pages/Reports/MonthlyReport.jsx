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

  // Mock breakdown by type - can be extended later when backend provides detailed breakdown
  const typeBreakdown = [
    {
      type: 'No Term',
      opened: 45,
      closed: 12,
      difference: 33
    },
    {
      type: '3 Months',
      opened: 38,
      closed: 10,
      difference: 28
    },
    {
      type: '6 Months',
      opened: 32,
      closed: 9,
      difference: 23
    }
  ];

  const lineChartData = [
    { day: 'Week 1', 'No Term': 12, '3 Months': 8, '6 Months': 7 },
    { day: 'Week 2', 'No Term': 15, '3 Months': 10, '6 Months': 9 },
    { day: 'Week 3', 'No Term': 10, '3 Months': 8, '6 Months': 6 },
    { day: 'Week 4', 'No Term': 8, '3 Months': 6, '6 Months': 6 }
  ];

  const pieChartData = typeBreakdown.map(item => ({
    name: item.type,
    value: item.opened,
    color: item.type === 'No Term' ? '#00AEEF' : item.type === '3 Months' ? '#1A4D8F' : '#8B5CF6'
  }));

  const totals = {
    opened: typeBreakdown.reduce((sum, item) => sum + item.opened, 0),
    closed: typeBreakdown.reduce((sum, item) => sum + item.closed, 0),
    difference: typeBreakdown.reduce((sum, item) => sum + item.difference, 0)
  };

  const handleExport = () => {
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    alert(`Exporting Monthly Report for ${month}/${year} to PDF...`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Report Header */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
            >
              <Calendar size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
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
          <div className="flex flex-col sm:flex-row items-end gap-4">
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
              className="w-full sm:w-auto h-12 rounded-xl px-6 text-white shadow-lg hover:shadow-xl transition-shadow"
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
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
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
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
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
                  className="rounded-xl shadow-sm hover:shadow-md"
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
          className="relative overflow-hidden rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
        >
          <div 
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-16 -mt-16"
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
          />
          <StarDecor className="top-3 right-3" />
          
          <div className="flex items-start justify-between relative">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">New Accounts Opened</p>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {totals.opened}
              </h3>
              <p className="text-xs text-gray-500">New accounts this month</p>
            </div>
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
            >
              <Users className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div 
          className="relative overflow-hidden rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
        >
          <div 
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-16 -mt-16"
            style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
          />
          <StarDecor className="top-3 right-3" />
          
          <div className="flex items-start justify-between relative">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Accounts Closed</p>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">
                {totals.closed}
              </h3>
              <p className="text-xs text-gray-500">Accounts closed this month</p>
            </div>
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
            >
              <FileDown className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div 
          className="relative overflow-hidden rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
        >
          <div 
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-16 -mt-16"
            style={{ background: 'linear-gradient(135deg, #00AEEF 0%, #1A4D8F 100%)' }}
          />
          <StarDecor className="top-3 right-3" />
          
          <div className="flex items-start justify-between relative">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Net Growth</p>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                +{totals.difference}
              </h3>
              <p className="text-xs text-gray-500">Account growth</p>
            </div>
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
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
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b-2 border-cyan-100">
          <CardTitle className="text-xl text-gray-800">
            Detailed Report - {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100">
                  <TableHead className="font-semibold text-gray-700">Savings Type</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Accounts Opened</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Accounts Closed</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Net Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {typeBreakdown.map((row, index) => (
                  <TableRow key={index} className="hover:bg-cyan-50 transition-colors">
                    <TableCell className="font-medium text-gray-700">{row.type}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {row.opened}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      {row.closed}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                      +{row.difference}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gradient-to-r from-cyan-100 to-blue-100 font-bold">
                  <TableCell className="font-bold text-gray-800">Total</TableCell>
                  <TableCell className="text-right font-bold text-green-700">
                    {totals.opened}
                  </TableCell>
                  <TableCell className="text-right font-bold text-red-700">
                    {totals.closed}
                  </TableCell>
                  <TableCell className="text-right font-bold text-blue-700">
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
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-100">
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
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-100">
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
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-100">
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <Award size={20} className="text-amber-600" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 space-y-2">
              <p className="text-sm text-gray-600 font-medium">Growth Rate</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {((totals.difference / (totals.opened - totals.difference || 1)) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Growth compared to last month</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 space-y-2">
              <p className="text-sm text-gray-600 font-medium">Retention Rate</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {(((totals.opened - totals.closed) / totals.opened * 100) || 0).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Accounts retained</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 space-y-2">
              <p className="text-sm text-gray-600 font-medium">Avg New Accounts/Day</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
  );
}