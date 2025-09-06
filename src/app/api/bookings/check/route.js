import { checkAvailability, calculatePrice } from '@/lib/booking';

export async function POST(req) {
  try {
    const { listingId, checkIn, checkOut, guests } = await req.json();
    
    // Validate inputs
    if (!listingId || !checkIn || !checkOut || !guests) {
      return Response.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Check availability
    const availability = await checkAvailability(listingId, checkIn, checkOut);
    
    if (!availability.available) {
      return Response.json({ 
        available: false,
        error: availability.error 
      }, { status: 400 });
    }
    
    // Calculate pricing
    const pricing = calculatePrice(availability.listing, availability.nights);
    
    return Response.json({
      available: true,
      nights: availability.nights,
      pricing,
      listing: {
        minNights: availability.listing.minNights
      }
    });
    
  } catch (error) {
    console.error('Check availability error:', error);
    return Response.json({ 
      error: 'Failed to check availability' 
    }, { status: 500 });
  }
}