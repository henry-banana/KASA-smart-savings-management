import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "@/services/profileService";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Lock,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { StarDecor } from "../../components/CuteComponents";
import { Skeleton } from "../../components/ui/skeleton";
import { isServerUnavailable } from "@/utils/serverStatusUtils";
import { ServiceUnavailableState } from "@/components/ServiceUnavailableState";

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverError, setServerError] = useState(null);

  // Profile data from API
  const [profileData, setProfileData] = useState(null);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setServerError(null);
        const response = await getProfile();
        if (response.success && response.data) {
          setProfileData(response.data);
          setPersonalInfo({
            fullName: response.data.fullName || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        // Check if server is unavailable
        if (isServerUnavailable(err)) {
          setServerError(err);
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      console.log("📤 Sending change password request with:", {
        userId: user?.id,
        oldPassword: "***",
        newPassword: "***",
      });

      const response = await changePassword({
        userId: user?.id,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      console.log("📥 Full change password response:", response);
      console.log("📥 response.success:", response.success);
      console.log("📥 response.message:", response.message);
      console.log("📥 response.data:", response.data);

      if (response.success) {
        setShowChangePassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSuccessMessage("Password changed successfully");
        setShowSuccess(true);
      } else {
        console.error("❌ Change password failed:", response.message);
        alert(response.message || "Failed to change password");
      }
    } catch (err) {
      console.error("❌ Exception changing password:", err);
      console.error("📥 Full error object:", err);
      console.error("📥 Error message:", err.message);
      console.error("📥 Error type:", err.type);
      console.error("📥 Error response:", err.response);
      alert(err.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePersonalInfo = async () => {
    if (!personalInfo.fullName || !personalInfo.fullName.trim()) {
      alert("Full name is required");
      return;
    }

    try {
      setLoading(true);
      console.log("📤 Sending update request with:", {
        fullName: personalInfo.fullName,
      });

      const response = await updateProfile({
        fullName: personalInfo.fullName,
      });

      console.log("📥 Full response object:", response);
      console.log("📥 response.success:", response.success);
      console.log("📥 response.data:", response.data);
      console.log("📥 response.data?.fullName:", response.data?.fullName);

      if (response.success) {
        console.log("✅ Update successful, response.data:", response.data);
        setShowEditContact(false);
        setSuccessMessage("Personal information updated successfully");
        setShowSuccess(true);
        // Update profile data from response
        if (response.data) {
          // Handle both camelCase and lowercase field names from server
          const fullNameValue =
            response.data.fullName || response.data.fullname || "";
          console.log("🔄 Updating profile state with:", response.data);
          setProfileData(response.data);
          setPersonalInfo({
            fullName: fullNameValue,
          });
          // Update user in context - only update fullName
          console.log("🔄 Updating user context with fullName:", fullNameValue);
          updateUser({
            fullName: fullNameValue,
          });
        }
      } else {
        console.error("❌ Update failed:", response.message);
        alert(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "accountant":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "teller":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Canonical roleName derived from profile or auth user
  const roleName = (
    profileData?.roleName ||
    user?.roleName ||
    user?.role ||
    ""
  ).toLowerCase();

  // Show loading state
  if (loading && !profileData) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Profile Header Skeleton */}
        <div className="border border-gray-200 rounded-smlg:rounded-sm overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 bg-linear-to-br from-[#F3E8FF] to-[#E8F6FF]">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-md bg-gray-200" />
              <div className="flex-1 text-center sm:text-left space-y-3">
                <Skeleton className="h-8 w-48 mx-auto sm:mx-0 bg-gray-200" />
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Skeleton className="h-6 w-28 bg-gray-200 rounded-md" />
                  <Skeleton className="h-6 w-20 bg-gray-200 rounded-md" />
                </div>
                <Skeleton className="h-4 w-32 mx-auto sm:mx-0 bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Skeleton */}
        <div className="border border-gray-200 rounded-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 bg-gray-200" />
                <Skeleton className="h-4 w-36 bg-gray-200" />
              </div>
              <Skeleton className="h-10 w-16 bg-gray-200 rounded-xs" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-smbg-gray-50"
              >
                <Skeleton className="w-12 h-12 rounded-xs bg-gray-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-gray-200" />
                  <Skeleton className="h-4 w-48 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings Skeleton */}
        <div className="border border-gray-200 rounded-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 p-4 sm:p-6 space-y-2">
            <Skeleton className="h-6 w-40 bg-gray-200" />
            <Skeleton className="h-4 w-48 bg-gray-200" />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between p-4 rounded-smbg-gray-50">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xs bg-gray-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <Skeleton className="h-3 w-32 bg-gray-200" />
                </div>
              </div>
              <Skeleton className="h-10 w-36 bg-gray-200 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Account Details Skeleton */}
        <div className="border border-gray-200 rounded-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 p-4 sm:p-6">
            <Skeleton className="h-6 w-36 bg-gray-200" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 rounded-smbg-gray-50">
                  <Skeleton className="h-4 w-24 bg-gray-200 mb-2" />
                  <Skeleton className="h-5 w-36 bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show full-page error state if server unavailable
  if (serverError) {
    return (
      <ServiceUnavailableState
        variant="page"
        onRetry={() => {
          setServerError(null);
          setError(null);
          // Retry fetching profile
          const fetchProfile = async () => {
            try {
              setLoading(true);
              const response = await getProfile();
              if (response.success && response.data) {
                setProfileData(response.data);
                setPersonalInfo({
                  fullName: response.data.fullName || "",
                });
              }
            } catch (err) {
              console.error("Failed to fetch profile:", err);
              if (isServerUnavailable(err)) {
                setServerError(err);
              } else {
                setError("Failed to load profile");
              }
            } finally {
              setLoading(false);
            }
          };
          fetchProfile();
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 border-2 border-red-200 rounded-smbg-red-50">
          <p className="text-sm text-red-900">{error}</p>
        </div>
      )}

      {/* Profile Header */}
      <Card className="border border-gray-200 rounded-smlg:rounded-sm overflow-hidden">
        <CardContent className="p-4 sm:p-6 lg:p-8 bg-linear-to-br from-[#F3E8FF] to-[#E8F6FF] relative">
          <StarDecor className="top-4 right-8 sm:right-12" />
          <Sparkles
            className="absolute top-6 right-20 sm:right-32 text-purple-400 opacity-50"
            size={20}
          />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10">
            <div
              className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-md border border-gray-200 border-4 border-white shrink-0 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
              }}
            >
              <UserCircle size={48} className="sm:w-16 sm:h-16 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                {profileData?.fullName || user.fullName}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                <Badge
                  className={`${getRoleBadgeColor(
                    roleName
                  )} border font-medium`}
                >
                  {roleName === "admin"
                    ? "🔑 Administrator"
                    : roleName === "accountant"
                    ? "💼 Accountant"
                    : "💰 Teller"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border border-gray-200 rounded-sm overflow-hidden">
        <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Contact Information</CardTitle>
              <CardDescription>Your personal contact details</CardDescription>
            </div>
            <Button
              onClick={() => setShowEditContact(true)}
              variant="outline"
              className="rounded-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05]"
            >
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xs bg-blue-50 border border-blue-100">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xs border border-gray-100"
                style={{
                  background:
                    "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
                }}
              >
                <Mail size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-900">{profileData?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border border-gray-200 rounded-sm overflow-hidden">
        <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <CardTitle className="text-xl">Security Settings</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xs bg-linear-to-r from-[#FEF3C7] to-[#FDE68A] border border-yellow-200">
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xs border border-gray-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                  }}
                >
                  <Lock size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-600">Changed 30 days ago</p>
                </div>
              </div>
              <Button
                onClick={() => setShowChangePassword(true)}
                className="rounded-smbg-white border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05]"
                variant="outline"
              >
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card className="border border-gray-200 rounded-sm overflow-hidden">
        <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
          <CardTitle className="text-xl">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-xs bg-gray-50 border border-gray-100">
              <p className="mb-1 text-sm font-medium text-gray-600">
                Employee ID
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {profileData?.id || user?.id || "N/A"}
              </p>
            </div>
            <div className="p-4 rounded-xs bg-gray-50 border border-gray-100">
              <p className="mb-1 text-sm font-medium text-gray-600">
                Department
              </p>
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {roleName === "admin"
                  ? "Administration"
                  : roleName === "accountant"
                  ? "Accounting"
                  : "Teller"}
              </p>
            </div>
            <div className="p-4 rounded-xs bg-gray-50 border border-gray-100">
              <p className="mb-1 text-sm font-medium text-gray-600">Branch</p>
              <p className="text-sm font-semibold text-gray-900">
                {profileData?.branchName || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="rounded-sm">
          <DialogHeader>
            <div className="flex flex-col items-center gap-3 mb-2 text-center">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center border border-gray-200"
                style={{
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                }}
              >
                <Lock size={24} className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Change Password</DialogTitle>
                <DialogDescription>
                  Update your account password
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-gray-700">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                  className="h-11 rounded-sm border-gray-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />  
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-700">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                  className="h-11 rounded-sm border-gray-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Must be at least 6 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  className="h-11 rounded-sm border-gray-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleChangePassword}
              disabled={loading}
              className="flex-1 h-12 text-white rounded-smborder border-gray-200 font-medium"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
              }}
            >
              {loading ? "Changing..." : "Change Password"}
            </Button>
            <Button
              onClick={() => {
                setShowChangePassword(false);
                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              variant="outline"
              className="flex-1 h-12 rounded-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05]"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Personal Information Dialog */}
      <Dialog open={showEditContact} onOpenChange={setShowEditContact}>
        <DialogContent className="rounded-sm">
          <DialogHeader>
            <div className="flex flex-col items-center gap-3 mb-2 text-center">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center border border-gray-200"
                style={{
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                }}
              >
                <UserCircle size={24} className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  Edit Personal Information
                </DialogTitle>
                <DialogDescription>
                  Update your personal details
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
                type="text"
                value={personalInfo.fullName}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    fullName: e.target.value,
                  })
                }
                placeholder="Enter your full name"
                className="h-11 rounded-smborder-gray-200"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleUpdatePersonalInfo}
              disabled={loading}
              className="flex-1 h-12 text-white rounded-smborder border-gray-200 font-medium"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
              }}
            >
              {loading ? "Updating..." : "Update Information"}
            </Button>
            <Button
              onClick={() => setShowEditContact(false)}
              variant="outline"
              className="flex-1 h-12 rounded-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 hover:scale-[1.05]"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="rounded-sm">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div
                className="w-20 h-20 rounded-md flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                }}
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
            className="w-full h-12 text-white rounded-smborder border-gray-200 font-medium"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
