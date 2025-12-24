import "./Login.css";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Lock,
  User,
  Sparkles,
  Star,
  Heart,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useConfig } from "@/contexts/ConfigContext";
import { useAuth } from "@/hooks/useAuth";
import { logger } from "@/utils/logger";
import { mapAuthErrorToMessage } from "@/utils/authErrorMapper";

// Spinner thuần CSS/Tailwind (giữ size động)
function Spinner({ size = 16, light = true }) {
  const borderColor = light ? "border-white" : "border-gray-400";
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 ${borderColor} border-t-transparent align-middle`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

// Validation utility functions
function validateEmail(email) {
  if (!email || !email.trim()) {
    return "Email is required";
  }

  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Invalid email format";
  }

  return null; // No error
}

function validatePassword(password) {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null; // No error
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);

  // ✅ Use new hooks
  const { devMode } = useConfig();
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setLoginError(null);
    setUsernameError("");
    setPasswordError("");

    // Validate username (email)
    const usernameValidationError = validateEmail(username);
    if (usernameValidationError) {
      setUsernameError(usernameValidationError);
      return;
    }

    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    setLoading(true);

    try {
      // ✅ Use new authService through context (trim email before submit)
      const userData = await authLogin({
        username: username.trim(),
        password,
      });

      // userData.role đã là: 'admin' | 'teller' | 'accountant'
      if (userData?.role === "admin") {
        navigate("/regulations");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      logger.error("Login failed", err);

      // Map error to user-friendly message
      const mappedError = mapAuthErrorToMessage(err);
      setLoginError(mappedError);

      // Focus password field for user convenience
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);

      // Keep username field for user to retry
      // Password is kept too - user can clear if they want
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (role) => {
    const roleCredentials = {
      teller: { username: "teller1", password: "123456" },
      accountant: { username: "accountant1", password: "123456" },
      admin: { username: "admin1", password: "admin123" },
    };

    const creds = roleCredentials[role];
    setLoading(true);
    setLoginError(null);

    try {
      const userData = await authLogin(creds);

      if (userData?.role === "admin") {
        navigate("/regulations");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Quick role login error:", err);
      const mappedError = mapAuthErrorToMessage(err);
      setLoginError(mappedError);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 50%, #FFF7D6 100%)",
      }}
    >
      {/* 🎨 Cute Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles
          className="absolute text-yellow-300 top-20 left-20 opacity-40"
          size={40}
        />
        <Star
          className="absolute text-pink-300 top-40 right-32 opacity-30"
          size={32}
          fill="currentColor"
        />
        <Heart
          className="absolute text-red-200 opacity-25 bottom-32 left-40"
          size={28}
          fill="currentColor"
        />
        <Sparkles
          className="absolute bottom-40 right-20 text-cyan-300 opacity-40"
          size={36}
        />

        {/* Floating circles */}
        <div className="absolute w-32 h-32 bg-blue-200 rounded-md top-1/4 left-1/4 opacity-10 blur-2xl animate-pulse" />
        <div
          className="absolute w-40 h-40 bg-pink-200 rounded-md bottom-1/3 right-1/3 opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Card className="relative z-10 w-full max-w-md overflow-hidden border border-gray-200 rounded-sm">
        {/* Gradient Top Bar */}
        <div className="h-2 bg-linear-to-r from-[#1A4D8F] via-[#00AEEF] to-[#1A4D8F]" />

        <CardHeader className="relative pt-8 pb-6 space-y-4 text-center">
          {/* Logo with cute design */}
          <div className="relative mx-auto">
            <div
              className="relative flex items-center justify-center w-20 h-20 overflow-hidden border border-gray-200 rounded-sm"
              style={{
                background: "linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)",
              }}
            >
              <span className="text-3xl font-bold text-white">K</span>
              <Sparkles
                className="absolute text-yellow-300 -top-1 -right-1 opacity-80"
                size={20}
              />
              <Star
                className="absolute text-pink-300 -bottom-1 -left-1 opacity-60"
                size={16}
                fill="currentColor"
              />
            </div>

            {/* Decorative elements around logo */}
            <div className="absolute w-6 h-6 bg-pink-200 rounded-md -top-2 -right-2 opacity-60 animate-pulse" />
            <div
              className="absolute w-4 h-4 rounded-md -bottom-2 -left-2 bg-cyan-200 opacity-60 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          <div>
            <CardTitle
              className="mb-2 text-3xl"
              style={{
                background: "linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              KASA
            </CardTitle>
            <CardDescription className="text-base">
              Savings Management System
            </CardDescription>
            <h3 className="pt-3 font-medium text-gray-700">
              Log in to KASA ✨
            </h3>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 space-y-6">
          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            aria-busy={loading}
          >
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">
                Username
              </Label>
              <div className="relative">
                <User
                  className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                  size={18}
                />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    // Clear errors when user starts typing
                    if (usernameError) setUsernameError("");
                    if (loginError) setLoginError(null);
                  }}
                  disabled={loading}
                  className={`pl-10 h-12 rounded-xs border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all ${
                    usernameError
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                      : ""
                  }`}
                />
              </div>
              {usernameError && (
                <p className="flex items-center gap-1 text-xs text-red-600 sm:text-sm">
                  <span className="text-xs">⚠️</span> {usernameError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                  size={18}
                />
                <Input
                  ref={passwordInputRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // Clear errors when user starts typing
                    if (passwordError) setPasswordError("");
                    if (loginError) setLoginError(null);
                  }}
                  disabled={loading}
                  className={`pl-10 pr-10 h-12 rounded-xs border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all ${
                    passwordError
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-500 cursor-pointer rounded-r-md hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPassword ? "Show password" : "Hide password"}
                  tabIndex={-1}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="flex items-center gap-1 text-xs text-red-600 sm:text-sm">
                  <span className="text-xs">⚠️</span> {passwordError}
                </p>
              )}
            </div>

            {loginError && (
              <div
                className={`p-3 rounded-sm border-l-4 flex items-start gap-3 animate-in slide-in-from-top-2 ${
                  loginError.isWarning
                    ? "border-amber-400 bg-amber-50"
                    : loginError.isSessionExpired
                    ? "border-orange-400 bg-orange-50"
                    : "border-red-400 bg-red-50"
                }`}
              >
                <AlertCircle
                  className={`flex-shrink-0 mt-0.5 ${
                    loginError.isWarning
                      ? "text-amber-600"
                      : loginError.isSessionExpired
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                  size={18}
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-sm mb-1 ${
                      loginError.isWarning
                        ? "text-amber-800"
                        : loginError.isSessionExpired
                        ? "text-orange-800"
                        : "text-red-800"
                    }`}
                  >
                    {loginError.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      loginError.isWarning
                        ? "text-amber-700"
                        : loginError.isSessionExpired
                        ? "text-orange-700"
                        : "text-red-700"
                    }`}
                  >
                    {loginError.message}
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-white rounded-xs font-medium border border-gray-200 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)",
              }}
            >
              {loading && <Spinner size={16} light />}
              {loading ? "Logging in..." : "Log In"}
            </Button>

            <div className="w-full text-center">
              <button
                type="button"
                disabled={loading}
                className="inline-block text-sm text-gray-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:text-[#00AEEF]"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>
          </form>

          {/* DEV MODE SECTION - Only show when DEV_MODE is true */}
          {/* DEV MODE SECTION - Only show when devMode is true */}
          {devMode && (
            <>
              {/* Cute Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-3 font-medium text-gray-500 bg-white rounded-md">
                    or select a role (dev mode) ⚙️
                  </span>
                </div>
              </div>

              {/* Cute Role Selection Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleRoleSelect("teller")}
                  disabled={loading}
                  className="group relative overflow-hidden rounded-sm p-4 border-2 border-transparent hover:border-[#1A4D8F] transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 100%)",
                  }}
                >
                  <div className="text-center">
                    <div className="mb-1 text-2xl">🏦</div>
                    <p className="text-xs font-semibold text-[#1A4D8F]">
                      Teller
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect("accountant")}
                  disabled={loading}
                  className="group relative overflow-hidden rounded-sm p-4 border-2 border-transparent hover:border-[#00AEEF] transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, #DFF9F4 0%, #FFF7D6 100%)",
                  }}
                >
                  <div className="text-center">
                    <div className="mb-1 text-2xl">📊</div>
                    <p className="text-xs font-semibold text-[#00AEEF]">
                      Accountant
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect("admin")}
                  disabled={loading}
                  className="group relative overflow-hidden rounded-sm p-4 border-2 border-transparent hover:border-[#BE185D] transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFE8F0 0%, #F3E8FF 100%)",
                  }}
                >
                  <div className="text-center">
                    <div className="mb-1 text-2xl">👑</div>
                    <p className="text-xs font-semibold text-[#BE185D]">
                      Admin
                    </p>
                  </div>
                </button>
              </div>

              {/* Dev Mode Indicator */}
              <div className="pt-2 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-purple-100 rounded-md bg-linear-to-r from-purple-50 to-pink-50">
                  <Sparkles size={14} className="text-purple-400" />
                  <p className="text-xs font-medium text-purple-600">
                    Dev Mode — Role buttons for testing
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>

        {/* Overlay khi loading */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-sm bg-white/20 backdrop-blur-[1px] animate-fade-in">
            <span className="spinner inline-block animate-spin rounded-full border-4 border-[#1A4D8F] border-t-transparent" />
            <p className="mt-3 text-[#1A4D8F] font-medium text-sm animate-wave">
              Loading...
            </p>
          </div>
        )}
      </Card>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-[#1A4D8F] via-[#00AEEF] to-[#1A4D8F] opacity-50" />
    </div>
  );
}
