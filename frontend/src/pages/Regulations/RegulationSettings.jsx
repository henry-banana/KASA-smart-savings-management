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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { CheckCircle2, AlertTriangle, History, Settings, Sparkles } from 'lucide-react';
import { StarDecor } from '../../components/CuteComponents';

export default function RegulationSettings({ user }) {
  const [minDeposit, setMinDeposit] = useState('100000');
  const [minWithdrawalDays, setMinWithdrawalDays] = useState('15');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [interestRates, setInterestRates] = useState([
    { type: 'Không Kỳ Hạn', rate: '2.0', editable: false },
    { type: '3 Tháng', rate: '4.5', editable: false },
    { type: '6 Tháng', rate: '5.5', editable: false }
  ]);

  const changeHistory = [
    {
      date: '2025-11-01',
      user: 'admin',
      field: 'Số Tiền Gửi Tối Thiểu',
      oldValue: '50.000 đ',
      newValue: '100.000 đ'
    },
    {
      date: '2025-10-15',
      user: 'admin',
      field: 'Số Ngày Rút Tối Thiểu',
      oldValue: '10 ngày',
      newValue: '15 ngày'
    },
    {
      date: '2025-09-20',
      user: 'admin',
      field: 'Lãi Suất 3 Tháng',
      oldValue: '4.0%',
      newValue: '4.5%'
    },
    {
      date: '2025-08-10',
      user: 'admin',
      field: 'Lãi Suất 6 Tháng',
      oldValue: '5.0%',
      newValue: '5.5%'
    }
  ];

  const handleUpdateRate = (index, newRate) => {
    const updated = [...interestRates];
    updated[index].rate = newRate;
    setInterestRates(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmUpdate = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    
    // Add to history (mock)
    changeHistory.unshift({
      date: new Date().toISOString().split('T')[0],
      user: user.username,
      field: 'Regulations',
      oldValue: 'Previous',
      newValue: 'Updated'
    });
  };

  if (user.role !== 'admin') {
    return (
      <Card className="rounded-3xl border-0 shadow-xl">
        <CardContent className="p-12 text-center">
          <AlertTriangle size={64} className="mx-auto mb-4 text-yellow-500" />
          <h3 className="mb-2 text-xl font-semibold">Truy Cập Bị Hạn Chế</h3>
          <p className="text-gray-600">Chỉ quản trị viên mới có quyền cấu hình quy định.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings Form */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F3E8FF] to-[#E8F6FF] border-b border-gray-100 relative overflow-hidden pb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full -mr-32 -mt-32" />
          <StarDecor className="top-4 right-12" />
          <Sparkles className="absolute top-6 right-32 text-purple-400 opacity-50" size={24} />
          
          <div className="flex items-start gap-4 relative z-10">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <Settings size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                Cài Đặt Quy Định (QĐ6)
                <span className="text-2xl">⚙️</span>
              </CardTitle>
              <CardDescription className="text-base">
                Cấu hình các quy định và quy tắc toàn hệ thống
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <h4 className="font-semibold text-gray-900">Quy Định Cơ Bản</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minDeposit" className="text-gray-700">Số Tiền Gửi Tối Thiểu (VND)</Label>
                  <Input
                    id="minDeposit"
                    type="number"
                    value={minDeposit}
                    onChange={(e) => setMinDeposit(e.target.value)}
                    className="h-11 rounded-xl border-gray-200"
                  />
                  <p className="text-xs text-gray-500">Số tiền tối thiểu để mở tài khoản hoặc gửi tiền</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minWithdrawalDays" className="text-gray-700">Kỳ Hạn Rút Tối Thiểu (Ngày)</Label>
                  <Input
                    id="minWithdrawalDays"
                    type="number"
                    value={minWithdrawalDays}
                    onChange={(e) => setMinWithdrawalDays(e.target.value)}
                    className="h-11 rounded-xl border-gray-200"
                  />
                  <p className="text-xs text-gray-500">Số ngày tối thiểu trước khi được phép rút tiền</p>
                </div>
              </div>
            </div>

            {/* Interest Rates */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <h4 className="font-semibold text-gray-900">Lãi Suất Theo Loại Sổ</h4>
              </div>
              
              <div className="border rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-[#F8F9FC] to-white hover:bg-gradient-to-r">
                      <TableHead className="font-semibold">Loại Sổ Tiết Kiệm</TableHead>
                      <TableHead className="font-semibold">Lãi Suất (% năm)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interestRates.map((item, index) => (
                      <TableRow key={index} className="hover:bg-[#F8F9FC] transition-colors">
                        <TableCell className="font-medium">{item.type}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.1"
                            value={item.rate}
                            onChange={(e) => handleUpdateRate(index, e.target.value)}
                            className="w-32 h-10 rounded-xl border-gray-200"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit"
                className="h-12 px-8 text-white rounded-xl shadow-lg font-medium"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                Cập Nhật Quy Định
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="h-12 px-8 rounded-xl border-gray-200"
                onClick={() => {
                  setMinDeposit('100000');
                  setMinWithdrawalDays('15');
                  setInterestRates([
                    { type: 'Không Kỳ Hạn', rate: '2.0', editable: false },
                    { type: '3 Tháng', rate: '4.5', editable: false },
                    { type: '6 Tháng', rate: '5.5', editable: false }
                  ]);
                }}
              >
                Đặt Lại Mặc Định
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Current Regulations Summary */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <CardTitle className="text-xl">Tóm Tắt Quy Định Hiện Tại</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-6 rounded-2xl border-2 border-blue-100" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' }}>
              <h5 className="text-sm font-semibold text-blue-900 mb-4">Quy Định Gửi & Rút Tiền</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-800">Số Tiền Gửi Tối Thiểu:</span>
                  <span className="text-sm font-semibold text-blue-900">₫{Number(minDeposit).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-800">Kỳ Hạn Giữ Tối Thiểu:</span>
                  <span className="text-sm font-semibold text-blue-900">{minWithdrawalDays} ngày</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border-2 border-green-100" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)' }}>
              <h5 className="text-sm font-semibold text-green-900 mb-4">Lãi Suất</h5>
              <div className="space-y-3">
                {interestRates.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-green-800">{item.type}:</span>
                    <span className="text-sm font-semibold text-green-900">{item.rate}% mỗi năm</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change History */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <History size={20} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Lịch Sử Thay Đổi</CardTitle>
              <CardDescription>Theo dõi tất cả thay đổi quy định của quản trị viên</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="border rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#F8F9FC] to-white hover:bg-gradient-to-r">
                  <TableHead className="font-semibold">Ngày</TableHead>
                  <TableHead className="font-semibold">Thay Đổi Bởi</TableHead>
                  <TableHead className="font-semibold">Trường</TableHead>
                  <TableHead className="font-semibold">Giá Trị Cũ</TableHead>
                  <TableHead className="font-semibold">Giá Trị Mới</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changeHistory.map((change, index) => (
                  <TableRow key={index} className="hover:bg-[#F8F9FC] transition-colors">
                    <TableCell className="font-medium">{change.date}</TableCell>
                    <TableCell>{change.user}</TableCell>
                    <TableCell>{change.field}</TableCell>
                    <TableCell className="text-red-600 font-medium">{change.oldValue}</TableCell>
                    <TableCell className="text-green-600 font-medium">{change.newValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' }}
              >
                <AlertTriangle size={24} className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Xác Nhận Thay Đổi Quy Định</DialogTitle>
                <DialogDescription className="text-base">
                  Bạn có chắc chắn muốn cập nhật quy định hệ thống? Điều này sẽ ảnh hưởng đến tất cả giao dịch tương lai.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 border-2 border-yellow-200 rounded-2xl bg-yellow-50">
              <p className="text-sm text-yellow-900 flex items-center gap-2">
                <AlertTriangle size={16} />
                Thay đổi sẽ có hiệu lực ngay lập tức và áp dụng cho tất cả tài khoản.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={confirmUpdate}
              className="flex-1 h-12 text-white rounded-xl shadow-lg font-medium"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              Xác Nhận Thay Đổi
            </Button>
            <Button 
              onClick={() => setShowConfirm(false)}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200"
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' }}
              >
                <CheckCircle2 size={48} className="text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Đã Cập Nhật Quy Định!</DialogTitle>
            <DialogDescription className="text-center text-base">
              Các quy định hệ thống đã được cập nhật thành công.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 space-y-2 rounded-2xl bg-gray-50 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700">Quy định đã cập nhật:</p>
              <ul className="space-y-1 text-sm list-disc list-inside text-gray-600">
                <li>Số Tiền Gửi Tối Thiểu: ₫{Number(minDeposit).toLocaleString()}</li>
                <li>Kỳ Hạn Rút Tối Thiểu: {minWithdrawalDays} ngày</li>
                {interestRates.map((item, index) => (
                  <li key={index}>Lãi Suất {item.type}: {item.rate}%</li>
                ))}
              </ul>
            </div>
          </div>
          <Button 
            onClick={() => setShowSuccess(false)}
            className="w-full h-12 text-white rounded-xl shadow-lg font-medium"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
          >
            Đóng
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
