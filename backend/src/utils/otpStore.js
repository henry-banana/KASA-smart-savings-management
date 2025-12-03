/**
 * In-memory OTP storage
 * Structure: { email: { otp: '123456', expiresAt: timestamp, userId: 'user1' } }
 */
const otpStore = new Map();

/**
 * Generate 6-digit OTP
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Save OTP with expiration (default 5 minutes)
 */
export function saveOTP(email, userId, expirationMinutes = 5) {
  const otp = generateOTP();
  const expiresAt = Date.now() + expirationMinutes * 60 * 1000;

  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt,
    userId,
    createdAt: Date.now(),
  });

  console.log(
    `OTP saved for ${email}: ${otp} (expires in ${expirationMinutes}min)`
  );
  return otp;
}

/**
 * Verify OTP
 */
export function verifyOTP(email, otp) {
  const record = otpStore.get(email.toLowerCase());

  if (!record) {
    return { valid: false, error: "OTP not found" };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, error: "OTP expired" };
  }

  if (record.otp !== otp) {
    return { valid: false, error: "Invalid OTP" };
  }

  return { valid: true, userId: record.userId };
}

/**
 * Delete OTP after successful verification
 */
export function deleteOTP(email) {
  otpStore.delete(email.toLowerCase());
}

/**
 * Clean expired OTPs (call periodically)
 */
export function cleanExpiredOTPs() {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(email);
      console.log(`🗑️ Cleaned expired OTP for ${email}`);
    }
  }
}

// Clean expired OTPs every 10 minutes
setInterval(cleanExpiredOTPs, 10 * 60 * 1000);
