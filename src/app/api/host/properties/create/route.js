import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    // Get session from cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('houseiana_session');
    
    if (!sessionToken || !sessionToken.value) {
      console.log('No session token found');
      return NextResponse.json({ error: 'Please sign in to continue' }, { status: 401 });
    }

    // For now, decode the base64 session (if not using database sessions yet)
    let userId;
    try {
      const sessionData = JSON.parse(
        Buffer.from(sessionToken.value, 'base64').toString()
      );
      userId = sessionData.id;
      console.log('Session user ID:', userId);
    } catch (e) {
      // If using database sessions
      const session = await prisma.session.findUnique({
        where: { token: sessionToken.value }
      });
      
      if (!session || session.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
      }
      
      userId = session.userId;
    }

    const data = await request.json();
    console.log('Creating property for user:', userId);
    
    // Create property in database
    const property = await prisma.listing.create({
      data: {
        hostId: userId,
        title: data.title,
        description: data.description || '',
        propertyType: data.propertyType.toLowerCase(),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseFloat(data.bathrooms),
        maxGuests: parseInt(data.maxGuests),
        squareMeters: data.size ? parseInt(data.size) : null,
        
        // Location
        city: data.city,
        area: data.area,
        address: {
          street: data.address,
          building: data.buildingName || '',
          floor: data.floorNumber || ''
        },
        
        // Pricing
        monthlyPrice: parseFloat(data.monthlyRent),
        weeklyPrice: data.weeklyRent ? parseFloat(data.weeklyRent) : null,
        nightlyPrice: data.dailyRent ? parseFloat(data.dailyRent) : null,
        cleaningFee: data.cleaningFee ? parseFloat(data.cleaningFee) : 200,
        securityDeposit: data.securityDeposit ? parseFloat(data.securityDeposit) : 1000,
        
        // Features
        inUnitFeatures: data.amenities || {},
        photos: data.photos || [],
        
        // Rules and settings
        houseRules: data.houseRules || '',
        minNights: parseInt(data.minimumStay || 30),
        instantBook: data.instantBooking || false,
        checkInTime: data.checkInTime || '15:00',
        checkOutTime: data.checkOutTime || '11:00',
        
        // Status
        status: 'active',
        isActive: true,
        publishedAt: new Date()
      }
    });

    console.log('Property created successfully:', property.id);

    // Create availability calendar
    const availabilityData = [];
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      availabilityData.push({
        listingId: property.id,
        date: date,
        available: true
      });
    }
    
    await prisma.availability.createMany({
      data: availabilityData,
      skipDuplicates: true
    });

    return NextResponse.json({
      success: true,
      property,
      message: 'Property published successfully!'
    });
    
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { 
        error: 'Failed to publish property', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}