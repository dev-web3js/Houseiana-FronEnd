import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { saveHost, findHostByEmail } from '@/lib/database';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      idType,
      idNumber,
      hasProperty,
      propertyType,
      agreeTerms
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (!agreeTerms) {
      return NextResponse.json(
        { error: 'You must agree to the terms' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingHost = findHostByEmail(email);
    if (existingHost) {
      return NextResponse.json(
        { error: 'Email already registered. Please sign in instead.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create host account
    const newHost = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email: email.toLowerCase(), // Normalize email
      phone,
      password: hashedPassword,
      idType,
      idNumber,
      hasProperty,
      propertyType,
      role: 'host',
      isVerified: false,
      createdAt: new Date().toISOString(),
      properties: [],
      earnings: 0,
      responseRate: 0
    };

    // Save to persistent database
    saveHost(newHost);

    // Create session token with user info
    const sessionToken = Buffer.from(JSON.stringify({
      id: newHost.id,
      email: newHost.email,
      firstName: newHost.firstName,
      lastName: newHost.lastName,
      role: 'host'
    })).toString('base64');

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('houseiana_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    console.log('Host created successfully:', email); // For debugging

    return NextResponse.json({
      success: true,
      message: 'Host account created successfully',
      user: {
        id: newHost.id,
        firstName: newHost.firstName,
        lastName: newHost.lastName,
        email: newHost.email,
        role: 'host'
      }
    });

  } catch (error) {
    console.error('Host signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}