import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
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
import { RoleGuard } from '../../components/RoleGuard';

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

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
      role: userData.roleName,
      password: ''
    });
    setShowEditUser(true);
  };

  const handleDisableUser = (userData) => {
    setSelectedUser(userData);
    setShowDisableConfirm(true);
  };

  const confirmDisable = async () => {
    if (selectedUser) {
      try {
        const newStatus = selectedUser.status === 'active' ? 'disabled' : 'active';
        await userService.updateUserStatus(selectedUser.id, newStatus);
        await fetchUsers(); // Refresh list
        setSuccessMessage(`User ${selectedUser.status === 'active' ? 'disabled' : 'enabled'} successfully`);
        setShowSuccess(true);
      } catch (err) {
        setError(err.message || 'Failed to update user status');
        console.error('Error toggling user status:', err);
      }
    }
    setShowDisableConfirm(false);
  };

  const submitAddUser = async () => {
    try {
      await userService.createUser(formData);
      await fetchUsers(); // Refresh list
      setShowAddUser(false);
      setSuccessMessage('User created successfully');
      setShowSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to create user');
      console.error('Error creating user:', err);
    }
  };

  const submitEditUser = async () => {
    if (selectedUser) {
      try {
        await userService.updateUser(selectedUser.id, {
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          roleName: formData.role
        });
        await fetchUsers(); // Refresh list
        setShowEditUser(false);
        setSuccessMessage('User updated successfully');
        setShowSuccess(true);
      } catch (err) {
        setError(err.message || 'Failed to update user');
        console.error('Error updating user:', err);
      }
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

  // if (user.role !== 'admin') {
  //   return (
  //     <Card className="border-0 shadow-xl rounded-3xl">
  //       <CardContent className="p-12 text-center">
  //         <AlertTriangle size={64} className="mx-auto mb-4 text-yellow-500" />
  //         <h3 className="mb-2 text-xl font-semibold">Access Restricted</h3>
  //         <p className="text-gray-600">Only administrators have permission to manage users.</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <RoleGuard allow={['admin']}>
      <div className="space-y-4 sm:space-y-6">
        {/* Error Alert */}
        {error && (
          <Card className="overflow-hidden border-red-200 shadow-xl bg-red-50 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-800">
                <AlertTriangle size={20} />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <Card className="overflow-hidden border-0 shadow-xl rounded-2xl lg:rounded-3xl">
          <CardHeader className="bg-linear-to-r from-[#F3E8FF] to-[#E8F6FF] border-b border-gray-100 relative overflow-hidden pb-6 sm:pb-8">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/50 sm:-mr-24 lg:-mr-32 sm:-mt-24 lg:-mt-32" />
            <StarDecor className="top-4 right-8 sm:right-12" />
            <Sparkles className="absolute text-purple-400 opacity-50 top-6 right-20 sm:right-32" size={20} />
            
            <div className="relative z-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-start flex-1 min-w-0 gap-3 sm:gap-4">
                <div 
                  className="flex items-center justify-center shrink-0 w-12 h-12 shadow-lg sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
                >
                  <Users2 size={24} className="text-white sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="flex items-center gap-2 mb-1 text-lg sm:text-xl lg:text-2xl sm:mb-2">
                    <span className="truncate">User Management</span>
                    <span className="shrink-0 text-xl sm:text-2xl">👥</span>
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Manage system users and permissions
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={handleAddUser}
                className="shrink-0 w-full h-10 px-4 text-sm font-medium text-white shadow-lg sm:w-auto sm:h-11 lg:h-12 sm:px-6 rounded-xl sm:text-base"
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
        <Card className="overflow-hidden border-0 shadow-xl rounded-2xl lg:rounded-3xl">
          <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl">
              User List ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="overflow-hidden border rounded-xl lg:rounded-2xl">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="py-12 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
                    <p className="mt-4 text-gray-600">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    <Users2 size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No users found</p>
                  </div>
                ) : (
                  <Table>
                  <TableHeader>
                    <TableRow className="bg-linear-to-r from-[#F8F9FC] to-white hover:bg-linear-to-r">
                      <TableHead className="text-xs font-semibold sm:text-sm">Username</TableHead>
                      <TableHead className="hidden text-xs font-semibold sm:text-sm md:table-cell">Full Name</TableHead>
                      <TableHead className="hidden text-xs font-semibold sm:text-sm lg:table-cell">Email</TableHead>
                      <TableHead className="text-xs font-semibold sm:text-sm">Role</TableHead>
                      <TableHead className="text-xs font-semibold sm:text-sm">Status</TableHead>
                      <TableHead className="hidden text-xs font-semibold sm:text-sm sm:table-cell">Created Date</TableHead>
                      <TableHead className="text-xs font-semibold text-center sm:text-sm">Actions</TableHead>
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
                          className={`${getRoleBadgeColor(userData.roleName)} border capitalize`}
                        >
                          {userData.roleName === 'admin' ? 'Administrator' : 
                          userData.roleName === 'accountant' ? 'Accountant' : 
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
                      <TableCell>{userData.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
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
              )}
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
                  className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl"
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
                  className="border-gray-200 h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className="border-gray-200 h-11 rounded-xl"
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
                  className="border-gray-200 h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="border-gray-200 h-11 rounded-xl">
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
                  className="border-gray-200 h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={submitAddUser}
                className="flex-1 h-12 font-medium text-white shadow-lg rounded-xl"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                Create User
              </Button>
              <Button 
                onClick={() => setShowAddUser(false)}
                variant="outline"
                className="flex-1 h-12 border-gray-200 rounded-xl"
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
                  className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl"
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
                  className="border-gray-200 h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editFullName" className="text-gray-700">Full Name</Label>
                <Input
                  id="editFullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="border-gray-200 h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editEmail" className="text-gray-700">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-gray-200 h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editRole" className="text-gray-700">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="border-gray-200 h-11 rounded-xl">
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
                className="flex-1 h-12 font-medium text-white shadow-lg rounded-xl"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                Update
              </Button>
              <Button 
                onClick={() => setShowEditUser(false)}
                variant="outline"
                className="flex-1 h-12 border-gray-200 rounded-xl"
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
              <AlertDialogCancel className="border-gray-200 rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDisable}
                className="text-white shadow-lg rounded-xl"
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
                  className="flex items-center justify-center w-20 h-20 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' }}
                >
                  <CheckCircle2 size={48} className="text-white" />
                </div>
              </div>
              <DialogTitle className="text-2xl text-center">Success!</DialogTitle>
              <DialogDescription className="text-base text-center">
                {successMessage}
              </DialogDescription>
            </DialogHeader>
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
