import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('houseiana_session');
    
    if (!sessionToken?.value) {
      return NextResponse.json(
        { error: 'Please sign in' },
        { status: 401 }
      );
    }

    // Get user from session
    let user;
    try {
      const session = await prisma.session.findUnique({
        where: { token: sessionToken.value },
        include: { user: true }
      });
      
      if (session && session.expiresAt > new Date()) {
        user = session.user;
      } else {
        // Fallback
        const sessionData = JSON.parse(
          Buffer.from(sessionToken.value, 'base64').toString()
        );
        user = await prisma.user.findUnique({
          where: { email: sessionData.email }
        });
      }
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Fetch properties from database
    const properties = await prisma.listing.findMany({
      where: {
        hostId: user.id,
        status: {
          not: 'deleted'
        }
      },
      include: {
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data
    const transformedProperties = properties.map(property => ({
      ...property,
      bookingCount: property._count.bookings,
      reviewCount: property._count.reviews,
      monthlyRent: property.monthlyPrice, // For backward compatibility
    }));

    return NextResponse.json({
      properties: transformedProperties,
      total: properties.length,
      hostId: user.id
    });
    
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('houseiana_session');
    
    if (!sessionToken?.value) {
      return NextResponse.json(
        { error: 'Please sign in', success: false },
        { status: 401 }
      );
    }

    // Get user from session
    let user;
    try {
      const session = await prisma.session.findUnique({
        where: { token: sessionToken.value },
        include: { user: true }
      });
      
      if (session && session.expiresAt > new Date()) {
        user = session.user;
      } else {
        // Fallback
        const sessionData = JSON.parse(
          Buffer.from(sessionToken.value, 'base64').toString()
        );
        user = await prisma.user.findUnique({
          where: { email: sessionData.email }
        });
      }
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid session', success: false },
        { status: 401 }
      );
    }

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 401 }
      );
    }

    // Log for debugging
    console.log('User creating property:', {
      id: user.id,
      email: user.email,
      isHost: user.isHost,
      role: user.role
    });

    // Check if user is a host (check both isHost flag and role)
    if (!user.isHost && user.role !== 'host' && user.role !== 'both') {
      // If not a host, update them to be a host
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          isHost: true,
          role: user.role === 'guest' ? 'host' : 'both',
          hostSince: new Date()
        }
      });
      
      // Refresh user data
      user = await prisma.user.findUnique({
        where: { id: user.id }
      });
    }

    // Parse request body
    const body = await request.json();
    
    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + 
      '-' + crypto.randomBytes(4).toString('hex');

    // Create the listing
    const newListing = await prisma.listing.create({
      data: {
        hostId: user.id,
        status: 'active',
        
        // Basic Info
        title: body.title,
        slug: slug,
        description: body.description || '',
        propertyType: body.propertyType || 'apartment',
        entirePlace: true,
        
        // Location
        country: 'Qatar',
        city: body.city || 'Doha',
        area: body.area || '',
        district: body.area || '',
        buildingName: body.buildingName || '',
        streetNumber: body.address || '',
        floorNumber: body.floorNumber || '',
        
        // Coordinates (required field - default to Doha center if not provided)
        coordinates: body.coordinates || { lat: 25.2854, lng: 51.5310 },
        
        // Property Layout
        bedrooms: parseInt(body.bedrooms) || 1,
        bathrooms: parseFloat(body.bathrooms) || 1,
        beds: parseInt(body.bedrooms) || 1,
        squareMeters: body.size ? parseInt(body.size) : null,
        
        // Occupancy
        maxGuests: parseInt(body.maxGuests) || 2,
        maxAdults: parseInt(body.maxGuests) || 2,
        
        // Pricing
        monthlyPrice: parseFloat(body.monthlyRent) || 0,
        weeklyPrice: body.weeklyRent ? parseFloat(body.weeklyRent) : null,
        nightlyPrice: body.dailyRent ? parseFloat(body.dailyRent) : null,
        cleaningFee: body.cleaningFee ? parseFloat(body.cleaningFee) : 200,
        securityDeposit: body.securityDeposit ? parseFloat(body.securityDeposit) : 1000,
        
        // Check-in/out
        checkInTime: body.checkInTime || '15:00',
        checkOutTime: body.checkOutTime || '11:00',
        
        // Booking Settings
        minNights: parseInt(body.minimumStay) || 30,
        instantBook: body.instantBooking || false,
        
        // Features (store amenities as JSON)
        inUnitFeatures: body.amenities || {},
        
        // Photos
        photos: body.photos ? body.photos.map((url, index) => ({
          url,
          order: index,
          caption: ''
        })) : [],
        
        // House Rules
        houseRules: body.houseRules || '',
        
        // Availability
        isActive: true,
        publishedAt: new Date(),
        
        // SEO
        keywords: [body.propertyType, body.city, body.area].filter(Boolean)
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Property published successfully!',
      property: newListing
    });

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create property', 
        success: false,
        details: error.message 
      },
      { status: 500 }
    );
  }
}