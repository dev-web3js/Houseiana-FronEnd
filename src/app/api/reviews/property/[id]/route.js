import { NextResponse } from 'next/server';

// Mock data for property reviews
const getMockReviews = (propertyId) => [
  {
    id: '1',
    bookingId: 'BK001',
    reviewType: 'property',
    overall: 5,
    cleanliness: 5,
    accuracy: 5,
    checkIn: 5,
    communication: 5,
    location: 5,
    value: 4,
    publicReview: 'Amazing property! The place was exactly as described in the photos. The host was very responsive and helpful throughout our stay. The location was perfect - close to everything we wanted to see. Would definitely stay here again!',
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
    ],
    isVerifiedStay: true,
    createdAt: new Date('2024-12-15'),
    reviewerName: 'Sarah Johnson',
    reviewerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    response: 'Thank you so much for your wonderful review, Sarah! We\'re thrilled you enjoyed your stay and found everything to your satisfaction. You\'re always welcome back!',
    respondedAt: new Date('2024-12-16')
  },
  {
    id: '2',
    bookingId: 'BK002',
    reviewType: 'property',
    overall: 4,
    cleanliness: 4,
    accuracy: 5,
    checkIn: 4,
    communication: 4,
    location: 5,
    value: 4,
    publicReview: 'Great location and spacious apartment. Everything was clean and well-maintained. The only minor issue was that the WiFi was a bit slow at times, but overall it was a pleasant stay.',
    isVerifiedStay: true,
    createdAt: new Date('2024-11-20'),
    reviewerName: 'Michael Chen',
    reviewerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  {
    id: '3',
    bookingId: 'BK003',
    reviewType: 'property',
    overall: 5,
    cleanliness: 5,
    accuracy: 5,
    checkIn: 5,
    communication: 5,
    location: 4,
    value: 5,
    publicReview: 'Exceeded our expectations! The property is beautiful and the host went above and beyond to make our stay comfortable. The pool area was fantastic and the kids loved it. Highly recommend!',
    photos: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop'
    ],
    isVerifiedStay: true,
    createdAt: new Date('2024-10-10'),
    reviewerName: 'Emily Rodriguez',
    reviewerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    response: 'We\'re so happy you and your family had a great time! The pool is definitely a favorite among our guests. Hope to see you again soon!',
    respondedAt: new Date('2024-10-11')
  },
  {
    id: '4',
    bookingId: 'BK004',
    reviewType: 'property',
    overall: 3,
    cleanliness: 3,
    accuracy: 4,
    checkIn: 3,
    communication: 3,
    location: 4,
    value: 3,
    publicReview: 'The location was good and the space was adequate. However, there were some maintenance issues that needed attention - the air conditioning wasn\'t working properly and one of the bathroom faucets was leaking.',
    isVerifiedStay: true,
    createdAt: new Date('2024-09-05'),
    reviewerName: 'David Kim',
    reviewerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    response: 'Thank you for your feedback, David. We sincerely apologize for the maintenance issues you experienced. We\'ve since fixed both the AC and the faucet. We appreciate your patience and hope you\'ll give us another chance in the future.',
    respondedAt: new Date('2024-09-06')
  },
  {
    id: '5',
    bookingId: 'BK005',
    reviewType: 'property',
    overall: 5,
    cleanliness: 5,
    accuracy: 5,
    checkIn: 5,
    communication: 5,
    location: 5,
    value: 5,
    publicReview: 'Perfect stay! Everything was spotless, check-in was seamless, and the host was incredibly helpful with local recommendations. The view from the balcony was breathtaking. Will definitely book again!',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
    ],
    isVerifiedStay: true,
    createdAt: new Date('2024-08-20'),
    reviewerName: 'Lisa Anderson',
    reviewerImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop'
  }
];

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Return mock reviews for now
    const reviews = getMockReviews(id);
    
    return NextResponse.json({
      success: true,
      reviews,
      total: reviews.length
    });

  } catch (error) {
    console.error('Fetch property reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}