import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { branchService } from "@/services/branchService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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
import {
  UserPlus,
  Edit,
  UserX,
  AlertTriangle,
  CheckCircle2,
  Users2,
  Sparkles,
} from "lucide-react";
import { StarDecor } from "../../components/CuteComponents";
import { RoleGuard } from "../../components/RoleGuard";
import { Skeleton } from "../../components/ui/skeleton";
import { formatVnNumber } from "@/utils/numberFormatter";
import { ServiceUnavailablePageState } from "../../components/ServiceUnavailableState";
import { isServerUnavailable } from "@/utils/serverStatusUtils";

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [addUserError, setAddUserError] = useState(null);
  const [editUserError, setEditUserError] = useState(null);
  const [addUserEmailError, setAddUserEmailError] = useState(null);
  const [editUserEmailError, setEditUserEmailError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "teller",
    branchName: "",
  });

  // Fetch users and branches on mount
  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      if (isServerUnavailable(err)) {
        setError("SERVER_UNAVAILABLE");
      } else {
        setError(err.message || "Failed to fetch users");
      }
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const data = await branchService.getBranchNames();
      setBranches(data);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const handleAddUser = () => {
    setFormData({
      fullName: "",
      email: "",
      role: "teller",
      branchName: branches.length > 0 ? branches[0] : "Thủ Đức",
    });
    setAddUserError(null);
    setShowAddUser(true);
  };

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    // Normalize role for Select component: Administrator -> admin, Accountant -> accountant, Teller -> teller
    const normalizeRoleForForm = (role) => {
      const normalized = role?.toLowerCase();
      if (normalized === "administrator") return "admin";
      return normalized;
    };
    setFormData({
      fullName: userData.fullName,
      email: userData.email,
      role: normalizeRoleForForm(userData.roleName),
      branchName:
        userData.branchName || (branches.length > 0 ? branches[0] : "Thủ Đức"),
    });
    setEditUserError(null);
    setShowEditUser(true);
  };

  const handleDisableUser = (userData) => {
    setSelectedUser(userData);
    setShowDisableConfirm(true);
  };

  const confirmDisable = async () => {
    if (selectedUser) {
      try {
        const newStatus =
          selectedUser.status?.toLowerCase() === "rejected"
            ? "Approved"
            : "Rejected";
        await userService.updateUserStatus(selectedUser.id, newStatus);
        await fetchUsers(); // Refresh list
        setSuccessMessage(
          `User ${
            selectedUser.status?.toLowerCase() === "rejected"
              ? "approved"
              : "rejected"
          } successfully`
        );
        setShowSuccess(true);
      } catch (err) {
        setError(err.message || "Failed to update user status");
        console.error("Error toggling user status:", err);
      }
    }
    setShowDisableConfirm(false);
  };

  const submitAddUser = async () => {
    try {
      setAddUserError(null);
      setAddUserEmailError(null);

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) {
        setAddUserEmailError("Email is required");
        return;
      }
      if (!emailRegex.test(formData.email)) {
        setAddUserEmailError("Please enter a valid email address");
        return;
      }

      // Normalize role for backend: admin -> Administrator, teller -> Teller, accountant -> Accountant
      const capitalizeRole = (role) => {
        if (role.toLowerCase() === "admin") return "Administrator";
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      };

      await userService.createUser({
        fullName: formData.fullName,
        email: formData.email,
        roleName: capitalizeRole(formData.role),
        branchName: formData.branchName,
      });
      await fetchUsers(); // Refresh list
      setShowAddUser(false);
      setSuccessMessage("User created successfully");
      setShowSuccess(true);
    } catch (err) {
      setAddUserError(err.message || "Failed to create user account");
      console.error("Error creating user:", err);
    }
  };

  const submitEditUser = async () => {
    if (selectedUser) {
      try {
        setEditUserError(null);
        setEditUserEmailError(null);

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
          setEditUserEmailError("Email is required");
          return;
        }
        if (!emailRegex.test(formData.email)) {
          setEditUserEmailError("Please enter a valid email address");
          return;
        }

        // Normalize role for backend: admin -> Administrator, teller -> Teller, accountant -> Accountant
        const capitalizeRole = (role) => {
          if (role.toLowerCase() === "admin") return "Administrator";
          return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        };

        await userService.updateUser(selectedUser.id, {
          fullName: formData.fullName,
          email: formData.email,
          roleName: capitalizeRole(formData.role),
          branchName: formData.branchName,
        });
        await fetchUsers(); // Refresh list
        setShowEditUser(false);
        setSuccessMessage("User updated successfully");
        setShowSuccess(true);
      } catch (err) {
        setEditUserError(err.message || "Failed to update user");
        console.error("Error updating user:", err);
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    const normalizedRole = role?.toLowerCase();
    if (normalizedRole === "admin" || normalizedRole === "administrator") {
      return "bg-purple-100 text-purple-700 border-purple-200";
    }
    if (normalizedRole === "accountant") {
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    }
    if (normalizedRole === "teller") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusBadgeColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "submitted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "unsubmitted":
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "approved":
        return "✓ Approved";
      case "submitted":
        return "📝 Submitted";
      case "rejected":
        return "✗ Rejected";
      case "unsubmitted":
      default:
        return "⏳ Unsubmitted";
    }
  };

  // if (user.role !== 'admin') {
  //   return (
  //     <Card className="border border-gray-200 rounded-sm">
  //       <CardContent className="p-12 text-center">
  //         <AlertTriangle size={64} className="mx-auto mb-4 text-yellow-500" />
  //         <h3 className="mb-2 text-xl font-semibold">Access Restricted</h3>
  //         <p className="text-gray-600">Only administrators have permission to manage users.</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  // Show server unavailable state for connection errors
  if (error === "SERVER_UNAVAILABLE") {
    return (
      <RoleGuard allow={["admin"]}>
        <ServiceUnavailablePageState onRetry={fetchUsers} loading={loading} />
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allow={["admin"]}>
      <div className="space-y-4 sm:space-y-6">
        {/* Error Alert */}
        {error && (
          <Card className="overflow-hidden border-red-200 border bg-red-50 rounded-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-800">
                <AlertTriangle size={20} />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <Card className="overflow-hidden border border-gray-200 rounded-sm lg:rounded-sm">
          <CardHeader className="bg-linear-to-r from-[#F3E8FF] to-[#E8F6FF] border-b border-gray-100 relative overflow-hidden pb-6 sm:pb-8">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-md sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/50 sm:-mr-24 lg:-mr-32 sm:-mt-24 lg:-mt-32" />
            <StarDecor className="top-4 right-8 sm:right-12" />
            <Sparkles
              className="absolute text-purple-400 opacity-50 top-6 right-20 sm:right-32"
              size={20}
            />

            <div className="relative z-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-start flex-1 min-w-0 gap-3 sm:gap-4">
                <div
                  className="flex items-center justify-center shrink-0 w-12 h-12 border border-gray-200 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xs sm:rounded-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                  }}
                >
                  <Users2
                    size={24}
                    className="text-white sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                  />
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
                className="shrink-0 w-full h-10 px-4 text-sm font-medium text-white border border-gray-200 sm:w-auto sm:h-11 lg:h-12 sm:px-6 rounded-sm sm:text-base"
                style={{
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                }}
              >
                <UserPlus size={16} className="sm:w-[18px] sm:h-[18px] mr-2" />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden border border-gray-200 rounded-sm lg:rounded-sm">
          <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl">
              User List ({formatVnNumber(users.length)})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="overflow-hidden border rounded-xs lg:rounded-sm">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {/* Table Header Skeleton */}
                    <div className="flex gap-4 p-3 bg-gray-50 rounded-xs">
                      <Skeleton className="h-5 w-24 bg-gray-200" />
                      <Skeleton className="h-5 w-32 bg-gray-200 hidden md:block" />
                      <Skeleton className="h-5 w-40 bg-gray-200 hidden lg:block" />
                      <Skeleton className="h-5 w-20 bg-gray-200" />
                      <Skeleton className="h-5 w-20 bg-gray-200" />
                      <Skeleton className="h-5 w-28 bg-gray-200 hidden sm:block" />
                      <Skeleton className="h-5 w-24 bg-gray-200" />
                    </div>
                    {/* Table Rows Skeleton */}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 border border-gray-100 rounded-xs animate-pulse"
                      >
                        <Skeleton className="h-4 w-24 bg-gray-200" />
                        <Skeleton className="h-4 w-32 bg-gray-200 hidden md:block" />
                        <Skeleton className="h-4 w-40 bg-gray-200 hidden lg:block" />
                        <Skeleton className="h-6 w-24 bg-gray-200 rounded-md" />
                        <Skeleton className="h-6 w-16 bg-gray-200 rounded-md" />
                        <Skeleton className="h-4 w-28 bg-gray-200 hidden sm:block" />
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-16 bg-gray-200 rounded-xs" />
                          <Skeleton className="h-8 w-20 bg-gray-200 rounded-xs" />
                        </div>
                      </div>
                    ))}
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
                        <TableHead className="text-xs font-semibold sm:text-sm">
                          Username
                        </TableHead>
                        <TableHead className="hidden text-xs font-semibold sm:text-sm md:table-cell">
                          Full Name
                        </TableHead>
                        <TableHead className="hidden text-xs font-semibold sm:text-sm lg:table-cell">
                          Email
                        </TableHead>
                        <TableHead className="text-xs font-semibold sm:text-sm">
                          Role
                        </TableHead>
                        <TableHead className="text-xs font-semibold sm:text-sm">
                          Status
                        </TableHead>
                        <TableHead className="hidden text-xs font-semibold sm:text-sm sm:table-cell">
                          Branch
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-center sm:text-sm">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((userData) => (
                        <TableRow
                          key={userData.id}
                          className="hover:bg-[#F8F9FC] transition-colors"
                        >
                          <TableCell className="font-medium">
                            {userData.username}
                          </TableCell>
                          <TableCell>{userData.fullName}</TableCell>
                          <TableCell className="text-gray-600">
                            {userData.email}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getRoleBadgeColor(
                                userData.roleName
                              )} border capitalize`}
                            >
                              {userData.roleName}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusBadgeColor(
                                userData.status
                              )} border`}
                            >
                              {getStatusLabel(userData.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>{userData.branchName || "-"}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditUser(userData)}
                                className="rounded-xs border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05]"
                              >
                                <Edit size={14} className="mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDisableUser(userData)}
                                className={`min-w-[100px] rounded-xs border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05] ${
                                  userData.status?.toLowerCase() === "rejected"
                                    ? "text-blue-600 hover:bg-blue-50"
                                    : "text-red-600 hover:bg-red-50"
                                }`}
                              >
                                <UserX size={14} className="mr-1" />
                                {userData.status?.toLowerCase() === "rejected"
                                  ? "Approve"
                                  : "Reject"}
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
          <DialogContent className="rounded-sm">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                  }}
                >
                  <UserPlus size={24} className="text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account in the system
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    setAddUserError(null);
                  }}
                  placeholder="Enter full name"
                  className="border-gray-200 h-11 rounded-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700">
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => {
                    setFormData({ ...formData, role: value });
                    setAddUserError(null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teller">Teller</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchName" className="text-gray-700">
                  Branch
                </Label>
                <Select
                  value={formData.branchName}
                  onValueChange={(value) => {
                    setFormData({ ...formData, branchName: value });
                    setAddUserError(null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.length > 0 ? (
                      branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="Thủ Đức" disabled>
                        Loading branches...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setAddUserError(null);
                    setAddUserEmailError(null);
                  }}
                  placeholder="Enter email address"
                  className={`border-gray-200 h-11 rounded-sm ${
                    addUserEmailError
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                {addUserEmailError && (
                  <p className="text-sm text-red-600">{addUserEmailError}</p>
                )}
              </div>

              {addUserError && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-sm">
                  <AlertTriangle
                    size={20}
                    className="text-red-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700">{addUserError}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                onClick={submitAddUser}
                className="flex-1 h-12 font-medium text-white border border-gray-200 rounded-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                }}
              >
                Create User
              </Button>
              <Button
                onClick={() => setShowAddUser(false)}
                variant="outline"
                className="flex-1 h-12 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05] rounded-sm"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
          <DialogContent className="rounded-sm">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                  }}
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
                <Label htmlFor="editFullName" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="editFullName"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    setEditUserError(null);
                  }}
                  className="border-gray-200 h-11 rounded-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editRole" className="text-gray-700">
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => {
                    setFormData({ ...formData, role: value });
                    setEditUserError(null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teller">Teller</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editBranchName" className="text-gray-700">
                  Branch
                </Label>
                <Select
                  value={formData.branchName}
                  onValueChange={(value) => {
                    setFormData({ ...formData, branchName: value });
                    setEditUserError(null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.length > 0 ? (
                      branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="Thủ Đức" disabled>
                        Loading branches...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editEmail" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setEditUserError(null);
                    setEditUserEmailError(null);
                  }}
                  className="border-gray-200 h-11 rounded-sm"
                  disabled
                  readOnly
                />
              </div>

              {editUserError && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-sm">
                  <AlertTriangle
                    size={20}
                    className="text-red-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700">{editUserError}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                onClick={submitEditUser}
                className="flex-1 h-12 font-medium text-white border border-gray-200 rounded-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                }}
              >
                Update
              </Button>
              <Button
                onClick={() => setShowEditUser(false)}
                variant="outline"
                className="flex-1 h-12 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05] rounded-sm"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Disable Confirmation */}
        <AlertDialog
          open={showDisableConfirm}
          onOpenChange={setShowDisableConfirm}
        >
          <AlertDialogContent className="rounded-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                {selectedUser?.status?.toLowerCase() === "rejected"
                  ? "Approve"
                  : "Reject"}{" "}
                User?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Are you sure you want to{" "}
                {selectedUser?.status?.toLowerCase() === "rejected"
                  ? "approve"
                  : "reject"}{" "}
                {selectedUser?.fullName}?
                {selectedUser?.status?.toLowerCase() !== "rejected" &&
                  " This will change the user status to Rejected."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05]  rounded-sm">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDisable}
                className="text-white border border-gray-200 rounded-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="rounded-sm">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div
                  className="flex items-center justify-center w-20 h-20 rounded-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                  }}
                >
                  <CheckCircle2 size={48} className="text-white" />
                </div>
              </div>
              <DialogTitle className="text-2xl text-center">
                Success!
              </DialogTitle>
              <DialogDescription className="text-base text-center">
                {successMessage}
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full h-12 font-medium text-white border border-gray-200 rounded-sm"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
              }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
