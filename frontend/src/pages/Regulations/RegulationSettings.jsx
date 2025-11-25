import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
import { RoleGuard } from '../../components/RoleGuard';

export default function RegulationSettings() {
  const { user } = useAuth();
  const [minDeposit, setMinDeposit] = useState('100000');
  const [minWithdrawalDays, setMinWithdrawalDays] = useState('15');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [interestRates, setInterestRates] = useState([
    { type: 'No Term', rate: '2.0', editable: true },
    { type: '3 Months', rate: '4.5', editable: true },
    { type: '6 Months', rate: '5.5', editable: true }
  ]);

  const changeHistory = [
    {
      date: '2025-11-01',
      user: 'admin',
      field: 'Minimum Deposit Amount',
      oldValue: '50.000 đ',
      newValue: '100.000 đ'
    },
    {
      date: '2025-10-15',
      user: 'admin',
      field: 'Minimum Withdrawal Days',
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

  return (
    <RoleGuard allow={['admin']}>
    <div className="space-y-4 sm:space-y-6">
      {/* Settings Form */}
      <Card className="overflow-hidden border-0 shadow-xl rounded-2xl lg:rounded-3xl">
        <CardHeader className="bg-linear-to-r from-[#F3E8FF] to-[#E8F6FF] border-b border-gray-100 relative overflow-hidden pb-6 sm:pb-8">
          <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/50 sm:-mr-24 lg:-mr-32 sm:-mt-24 lg:-mt-32" />
          <StarDecor className="top-4 right-8 sm:right-12" />
          <Sparkles className="absolute text-purple-400 opacity-50 top-6 right-20 sm:right-32" size={20} />
          
          <div className="relative z-10 flex items-start gap-3 sm:gap-4">
            <div 
              className="flex items-center justify-center shrink-0 w-12 h-12 shadow-lg sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <Settings size={24} className="text-white sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 mb-2 text-2xl">
                Regulation Settings (QĐ6)
                <span className="text-2xl">⚙️</span>
              </CardTitle>
              <CardDescription className="text-base">
                Configure system-wide regulations and rules
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Basic Regulations</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minDeposit" className="text-gray-700">Minimum Deposit (VND)</Label>
                  <Input
                    id="minDeposit"
                    type="number"
                    value={minDeposit}
                    onChange={(e) => setMinDeposit(e.target.value)}
                    className="border-gray-200 h-11 rounded-xl"
                  />
                  <p className="text-xs text-gray-500">Minimum amount to open account or deposit</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minWithdrawalDays" className="text-gray-700">Minimum Withdrawal Period (Days)</Label>
                  <Input
                    id="minWithdrawalDays"
                    type="number"
                    value={minWithdrawalDays}
                    onChange={(e) => setMinWithdrawalDays(e.target.value)}
                    className="border-gray-200 h-11 rounded-xl"
                  />
                  <p className="text-xs text-gray-500">Minimum days before withdrawal allowed</p>
                </div>
              </div>
            </div>

            {/* Interest Rates */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Interest Rates by Account Type</h4>
              </div>
              
              <div className="overflow-hidden border rounded-2xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-linear-to-r from-[#F8F9FC] to-white hover:bg-linear-to-r">
                      <TableHead className="font-semibold">Savings Account Type</TableHead>
                      <TableHead className="font-semibold">Interest Rate (% per year)</TableHead>
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
                            className="w-32 h-10 border-gray-200 rounded-xl"
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
                className="h-12 px-8 font-medium text-white shadow-lg rounded-xl"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                Update Regulations
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="h-12 px-8 border-gray-200 rounded-xl"
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
                Reset to Default
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Current Regulations Summary */}
      <Card className="overflow-hidden border-0 shadow-xl rounded-3xl">
        <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <CardTitle className="text-xl">Current Regulations Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-6 border-2 border-blue-100 rounded-2xl" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' }}>
              <h5 className="mb-4 text-sm font-semibold text-blue-900">Deposit & Withdrawal Regulations</h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">Minimum Deposit:</span>
                  <span className="text-sm font-semibold text-blue-900">₫{Number(minDeposit).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">Minimum Holding Period:</span>
                  <span className="text-sm font-semibold text-blue-900">{minWithdrawalDays} days</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-2 border-green-100 rounded-2xl" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)' }}>
              <h5 className="mb-4 text-sm font-semibold text-green-900">Interest Rates</h5>
              <div className="space-y-3">
                {interestRates.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-green-800">{item.type}:</span>
                    <span className="text-sm font-semibold text-green-900">{item.rate}% per year</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change History */}
      <Card className="overflow-hidden border-0 shadow-xl rounded-3xl">
        <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <History size={20} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Change History</CardTitle>
              <CardDescription>Track all regulation changes by administrators</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-hidden border rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow className="bg-linear-to-r from-[#F8F9FC] to-white hover:bg-linear-to-r">
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Changed By</TableHead>
                  <TableHead className="font-semibold">Field</TableHead>
                  <TableHead className="font-semibold">Old Value</TableHead>
                  <TableHead className="font-semibold">New Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changeHistory.map((change, index) => (
                  <TableRow key={index} className="hover:bg-[#F8F9FC] transition-colors">
                    <TableCell className="font-medium">{change.date}</TableCell>
                    <TableCell>{change.user}</TableCell>
                    <TableCell>{change.field}</TableCell>
                    <TableCell className="font-medium text-red-600">{change.oldValue}</TableCell>
                    <TableCell className="font-medium text-green-600">{change.newValue}</TableCell>
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
                className="flex items-center justify-center w-12 h-12 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' }}
              >
                <AlertTriangle size={24} className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Confirm Regulation Change</DialogTitle>
                <DialogDescription className="text-base">
                  Are you sure you want to update system regulations? This will affect all future transactions.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 border-2 border-yellow-200 rounded-2xl bg-yellow-50">
              <p className="flex items-center gap-2 text-sm text-yellow-900">
                <AlertTriangle size={16} />
                Changes will take effect immediately and apply to all accounts.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={confirmUpdate}
              className="flex-1 h-12 font-medium text-white shadow-lg rounded-xl"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              Confirm Change
            </Button>
            <Button 
              onClick={() => setShowConfirm(false)}
              variant="outline"
              className="flex-1 h-12 border-gray-200 rounded-xl"
            >
              Cancel
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
                className="flex items-center justify-center w-20 h-20 rounded-full"
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' }}
              >
                <CheckCircle2 size={48} className="text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center">Regulations Updated!</DialogTitle>
            <DialogDescription className="text-base text-center">
              System regulations have been successfully updated.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 space-y-2 border border-gray-200 rounded-2xl bg-gray-50">
              <p className="text-sm font-semibold text-gray-700">Updated regulations:</p>
              <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                <li>Minimum Deposit: ₫{Number(minDeposit).toLocaleString()}</li>
                <li>Minimum Withdrawal Period: {minWithdrawalDays} days</li>
                {interestRates.map((item, index) => (
                  <li key={index}>Interest Rate {item.type}: {item.rate}%</li>
                ))}
              </ul>
            </div>
          </div>
          <Button 
            onClick={() => setShowSuccess(false)}
            className="w-full h-12 font-medium text-white shadow-lg rounded-xl"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
    </RoleGuard>
  );
}
