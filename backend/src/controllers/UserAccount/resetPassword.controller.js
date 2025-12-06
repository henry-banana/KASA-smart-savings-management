import { supabase } from "../../config/database.js";
import { verifyOTP, deleteOTP } from "../../utils/otpStore.js";
import { hashPassword } from "../../middleware/hashing.middleware.js";

/**
 * POST /api/auth/reset-password
 * Step 3: Reset password with verified OTP
 */
export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    // 1. Validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
        success: false,
      });
    }

    if (!email.trim() || !otp.trim() || !newPassword.trim()) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
        success: false,
      });
    }

    // 2. Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false,
      });
    }

    // 3. Verify OTP again (final check)
    const otpResult = verifyOTP(email, otp);

    if (!otpResult.valid) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
        success: false,
      });
    }

    const userId = otpResult.userId;

    // 4. Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // 5. Update password in database
    const { data, error } = await supabase
      .from("useraccount")
      .update({ password: hashedPassword })
      .eq("userid", userId)
      .select()
      .single();

    if (error || !data) {
      console.error("Failed to update password:", error);
      return res.status(500).json({
        message: "Failed to reset password",
        success: false,
      });
    }

    // 6. Delete OTP after successful reset
    deleteOTP(email);

    // 7. Success response
    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      message: "Failed to reset password",
      success: false,
    });
  }
}
