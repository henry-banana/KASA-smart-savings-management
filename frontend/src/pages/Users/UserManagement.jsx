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
          <h3 className="mb-2 text-xl font-semibold">Truy Cập Bị Hạn Chế</h3>
          <p className="text-gray-600">Chỉ quản trị viên mới có quyền quản lý người dùng.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F3E8FF] to-[#E8F6FF] border-b border-gray-100 relative overflow-hidden pb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full -mr-32 -mt-32" />
          <StarDecor className="top-4 right-12" />
          <Sparkles className="absolute top-6 right-32 text-purple-400 opacity-50" size={24} />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                <Users2 size={32} className="text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                  Quản Lý Người Dùng
                  <span className="text-2xl">👥</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Quản lý người dùng hệ thống và phân quyền
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={handleAddUser}
              className="text-white h-12 px-6 rounded-xl shadow-lg font-medium"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <UserPlus size={18} className="mr-2" />
              Thêm Người Dùng
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <CardTitle className="text-xl">
            Danh Sách Người Dùng ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="border rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#F8F9FC] to-white hover:bg-gradient-to-r">
                  <TableHead className="font-semibold">Tên Đăng Nhập</TableHead>
                  <TableHead className="font-semibold">Họ Tên</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Vai Trò</TableHead>
                  <TableHead className="font-semibold">Trạng Thái</TableHead>
                  <TableHead className="font-semibold">Ngày Tạo</TableHead>
                  <TableHead className="font-semibold text-center">Hành Động</TableHead>
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
                        {userData.role === 'admin' ? 'Quản trị viên' : 
                         userData.role === 'accountant' ? 'Kế toán' : 
                         'Thu ngân'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={userData.status === 'active' ? 
                          'bg-green-100 text-green-700 border-green-200 border' : 
                          'bg-gray-100 text-gray-700 border-gray-200 border'}
                      >
                        {userData.status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}
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
                          Sửa
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
                          {userData.status === 'active' ? 'Vô hiệu' : 'Kích hoạt'}
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
                <DialogTitle className="text-xl">Thêm Người Dùng Mới</DialogTitle>
                <DialogDescription>Tạo tài khoản người dùng mới trong hệ thống</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Tên Đăng Nhập</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Nhập tên đăng nhập"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700">Họ và Tên</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nhập họ và tên"
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
                placeholder="Nhập địa chỉ email"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700">Vai Trò</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="h-11 rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="teller">Thu Ngân</SelectItem>
                  <SelectItem value="accountant">Kế Toán</SelectItem>
                  <SelectItem value="admin">Quản Trị Viên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Mật Khẩu</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Nhập mật khẩu"
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
              Tạo Người Dùng
            </Button>
            <Button 
              onClick={() => setShowAddUser(false)}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200"
            >
              Hủy
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
                <DialogTitle className="text-xl">Chỉnh Sửa Người Dùng</DialogTitle>
                <DialogDescription>Cập nhật thông tin người dùng</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editUsername" className="text-gray-700">Tên Đăng Nhập</Label>
              <Input
                id="editUsername"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="h-11 rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editFullName" className="text-gray-700">Họ và Tên</Label>
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
              <Label htmlFor="editRole" className="text-gray-700">Vai Trò</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="h-11 rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="teller">Thu Ngân</SelectItem>
                  <SelectItem value="accountant">Kế Toán</SelectItem>
                  <SelectItem value="admin">Quản Trị Viên</SelectItem>
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
              Cập Nhật
            </Button>
            <Button 
              onClick={() => setShowEditUser(false)}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200"
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disable Confirmation */}
      <AlertDialog open={showDisableConfirm} onOpenChange={setShowDisableConfirm}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              {selectedUser?.status === 'active' ? 'Vô Hiệu Hóa' : 'Kích Hoạt'} Người Dùng?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Bạn có chắc chắn muốn {selectedUser?.status === 'active' ? 'vô hiệu hóa' : 'kích hoạt'} {selectedUser?.fullName}? 
              {selectedUser?.status === 'active' && ' Người dùng này sẽ không thể truy cập hệ thống.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-gray-200">Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDisable}
              className="rounded-xl text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              Xác Nhận
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
            <DialogTitle className="text-center text-2xl">Thành Công!</DialogTitle>
            <DialogDescription className="text-center text-base">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <Button 
            onClick={() => setShowSuccess(false)}
            className="w-full h-12 text-white rounded-xl shadow-lg font-medium"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
          >
            Đóng
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
