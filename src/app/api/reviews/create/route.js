import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { 
      bookingId, 
      reviewType, 
      ratings, 
      publicReview, 
      privateNote, 
      photos = [] 
    } = data;

    // Validate booking exists and belongs to user or is for the user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          include: {
            host: true
          }
        },
        guest: true
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        bookingId,
        reviewerId: user.id,
        reviewType
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already exists for this booking' },
        { status: 400 }
      );
    }

    // Determine reviewee based on review type
    let revieweeId = null;
    if (reviewType === 'host') {
      revieweeId = booking.listing.hostId;
    } else if (reviewType === 'guest') {
      // Host reviewing guest
      if (user.id !== booking.listing.hostId) {
        return NextResponse.json(
          { error: 'Only hosts can review guests' },
          { status: 403 }
        );
      }
      revieweeId = booking.guestId;
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        bookingId,
        reviewerId: user.id,
        revieweeId,
        listingId: booking.listingId,
        reviewType,
        overall: ratings.overall,
        cleanliness: ratings.cleanliness,
        accuracy: ratings.accuracy,
        checkIn: ratings.checkIn,
        communication: ratings.communication,
        location: ratings.location,
        value: ratings.value,
        hostHospitality: ratings.hostHospitality,
        hostResponsiveness: ratings.hostResponsiveness,
        hostReliability: ratings.hostReliability,
        guestCleanliness: ratings.guestCleanliness,
        guestCommunication: ratings.guestCommunication,
        guestRules: ratings.guestRules,
        guestRecommend: ratings.guestRecommend,
        publicReview,
        privateNote,
        photos,
        isVerifiedStay: true
      }
    });

    // Update listing's average rating and review count if it's a property review
    if (reviewType === 'property') {
      const allReviews = await prisma.review.findMany({
        where: {
          listingId: booking.listingId,
          reviewType: 'property'
        }
      });

      const avgRating = allReviews.reduce((sum, r) => sum + r.overall, 0) / allReviews.length;
      
      await prisma.listing.update({
        where: { id: booking.listingId },
        data: {
          averageRating: avgRating,
          reviewCount: allReviews.length
        }
      });
    }

    // Create notification for reviewee
    if (revieweeId) {
      await prisma.notification.create({
        data: {
          userId: revieweeId,
          type: reviewType === 'guest' ? 'guest_reviewed' : 'new_review',
          title: 'New Review',
          message: reviewType === 'guest' 
            ? `${user.name || 'A host'} has reviewed you as a guest`
            : `${user.name || 'A guest'} has left a review`,
          data: {
            reviewId: review.id,
            bookingId: booking.id,
            listingId: booking.listingId
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}