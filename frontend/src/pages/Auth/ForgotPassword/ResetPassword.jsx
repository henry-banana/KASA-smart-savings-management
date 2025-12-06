import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Sparkles,
  Star,
  Heart,
  Loader2,
} from "lucide-react";
import { authService } from "../../../services/authService";
import { logger } from "../../../utils/logger";

// UI Component
function ResetPassword({ email, otp, onSuccess, onBack, onBackToLogin }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
    { label: "Contains uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
    { label: "Contains lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
    { label: "Contains number", test: (pwd) => /\d/.test(pwd) },
  ];

  const validatePassword = () => {
    const validationErrors = [];

    if (!newPassword) {
      validationErrors.push("Please enter a new password");
    }

    if (!confirmPassword) {
      validationErrors.push("Please confirm your password");
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      validationErrors.push("Passwords do not match");
    }

    const failedRequirements = passwordRequirements.filter(
      (req) => !req.test(newPassword)
    );
    if (failedRequirements.length > 0) {
      validationErrors.push("Password does not meet all requirements");
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validatePassword();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const response = await authService.resetPassword({
        email,
        otp,
        newPassword,
      });
      logger.info("Password reset successful", response);

      // Success notification (using alert for now, will be replaced with toast)
      setTimeout(() => {
        alert(
          "✓ Password Changed\n\nYour password has been successfully reset!"
        );
        onSuccess();
      }, 100);
    } catch (err) {
      logger.error("Password reset failed", err);
      setErrors([err.message || "Failed to reset password. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword &&
      passwordRequirements.every((req) => req.test(newPassword))
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 50%, #FFF7D6 100%)",
      }}
    >
      {/* 🎨 Cute Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Sparkles
          className="absolute top-20 left-20 text-yellow-300 opacity-40"
          size={40}
        />
        <Star
          className="absolute top-40 right-32 text-pink-300 opacity-30"
          size={32}
          fill="currentColor"
        />
        <Heart
          className="absolute bottom-32 left-40 text-red-200 opacity-25"
          size={28}
          fill="currentColor"
        />
        <Sparkles
          className="absolute bottom-40 right-20 text-cyan-300 opacity-40"
          size={36}
        />

        {/* Floating circles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-200 rounded-lg opacity-10 blur-2xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-purple-200 rounded-lg opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Card className="w-full max-w-md border border-gray-200 relative z-10 rounded-md overflow-hidden">
        {/* Gradient Top Bar */}
        <div className="h-2 bg-linear-to-r from-[#6366F1] via-[#8B5CF6] to-[#6366F1]" />

        <CardHeader className="space-y-4 text-center pt-8 pb-6 relative">
          {/* Icon with cute design */}
          <div className="mx-auto relative">
            <div
              className="w-20 h-20 rounded-md flex items-center justify-center border border-gray-200 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              }}
            >
              <Lock className="text-white" size={36} />
              <Sparkles
                className="absolute -top-1 -right-1 text-yellow-300 opacity-80"
                size={20}
              />
              <Star
                className="absolute -bottom-1 -left-1 text-purple-300 opacity-60"
                size={16}
                fill="currentColor"
              />
            </div>

            {/* Decorative elements around icon */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-purple-200 opacity-60 animate-pulse" />
            <div
              className="absolute -bottom-2 -left-2 w-4 h-4 rounded-lg bg-indigo-200 opacity-60 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          <div>
            <CardTitle className="text-2xl mb-2">Reset Password 🔑</CardTitle>
            <CardDescription className="text-base">
              Choose a strong password for your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-700">
                New Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrors([]);
                  }}
                  className="pl-10 pr-10 h-12 rounded-xs border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors([]);
                  }}
                  className="pl-10 pr-10 h-12 rounded-xs border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-md p-4 border border-indigo-100 space-y-2">
              <p className="text-xs font-semibold text-indigo-700 mb-2">
                Password Requirements:
              </p>
              {passwordRequirements.map((req, index) => {
                const valid = req.test(newPassword);
                return (
                  <div key={index} className="flex items-center gap-2">
                    {valid ? (
                      <CheckCircle2
                        size={14}
                        className="text-green-500 shrink-0"
                      />
                    ) : (
                      <XCircle size={14} className="text-gray-300 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        valid ? "text-green-700 font-medium" : "text-gray-600"
                      }`}
                    >
                      {req.label}
                    </span>
                  </div>
                );
              })}
              {confirmPassword && (
                <div className="flex items-center gap-2 pt-2 border-t border-indigo-200 mt-3">
                  {newPassword === confirmPassword ? (
                    <>
                      <CheckCircle2
                        size={14}
                        className="text-green-500 shrink-0"
                      />
                      <span className="text-xs text-green-700 font-medium">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle size={14} className="text-red-400 shrink-0" />
                      <span className="text-xs text-red-600">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xs p-3 space-y-1">
                {errors.map((err, index) => (
                  <p
                    key={index}
                    className="text-sm text-red-600 flex items-start gap-2"
                  >
                    <XCircle size={16} className="shrink-0 mt-0.5" />
                    {err}
                  </p>
                ))}
              </div>
            )}

            <Button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`
                w-full h-12 text-white rounded-lg font-medium border border-gray-200 transition-all duration-300
                ${
                  isFormValid() && !loading
                    ? "hover:border border-gray-200 hover:scale-[1.02]"
                    : "opacity-50 cursor-not-allowed"
                }
              `}
              style={{
                background:
                  isFormValid() && !loading
                    ? "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                    : "linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Saving...
                </>
              ) : (
                "Save Password 💾"
              )}
            </Button>
          </form>

          {/* Back to Login - for users who remember password */}
          <div className="w-full text-center">
            <button
              onClick={onBackToLogin || onBack}
              className="inline-block text-sm text-gray-600 hover:text-indigo-600 transition-colors underline cursor-pointer"
            >
              I remember my password - Back to Login
            </button>
          </div>

          {/* Security Tip */}
          <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-md p-4 border border-purple-100">
            <p className="text-xs text-purple-700 text-center">
              🛡️ <strong>Security Tip:</strong> Use a unique password that you
              don't use anywhere else.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-[#6366F1] via-[#8B5CF6] to-[#6366F1] opacity-50" />
    </div>
  );
}

// Route wrapper with navigation and state guard
export function ResetPasswordRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  // Guard direct access
  if (!email || !otp) return <Navigate to="/forgot-password" replace />;

  return (
    <ResetPassword
      email={email}
      otp={otp}
      onSuccess={() => navigate("/login")}
      onBack={() => navigate("/forgot-password/otp", { state: { email } })}
      onBackToLogin={() => navigate("/login")}
    />
  );
}

export default ResetPassword;
