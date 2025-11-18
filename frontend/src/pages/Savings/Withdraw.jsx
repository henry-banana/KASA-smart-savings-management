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
import { CheckCircle2, AlertCircle, Search, Wallet, ArrowUpCircle, Sparkles } from 'lucide-react';
import { StarDecor, ReceiptIllustration } from '../../components/CuteComponents';
import { getAccountInfo, withdrawMoney } from '../../services/transactionService';

export default function Withdraw() {
  const [accountId, setAccountId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [calculatedInterest, setCalculatedInterest] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateDaysDifference = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAccountLookup = async () => {
    setError('');
    setAccountInfo(null);
    setIsLookingUp(true);
    
    try {
      const response = await getAccountInfo(accountId);
      const account = response.data;
      
      const daysSinceOpen = calculateDaysDifference(account.openDate);
      
      if (daysSinceOpen < 15) {
        setError(`Account must be open for at least 15 days. Current: ${daysSinceOpen} days`);
        return;
      }

      setAccountInfo({
        ...account,
        daysSinceOpen
      });
    } catch (err) {
      console.error('Account lookup error:', err);
      setError(err.message);
    } finally {
      setIsLookingUp(false);
    }
  };

  const calculateInterest = (amount) => {
    if (!accountInfo) return 0;
    
    const days = accountInfo.daysSinceOpen;
    const rate = accountInfo.interestRate;
    
    // Simple interest calculation)
    const interest = amount * rate * (days / 365);
    return Math.round(interest);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!accountInfo) {
      setError('Please lookup a valid account first');
      return;
    }

    const amount = Number(withdrawAmount);
    
    if (!withdrawAmount || amount <= 0) {
      setError('Please enter a valid withdrawal amount');
      return;
    }

    if (amount > accountInfo.balance) {
      setError('Insufficient balance');
      return;
    }

    // Check fixed-term withdrawal rules
    if (accountInfo.type !== 'no-term') {
      const today = new Date();
      const maturityDate = new Date(accountInfo.maturityDate);
      
      if (today < maturityDate) {
        setError('Fixed-term accounts can only be withdrawn at maturity');
        return;
      }

      // For fixed-term at maturity, must withdraw full amount
      if (amount !== accountInfo.balance) {
        setError('Fixed-term accounts must withdraw the full balance at maturity');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      // Calculate interest and total payout
      const interest = calculateInterest(amount);
      const total = amount + interest;
      
      const response = await withdrawMoney(accountId, amount);
      
      setCalculatedInterest(interest);
      setTotalPayout(total);
      setShowSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setAccountId('');
        setWithdrawAmount('');
        setAccountInfo(null);
        setError('');
      }, 500);
    } catch (err) {
      console.error('Withdraw error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFixedTermMatured = () => {
    if (!accountInfo || accountInfo.type === 'no-term') return false;
    const today = new Date();
    const maturityDate = new Date(accountInfo.maturityDate);
    return today >= maturityDate;
  };

  return (
    <div className="max-w-4xl">
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        {/* Cute Header */}
        <CardHeader className="bg-gradient-to-r from-[#FFF7D6] to-[#FFE8F0] border-b border-gray-100 relative overflow-hidden pb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full -mr-32 -mt-32" />
          <StarDecor className="top-4 right-12" />
          <Sparkles className="absolute top-6 right-32 text-amber-400 opacity-50" size={24} />
          
          <div className="flex items-start gap-4 relative z-10">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' }}
            >
              <ArrowUpCircle size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                Make Withdrawal (BM3)
                <span className="text-2xl">💵</span>
              </CardTitle>
              <CardDescription className="text-base">
                Withdraw money from a savings account
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Account Lookup Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Search size={20} className="text-[#F59E0B]" />
              <h3 className="font-semibold text-gray-900">Account Lookup</h3>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={accountId}
                  onChange={(e) => {
                    setAccountId(e.target.value);
                    setAccountInfo(null);
                    setError('');
                  }}
                  placeholder="Enter account ID (e.g., SA12345)"
                  className="h-12 rounded-xl border-gray-200 focus:border-[#F59E0B] focus:ring-[#F59E0B] transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleAccountLookup()}
                />
              </div>
              <Button
                type="button"
                onClick={handleAccountLookup}
                className="h-12 px-6 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' }}
              >
                <Search size={18} className="mr-2" />
                Lookup
              </Button>
            </div>

            {error && (
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
                  background: 'linear-gradient(135deg, #FFF7D6 0%, #FFE8F0 100%)',
                  borderColor: '#F59E0B40'
                }}
              >
                <StarDecor className="top-2 right-2" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Customer Name</p>
                    <p className="text-sm font-medium">{accountInfo.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Account Type</p>
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                      {accountInfo.type === 'no-term' ? 'No Term' : accountInfo.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Balance</p>
                    <p className="text-sm font-semibold text-green-600">₫{accountInfo.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Open Date</p>
                    <p className="text-sm font-medium">{accountInfo.openDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Days Since Open</p>
                    <p className="text-sm font-medium">{accountInfo.daysSinceOpen} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Interest Rate</p>
                    <p className="text-sm font-medium">{(accountInfo.interestRate * 100).toFixed(1)}% per year</p>
                  </div>
                  {accountInfo.maturityDate && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500">Maturity Date</p>
                        <p className="text-sm font-medium">{accountInfo.maturityDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        {isFixedTermMatured() ? (
                          <Badge className="text-green-800 bg-green-100">Matured</Badge>
                        ) : (
                          <Badge className="text-yellow-800 bg-yellow-100">Not Matured</Badge>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Withdrawal Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Wallet size={20} className="text-[#F59E0B]" />
                <h3 className="font-semibold text-gray-900">Withdrawal Information</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdrawAmount" className="text-gray-700">
                  Withdrawal Amount (VND) *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-lg">₫</span>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => {
                      setWithdrawAmount(e.target.value);
                      if (accountInfo && e.target.value) {
                        const interest = calculateInterest(Number(e.target.value));
                        setCalculatedInterest(interest);
                      }
                    }}
                    placeholder="Enter amount"
                    disabled={!accountInfo}
                    className="pl-8 h-14 text-lg rounded-xl border-gray-200 focus:border-[#F59E0B] focus:ring-[#F59E0B] transition-all"
                  />
                </div>
                {accountInfo && withdrawAmount && (
                  <div 
                    className="p-5 rounded-2xl border-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #FFF7D6 0%, #ffffff 100%)',
                      borderColor: '#F59E0B20'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Estimated Interest:</span>
                      <span className="font-semibold text-green-600">₫{calculatedInterest.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                      <span className="font-medium text-gray-700">Total Payout:</span>
                      <span className="text-xl font-bold text-green-600">₫{(Number(withdrawAmount) + calculatedInterest).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={!accountInfo}
                className="flex-1 h-12 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' }}
              >
                <CheckCircle2 size={18} className="mr-2" />
                Confirm Withdrawal
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="h-12 px-8 rounded-full border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  setAccountId('');
                  setWithdrawAmount('');
                  setAccountInfo(null);
                  setError('');
                  setCalculatedInterest(0);
                }}
              >
                Reset
              </Button>
            </div>
          </form>

          {/* Helper Text */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h5 className="mb-2 text-sm text-blue-900">Withdrawal Rules:</h5>
            <ul className="space-y-1 text-sm text-blue-800 list-disc list-inside">
              <li>Account must be open for at least 15 days</li>
              <li>No-Term accounts: Partial withdrawals allowed</li>
              <li>Fixed-Term accounts: Can only withdraw at maturity date</li>
              <li>Fixed-Term accounts: Must withdraw full balance at maturity</li>
              <li>Interest is calculated based on days held and account type</li>
            </ul>
          </div>
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
                  <CheckCircle2 size={48} className="text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 text-yellow-400" size={24} />
              </div>
              <ReceiptIllustration size={80} />
            </div>
            <DialogTitle className="text-center text-2xl">
              Withdrawal Successful! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              The withdrawal has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <div 
              className="p-6 rounded-2xl space-y-3 border-2"
              style={{ 
                background: 'linear-gradient(135deg, #FFF7D6 0%, #FFE8F0 100%)',
                borderColor: '#F59E0B40'
              }}
            >
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account ID:</span>
                <span className="font-semibold text-[#F59E0B]">{accountInfo?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer:</span>
                <span className="font-medium">{accountInfo?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Withdrawal Amount:</span>
                <span className="font-semibold">₫{Number(withdrawAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Interest Earned:</span>
                <span className="font-semibold text-green-600">+₫{calculatedInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-medium text-gray-700">Total Payout:</span>
                <span className="text-xl font-bold text-green-600">₫{totalPayout.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowSuccess(false)}
            className="w-full h-12 text-white rounded-full font-medium shadow-lg"
            style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
