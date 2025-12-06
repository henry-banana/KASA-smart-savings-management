import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Mail, ArrowLeft, Sparkles, Star, Heart, Loader2 } from "lucide-react";
import { authService } from "../../../services/authService";
import { logger } from "../../../utils/logger";

// UI Component
function ForgotPassword({ onContinue, onBack }) {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await authService.requestPasswordReset(emailOrUsername);
      logger.info("Password reset requested", response);

      // Pass the email from response or original input
      const email = response.email || emailOrUsername;
      onContinue(email);
    } catch (err) {
      logger.error("Password reset request failed", err);
      setError(err.message || "Unable to send password reset request");
    } finally {
      setLoading(false);
    }
  };

  const isValid = emailOrUsername.trim().length > 0;

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
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-md opacity-10 blur-2xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-pink-200 rounded-md opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Card className="w-full max-w-md border border-gray-200 relative z-10 rounded-sm overflow-hidden">
        {/* Gradient Top Bar */}
        <div className="h-2 bg-linear-to-r from-[#1A4D8F] via-[#00AEEF] to-[#1A4D8F]" />

        <CardHeader className="space-y-4 text-center pt-8 pb-6 relative">
          {/* Icon with cute design */}
          <div className="mx-auto relative">
            <div
              className="w-20 h-20 rounded-sm flex items-center justify-center border border-gray-200 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
              }}
            >
              <Mail className="text-white" size={36} />
              <Sparkles
                className="absolute -top-1 -right-1 text-yellow-300 opacity-80"
                size={20}
              />
              <Star
                className="absolute -bottom-1 -left-1 text-pink-300 opacity-60"
                size={16}
                fill="currentColor"
              />
            </div>

            {/* Decorative elements around icon */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-md bg-pink-200 opacity-60 animate-pulse" />
            <div
              className="absolute -bottom-2 -left-2 w-4 h-4 rounded-md bg-purple-200 opacity-60 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          <div>
            <CardTitle className="text-2xl mb-2">Forgot Password? 🔒</CardTitle>
            <CardDescription className="text-base">
              No worries! Enter your email or username and we'll send you a
              reset link.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername" className="text-gray-700">
                Email or Username
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="emailOrUsername"
                  type="text"
                  placeholder="Enter your email or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="pl-10 h-12 rounded-xs border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xs border border-red-200 flex items-center gap-2">
                <span className="font-medium">⚠️</span>
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={!isValid || loading}
              className={`
                w-full h-12 text-white rounded-md font-medium border border-gray-200 transition-all duration-300
                ${
                  isValid && !loading
                    ? "hover:border border-gray-200 hover:scale-[1.02]"
                    : "opacity-50 cursor-not-allowed"
                }
              `}
              style={{
                background:
                  isValid && !loading
                    ? "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
                    : "linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Processing...
                </>
              ) : (
                "Send Reset Link ✨"
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="w-full text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors group cursor-pointer"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Login
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-sm p-4 border border-purple-100">
            <p className="text-xs text-purple-700 text-center">
              💡 <strong>Tip:</strong> Check your spam folder if you don't
              receive the email within a few minutes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-[#8B5CF6] via-[#EC4899] to-[#8B5CF6] opacity-50" />
    </div>
  );
}

// Route wrapper with navigation logic
export function ForgotPasswordRoute() {
  const navigate = useNavigate();
  return (
    <ForgotPassword
      onContinue={(email) =>
        navigate("/forgot-password/otp", { state: { email } })
      }
      onBack={() => navigate("/login")}
    />
  );
}

export default ForgotPassword;
