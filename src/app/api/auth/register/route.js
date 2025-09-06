import { prisma } from "@/lib/prisma";
import { hashPassword, createSession, sessionCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, name } = body;

    // Validation
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existing) {
      return new Response(JSON.stringify({ error: "Email already registered" }), { 
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
        name: name || `${firstName} ${lastName}`.trim() || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true
      }
    });

    // Create session
    const token = await createSession(user);
    const headers = new Headers({
      "Set-Cookie": sessionCookie(token),
      "Content-Type": "application/json",
    });

    return new Response(JSON.stringify({ ok: true, user }), { 
      status: 201, 
      headers 
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Registration failed" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}