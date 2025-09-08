import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return new Response(JSON.stringify({ error: "Token and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Hash the token to match what's in the database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken }
    });

    if (!resetToken) {
      return new Response(JSON.stringify({ error: "Invalid or expired reset token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      });

      return new Response(JSON.stringify({ error: "Reset token has expired" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Hash the new password
    const passwordHash = await hashPassword(password);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    // Delete the used reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    });

    // Optional: Delete all sessions for this user to force re-login
    await prisma.session.deleteMany({
      where: { userId: user.id }
    });

    return new Response(JSON.stringify({ 
      success: true,
      message: "Password has been reset successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Password reset error:", error);
    return new Response(JSON.stringify({ error: "Failed to reset password" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}