import { supabase } from "../../config/database.js";
import { comparePassword } from "../../middleware/comparePass.middleware.js";
import { hashPassword } from "../../middleware/hashing.middleware.js";

export async function changePassword(req, res) {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // 1. Validation
    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({
        message: "User ID, old password and new password are required",
        success: false,
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
        success: false,
      });
    }

    // 2. Get user account with current password
    const { data: userAccount, error: userError } = await supabase
      .from("useraccount")
      .select("userid, password")
      .eq("userid", userId)
      .maybeSingle();

    if (userError || !userAccount) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // 3. Verify old password
    const isPasswordValid = await comparePassword(
      oldPassword,
      userAccount.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Old password is incorrect",
        success: false,
      });
    }

    // 4. Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // 5. Update password in database
    const { error: updateError } = await supabase
      .from("useraccount")
      .update({ password: hashedPassword })
      .eq("userid", userId);

    if (updateError) {
      console.error("Error updating password:", updateError);
      return res.status(500).json({
        message: "Failed to update password",
        success: false,
      });
    }

    // 6. Success response
    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({
      message: "Failed to change password",
      success: false,
    });
  }
}
