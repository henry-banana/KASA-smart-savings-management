import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
import { UserCircle, Mail, Phone, MapPin, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { StarDecor } from '../../components/CuteComponents';

export default function UserProfile() {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [contactInfo, setContactInfo] = useState({
    email: `${user.username}@kasa.com`,
    phone: '+84 123 456 789',
    address: '123 Main Street, District 1, Ho Chi Minh City'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setShowChangePassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSuccessMessage('Password changed successfully');
    setShowSuccess(true);
  };

  const handleUpdateContact = () => {
    if (!contactInfo.email || !contactInfo.phone) {
      alert('Email and phone are required');
      return;
    }

    setShowEditContact(false);
    setSuccessMessage('Contact information updated successfully');
    setShowSuccess(true);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'accountant':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'teller':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-xl rounded-2xl lg:rounded-3xl overflow-hidden">
        <CardContent className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#F3E8FF] to-[#E8F6FF] relative">
          <StarDecor className="top-4 right-8 sm:right-12" />
          <Sparkles className="absolute top-6 right-20 sm:right-32 text-purple-400 opacity-50" size={20} />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10">
            <div 
              className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-xl border-4 border-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <UserCircle size={48} className="sm:w-16 sm:h-16 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-gray-900 truncate">{user.fullName}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                <Badge className={`${getRoleBadgeColor(user.role)} border font-medium`}>
                  {user.role === 'admin' ? '🔑 Administrator' : 
                   user.role === 'accountant' ? '💼 Accountant' : 
                   '💰 Teller'}
                </Badge>
                <Badge className="text-green-700 bg-green-100 border-green-200 border font-medium">
                  ✓ Active
                </Badge>
              </div>
              <p className="text-sm text-gray-700">@{user.username}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Contact Information</CardTitle>
              <CardDescription>Your personal contact details</CardDescription>
            </div>
            <Button 
              onClick={() => setShowEditContact(true)}
              variant="outline"
              className="rounded-xl border-gray-200"
            >
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' }}>
                <Mail size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-900">{contactInfo.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm" style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' }}>
                <Phone size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Phone Number</p>
                <p className="text-sm text-gray-900">{contactInfo.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
                <MapPin size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Address</p>
                <p className="text-sm text-gray-900">{contactInfo.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <CardTitle className="text-xl">Security Settings</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border border-yellow-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' }}>
                  <Lock size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-600">Changed 30 days ago</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowChangePassword(true)}
                className="rounded-xl bg-white border border-yellow-200 hover:bg-yellow-50"
                variant="outline"
              >
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <CardTitle className="text-xl">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="mb-1 text-sm font-medium text-gray-600">Username</p>
              <p className="text-sm font-semibold text-gray-900">{user.username}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="mb-1 text-sm font-medium text-gray-600">User ID</p>
              <p className="text-sm font-semibold text-gray-900">U{Math.floor(1000 + Math.random() * 9000)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="mb-1 text-sm font-medium text-gray-600">Account Created</p>
              <p className="text-sm font-semibold text-gray-900">January 15, 2025</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="mb-1 text-sm font-medium text-gray-600">Last Login</p>
              <p className="text-sm font-semibold text-gray-900">Today at 09:30 AM</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="mb-1 text-sm font-medium text-gray-600">Department</p>
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {user.role === 'admin' ? 'Administration' : 
                 user.role === 'accountant' ? 'Accounting' : 
                 'Teller'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="mb-1 text-sm font-medium text-gray-600">Status</p>
              <Badge className="text-green-700 bg-green-100 border-green-200 border">✓ Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <CardTitle className="text-xl">Tóm Tắt Hoạt Động</CardTitle>
          <CardDescription>Thống kê hoạt động gần đây của bạn</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-6 text-center rounded-2xl border-2" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderColor: '#3B82F640' }}>
              <p className="mb-2 text-3xl font-bold text-blue-600">47</p>
              <p className="text-sm font-medium text-gray-700">Giao Dịch Hôm Nay</p>
            </div>
            <div className="p-6 text-center rounded-2xl border-2" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', borderColor: '#10B98140' }}>
              <p className="mb-2 text-3xl font-bold text-green-600">312</p>
              <p className="text-sm font-medium text-gray-700">Tuần Này</p>
            </div>
            <div className="p-6 text-center rounded-2xl border-2" style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)', borderColor: '#8B5CF640' }}>
              <p className="mb-2 text-3xl font-bold text-purple-600">1,247</p>
              <p className="text-sm font-medium text-gray-700">Tháng Này</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                <Lock size={24} className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Change Password</DialogTitle>
                <DialogDescription>Update your account password</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-gray-700">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
                className="h-11 rounded-xl border-gray-200"
              />
              <p className="text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={handleChangePassword}
              className="flex-1 h-12 text-white rounded-xl shadow-lg font-medium"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              Change Password
            </Button>
            <Button 
              onClick={() => {
                setShowChangePassword(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={showEditContact} onOpenChange={setShowEditContact}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                <Mail size={24} className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Edit Contact Information</DialogTitle>
                <DialogDescription>Update your contact details</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700">Address</Label>
              <Input
                id="address"
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                className="h-11 rounded-xl border-gray-200"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={handleUpdateContact}
              className="flex-1 h-12 text-white rounded-xl shadow-lg font-medium"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              Update Information
            </Button>
            <Button 
              onClick={() => setShowEditContact(false)}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
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
            <DialogTitle className="text-center text-2xl">Success!</DialogTitle>
            <DialogDescription className="text-center text-base">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <Button 
            onClick={() => setShowSuccess(false)}
            className="w-full h-12 text-white rounded-xl shadow-lg font-medium"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
