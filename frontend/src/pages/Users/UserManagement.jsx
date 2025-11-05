import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { UserPlus, Edit, UserX, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function UserManagement({ user }) {
  const [users, setUsers] = useState([
    {
      id: 'U001',
      username: 'teller1',
      fullName: 'John Doe',
      email: 'teller1@kasa.com',
      role: 'teller',
      status: 'active',
      createdDate: '2025-01-10'
    },
    {
      id: 'U002',
      username: 'accountant1',
      fullName: 'Jane Smith',
      email: 'accountant1@kasa.com',
      role: 'accountant',
      status: 'active',
      createdDate: '2025-01-15'
    },
    {
      id: 'U003',
      username: 'admin1',
      fullName: 'Bob Johnson',
      email: 'admin1@kasa.com',
      role: 'admin',
      status: 'active',
      createdDate: '2025-02-01'
    },
    {
      id: 'U004',
      username: 'teller2',
      fullName: 'Alice Brown',
      email: 'teller2@kasa.com',
      role: 'teller',
      status: 'disabled',
      createdDate: '2025-02-10'
    }
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'teller',
    password: ''
  });

  const handleAddUser = () => {
    setFormData({
      username: '',
      fullName: '',
      email: '',
      role: 'teller',
      password: ''
    });
    setShowAddUser(true);
  };

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setFormData({
      username: userData.username,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
      password: ''
    });
    setShowEditUser(true);
  };

  const handleDisableUser = (userData) => {
    setSelectedUser(userData);
    setShowDisableConfirm(true);
  };

  const confirmDisable = () => {
    if (selectedUser) {
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' }
          : u
      ));
      setSuccessMessage(`User ${selectedUser.status === 'active' ? 'disabled' : 'enabled'} successfully`);
      setShowSuccess(true);
    }
    setShowDisableConfirm(false);
  };

  const submitAddUser = () => {
    const newUser = {
      id: `U${String(users.length + 1).padStart(3, '0')}`,
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setShowAddUser(false);
    setSuccessMessage('User created successfully');
    setShowSuccess(true);
  };

  const submitEditUser = () => {
    if (selectedUser) {
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? { ...u, username: formData.username, fullName: formData.fullName, email: formData.email, role: formData.role }
          : u
      ));
      setShowEditUser(false);
      setSuccessMessage('User updated successfully');
      setShowSuccess(true);
    }
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

  if (user.role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertTriangle size={64} className="mx-auto mb-4 text-yellow-500" />
          <h3 className="mb-2 text-xl">Access Restricted</h3>
          <p className="text-gray-600">Only administrators can access user management.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and their roles</CardDescription>
            </div>
            <Button 
              onClick={handleAddUser}
              className="text-white"
              style={{ backgroundColor: '#1A4D8F' }}
            >
              <UserPlus size={16} className="mr-2" />
              Add New User
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userData) => (
                  <TableRow key={userData.id}>
                    <TableCell>{userData.username}</TableCell>
                    <TableCell>{userData.fullName}</TableCell>
                    <TableCell>{userData.email}</TableCell>
                    <TableCell>
                      <Badge 
                        style={getRoleBadgeColor(userData.role)}
                        className="capitalize"
                      >
                        {userData.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={userData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {userData.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{userData.createdDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditUser(userData)}
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDisableUser(userData)}
                          className={userData.status === 'active' ? 'text-red-600' : 'text-green-600'}
                        >
                          <UserX size={14} className="mr-1" />
                          {userData.status === 'active' ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new system user account</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teller">Teller</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={submitAddUser}
              className="flex-1 text-white"
              style={{ backgroundColor: '#1A4D8F' }}
            >
              Create User
            </Button>
            <Button 
              onClick={() => setShowAddUser(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editUsername">Username</Label>
              <Input
                id="editUsername"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editFullName">Full Name</Label>
              <Input
                id="editFullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teller">Teller</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={submitEditUser}
              className="flex-1 text-white"
              style={{ backgroundColor: '#1A4D8F' }}
            >
              Update User
            </Button>
            <Button 
              onClick={() => setShowEditUser(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disable Confirmation */}
      <AlertDialog open={showDisableConfirm} onOpenChange={setShowDisableConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === 'active' ? 'Disable' : 'Enable'} User?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedUser?.status === 'active' ? 'disable' : 'enable'} {selectedUser?.fullName}? 
              {selectedUser?.status === 'active' && ' This user will no longer be able to access the system.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisable}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
