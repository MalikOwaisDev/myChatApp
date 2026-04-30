const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, CLIENT_URL } = require('../config/env');

const createTransporter = () =>
  nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

const sendPasswordResetEmail = async (toEmail, rawToken) => {
  const resetUrl = `${CLIENT_URL}/reset-password?token=${rawToken}`;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Chat App" <${EMAIL_FROM}>`,
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #111827;">Reset Your Password</h2>
        <p style="color: #374151;">You requested a password reset. Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
          Reset Password
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px;">If you did not request this, please ignore this email. Your account is safe.</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail };
