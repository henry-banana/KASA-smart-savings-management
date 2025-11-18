import React, { useState, useEffect } from 'react';
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
import { FileDown, Calendar, TrendingUp, Users, Award, BarChart3, Sparkles } from 'lucide-react';
import { StarDecor, SparkleDecor } from '../../components/CuteComponents';
import { getMonthlyReport } from '../../services/reportService';

export default function MonthlyReport() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await getMonthlyReport(Number(selectedMonth), Number(selectedYear));
        setReportData(response.data);
      } catch (err) {
        console.error('Monthly report error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedMonth, selectedYear]);

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
    alert(`Exporting Monthly Report for ${selectedMonth}/${selectedYear} to PDF...`);
  };

  if (loading || !reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  const months = [
    { value: '1', label: 'Tháng 1' },
    { value: '2', label: 'Tháng 2' },
    { value: '3', label: 'Tháng 3' },
    { value: '4', label: 'Tháng 4' },
    { value: '5', label: 'Tháng 5' },
    { value: '6', label: 'Tháng 6' },
    { value: '7', label: 'Tháng 7' },
    { value: '8', label: 'Tháng 8' },
    { value: '9', label: 'Tháng 9' },
    { value: '10', label: 'Tháng 10' },
    { value: '11', label: 'Tháng 11' },
    { value: '12', label: 'Tháng 12' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

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
            background: 'linear-gradient(135deg, #00AEEF 0%, #1A4D8F 100%)'
          }}
        />
        <CardHeader className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="p-3 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #00AEEF 0%, #1A4D8F 100%)' }}
            >
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Báo Cáo Tháng (BM5.2)
              </CardTitle>
              <CardDescription className="text-base">
                Xem hoạt động tài khoản theo tháng và loại tiết kiệm
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="month" className="text-gray-700 font-medium">
                <Calendar size={16} className="inline mr-2" />
                Tháng
              </Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="rounded-xl border-2 border-cyan-100 focus:border-cyan-400">
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
              <Label htmlFor="year" className="text-gray-700 font-medium">Năm</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="rounded-xl border-2 border-cyan-100 focus:border-cyan-400">
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
              className="rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00AEEF 0%, #1A4D8F 100%)' }}
            >
              <FileDown size={16} className="mr-2" />
              Xuất Báo Cáo
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
              <p className="text-sm text-gray-600 mb-2">Tài Khoản Mở Mới</p>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {totals.opened}
              </h3>
              <p className="text-xs text-gray-500">Tài khoản mới trong tháng</p>
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
              <p className="text-sm text-gray-600 mb-2">Tài Khoản Đóng</p>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">
                {totals.closed}
              </h3>
              <p className="text-xs text-gray-500">Tài khoản đóng trong tháng</p>
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
              <p className="text-sm text-gray-600 mb-2">Tăng Trưởng Ròng</p>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                +{totals.difference}
              </h3>
              <p className="text-xs text-gray-500">Tăng trưởng tài khoản</p>
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

      {/* Data Table */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b-2 border-cyan-100">
          <CardTitle className="text-xl text-gray-800">
            Báo Cáo Chi Tiết - {months[parseInt(selectedMonth) - 1]?.label} {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100">
                  <TableHead className="font-semibold text-gray-700">Loại Tiết Kiệm</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Tài Khoản Mở</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Tài Khoản Đóng</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Chênh Lệch Ròng</TableHead>
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
                  <TableCell className="font-bold text-gray-800">Tổng Cộng</TableCell>
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
            <CardTitle className="text-xl text-gray-800">Xu Hướng Theo Tuần</CardTitle>
            <CardDescription className="text-gray-600">
              Tài khoản mới mở theo tuần
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
                <Line type="monotone" dataKey="No Term" stroke="#00AEEF" strokeWidth={3} dot={{ r: 5 }} name="Không Kỳ Hạn" />
                <Line type="monotone" dataKey="3 Months" stroke="#1A4D8F" strokeWidth={3} dot={{ r: 5 }} name="3 Tháng" />
                <Line type="monotone" dataKey="6 Months" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} name="6 Tháng" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-100">
            <CardTitle className="text-xl text-gray-800">Phân Bổ Loại Tài Khoản</CardTitle>
            <CardDescription className="text-gray-600">
              Phần trăm tài khoản mới theo loại
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
            Chỉ Số Hiệu Suất
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 space-y-2">
              <p className="text-sm text-gray-600 font-medium">Tỷ Lệ Tăng Trưởng</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {((totals.difference / (totals.opened - totals.difference || 1)) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Tăng trưởng so với tháng trước</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 space-y-2">
              <p className="text-sm text-gray-600 font-medium">Tỷ Lệ Giữ Chân</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {(((totals.opened - totals.closed) / totals.opened * 100) || 0).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Tài khoản được giữ lại</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 space-y-2">
              <p className="text-sm text-gray-600 font-medium">TB Tài Khoản Mới/Ngày</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {(totals.opened / 30).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">Trung bình mỗi ngày</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
