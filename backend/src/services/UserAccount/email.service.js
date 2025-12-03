import nodemailer from "nodemailer";

export async function sendOTPEmail(email, otp, fullName = "User") {
  // Tạo transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Nội dung email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Password Reset OTP - KASA",
    html: `
      <h2>Password Reset Request</h2>
      <p>Hi ${fullName},</p>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>KASA Team</p>
    `,
  };

  // Gửi email
  await transporter.sendMail(mailOptions);

  return { success: true };
}