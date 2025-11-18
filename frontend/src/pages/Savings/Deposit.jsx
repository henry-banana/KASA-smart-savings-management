import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { CheckCircle2, AlertCircle, Search, Coins, ArrowDownCircle, Sparkles, TrendingUp } from 'lucide-react';
import { StarDecor, CoinsIllustration } from '../../components/CuteComponents';
import { getAccountInfo, depositMoney } from '../../services/transactionService';

export default function Deposit() {
  const [accountId, setAccountId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [newBalance, setNewBalance] = useState(0);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccountLookup = async () => {
    setError('');
    setAccountInfo(null);
    setIsLookingUp(true);
    
    try {
      const response = await getAccountInfo(accountId);
      const account = response.data;
      
      if (account.type !== 'no-term') {
        setError('Deposits are only allowed for No-Term savings accounts');
        return;
      }
      
      setAccountInfo(account);
    } catch (err) {
      console.error('Account lookup error:', err);
      setError(err.message);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!accountInfo) {
      setError('Please lookup a valid account first');
      return;
    }

    const amount = Number(depositAmount);
    
    if (!depositAmount || amount <= 0) {
      setError('Please enter a valid deposit amount');
      return;
    }

    if (amount < 100000) {
      setError('Minimum deposit amount is 100,000 VND');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await depositMoney(accountId, amount);
      setNewBalance(response.data.balanceAfter);
      setShowSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setAccountId('');
        setDepositAmount('');
        setAccountInfo(null);
        setError('');
      }, 500);
    } catch (err) {
      console.error('Deposit error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        {/* Cute Header */}
        <CardHeader className="bg-gradient-to-r from-[#E8F6FF] to-[#DFF9F4] border-b border-gray-100 relative overflow-hidden pb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full -mr-32 -mt-32" />
          <StarDecor className="top-4 right-12" />
          <Sparkles className="absolute top-6 right-32 text-cyan-300 opacity-50" size={24} />
          
          <div className="flex items-start gap-4 relative z-10">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)' }}
            >
              <ArrowDownCircle size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                Make Deposit
                <span className="text-2xl">💰</span>
              </CardTitle>
              <CardDescription className="text-base">
                Deposit money into a savings account (BM2)
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Account Lookup Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Search size={20} className="text-[#1A4D8F]" />
              <h3 className="font-semibold text-gray-900">Account Lookup</h3>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={accountId}
                  onChange={(e) => {
                    setAccountId(e.target.value.toUpperCase());
                    setAccountInfo(null);
                    setError('');
                  }}
                  placeholder="Enter account ID (e.g., SA12345)"
                  className="h-12 rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleAccountLookup()}
                />
              </div>
              <Button
                type="button"
                onClick={handleAccountLookup}
                disabled={isLookingUp || !accountId}
                className="h-12 px-6 rounded-xl bg-[#1A4D8F] hover:bg-[#154171] text-white"
              >
                <Search size={18} className="mr-2" />
                {isLookingUp ? 'Searching...' : 'Lookup'}
              </Button>
            </div>

            {error && !accountInfo && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {accountInfo && (
              <div 
                className="p-6 rounded-2xl border-2 space-y-3 relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 100%)',
                  borderColor: '#00AEEF40'
                }}
              >
                <StarDecor className="top-2 right-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account ID:</span>
                  <span className="font-semibold text-[#1A4D8F]">{accountInfo.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customer Name:</span>
                  <span className="font-medium">{accountInfo.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Type:</span>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    No Term
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Current Balance:</span>
                  <span className="text-lg font-bold text-green-600">
                    ₫{accountInfo.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Deposit Form */}
          {accountInfo && (
            <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Coins size={20} className="text-[#00AEEF]" />
                  <h3 className="font-semibold text-gray-900">Deposit Information</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="depositAmount" className="text-gray-700">Deposit Amount (VND) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-lg">₫</span>
                    <Input
                      id="depositAmount"
                      type="number"
                      value={depositAmount}
                      onChange={(e) => {
                        setDepositAmount(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter deposit amount"
                      className="pl-8 h-14 text-lg rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>💡</span> Minimum amount: ₫100,000
                  </p>
                </div>

                {error && accountInfo && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Quick Amount Buttons */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Quick Amount:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[100000, 500000, 1000000, 5000000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setDepositAmount(amount.toString())}
                        className="h-12 rounded-xl border-2 border-gray-200 hover:border-[#00AEEF] hover:bg-[#E8F6FF] transition-all font-medium text-sm"
                      >
                        ₫{(amount / 1000000).toFixed(amount >= 1000000 ? 0 : 1)}M
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 h-12 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)' }}
                >
                  <CheckCircle2 size={18} className="mr-2" />
                  Confirm Deposit
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  className="h-12 px-8 rounded-full border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    setAccountId('');
                    setDepositAmount('');
                    setAccountInfo(null);
                    setError('');
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' }}
                >
                  <TrendingUp size={48} className="text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 text-yellow-400" size={24} />
              </div>
              <CoinsIllustration size={80} />
            </div>
            <DialogTitle className="text-center text-2xl">
              Deposit Successful! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              The deposit has been processed successfully
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
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account ID:</span>
                <span className="font-semibold text-[#1A4D8F]">{accountInfo?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer:</span>
                <span className="font-medium">{accountInfo?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Deposit Amount:</span>
                <span className="font-semibold text-green-600">+₫{Number(depositAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">New Balance:</span>
                <span className="text-lg font-bold text-green-600">₫{newBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowSuccess(false)}
            className="w-full h-12 text-white rounded-full font-medium shadow-lg"
            style={{ background: 'linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)' }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
