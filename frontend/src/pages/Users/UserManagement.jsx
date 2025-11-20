import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
import { UserPlus, Edit, UserX, AlertTriangle, CheckCircle2, Users2, Sparkles } from 'lucide-react';
import { StarDecor } from '../../components/CuteComponents';

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([
    {
      id: 'U001',
      username: 'teller1',
      fullName: 'Nguyễn Văn A',
      email: 'teller1@kasa.com',
      role: 'teller',
      status: 'active',
      createdDate: '2025-01-15'
    },
    {
      id: 'U002',
      username: 'accountant1',
      fullName: 'Trần Thị B',
      email: 'accountant1@kasa.com',
      role: 'accountant',
      status: 'active',
      createdDate: '2025-02-01'
    },
    {
      id: 'U003',
      username: 'admin1',
      fullName: 'Lê Văn C',
      email: 'admin@kasa.com',
      role: 'admin',
      status: 'active',
      createdDate: '2025-01-01'
    },
    {
      id: 'U004',
      username: 'teller2',
      fullName: 'Phạm Thị D',
      email: 'teller2@kasa.com',
      role: 'teller',
      status: 'disabled',
      createdDate: '2025-03-10'
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
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'accountant':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'teller':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (user.role !== 'admin') {
    return (
      <Card className="rounded-3xl border-0 shadow-xl">
        <CardContent className="p-12 text-center">
          <AlertTriangle size={64} className="mx-auto mb-4 text-yellow-500" />
          <h3 className="mb-2 text-xl font-semibold">Access Restricted</h3>
          <p className="text-gray-600">Only administrators have permission to manage users.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-xl rounded-2xl lg:rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F3E8FF] to-[#E8F6FF] border-b border-gray-100 relative overflow-hidden pb-6 sm:pb-8">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/50 rounded-full -mr-16 sm:-mr-24 lg:-mr-32 -mt-16 sm:-mt-24 lg:-mt-32" />
          <StarDecor className="top-4 right-8 sm:right-12" />
          <Sparkles className="absolute top-6 right-20 sm:right-32 text-purple-400 opacity-50" size={20} />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                <Users2 size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2 flex items-center gap-2">
                  <span className="truncate">User Management</span>
                  <span className="text-xl sm:text-2xl flex-shrink-0">👥</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Manage system users and permissions
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={handleAddUser}
              className="w-full sm:w-auto text-white h-10 sm:h-11 lg:h-12 px-4 sm:px-6 rounded-xl shadow-lg font-medium text-sm sm:text-base flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <UserPlus size={16} className="sm:w-[18px] sm:h-[18px] mr-2" />
              <span className="hidden sm:inline">Add User</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-xl rounded-2xl lg:rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F8F9FC] to-white border-b border-gray-100 p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg lg:text-xl">
            User List ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="border rounded-xl lg:rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[#F8F9FC] to-white hover:bg-gradient-to-r">
                    <TableHead className="font-semibold text-xs sm:text-sm">Username</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm hidden md:table-cell">Full Name</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm hidden lg:table-cell">Email</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm">Role</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm hidden sm:table-cell">Created Date</TableHead>
                    <TableHead className="font-semibold text-center text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userData) => (
                    <TableRow key={userData.id} className="hover:bg-[#F8F9FC] transition-colors">
                    <TableCell className="font-medium">{userData.username}</TableCell>
                    <TableCell>{userData.fullName}</TableCell>
                    <TableCell className="text-gray-600">{userData.email}</TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getRoleBadgeColor(userData.role)} border capitalize`}
                      >
                        {userData.role === 'admin' ? 'Administrator' : 
                         userData.role === 'accountant' ? 'Accountant' : 
                         'Teller'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={userData.status === 'active' ? 
                          'bg-green-100 text-green-700 border-green-200 border' : 
                          'bg-gray-100 text-gray-700 border-gray-200 border'}
                      >
                        {userData.status === 'active' ? 'Active' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell>{userData.createdDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditUser(userData)}
                          className="rounded-xl hover:bg-[#F3E8FF]"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDisableUser(userData)}
                          className={`rounded-xl ${userData.status === 'active' ? 
                            'text-red-600 hover:bg-red-50' : 
                            'text-green-600 hover:bg-green-50'}`}
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
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                <UserPlus size={24} className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Add New User</DialogTitle>
                <DialogDescription>Create a new user account in the system</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="h-11 rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="teller">Teller</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={submitAddUser}
              className="flex-1 h-12 text-white rounded-xl shadow-lg font-medium"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              Create User
            </Button>
            <Button 
              onClick={() => setShowAddUser(false)}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                <Edit size={24} className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Edit User</DialogTitle>
                <DialogDescription>Update user information</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editUsername" className="text-gray-700">Username</Label>
              <Input
                id="editUsername"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editFullName" className="text-gray-700">Full Name</Label>
              <Input
                id="editFullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editEmail" className="text-gray-700">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editRole" className="text-gray-700">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="h-11 rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="teller">Teller</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={submitEditUser}
              className="flex-1 h-12 text-white rounded-xl shadow-lg font-medium"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              Update
            </Button>
            <Button 
              onClick={() => setShowEditUser(false)}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disable Confirmation */}
      <AlertDialog open={showDisableConfirm} onOpenChange={setShowDisableConfirm}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              {selectedUser?.status === 'active' ? 'Disable' : 'Enable'} User?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to {selectedUser?.status === 'active' ? 'disable' : 'enable'} {selectedUser?.fullName}? 
              {selectedUser?.status === 'active' && ' This user will not be able to access the system.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-gray-200">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDisable}
              className="rounded-xl text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
