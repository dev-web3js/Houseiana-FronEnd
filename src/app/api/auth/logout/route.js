import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const headers = new Headers({
    "Set-Cookie": clearSessionCookie(),
    "Content-Type": "application/json",
  });
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}
