import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is a host
    if (user.role !== 'host' && user.role !== 'both') {
      return NextResponse.json(
        { error: 'Not a host account' },
        { status: 403 }
      );
    }

    // Create session
    const token = randomBytes(32).toString('hex');
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent')
      }
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('houseiana_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        isHost: user.isHost
      }
    });
    
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Sign in failed' },
      { status: 500 }
    );
  }
}