import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
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

    const body = await request.json();
    const {
      propertyId,
      checkIn,
      checkOut,
      guests,
      specialRequests,
      pricing,
      paymentMethod,
      paymentDetails
    } = body;

    // Validate required fields
    if (!propertyId || !checkIn || !checkOut || !guests || !pricing) {
      return NextResponse.json(
        { message: 'Missing required booking information' },
        { status: 400 }
      );
    }

    // Check if property exists and is available
    const property = await prisma.listing.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      );
    }

    if (property.status !== 'active' || !property.isActive) {
      return NextResponse.json(
        { message: 'Property is not available for booking' },
        { status: 400 }
      );
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        listingId: propertyId,
        status: { in: ['confirmed', 'pending'] },
        OR: [
          {
            AND: [
              { checkIn: { lte: new Date(checkIn) } },
              { checkOut: { gt: new Date(checkIn) } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: new Date(checkOut) } },
              { checkOut: { gte: new Date(checkOut) } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: new Date(checkIn) } },
              { checkOut: { lte: new Date(checkOut) } }
            ]
          }
        ]
      }
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { message: 'Property is not available for selected dates' },
        { status: 400 }
      );
    }

    // Calculate total nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    // Generate confirmation code
    const confirmationCode = generateConfirmationCode();

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        listingId: propertyId,
        guestId: user.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        numberOfGuests: parseInt(guests),
        totalPrice: pricing.total,
        nightlyRate: pricing.nightlyPrice || pricing.subtotal / nights,
        cleaningFee: pricing.cleaningFee || 0,
        serviceFee: pricing.serviceFee || 0,
        totalNights: nights,
        specialRequests: specialRequests || '',
        status: 'confirmed',
        paymentMethod: paymentMethod || 'card',
        paymentStatus: 'completed',
        confirmationCode: confirmationCode,
        bookedAt: new Date()
      },
      include: {
        listing: {
          select: {
            title: true,
            area: true,
            city: true,
            bedrooms: true,
            bathrooms: true
          }
        },
        guest: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      id: booking.id,
      confirmationCode: booking.confirmationCode,
      status: booking.status,
      message: 'Booking confirmed successfully'
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create booking. Please try again.' },
      { status: 500 }
    );
  }
}

function generateConfirmationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}