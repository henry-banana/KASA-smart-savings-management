import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileDown } from 'lucide-react';

export default function MonthlyReport({ user }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  // Mock report data
  const reportData = [
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

  const pieChartData = reportData.map(item => ({
    name: item.type,
    value: item.opened,
    color: item.type === 'No Term' ? '#00AEEF' : item.type === '3 Months' ? '#1A4D8F' : '#8B5CF6'
  }));

  const totals = {
    opened: reportData.reduce((sum, item) => sum + item.opened, 0),
    closed: reportData.reduce((sum, item) => sum + item.closed, 0),
    difference: reportData.reduce((sum, item) => sum + item.difference, 0)
  };

  const handleExport = () => {
    alert(`Exporting Monthly Report for ${selectedMonth}/${selectedYear} to PDF...`);
  };

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Report (BM5.2)</CardTitle>
          <CardDescription>View monthly account activity by savings type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleExport}
              style={{ backgroundColor: '#1A4D8F' }}
              className="text-white"
            >
              <FileDown size={16} className="mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Accounts Opened</p>
              <h3 className="text-2xl text-green-600">{totals.opened}</h3>
              <p className="text-xs text-gray-500">New accounts this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Accounts Closed</p>
              <h3 className="text-2xl text-red-600">{totals.closed}</h3>
              <p className="text-xs text-gray-500">Closed accounts this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Net Growth</p>
              <h3 className="text-2xl text-blue-600">+{totals.difference}</h3>
              <p className="text-xs text-gray-500">Account growth this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Report for {months[parseInt(selectedMonth) - 1]?.label} {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Savings Type</TableHead>
                  <TableHead className="text-right">Accounts Opened</TableHead>
                  <TableHead className="text-right">Accounts Closed</TableHead>
                  <TableHead className="text-right">Net Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.type}</TableCell>
                    <TableCell className="text-right text-green-600">
                      {row.opened}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {row.closed}
                    </TableCell>
                    <TableCell className="text-right text-blue-600">
                      +{row.difference}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50">
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell className="text-right text-green-600">
                    {totals.opened}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {totals.closed}
                  </TableCell>
                  <TableCell className="text-right text-blue-600">
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
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trend</CardTitle>
            <CardDescription>New accounts opened per week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="No Term" stroke="#00AEEF" strokeWidth={2} />
                <Line type="monotone" dataKey="3 Months" stroke="#1A4D8F" strokeWidth={2} />
                <Line type="monotone" dataKey="6 Months" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Account Type Distribution</CardTitle>
            <CardDescription>Percentage of new accounts by type</CardDescription>
          </CardHeader>
          <CardContent>
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl text-blue-600">
                {((totals.difference / (totals.opened - totals.difference || 1)) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Month-over-month growth</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Retention Rate</p>
              <p className="text-2xl text-green-600">
                {(((totals.opened - totals.closed) / totals.opened * 100) || 0).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Accounts retained</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Average Daily New Accounts</p>
              <p className="text-2xl text-purple-600">
                {(totals.opened / 30).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">Per day average</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
