import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = parseInt(searchParams.get('guests') || '1');

    const where = {
      status: 'active',
      isActive: true,
      maxGuests: {
        gte: guests
      }
    };

    if (city) {
      where.city = city;
    }

    // Get available properties
    let properties = await prisma.listing.findMany({
      where,
      include: {
        host: {
          select: {
            name: true,
            firstName: true,
            responseTime: true
          }
        }
      }
    });

    // Filter by availability if dates provided
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      const availableProperties = [];
      
      for (const property of properties) {
        const unavailableDates = await prisma.availability.findMany({
          where: {
            listingId: property.id,
            date: {
              gte: checkInDate,
              lt: checkOutDate
            },
            available: false
          }
        });
        
        if (unavailableDates.length === 0) {
          availableProperties.push(property);
        }
      }
      
      properties = availableProperties;
    }

    return NextResponse.json({
      properties,
      total: properties.length
    });
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}