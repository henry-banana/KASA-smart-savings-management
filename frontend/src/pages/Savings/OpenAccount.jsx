import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { CheckCircle2, PiggyBank, User as UserIcon, CreditCard, MapPin, Calendar, Coins, Sparkles, Heart } from 'lucide-react';
import { StarDecor, PiggyBankIllustration } from '../../components/CuteComponents';

export default function OpenAccount({ user }) {
  const [formData, setFormData] = useState({
    customerName: '',
    idCard: '',
    address: '',
    savingsType: '',
    initialDeposit: '',
    openDate: new Date().toISOString().split('T')[0]
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [accountCode, setAccountCode] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};

    if (!formData.customerName) newErrors.customerName = 'Vui lòng nhập tên khách hàng';
    if (!formData.idCard) newErrors.idCard = 'Vui lòng nhập CMND/CCCD';
    if (!formData.address) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.savingsType) newErrors.savingsType = 'Vui lòng chọn loại sổ';
    if (!formData.initialDeposit) {
      newErrors.initialDeposit = 'Vui lòng nhập số tiền';
    } else if (Number(formData.initialDeposit) < 100000) {
      newErrors.initialDeposit = 'Số tiền tối thiểu là 100,000 VND';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const code = 'SA' + Math.floor(10000 + Math.random() * 90000);
      setAccountCode(code);
      setShowSuccess(true);
      
      setTimeout(() => {
        setFormData({
          customerName: '',
          idCard: '',
          address: '',
          savingsType: '',
          initialDeposit: '',
          openDate: new Date().toISOString().split('T')[0]
        });
      }, 500);
    }
  };

  const savingsTypes = [
    { value: 'no-term', label: 'Không Kỳ Hạn (Linh Hoạt)', emoji: '🔄', color: '#1A4D8F' },
    { value: '3-months', label: '3 Tháng (Lãi Suất Cố Định)', emoji: '📅', color: '#00AEEF' },
    { value: '6-months', label: '6 Tháng (Lãi Suất Cao)', emoji: '⭐', color: '#60A5FA' }
  ];

  return (
    <div className="max-w-4xl">
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        {/* Cute Header with Gradient */}
        <CardHeader className="bg-gradient-to-r from-[#E8F6FF] to-[#DFF9F4] border-b border-gray-100 relative overflow-hidden pb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full -mr-32 -mt-32" />
          <StarDecor className="top-4 right-12" />
          <Sparkles className="absolute top-6 right-32 text-cyan-300 opacity-50" size={24} />
          
          <div className="flex items-start gap-4 relative z-10">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
            >
              <PiggyBank size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                Mở Sổ Tiết Kiệm Mới
                <span className="text-2xl">🏦</span>
              </CardTitle>
              <CardDescription className="text-base">
                Tạo sổ tiết kiệm mới cho khách hàng (BM1)
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Info Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <UserIcon size={20} className="text-[#1A4D8F]" />
                <h3 className="font-semibold text-gray-900">Thông Tin Khách Hàng</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-gray-700">Tên Khách Hàng *</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Nhập họ và tên"
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all"
                    />
                  </div>
                  {errors.customerName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠️</span> {errors.customerName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idCard" className="text-gray-700">Số CMND/CCCD *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="idCard"
                      value={formData.idCard}
                      onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                      placeholder="Nhập số CMND/CCCD"
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all"
                    />
                  </div>
                  {errors.idCard && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠️</span> {errors.idCard}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700">Địa Chỉ *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Nhập địa chỉ đầy đủ"
                    rows={3}
                    className="pl-10 rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all"
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="text-xs">⚠️</span> {errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Savings Details Section */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 mb-4">
                <Coins size={20} className="text-[#00AEEF]" />
                <h3 className="font-semibold text-gray-900">Thông Tin Sổ Tiết Kiệm</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="savingsType" className="text-gray-700">Loại Sổ Tiết Kiệm *</Label>
                <Select value={formData.savingsType} onValueChange={(value) => setFormData({ ...formData, savingsType: value })}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200">
                    <SelectValue placeholder="Chọn loại sổ tiết kiệm" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {savingsTypes.map(type => (
                      <SelectItem key={type.value} value={type.value} className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <span>{type.emoji}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.savingsType && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="text-xs">⚠️</span> {errors.savingsType}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="initialDeposit" className="text-gray-700">Số Tiền Gửi Ban Đầu (VND) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                    <Input
                      id="initialDeposit"
                      type="number"
                      value={formData.initialDeposit}
                      onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                      placeholder="Tối thiểu: 100,000"
                      className="pl-8 h-12 rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all"
                    />
                  </div>
                  {errors.initialDeposit && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠️</span> {errors.initialDeposit}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>💡</span> Số tiền tối thiểu: ₫100,000
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openDate" className="text-gray-700">Ngày Mở Sổ</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="openDate"
                      type="date"
                      value={formData.openDate}
                      onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
                      disabled
                      className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <Button 
                type="submit" 
                className="flex-1 h-12 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
              >
                <CheckCircle2 size={18} className="mr-2" />
                Xác Nhận Mở Sổ
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="h-12 px-8 rounded-full border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  setFormData({
                    customerName: '',
                    idCard: '',
                    address: '',
                    savingsType: '',
                    initialDeposit: '',
                    openDate: new Date().toISOString().split('T')[0]
                  });
                  setErrors({});
                }}
              >
                Làm Mới
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 🎉 Cute Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' }}
                >
                  <CheckCircle2 size={48} className="text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 text-yellow-400" size={24} />
                <Heart className="absolute -bottom-2 -left-2 text-pink-400" size={20} fill="currentColor" />
              </div>
              <PiggyBankIllustration size={80} />
            </div>
            <DialogTitle className="text-center text-2xl">
              Mở Sổ Thành Công! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              Sổ tiết kiệm mới đã được tạo thành công
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <div 
              className="p-6 rounded-2xl space-y-3 border-2"
              style={{ 
                background: 'linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 100%)',
                borderColor: '#00AEEF40'
              }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mã Sổ:</span>
                <span className="font-semibold text-lg text-[#1A4D8F]">{accountCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Khách Hàng:</span>
                <span className="font-medium">{formData.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Loại Sổ:</span>
                <span className="font-medium capitalize">
                  {savingsTypes.find(t => t.value === formData.savingsType)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Số Tiền:</span>
                <span className="font-semibold text-green-600">₫{Number(formData.initialDeposit).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ngày Mở:</span>
                <span className="font-medium">{formData.openDate}</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowSuccess(false)}
            className="w-full h-12 text-white rounded-full font-medium shadow-lg"
            style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
          >
            Đóng
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
