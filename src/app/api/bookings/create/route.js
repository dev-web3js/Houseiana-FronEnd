import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Please sign in' }, { status: 401 });
    }

    const data = await request.json();
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    
    // Calculate nights
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Start transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          listingId: data.propertyId,
          guestId: session.userId,
          checkIn: checkIn,
          checkOut: checkOut,
          adults: data.guests || 2,
          nightlyRate: parseFloat(data.nightlyRate),
          totalNights: nights,
          subtotal: parseFloat(data.subtotal),
          cleaningFee: parseFloat(data.cleaningFee || 0),
          serviceFee: parseFloat(data.serviceFee || 0),
          totalPrice: parseFloat(data.totalAmount),
          specialRequests: data.specialRequests,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paidAt: new Date()
        }
      });

      // Block dates in availability calendar
      const datesToBlock = [];
      const currentDate = new Date(checkIn);
      
      while (currentDate < checkOut) {
        datesToBlock.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      await tx.availability.updateMany({
        where: {
          listingId: data.propertyId,
          date: {
            in: datesToBlock
          }
        },
        data: {
          available: false
        }
      });

      return newBooking;
    });

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking confirmed successfully'
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Booking failed' },
      { status: 500 }
    );
  }
}