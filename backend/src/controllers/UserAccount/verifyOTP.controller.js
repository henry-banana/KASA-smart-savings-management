import { verifyOTP } from "../../utils/otpStore.js";

/**
 * POST /api/auth/verify-otp
 * Step 2: Verify OTP code
 */
export async function verifyOTPController(req, res) {
  try {
    const { email, otp } = req.body;

    // 1. Validation
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    if (!email.trim() || !otp.trim()) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    // 2. Verify OTP
    const result = verifyOTP(email, otp);

    if (!result.valid) {
      const message =
        result.error === "OTP expired" ? "OTP expired" : "Invalid OTP";

      return res.status(400).json({
        message,
        success: false,
      });
    }

    // 3. Success response (don't delete OTP yet - need it for reset)
    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    return res.status(500).json({
      message: "Failed to verify OTP",
      success: false,
    });
  }
}
