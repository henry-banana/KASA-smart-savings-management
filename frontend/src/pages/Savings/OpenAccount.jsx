import React, { useState } from 'react';
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
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

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

    if (!formData.customerName) newErrors.customerName = 'Customer name is required';
    if (!formData.idCard) newErrors.idCard = 'ID card is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.savingsType) newErrors.savingsType = 'Please select a savings type';
    if (!formData.initialDeposit) {
      newErrors.initialDeposit = 'Initial deposit is required';
    } else if (Number(formData.initialDeposit) < 100000) {
      newErrors.initialDeposit = 'Minimum deposit is 100,000 VND';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Generate account code
      const code = 'SA' + Math.floor(10000 + Math.random() * 90000);
      setAccountCode(code);
      setShowSuccess(true);
      
      // Reset form
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
    { value: 'regular', label: 'Regular Savings' },
    { value: 'fixed-3m', label: '3 Months Fixed Term' },
    { value: 'fixed-6m', label: '6 Months Fixed Term' }
  ];

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Open New Savings Account (BM1)</CardTitle>
          <CardDescription>Create a new savings account for a customer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter full name"
                />
                {errors.customerName && <p className="text-sm text-red-500">{errors.customerName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="idCard">ID Card Number *</Label>
                <Input
                  id="idCard"
                  value={formData.idCard}
                  onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                  placeholder="Enter ID card number"
                />
                {errors.idCard && <p className="text-sm text-red-500">{errors.idCard}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
                rows={3}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="savingsType">Savings Type *</Label>
                <Select value={formData.savingsType ?? ''} onValueChange={(value) => setFormData({ ...formData, savingsType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select savings type" />
                  </SelectTrigger>
                  <SelectContent>
                    {savingsTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.savingsType && <p className="text-sm text-red-500">{errors.savingsType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialDeposit">Initial Deposit (VND) *</Label>
                <Input
                  id="initialDeposit"
                  type="number"
                  value={formData.initialDeposit}
                  onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                  placeholder="Min 100,000"
                />
                {errors.initialDeposit && <p className="text-sm text-red-500">{errors.initialDeposit}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openDate">Open Date</Label>
              <Input
                id="openDate"
                type="date"
                value={formData.openDate}
                onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
                disabled
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="text-white"
                style={{ backgroundColor: '#1A4D8F' }}
              >
                Confirm Open Account
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setFormData({
                  customerName: '',
                  idCard: '',
                  address: '',
                  savingsType: '',
                  initialDeposit: '',
                  openDate: new Date().toISOString().split('T')[0]
                });
                setErrors({});
              }}>
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={64} className="text-green-500" />
            </div>
            <DialogTitle className="text-center">Account Created Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              The new savings account has been created.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 space-y-2 rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Code:</span>
                <span className="text-sm">{accountCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer Name:</span>
                <span className="text-sm">{formData.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Savings Type:</span>
                <span className="text-sm capitalize">{formData.savingsType?.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Initial Deposit:</span>
                <span className="text-sm">₫{Number(formData.initialDeposit).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Open Date:</span>
                <span className="text-sm">{formData.openDate}</span>
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
