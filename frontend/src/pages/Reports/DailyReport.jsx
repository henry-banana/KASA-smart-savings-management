import React, { useState, useEffect } from 'react';
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
import { FileDown, Calendar, TrendingUp, TrendingDown, DollarSign, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CuteStatCard, StarDecor, SparkleDecor } from '../../components/CuteComponents';
import { getDailyReport } from '../../services/reportService';

export default function DailyReport() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await getDailyReport(selectedDate);
        setReportData(response.data);
      } catch (err) {
        console.error('Report error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedDate]);

  // Mock breakdown by type - can be extended later
  const typeBreakdown = [
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

  const chartData = typeBreakdown.map(item => ({
    name: item.type,
    Deposits: item.deposits,
    Withdrawals: item.withdrawals,
    Difference: item.difference
  }));

  const totals = {
    deposits: typeBreakdown.reduce((sum, item) => sum + item.deposits, 0),
    withdrawals: typeBreakdown.reduce((sum, item) => sum + item.withdrawals, 0),
    difference: typeBreakdown.reduce((sum, item) => sum + item.difference, 0)
  };

  const handleExport = () => {
    alert(`Exporting Daily Report for ${selectedDate} to PDF...`);
  };

  if (loading || !reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Decorative elements */}
      <SparkleDecor className="top-4 right-12" />
      <StarDecor className="top-8 left-24" />
      
      {/* Report Header */}
      <Card className="relative overflow-hidden border-0 shadow-lg">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
        <CardHeader className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="p-3 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <FileDown className="text-white" size={24} />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Báo Cáo Ngày (BM5.1)
              </CardTitle>
              <CardDescription className="text-base">
                Xem tổng hợp gửi/rút tiền theo loại tiết kiệm trong ngày
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="reportDate" className="text-gray-700 font-medium">
                <Calendar size={16} className="inline mr-2" />
                Chọn Ngày
              </Label>
              <div className="relative">
                <Input
                  id="reportDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl border-2 border-purple-100 focus:border-purple-400 transition-colors"
                />
              </div>
            </div>
            <Button 
              onClick={handleExport}
              className="rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <FileDown size={16} className="mr-2" />
              Xuất PDF
            </Button>
          </div>
        </CardContent>
      </Card>

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
              <p className="text-sm text-gray-600 mb-2">Tổng Tiền Gửi</p>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                ₫{totals.deposits.toLocaleString()}
              </h3>
              <div className="flex items-center gap-1">
                <ArrowUpRight size={14} className="text-green-600" />
                <span className="text-xs text-gray-500">Tất cả loại tài khoản</span>
              </div>
            </div>
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
            >
              <TrendingUp className="text-white" size={24} />
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
              <p className="text-sm text-gray-600 mb-2">Tổng Tiền Rút</p>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">
                ₫{totals.withdrawals.toLocaleString()}
              </h3>
              <div className="flex items-center gap-1">
                <ArrowDownRight size={14} className="text-red-600" />
                <span className="text-xs text-gray-500">Tất cả loại tài khoản</span>
              </div>
            </div>
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
            >
              <TrendingDown className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div 
          className="relative overflow-hidden rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
        >
          <div 
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-16 -mt-16"
            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
          />
          <StarDecor className="top-3 right-3" />
          
          <div className="flex items-start justify-between relative">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Chênh Lệch Ròng</p>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                ₫{totals.difference.toLocaleString()}
              </h3>
              <div className="flex items-center gap-1">
                <DollarSign size={14} className="text-blue-600" />
                <span className="text-xs text-gray-500">Gửi - Rút</span>
              </div>
            </div>
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
            >
              <Sparkles className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-purple-100">
          <CardTitle className="text-xl text-gray-800">
            Báo Cáo Chi Tiết - {selectedDate}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100">
                  <TableHead className="font-semibold text-gray-700">Loại Tiết Kiệm</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Tổng Tiền Gửi</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Tổng Tiền Rút</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Chênh Lệch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {typeBreakdown.map((row, index) => (
                  <TableRow key={index} className="hover:bg-purple-50 transition-colors">
                    <TableCell className="font-medium text-gray-700">{row.type}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      ₫{row.deposits.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      ₫{row.withdrawals.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                      ₫{row.difference.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gradient-to-r from-purple-100 to-pink-100 font-bold">
                  <TableCell className="font-bold text-gray-800">Tổng Cộng</TableCell>
                  <TableCell className="text-right font-bold text-green-700">
                    ₫{totals.deposits.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-red-700">
                    ₫{totals.withdrawals.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-blue-700">
                    ₫{totals.difference.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Chart Visualization */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b-2 border-blue-100">
          <CardTitle className="text-xl text-gray-800">So Sánh Trực Quan</CardTitle>
          <CardDescription className="text-gray-600">
            Biểu đồ gửi/rút theo loại tài khoản (triệu VND)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis 
                label={{ value: 'Số tiền (Triệu VND)', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
                stroke="#6B7280"
              />
              <Tooltip 
                formatter={(value) => `₫${Number(value).toFixed(1)}M`}
                contentStyle={{ borderRadius: '12px', border: '2px solid #E5E7EB' }}
              />
              <Legend />
              <Bar dataKey="Deposits" fill="url(#colorDeposits)" name="Tiền Gửi" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Withdrawals" fill="url(#colorWithdrawals)" name="Tiền Rút" radius={[8, 8, 0, 0]} />
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
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-100">
          <CardTitle className="text-xl text-gray-800">Thống Kê Giao Dịch</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <h4 className="text-sm font-semibold text-green-700 flex items-center gap-2">
                <TrendingUp size={16} />
                Giao Dịch Gửi Tiền
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm">
                  <span className="text-sm text-gray-700">Không Kỳ Hạn</span>
                  <span className="text-sm font-semibold text-green-600">23 giao dịch</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm">
                  <span className="text-sm text-gray-700">3 Tháng</span>
                  <span className="text-sm font-semibold text-green-600">15 giao dịch</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm">
                  <span className="text-sm text-gray-700">6 Tháng</span>
                  <span className="text-sm font-semibold text-green-600">12 giao dịch</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t-2 border-green-200">
                  <span className="text-sm font-bold text-gray-800">Tổng Cộng</span>
                  <span className="text-sm font-bold text-green-700">50 giao dịch</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50">
              <h4 className="text-sm font-semibold text-red-700 flex items-center gap-2">
                <TrendingDown size={16} />
                Giao Dịch Rút Tiền
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm">
                  <span className="text-sm text-gray-700">Không Kỳ Hạn</span>
                  <span className="text-sm font-semibold text-red-600">8 giao dịch</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm">
                  <span className="text-sm text-gray-700">3 Tháng</span>
                  <span className="text-sm font-semibold text-red-600">5 giao dịch</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm">
                  <span className="text-sm text-gray-700">6 Tháng</span>
                  <span className="text-sm font-semibold text-red-600">2 giao dịch</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t-2 border-red-200">
                  <span className="text-sm font-bold text-gray-800">Tổng Cộng</span>
                  <span className="text-sm font-bold text-red-700">15 giao dịch</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
