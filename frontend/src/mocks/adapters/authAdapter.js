import {
  findUserByCredentials,
  findUserByUsername,
  updateUserPassword,
  mockUserAccounts,
} from "../data/users";
import { setCurrentUser } from "../data/profile";
import { randomDelay } from "../utils";
import { logger } from "@/utils/logger";

export const mockAuthAdapter = {
  async login(credentials) {
    await randomDelay();
    logger.info("🎭 Mock Login", { username: credentials.username });

    const { username, password } = credentials;
    const user = findUserByCredentials(username, password);

    if (!user) {
      // Align with OpenAPI: English error messages
      throw new Error("Incorrect username or password");
    }

    if (
      user.status?.toLowerCase() === "rejected" ||
      user.status?.toLowerCase() === "unsubmitted"
    ) {
      throw new Error("Account disabled. Contact administrator.");
    }

    // Ensure profile is synced with mockUserAccounts
    // Sync the profile data when user logs in
    setCurrentUser(user);

    return {
      message: "Login successfully",
      success: true,
      data: {
        userId: user.userid, // canonical field name per OpenAPI
        username: username, // reflect the real login identifier
        roleName: user.role,
        fullName: user.fullName,
        status: user.status,
        token: `mock_token_${user.userid}_${Date.now()}`,
      },
    };
  },

  async logout() {
    await randomDelay();
    return { message: "Logout successful", success: true };
  },

  /**
   * Mock: Request password reset
   */
  async requestPasswordReset(emailOrUsername) {
    await randomDelay();
    logger.info("🎭 Mock Request Password Reset", { emailOrUsername });

    if (!emailOrUsername || !String(emailOrUsername).trim()) {
      throw new Error("Email or username is required");
    }

    // Find by username or email
    const user = String(emailOrUsername).includes("@")
      ? mockUserAccounts.find((u) => u.email === emailOrUsername)
      : findUserByUsername(emailOrUsername);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      message: "OTP sent to your email",
      success: true,
      data: { email: user.email },
    };
  },

  /**
   * Mock: Verify OTP (accepts 123456 as valid)
   */
  async verifyOtp({ email, otp }) {
    await randomDelay();
    logger.info("🎭 Mock Verify OTP", { email, otp });

    if (!email || !String(email).trim() || !otp || !String(otp).trim()) {
      throw new Error("Email and OTP are required");
    }
    if (otp !== "123456") {
      throw new Error("Invalid OTP");
    }

    return {
      message: "OTP verified successfully",
      success: true,
    };
  },

  /**
   * Mock: Reset password
   */
  async resetPassword({ email, otp, newPassword }) {
    await randomDelay();
    logger.info("🎭 Mock Reset Password", { email, otp });

    if (
      !email ||
      !String(email).trim() ||
      !otp ||
      !String(otp).trim() ||
      !newPassword ||
      !String(newPassword).trim()
    ) {
      throw new Error("Email, OTP and new password are required");
    }
    if (otp !== "123456") {
      throw new Error("Invalid or expired OTP");
    }
    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Find user by email and update password
    const user =
      mockUserAccounts.find((u) => u.email === email) ||
      findUserByUsername(email.split("@")[0]);
    if (user) {
      updateUserPassword(user.userid, newPassword);
      logger.info("🎭 Password updated for user:", user.userid);
    }

    return {
      message: "Password reset successfully",
      success: true,
      data: { email },
    };
  },
};
