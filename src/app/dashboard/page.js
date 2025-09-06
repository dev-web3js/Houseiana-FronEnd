import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    // Redirect server-side (no flash of content)
    return (
      <meta httpEquiv="refresh" content="0; url=/auth/sign-in" />
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold">Welcome back{session.name ? `, ${session.name}` : ""}!</h1>
      <p className="mt-2 text-neutral-mutetext">Email: {session.email}</p>

      <div className="mt-6 grid gap-4">
        <a href="/bookings" className="border border-neutral-border rounded-lg p-4 hover:bg-neutral-bg">My bookings</a>
        <a href="/profile" className="border border-neutral-border rounded-lg p-4 hover:bg-neutral-bg">Profile</a>
        <form action="/api/auth/logout" method="post">
          <button className="px-4 py-2 rounded-lg border border-neutral-border hover:bg-neutral-bg">Log out</button>
        </form>
      </div>
    </main>
  );
}
