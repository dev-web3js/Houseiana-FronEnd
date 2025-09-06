import { NextResponse } from "next/server";

// Define protected routes
const PROTECTED = ["/dashboard", "/profile", "/bookings"];
const HOST_PROTECTED = ["/host/dashboard", "/host/listings", "/host/verify", "/host/banking", "/host/properties"];
const HOST_PUBLIC = ["/host/sign-in", "/become-a-host", "/host/sign-up"];

// Function to verify JWT session
async function verifyJWTSession(token) {
  if (!token) return null;
  
  try {
    // If you're using jose library
    const { jwtVerify } = await import("jose");
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production");
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    // If JWT verification fails, try simple base64 session
    return verifySimpleSession(token);
  }
}

// Function to verify simple base64 session (fallback)
function verifySimpleSession(token) {
  if (!token) return null;
  
  try {
    const sessionData = JSON.parse(
      Buffer.from(token, 'base64').toString()
    );
    
    // Check if session has required fields
    if (sessionData.id && sessionData.email) {
      return {
        sub: sessionData.id,
        email: sessionData.email,
        firstName: sessionData.firstName,
        lastName: sessionData.lastName,
        role: sessionData.role,
        name: sessionData.firstName || sessionData.name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Simple session verification failed:', error);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check route types
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isHostProtected = HOST_PROTECTED.some((p) => pathname.startsWith(p));
  const isHostPublic = HOST_PUBLIC.some((p) => pathname.startsWith(p));
  
  // If it's not a protected route, allow access
  if (!isProtected && !isHostProtected) {
    return NextResponse.next();
  }

  // Get session token from cookies
  const sessionToken = request.cookies.get("houseiana_session");
  
  // Try to verify the session
  let session = null;
  if (sessionToken && sessionToken.value) {
    // First try JWT verification, then fallback to simple session
    session = await verifyJWTSession(sessionToken.value);
  }

  // Handle missing or invalid session
  if (!session) {
    // No valid session found
    if (isHostProtected) {
      // Trying to access host protected route without session
      const signInUrl = new URL("/host/sign-in", request.url);
      signInUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(signInUrl);
    } else if (isProtected) {
      // Trying to access regular protected route without session
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Session exists - now check role-based access
  if (session && isHostProtected) {
    // Check if the user has host role
    if (session.role !== 'host') {
      // User exists but is not a host - redirect to host sign-in
      const signInUrl = new URL("/host/sign-in", request.url);
      signInUrl.searchParams.set("error", "host_only");
      signInUrl.searchParams.set("message", "Please sign in with a host account");
      return NextResponse.redirect(signInUrl);
    }
  }

  // Check for regular user trying to access regular protected routes
  if (session && isProtected) {
    // Check if it's a regular user route and user is not a host
    // (Optional: you might want to allow hosts to access regular user routes too)
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile") || pathname.startsWith("/bookings")) {
      if (session.role === 'host') {
        // Host trying to access regular user dashboard - redirect to host dashboard
        return NextResponse.redirect(new URL("/host/dashboard/welcome", request.url));
      }
    }
  }

  // All checks passed - allow the request
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    "/dashboard/:path*",
    "/profile/:path*", 
    "/bookings/:path*",
    "/host/:path*"
  ],
};