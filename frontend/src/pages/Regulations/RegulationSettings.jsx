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
import { CheckCircle2, AlertTriangle, History } from 'lucide-react';

export default function RegulationSettings({ user }) {
  const [minDeposit, setMinDeposit] = useState('100000');
  const [minWithdrawalDays, setMinWithdrawalDays] = useState('15');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [interestRates, setInterestRates] = useState([
    { type: 'No Term', rate: '2.0', editable: false },
    { type: '3 Months', rate: '4.5', editable: false },
    { type: '6 Months', rate: '5.5', editable: false }
  ]);

  const changeHistory = [
    {
      date: '2025-11-01',
      user: 'admin',
      field: 'Min Deposit',
      oldValue: '50,000',
      newValue: '100,000'
    },
    {
      date: '2025-10-15',
      user: 'admin',
      field: 'Min Withdrawal Days',
      oldValue: '10',
      newValue: '15'
    },
    {
      date: '2025-09-20',
      user: 'admin',
      field: '3 Months Interest Rate',
      oldValue: '4.0%',
      newValue: '4.5%'
    },
    {
      date: '2025-08-10',
      user: 'admin',
      field: '6 Months Interest Rate',
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
      <Card>
        <CardContent className="p-12 text-center">
          <AlertTriangle size={64} className="mx-auto mb-4 text-yellow-500" />
          <h3 className="mb-2 text-xl">Access Restricted</h3>
          <p className="text-gray-600">Only administrators can access regulation settings.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Regulation Settings (QĐ6)</CardTitle>
          <CardDescription>Configure system-wide regulations and rules</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <h4 className="text-sm text-gray-600">Basic Regulations</h4>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minDeposit">Minimum Deposit Amount (VND)</Label>
                  <Input
                    id="minDeposit"
                    type="number"
                    value={minDeposit}
                    onChange={(e) => setMinDeposit(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Minimum amount required to open an account or make a deposit</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minWithdrawalDays">Minimum Withdrawal Period (Days)</Label>
                  <Input
                    id="minWithdrawalDays"
                    type="number"
                    value={minWithdrawalDays}
                    onChange={(e) => setMinWithdrawalDays(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Minimum number of days before withdrawal is allowed</p>
                </div>
              </div>
            </div>

            {/* Interest Rates */}
            <div className="space-y-4">
              <h4 className="text-sm text-gray-600">Interest Rates by Savings Type</h4>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Savings Type</TableHead>
                      <TableHead>Interest Rate (% per year)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interestRates.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.1"
                            value={item.rate}
                            onChange={(e) => handleUpdateRate(index, e.target.value)}
                            className="w-32"
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
                className="text-white"
                style={{ backgroundColor: '#1A4D8F' }}
              >
                Update Regulations
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setMinDeposit('100000');
                  setMinWithdrawalDays('15');
                  setInterestRates([
                    { type: 'No Term', rate: '2.0', editable: false },
                    { type: '3 Months', rate: '4.5', editable: false },
                    { type: '6 Months', rate: '5.5', editable: false }
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
      <Card>
        <CardHeader>
          <CardTitle>Current Regulations Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-blue-50">
              <h5 className="mb-3 text-sm text-blue-900">Deposit & Withdrawal Rules</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-800">Minimum Deposit:</span>
                  <span className="text-sm text-blue-900">₫{Number(minDeposit).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-800">Minimum Holding Period:</span>
                  <span className="text-sm text-blue-900">{minWithdrawalDays} days</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-50">
              <h5 className="mb-3 text-sm text-green-900">Interest Rates</h5>
              <div className="space-y-2">
                {interestRates.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm text-green-800">{item.type}:</span>
                    <span className="text-sm text-green-900">{item.rate}% per year</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History size={20} />
            <CardTitle>Change History</CardTitle>
          </div>
          <CardDescription>Track all regulation changes made by administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Old Value</TableHead>
                  <TableHead>New Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changeHistory.map((change, index) => (
                  <TableRow key={index}>
                    <TableCell>{change.date}</TableCell>
                    <TableCell>{change.user}</TableCell>
                    <TableCell>{change.field}</TableCell>
                    <TableCell className="text-red-600">{change.oldValue}</TableCell>
                    <TableCell className="text-green-600">{change.newValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Regulation Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the system regulations? This will affect all future transactions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <p className="text-sm text-yellow-900">
                <AlertTriangle size={16} className="inline mr-2" />
                Changes will take effect immediately and apply to all accounts.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={confirmUpdate}
              className="flex-1 text-white"
              style={{ backgroundColor: '#1A4D8F' }}
            >
              Confirm Changes
            </Button>
            <Button 
              onClick={() => setShowConfirm(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={64} className="text-green-500" />
            </div>
            <DialogTitle className="text-center">Regulations Updated!</DialogTitle>
            <DialogDescription className="text-center">
              The system regulations have been updated successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 space-y-2 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Updated regulations:</p>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li>Minimum Deposit: ₫{Number(minDeposit).toLocaleString()}</li>
                <li>Minimum Withdrawal Period: {minWithdrawalDays} days</li>
                {interestRates.map((item, index) => (
                  <li key={index}>{item.type} Interest Rate: {item.rate}%</li>
                ))}
              </ul>
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
