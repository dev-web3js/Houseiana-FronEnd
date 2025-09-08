import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/reviews/property/[id] - Get reviews for a property
// GET /api/reviews/host/[id] - Get reviews for a host
// GET /api/reviews/guest/[id] - Get reviews for a guest
export async function GET(request, { params }) {
  try {
    const { type, id } = params;
    
    let reviews = [];
    
    if (type === 'property') {
      reviews = await prisma.review.findMany({
        where: {
          listingId: id,
          reviewType: 'property',
          isHidden: false
        },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else if (type === 'host') {
      reviews = await prisma.review.findMany({
        where: {
          revieweeId: id,
          reviewType: 'host',
          isHidden: false
        },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          },
          listing: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else if (type === 'guest') {
      reviews = await prisma.review.findMany({
        where: {
          revieweeId: id,
          reviewType: 'guest',
          isHidden: false
        },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              isHost: true
            }
          },
          listing: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    // Format reviews for frontend
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      bookingId: review.bookingId,
      reviewType: review.reviewType,
      overall: review.overall,
      cleanliness: review.cleanliness,
      accuracy: review.accuracy,
      checkIn: review.checkIn,
      communication: review.communication,
      location: review.location,
      value: review.value,
      hostHospitality: review.hostHospitality,
      hostResponsiveness: review.hostResponsiveness,
      hostReliability: review.hostReliability,
      guestCleanliness: review.guestCleanliness,
      guestCommunication: review.guestCommunication,
      guestRules: review.guestRules,
      guestRecommend: review.guestRecommend,
      publicReview: review.publicReview,
      response: review.response,
      respondedAt: review.respondedAt,
      photos: review.photos || [],
      isVerifiedStay: review.isVerifiedStay,
      createdAt: review.createdAt,
      reviewerName: review.reviewer?.name || 
                    `${review.reviewer?.firstName || ''} ${review.reviewer?.lastName || ''}`.trim() || 
                    'Anonymous',
      reviewerImage: review.reviewer?.profileImage,
      reviewerId: review.reviewer?.id,
      listingTitle: review.listing?.title
    }));

    return NextResponse.json({
      success: true,
      reviews: formattedReviews,
      total: formattedReviews.length
    });

  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}