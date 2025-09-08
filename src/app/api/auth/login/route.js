import prisma from "@/lib/prisma";
import { verifyPassword, createSession, sessionCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, emailOrUsername, password, rememberMe } = body;

    // Support both email and emailOrUsername for backwards compatibility
    const loginEmail = email || emailOrUsername;

    if (!loginEmail || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: loginEmail }, { username: loginEmail }],
      },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const token = await createSession(user);
    
    // Set cookie with longer expiration if "remember me" is checked
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days vs 7 days
    const cookieOptions = `${sessionCookie(token)}; Max-Age=${maxAge}`;
    
    const headers = new Headers({
      "Set-Cookie": cookieOptions,
      "Content-Type": "application/json",
    });

    return new Response(JSON.stringify({ 
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }), { status: 200, headers });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: "Login failed" }), { status: 500 });
  }
}
