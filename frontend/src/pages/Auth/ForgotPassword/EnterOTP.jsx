import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Shield,
  ArrowLeft,
  Sparkles,
  Star,
  Heart,
  Loader2,
} from "lucide-react";
import { authService } from "../../../services/authService";
import { logger } from "../../../utils/logger";
import { useConfig } from "@/contexts/ConfigContext";

// UI Component
function EnterOTP({ email, onVerify, onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const { devMode } = useConfig();

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData
      .split("")
      .concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp);

    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.verifyOtp({ email, otp: otpString });
      logger.info("OTP verified", response);
      onVerify(otpString);
    } catch (err) {
      logger.error("OTP verification failed", err);
      setError(err.message || "Invalid OTP code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
    // Show toast notification
    alert("New OTP code has been sent to your email!");
  };

  const isComplete = otp.every((digit) => digit !== "");

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
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-200 rounded-full opacity-10 blur-2xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-cyan-200 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Card className="w-full max-w-md border border-gray-200 relative z-10 rounded-3xl overflow-hidden">
        {/* Gradient Top Bar */}
        <div className="h-2 bg-linear-to-r from-[#10B981] via-[#00AEEF] to-[#10B981]" />

        <CardHeader className="space-y-4 text-center pt-8 pb-6 relative">
          {/* Icon with cute design */}
          <div className="mx-auto relative">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center border border-gray-200 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #00AEEF 100%)",
              }}
            >
              <Shield className="text-white" size={36} />
              <Sparkles
                className="absolute -top-1 -right-1 text-yellow-300 opacity-80"
                size={20}
              />
              <Star
                className="absolute -bottom-1 -left-1 text-cyan-300 opacity-60"
                size={16}
                fill="currentColor"
              />
            </div>

            {/* Decorative elements around icon */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-200 opacity-60 animate-pulse" />
            <div
              className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-green-200 opacity-60 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          <div>
            <CardTitle className="text-2xl mb-2">Enter OTP Code 🔐</CardTitle>
            <CardDescription className="text-base">
              We've sent a 6-digit code to
            </CardDescription>
            <p className="text-sm font-semibold text-[#00AEEF] mt-1">{email}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Boxes */}
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`
                    w-12 h-14 text-center text-xl font-bold rounded-xl border-2 
                    transition-all duration-200 outline-none
                    ${
                      digit
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-gray-200 bg-white text-gray-900"
                    }
                    focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20
                    ${error && "border-red-400 bg-red-50"}
                  `}
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 animate-shake">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!isComplete || loading}
              className={`
                w-full h-12 text-white rounded-full font-medium border border-gray-200 transition-all duration-300
                ${
                  isComplete && !loading
                    ? "hover:border border-gray-200 hover:scale-[1.02]"
                    : "opacity-50 cursor-not-allowed"
                }
              `}
              style={{
                background:
                  isComplete && !loading
                    ? "linear-gradient(135deg, #10B981 0%, #00AEEF 100%)"
                    : "linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Verifying...
                </>
              ) : (
                "Accept ✓"
              )}
            </Button>
          </form>

          {/* Resend Code */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              className="text-sm font-medium text-[#00AEEF] hover:text-[#1A4D8F] transition-colors underline cursor-pointer"
            >
              Resend OTP Code
            </button>
          </div>

          {/* Back Button */}
          <div className="w-full text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#00AEEF] transition-colors group cursor-pointer"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back
            </button>
          </div>

          {/* Dev Mode Info - Only show when devMode is true */}
          {devMode && (
            <div className="bg-linear-to-r from-green-50 to-cyan-50 rounded-2xl p-4 border border-green-100">
              <p className="text-xs text-green-700 text-center">
                🔧 <strong>Dev Mode:</strong> Use code{" "}
                <span className="font-mono bg-white px-2 py-0.5 rounded">
                  123456
                </span>{" "}
                for testing
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-[#10B981] via-[#00AEEF] to-[#10B981] opacity-50" />

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Route wrapper with navigation and state guard
export function EnterOTPRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) return <Navigate to="/forgot-password" replace />;

  return (
    <EnterOTP
      email={email}
      onVerify={(otp) =>
        navigate("/forgot-password/reset", { state: { email, otp } })
      }
      onBack={() => navigate("/forgot-password")}
    />
  );
}

export default EnterOTP;
