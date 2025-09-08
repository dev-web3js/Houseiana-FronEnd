import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log('Fetching property with ID:', id);

    const property = await prisma.listing.findUnique({
      where: { 
        id: id 
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            responseTime: true,
            responseRate: true,
            hostSince: true,
            hostVerified: true
          }
        },
        reviews: {
          select: {
            id: true,
            overall: true,
            publicReview: true,
            createdAt: true,
            reviewer: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      }
    });

    if (!property) {
      console.log('Property not found in database');
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    console.log('Property found:', {
      id: property.id,
      status: property.status,
      isActive: property.isActive
    });

    // Check if property is active
    if (property.status !== 'active' || !property.isActive) {
      console.log('Property not active:', property.status, property.isActive);
      return NextResponse.json(
        { error: 'Property is not available' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
    
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property details' },
      { status: 500 }
    );
  }
}