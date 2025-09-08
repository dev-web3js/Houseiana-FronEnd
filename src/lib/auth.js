import { cookies } from 'next/headers';
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Constants
export const SESSION_COOKIE_NAME = 'houseiana_session';

// Hash password
export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Create session
export async function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
      lastActivity: new Date()
    }
  });

  return token;
}

// Create session cookie
export function sessionCookie(token) {
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`;
}

// Verify token (alias for verifySession for API compatibility)
export async function verifyToken(token) {
  return verifySession(token);
}

// Verify session
export async function verifySession(token) {
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    // Update last activity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() }
    });

    return {
      userId: session.userId,
      email: session.user.email,
      name: session.user.name || `${session.user.firstName} ${session.user.lastName}`.trim(),
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      isHost: session.user.isHost,
      role: session.user.role
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME);
    
    if (!sessionToken || !sessionToken.value) {
      return null;
    }

    // Get session from database
    const session = await prisma.session.findUnique({
      where: {
        token: sessionToken.value
      },
      include: {
        user: true
      }
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    // Update last activity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() }
    });

    return {
      userId: session.userId,
      user: session.user,
      isHost: session.user.isHost,
      role: session.user.role
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}