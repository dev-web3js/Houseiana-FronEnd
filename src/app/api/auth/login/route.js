import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession, sessionCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const token = await createSession(user);
    const headers = new Headers({
      "Set-Cookie": sessionCookie(token),
      "Content-Type": "application/json",
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ error: "Login failed" }), { status: 500 });
  }
}
