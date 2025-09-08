import prisma from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sending function with Resend
async function sendPasswordResetEmail(email, resetLink) {
  // Check if Resend API key is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey || resendApiKey === 'YOUR_RESEND_API_KEY_HERE') {
    // Fallback to console logging if no API key
    console.log("\n===========================================");
    console.log("PASSWORD RESET EMAIL (Development Mode)");
    console.log("===========================================");
    console.log(`To: ${email}`);
    console.log(`Subject: Reset your Houseiana password`);
    console.log(`Reset Link: ${resetLink}`);
    console.log("===========================================");
    console.log("\n⚠️  To send real emails:");
    console.log("1. Sign up at https://resend.com");
    console.log("2. Get your API key from dashboard");
    console.log("3. Add to .env: RESEND_API_KEY='re_YOUR_API_KEY'");
    console.log("4. Add to .env: RESEND_FROM_EMAIL='noreply@yourdomain.com'");
    console.log("   (or use 'onboarding@resend.dev' for testing)");
    console.log("===========================================\n");
    return;
  }

  try {
    // Send email using Resend SDK
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your Houseiana password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
              .button { display: inline-block; padding: 12px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Houseiana</h1>
              </div>
              <div class="content">
                <h2>Reset Your Password</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center;">
                  <a href="${resetLink}" class="button">Reset Password</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #4F46E5;">${resetLink}</p>
                <div class="footer">
                  <p><strong>This link will expire in 1 hour.</strong></p>
                  <p>If you didn't request this password reset, please ignore this email.</p>
                  <p>For security reasons, this link can only be used once.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
    
    console.log('✅ Password reset email sent successfully to:', email);
    console.log('Email ID:', data?.id);
  } catch (error) {
    console.error('Error sending email:', error);
    // Log to console as fallback
    console.log("\n===========================================");
    console.log("FAILED TO SEND EMAIL - SHOWING LINK IN CONSOLE");
    console.log(`Reset Link: ${resetLink}`);
    console.log("===========================================\n");
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    console.log('Password reset requested for:', email);

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    console.log('User found:', user ? 'Yes' : 'No');

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Delete any existing reset tokens for this email
      await prisma.passwordResetToken.deleteMany({
        where: { email: email.toLowerCase() }
      });

      // Create new reset token (expires in 1 hour)
      await prisma.passwordResetToken.create({
        data: {
          email: email.toLowerCase(),
          token: hashedToken,
          expiresAt: new Date(Date.now() + 3600000) // 1 hour
        }
      });

      // Create reset link - use correct port
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
      const resetLink = `${baseUrl}/auth/reset-password?token=${resetToken}`;

      console.log('Sending email to:', email);
      // Send email
      await sendPasswordResetEmail(email, resetLink);
    } else {
      console.log('No user found with email:', email);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: "If an account exists with this email, a password reset link has been sent."
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Password reset error:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}