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
import { CheckCircle2, AlertCircle } from 'lucide-react';

// Mock account data with maturity dates
const mockAccounts = {
  'SA12345': {
    id: 'SA12345',
    customerName: 'Nguyen Van A',
    type: 'no-term',
    balance: 5000000,
    openDate: '2025-01-15',
    interestRate: 0.02
  },
  'SA12346': {
    id: 'SA12346',
    customerName: 'Tran Thi B',
    type: 'fixed-3m',
    balance: 10000000,
    openDate: '2024-11-01',
    maturityDate: '2025-02-01',
    interestRate: 0.045
  },
  'SA12347': {
    id: 'SA12347',
    customerName: 'Le Van C',
    type: 'no-term',
    balance: 7500000,
    openDate: '2025-03-10',
    interestRate: 0.02
  },
  'SA12348': {
    id: 'SA12348',
    customerName: 'Pham Thi D',
    type: 'fixed-6m',
    balance: 15000000,
    openDate: '2024-09-01',
    maturityDate: '2025-03-01',
    interestRate: 0.055
  }
};

export default function Withdraw({ user }) {
  const [accountId, setAccountId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [calculatedInterest, setCalculatedInterest] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0);

  const calculateDaysDifference = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAccountLookup = () => {
    setError('');
    const account = mockAccounts[accountId];
    
    if (!account) {
      setError('Account not found');
      setAccountInfo(null);
      return;
    }

    const daysSinceOpen = calculateDaysDifference(account.openDate);
    
    if (daysSinceOpen < 15) {
      setError(`Account must be open for at least 15 days. Current: ${daysSinceOpen} days`);
      setAccountInfo(null);
      return;
    }

    setAccountInfo({
      ...account,
      daysSinceOpen
    });
  };

  const calculateInterest = (amount) => {
    if (!accountInfo) return 0;
    
    const days = accountInfo.daysSinceOpen;
    const rate = accountInfo.interestRate;
    
    // Simple interest calculation)
    const interest = amount * rate * (days / 365);
    return Math.round(interest);
  };

  const handleSubmit = (e) => {
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

    // Calculate interest and total payout
    const interest = calculateInterest(amount);
    const total = amount + interest;
    
    setCalculatedInterest(interest);
    setTotalPayout(total);
    setShowSuccess(true);
    
    // Update mock data
    mockAccounts[accountId].balance -= amount;
    
    // Reset form
    setTimeout(() => {
      setAccountId('');
      setWithdrawAmount('');
      setAccountInfo(null);
      setError('');
    }, 500);
  };

  const isFixedTermMatured = () => {
    if (!accountInfo || accountInfo.type === 'no-term') return false;
    const today = new Date();
    const maturityDate = new Date(accountInfo.maturityDate);
    return today >= maturityDate;
  };

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Make Withdrawal (BM3)</CardTitle>
          <CardDescription>Withdraw money from a savings account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Account Lookup */}
            <div className="space-y-2">
              <Label htmlFor="accountId">Savings Account ID</Label>
              <div className="flex gap-2">
                <Input
                  id="accountId"
                  value={accountId}
                  onChange={(e) => {
                    setAccountId(e.target.value);
                    setAccountInfo(null);
                    setError('');
                  }}
                  placeholder="Enter account ID (e.g., SA12345)"
                />
                <Button 
                  type="button"
                  onClick={handleAccountLookup}
                  style={{ backgroundColor: '#00AEEF' }}
                  className="text-white"
                >
                  Lookup
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>

            {/* Account Information */}
            {accountInfo && (
              <div className="p-4 space-y-3 rounded-lg bg-gray-50">
                <h4 className="text-sm text-gray-600">Account Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Customer Name</p>
                    <p className="text-sm">{accountInfo.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Account Type</p>
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: accountInfo.type === 'no-term' ? '#00AEEF' : '#F59E0B',
                        color: accountInfo.type === 'no-term' ? '#00AEEF' : '#F59E0B'
                      }}
                    >
                      {accountInfo.type === 'no-term' ? 'No Term' : accountInfo.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Balance</p>
                    <p className="text-sm">₫{accountInfo.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Open Date</p>
                    <p className="text-sm">{accountInfo.openDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Days Since Open</p>
                    <p className="text-sm">{accountInfo.daysSinceOpen} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Interest Rate</p>
                    <p className="text-sm">{(accountInfo.interestRate * 100).toFixed(1)}% per year</p>
                  </div>
                  {accountInfo.maturityDate && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500">Maturity Date</p>
                        <p className="text-sm">{accountInfo.maturityDate}</p>
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

            {/* Withdrawal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Withdrawal Amount (VND)</Label>
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
                />
                {accountInfo && withdrawAmount && (
                  <div className="p-3 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-900">
                      Estimated Interest: <span className="font-medium">₫{calculatedInterest.toLocaleString()}</span>
                    </p>
                    <p className="text-sm text-blue-900">
                      Total Payout: <span className="font-medium">₫{(Number(withdrawAmount) + calculatedInterest).toLocaleString()}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={!accountInfo}
                  className="text-white"
                  style={{ backgroundColor: '#1A4D8F' }}
                >
                  Confirm Withdrawal
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
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
          </div>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={64} className="text-green-500" />
            </div>
            <DialogTitle className="text-center">Withdrawal Successful!</DialogTitle>
            <DialogDescription className="text-center">
              The withdrawal has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 space-y-2 rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account ID:</span>
                <span className="text-sm">{accountInfo?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer:</span>
                <span className="text-sm">{accountInfo?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Withdrawal Amount:</span>
                <span className="text-sm">₫{Number(withdrawAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Interest Earned:</span>
                <span className="text-sm text-green-600">+₫{calculatedInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm">Total Payout:</span>
                <span className="text-sm">₫{totalPayout.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setShowSuccess(false)}
            className="w-full text-white"
            style={{ backgroundColor: '#1A4D8F' }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
