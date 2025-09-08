import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token.value);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid authentication' },
        { status: 401 }
      );
    }

    const bookingId = params.id;

    // Fetch booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            area: true,
            city: true,
            address: true,
            bedrooms: true,
            bathrooms: true,
            maxGuests: true,
            photos: true,
            checkInTime: true,
            checkOutTime: true
          }
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to view this booking
    if (booking.guestId !== user.id) {
      return NextResponse.json(
        { message: 'Unauthorized to view this booking' },
        { status: 403 }
      );
    }

    return NextResponse.json(booking);

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { message: 'Failed to fetch booking details' },
      { status: 500 }
    );
  }
}