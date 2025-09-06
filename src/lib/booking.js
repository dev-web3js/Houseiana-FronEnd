import { prisma } from '@/lib/prisma';

export async function checkAvailability(listingId, checkIn, checkOut) {
  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Calculate nights
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Get listing details
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { 
        minNights: true, 
        isActive: true,
        monthlyPrice: true,
        weeklyPrice: true,
        nightlyPrice: true,
        cleaningFee: true
      }
    });
    
    if (!listing || !listing.isActive) {
      return { available: false, error: 'Listing not available' };
    }
    
    if (nights < listing.minNights) {
      return { 
        available: false, 
        error: `Minimum stay is ${listing.minNights} nights` 
      };
    }
    
    // Check for overlapping bookings
    const conflicts = await prisma.booking.findMany({
      where: {
        listingId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gt: checkInDate } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gte: checkOutDate } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkOut: { lte: checkOutDate } }
            ]
          }
        ]
      }
    });
    
    if (conflicts.length > 0) {
      return { available: false, error: 'Dates not available' };
    }
    
    return { 
      available: true, 
      nights,
      listing 
    };
    
  } catch (error) {
    console.error('Availability check error:', error);
    return { available: false, error: 'Failed to check availability' };
  }
}

export function calculatePrice(listing, nights) {
  let nightlyRate;
  
  // Determine rate based on length of stay
  if (nights >= 28 && listing.monthlyPrice) {
    nightlyRate = Number(listing.monthlyPrice) / 30;
  } else if (nights >= 7 && listing.weeklyPrice) {
    nightlyRate = Number(listing.weeklyPrice) / 7;
  } else if (listing.nightlyPrice) {
    nightlyRate = Number(listing.nightlyPrice);
  } else {
    throw new Error('No applicable rate found');
  }
  
  const subtotal = nightlyRate * nights;
  const cleaningFee = Number(listing.cleaningFee) || 0;
  const serviceFee = subtotal * 0.12; // 12% service fee
  const totalPrice = subtotal + cleaningFee + serviceFee;
  
  return {
    nightlyRate: nightlyRate.toFixed(2),
    subtotal: subtotal.toFixed(2),
    cleaningFee: cleaningFee.toFixed(2),
    serviceFee: serviceFee.toFixed(2),
    totalPrice: totalPrice.toFixed(2)
  };
}