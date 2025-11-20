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
import { createSavingBook } from '../../services/savingBookService';

export default function OpenAccount() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};

    if (!formData.customerName) newErrors.customerName = 'Please enter customer name';
    if (!formData.idCard) newErrors.idCard = 'Please enter ID card number';
    if (!formData.address) newErrors.address = 'Please enter address';
    if (!formData.savingsType) newErrors.savingsType = 'Please select savings type';
    if (!formData.initialDeposit) {
      newErrors.initialDeposit = 'Please enter amount';
    } else if (Number(formData.initialDeposit) < 100000) {
      newErrors.initialDeposit = 'Minimum amount is 100,000 VND';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await createSavingBook(formData);
        setAccountCode(response.data.accountCode);
        setShowSuccess(true);
        
        // Reset form after short delay
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
      } catch (err) {
        console.error('Create saving book error:', err);
        setErrors({ submit: err.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const savingsTypes = [
    { id: 'no-term', name: 'No Term', description: 'Flexible withdrawal', interestRate: 2.0, emoji: '🔄', color: 'from-[#1A4D8F] to-[#2563A8]' },
    { id: '3-months', name: '3 Months', description: 'Fixed for 3 months', interestRate: 4.5, emoji: '📅', color: 'from-[#00AEEF] to-[#33BFF3]' },
    { id: '6-months', name: '6 Months', description: 'Best rate available', interestRate: 5.5, emoji: '⭐', color: 'from-[#60A5FA] to-[#93C5FD]' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-xl rounded-2xl lg:rounded-3xl overflow-hidden">
        {/* Cute Header with Gradient */}
        <CardHeader className="bg-gradient-to-r from-[#E8F6FF] to-[#DFF9F4] border-b border-gray-100 relative overflow-hidden pb-6 sm:pb-8">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/50 rounded-full -mr-16 sm:-mr-24 lg:-mr-32 -mt-16 sm:-mt-24 lg:-mt-32" />
          <StarDecor className="top-4 right-8 sm:right-12" />
          <Sparkles className="absolute top-6 right-20 sm:right-32 text-cyan-300 opacity-50" size={20} />
          
          <div className="flex items-start gap-3 sm:gap-4 relative z-10">
            <div 
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
            >
              <PiggyBank size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2 flex items-center gap-2">
                <span className="truncate">Open New Savings Account</span>
                <span className="text-xl sm:text-2xl flex-shrink-0">🏦</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Create a new savings account for customer (Form BM1)
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Customer Info Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <UserIcon size={18} className="sm:w-5 sm:h-5 text-[#1A4D8F]" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Customer Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-gray-700 text-sm sm:text-base">Customer Name *</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Enter full name"
                      className="pl-10 h-11 sm:h-12 rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                    />
                  </div>
                  {errors.customerName && (
                    <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠️</span> {errors.customerName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idCard" className="text-gray-700 text-sm sm:text-base">ID Card Number *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="idCard"
                      value={formData.idCard}
                      onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                      placeholder="Enter ID card number"
                      className="pl-10 h-11 sm:h-12 rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                    />
                  </div>
                  {errors.idCard && (
                    <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠️</span> {errors.idCard}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700 text-sm sm:text-base">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                    rows={3}
                    className="pl-10 rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                  />
                </div>
                {errors.address && (
                  <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <span className="text-xs">⚠️</span> {errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Savings Details Section */}
            <div className="space-y-4 sm:space-y-6 pt-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Coins size={18} className="sm:w-5 sm:h-5 text-[#00AEEF]" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Savings Account Details</h3>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700 text-sm sm:text-base">Savings Type * (Select one)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {savingsTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, savingsType: type.id });
                        setErrors({ ...errors, savingsType: '' });
                      }}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left group ${
                        formData.savingsType === type.id
                          ? 'border-[#00AEEF] bg-gradient-to-br ' + type.color + ' text-white shadow-lg scale-105'
                          : 'border-gray-200 bg-white hover:border-[#00AEEF] hover:shadow-md hover:scale-102'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl">{type.emoji}</span>
                        {formData.savingsType === type.id && (
                          <CheckCircle2 size={20} className="text-white" />
                        )}
                      </div>
                      <div className={`text-2xl font-bold mb-1 ${
                        formData.savingsType === type.id ? 'text-white' : 'text-[#1A4D8F]'
                      }`}>
                        {type.interestRate}%
                      </div>
                      <div className={`text-sm font-semibold mb-0.5 ${
                        formData.savingsType === type.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {type.name}
                      </div>
                      <div className={`text-xs ${
                        formData.savingsType === type.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {type.description}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.savingsType && (
                  <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <span className="text-xs">⚠️</span> {errors.savingsType}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="initialDeposit" className="text-gray-700 text-sm sm:text-base">Initial Deposit (VND) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">₫</span>
                    <Input
                      id="initialDeposit"
                      type="number"
                      value={formData.initialDeposit}
                      onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                      placeholder="Minimum: 100,000"
                      className="pl-7 sm:pl-8 h-11 sm:h-12 rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all text-sm sm:text-base"
                    />
                  </div>
                  {errors.initialDeposit && (
                    <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠️</span> {errors.initialDeposit}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>💡</span> Minimum amount: ₫100,000
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openDate" className="text-gray-700 text-sm sm:text-base">Opening Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="openDate"
                      type="date"
                      value={formData.openDate}
                      onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
                      disabled
                      className="pl-10 h-11 sm:h-12 rounded-xl border-gray-200 bg-gray-50 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-100">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 h-11 sm:h-12 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
              >
                <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px] mr-2" />
                {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Mở Sổ'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="h-11 sm:h-12 sm:px-8 rounded-full border-gray-300 hover:bg-gray-50 text-sm sm:text-base"
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
        <DialogContent className="rounded-2xl sm:rounded-3xl max-w-[90vw] sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
          <DialogHeader>
            <div className="flex flex-col items-center mb-3 sm:mb-4">
              <div className="relative animate-in zoom-in-0 duration-500">
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-green-500/30"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' }}
                >
                  <CheckCircle2 size={40} className="sm:w-12 sm:h-12 text-white animate-in zoom-in-50 duration-700" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={20} />
                <Heart className="absolute -bottom-2 -left-2 text-pink-400 animate-bounce" size={16} fill="currentColor" />
              </div>
              <PiggyBankIllustration size={60} className="sm:w-20" />
            </div>
            <DialogTitle className="text-center text-xl sm:text-2xl">
              Account Opened Successfully! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base">
              Your new savings account has been created
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-3 sm:py-4">
            <div 
              className="p-4 sm:p-6 rounded-2xl space-y-2 sm:space-y-3 border-2 animate-in slide-in-from-bottom-4 duration-500 delay-200"
              style={{ 
                background: 'linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 100%)',
                borderColor: '#00AEEF40'
              }}
            >
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Account Code:</span>
                <span className="font-semibold text-base sm:text-lg text-[#1A4D8F] truncate">{accountCode}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Customer:</span>
                <span className="font-medium text-sm sm:text-base truncate text-right">{formData.customerName}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Type:</span>
                <span className="font-medium text-sm sm:text-base capitalize truncate text-right">
                  {savingsTypes.find(t => t.id === formData.savingsType)?.name}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Amount:</span>
                <span className="font-semibold text-sm sm:text-base text-green-600 truncate">₫{Number(formData.initialDeposit).toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Opening Date:</span>
                <span className="font-medium text-sm sm:text-base">{formData.openDate}</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowSuccess(false)}
            className="w-full h-11 sm:h-12 text-white rounded-full font-medium shadow-lg text-sm sm:text-base hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
