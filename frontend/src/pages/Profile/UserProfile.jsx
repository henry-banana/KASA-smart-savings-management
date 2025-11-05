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
import { UserCircle, Mail, Phone, MapPin, Lock, CheckCircle2 } from 'lucide-react';

export default function UserProfile({ user }) {
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
        return { backgroundColor: '#1A4D8F', color: 'white' };
      case 'accountant':
        return { backgroundColor: '#00AEEF', color: 'white' };
      case 'teller':
        return { backgroundColor: '#10B981', color: 'white' };
      default:
        return { backgroundColor: '#6B7280', color: 'white' };
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center justify-center w-24 h-24 rounded-full"
              style={{ backgroundColor: '#1A4D8F' }}
            >
              <UserCircle size={64} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-2xl">{user.fullName}</h2>
              <div className="flex items-center gap-3 mb-2">
                <Badge style={getRoleBadgeColor(user.role)} className="capitalize">
                  {user.role}
                </Badge>
                <Badge className="text-green-800 bg-green-100">Active</Badge>
              </div>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your personal contact details</CardDescription>
            </div>
            <Button 
              onClick={() => setShowEditContact(true)}
              variant="outline"
            >
              Edit Contact Info
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                <Mail size={20} style={{ color: '#1A4D8F' }} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="text-sm">{contactInfo.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                <Phone size={20} style={{ color: '#1A4D8F' }} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="text-sm">{contactInfo.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                <MapPin size={20} style={{ color: '#1A4D8F' }} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-sm">{contactInfo.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                  <Lock size={20} style={{ color: '#1A4D8F' }} />
                </div>
                <div>
                  <p className="text-sm">Password</p>
                  <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowChangePassword(true)}
                variant="outline"
              >
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-1 text-sm text-gray-600">Username</p>
              <p className="text-sm">{user.username}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-600">User ID</p>
              <p className="text-sm">U{Math.floor(1000 + Math.random() * 9000)}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-600">Account Created</p>
              <p className="text-sm">January 15, 2025</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-600">Last Login</p>
              <p className="text-sm">Today at 09:30 AM</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-600">Department</p>
              <p className="text-sm capitalize">{user.role} Department</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-600">Status</p>
              <Badge className="text-green-800 bg-green-100">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>Your recent activity statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-4 text-center rounded-lg bg-blue-50">
              <p className="mb-1 text-2xl text-blue-600">47</p>
              <p className="text-sm text-gray-600">Transactions Today</p>
            </div>
            <div className="p-4 text-center rounded-lg bg-green-50">
              <p className="mb-1 text-2xl text-green-600">312</p>
              <p className="text-sm text-gray-600">This Week</p>
            </div>
            <div className="p-4 text-center rounded-lg bg-purple-50">
              <p className="mb-1 text-2xl text-purple-600">1,247</p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update your account password</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
              <p className="text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={handleChangePassword}
              className="flex-1 text-white"
              style={{ backgroundColor: '#1A4D8F' }}
            >
              Change Password
            </Button>
            <Button 
              onClick={() => {
                setShowChangePassword(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={showEditContact} onOpenChange={setShowEditContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
            <DialogDescription>Update your contact details</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={handleUpdateContact}
              className="flex-1 text-white"
              style={{ backgroundColor: '#1A4D8F' }}
            >
              Update Information
            </Button>
            <Button 
              onClick={() => setShowEditContact(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={64} className="text-green-500" />
            </div>
            <DialogTitle className="text-center">Success!</DialogTitle>
            <DialogDescription className="text-center">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
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
