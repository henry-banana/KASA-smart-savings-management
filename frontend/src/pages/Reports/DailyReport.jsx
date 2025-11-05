import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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
import { FileDown, Calendar } from 'lucide-react';

export default function DailyReport({ user }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock report data
  const reportData = [
    {
      type: 'No Term',
      deposits: 12,
      withdrawals: 5,
      difference: 85000000
    },
    {
      type: '3 Months',
      deposits: 8,
      withdrawals: 3,
      difference: 67000000
    },
    {
      type: '6 Months',
      deposits: 6,
      withdrawals: 2,
      difference: 47000000
    }
  ];

  const chartData = reportData.map(item => ({
    name: item.type,
    Deposits: item.deposits,
    Withdrawals: item.withdrawals,
    Difference: item.difference
  }));

  const totals = {
    deposits: reportData.reduce((sum, item) => sum + item.deposits, 0),
    withdrawals: reportData.reduce((sum, item) => sum + item.withdrawals, 0),
    difference: reportData.reduce((sum, item) => sum + item.difference, 0)
  };

  const handleExport = () => {
    alert(`Exporting Daily Report for ${selectedDate} to PDF...`);
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Report (BM5.1)</CardTitle>
          <CardDescription>View daily deposits and withdrawals by savings type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="reportDate">Select Date</Label>
              <div className="relative">
                <Input
                  id="reportDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={handleExport}
              style={{ backgroundColor: '#1A4D8F' }}
              className="text-white"
            >
              <FileDown size={16} className="mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total Deposits</p>
              <h3 className="text-2xl text-green-600">₫{totals.deposits.toLocaleString()}</h3>
              <p className="text-xs text-gray-500">Across all account types</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total Withdrawals</p>
              <h3 className="text-2xl text-red-600">₫{totals.withdrawals.toLocaleString()}</h3>
              <p className="text-xs text-gray-500">Across all account types</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Net Difference</p>
              <h3 className="text-2xl text-blue-600">₫{totals.difference.toLocaleString()}</h3>
              <p className="text-xs text-gray-500">Deposits - Withdrawals</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Report for {selectedDate}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Savings Type</TableHead>
                  <TableHead className="text-right">Total Deposits</TableHead>
                  <TableHead className="text-right">Total Withdrawals</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.type}</TableCell>
                    <TableCell className="text-right text-green-600">
                      ₫{row.deposits.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      ₫{row.withdrawals.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-blue-600">
                      ₫{row.difference.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50">
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell className="text-right text-green-600">
                    ₫{totals.deposits.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    ₫{totals.withdrawals.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-blue-600">
                    ₫{totals.difference.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Comparison</CardTitle>
          <CardDescription>Deposits vs Withdrawals by Account Type (in millions VND)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Amount (M VND)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `₫${Number(value).toFixed(1)}M`} />
              <Legend />
              <Bar dataKey="Deposits" fill="#10B981" name="Deposits" />
              <Bar dataKey="Withdrawals" fill="#EF4444" name="Withdrawals" />
              <Bar dataKey="Difference" fill="#1A4D8F" name="Difference" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transaction Count */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="text-sm text-gray-600">Deposits</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">No Term</span>
                  <span className="text-sm">23 transactions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">3 Months</span>
                  <span className="text-sm">15 transactions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">6 Months</span>
                  <span className="text-sm">12 transactions</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm">Total</span>
                  <span className="text-sm">50 transactions</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm text-gray-600">Withdrawals</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">No Term</span>
                  <span className="text-sm">8 transactions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">3 Months</span>
                  <span className="text-sm">5 transactions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">6 Months</span>
                  <span className="text-sm">2 transactions</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm">Total</span>
                  <span className="text-sm">15 transactions</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
