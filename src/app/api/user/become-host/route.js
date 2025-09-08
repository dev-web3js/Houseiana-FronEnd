import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token.value);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
        email: true,
        firstName: true,
        lastName: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already a host
    if (user.role === 'host' || user.role === 'both') {
      return NextResponse.json(
        { message: 'User is already a host' },
        { status: 400 }
      );
    }

    // Update user role to 'both' (can be both guest and host)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: 'both' // User can now act as both guest and host
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        profileImage: true,
        createdAt: true
      }
    });

    // Create a welcome notification (optional)
    // await prisma.notification.create({
    //   data: {
    //     userId: user.id,
    //     title: 'Welcome to Hosting!',
    //     message: 'Congratulations on becoming a host! You can now list your properties and start earning.',
    //     type: 'system'
    //   }
    // });

    return NextResponse.json({
      ...updatedUser,
      message: 'Successfully upgraded to host'
    });

  } catch (error) {
    console.error('Error upgrading to host:', error);
    return NextResponse.json(
      { message: 'Failed to upgrade to host' },
      { status: 500 }
    );
  }
}