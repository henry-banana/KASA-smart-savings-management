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

// Mock account data
const mockAccounts = {
  'SA12345': {
    id: 'SA12345',
    customerName: 'Nguyen Van A',
    type: 'no-term',
    balance: 5000000,
    openDate: '2025-01-15'
  },
  'SA12346': {
    id: 'SA12346',
    customerName: 'Tran Thi B',
    type: 'fixed-3m',
    balance: 10000000,
    openDate: '2025-02-01'
  },
  'SA12347': {
    id: 'SA12347',
    customerName: 'Le Van C',
    type: 'no-term',
    balance: 7500000,
    openDate: '2025-03-10'
  }
};

export default function Deposit({ user }) {
  const [accountId, setAccountId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [newBalance, setNewBalance] = useState(0);

  const handleAccountLookup = () => {
    setError('');
    const account = mockAccounts[accountId];
    
    if (!account) {
      setError('Account not found');
      setAccountInfo(null);
      return;
    }

    if (account.type !== 'no-term') {
      setError('Deposits are only allowed for No-Term savings accounts');
      setAccountInfo(null);
      return;
    }

    setAccountInfo(account);
  };

  const handleSubmit = (e) => {
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

    // Process deposit
    const updatedBalance = accountInfo.balance + amount;
    setNewBalance(updatedBalance);
    setShowSuccess(true);
    
    // Update mock data
    mockAccounts[accountId].balance = updatedBalance;
    
    // Reset form
    setTimeout(() => {
      setAccountId('');
      setDepositAmount('');
      setAccountInfo(null);
      setError('');
    }, 500);
  };

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Make Deposit (BM2)</CardTitle>
          <CardDescription>Deposit money into a savings account</CardDescription>
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
                    <Badge variant="outline" style={{ borderColor: '#1A4D8F', color: '#00AEEF' }}>
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
                </div>
              </div>
            )}

            {/* Deposit Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Deposit Amount (VND)</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Min 100,000"
                  disabled={!accountInfo}
                />
                <p className="text-xs text-gray-500">Minimum deposit 100,000 VND</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={!accountInfo}
                  className="text-white"
                  style={{ backgroundColor: '#1A4D8F' }}
                >
                  Confirm Deposit
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
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

            {/* Helper Text */}
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h5 className="mb-2 text-sm text-blue-900">Deposit Rules:</h5>
              <ul className="space-y-1 text-sm text-blue-800 list-disc list-inside">
                <li>Only available for No-Term savings accounts</li>
                <li>Minimum deposit amount is 100,000 VND</li>
                <li>Fixed-term accounts cannot accept deposits after opening</li>
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
            <DialogTitle className="text-center">Deposit Successful!</DialogTitle>
            <DialogDescription className="text-center">
              The deposit has been processed successfully.
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
                <span className="text-sm text-gray-600">Deposit Amount:</span>
                <span className="text-sm text-green-600">+₫{Number(depositAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Previous Balance:</span>
                <span className="text-sm">₫{accountInfo?.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm">New Balance:</span>
                <span className="text-sm">₫{newBalance.toLocaleString()}</span>
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
