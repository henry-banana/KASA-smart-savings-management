import { supabase } from "../../config/database.js";
import { saveOTP } from "../../utils/otpStore.js";
import { sendOTPEmail } from "../../services/UserAccount/email.service.js";

/**
 * POST /api/auth/forgot-password
 * Step 1: Request password reset - Send OTP to email
 */
export async function forgotPassword(req, res) {
  try {
    const { emailOrUsername } = req.body;

    // 1. Validation
    if (!emailOrUsername || !emailOrUsername.trim()) {
      return res.status(400).json({
        message: "Email or username is required",
        success: false,
      });
    }

    // 2. Find user by username or email
    // Check if input is email (contains @) or username
    const isEmail = emailOrUsername.includes("@");

    if (isEmail) {
      // 1. Tìm employee theo email
      const { data: employee, error: empError } = await supabase
        .from("employee")
        .select("employeeid, email, fullname")
        .eq("email", emailOrUsername)
        .maybeSingle();

      if (empError || !employee) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }

      // 2. Tìm useraccount theo employeeid
      const { data: userAccount, error: accError } = await supabase
        .from("useraccount")
        .select("userid")
        .eq("userid", employee.employeeid)
        .maybeSingle();

      if (accError || !userAccount) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }

      // 3. Success
      const email = employee.email;
      const fullName = employee.fullname || "User";
      const userId = userAccount.userid;

      if (!email) {
        return res.status(400).json({
          message: "No email associated with this account",
          success: false,
        });
      }

      // 4. Generate and save OTP (5 minutes expiration)
      const otp = saveOTP(email, userId, 5);

      // 5. Send OTP via email
      await sendOTPEmail(email, otp, fullName);

      // 6. Success response
      return res.status(200).json({
        message: "OTP sent to your email",
        success: true,
        data: {
          email: email,
        },
      });
    } else {
      // Search by userid (username)
      const { data: userData, error } = await supabase
        .from("useraccount")
        .select(`
          userid,
          employee:employee (
            email,
            fullname
          )
        `)
        .eq("userid", emailOrUsername)
        .maybeSingle();

      console.log("userData:", userData, "error:", error);

      if (error || !userData || !userData.employee) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }

      const email = userData.employee.email;
      const fullName = userData.employee.fullname || "User";
      const userId = userData.userid;

      if (!email) {
        return res.status(400).json({
          message: "No email associated with this account",
          success: false,
        });
      }

      // 3. Generate and save OTP (5 minutes expiration)
      const otp = saveOTP(email, userId, 5);

      // 4. Send OTP via email
      await sendOTPEmail(email, otp, fullName);

      // 5. Success response
      return res.status(200).json({
        message: "OTP sent to your email",
        success: true,
        data: {
          email: email,
        },
      });
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({
      message: "Failed to process password reset request",
      success: false,
    });
  }
}
