const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedListings() {
  try {
    console.log('Starting to seed listings...');

    // Get the first user to be the host
    const host = await prisma.user.findFirst();
    
    if (!host) {
      console.log('No users found. Please create a user first.');
      return;
    }

    console.log(`Using host: ${host.firstName} ${host.lastName}`);

    // Create sample listings
    const listings = [
      {
        hostId: host.id,
        status: 'active',
        title: 'Luxury Pearl Qatar Apartment with Sea View',
        slug: 'luxury-pearl-qatar-apartment',
        description: 'Experience luxury living in this stunning 2-bedroom apartment at The Pearl Qatar. Featuring panoramic sea views, modern furnishings, and access to premium amenities including gym, pool, and 24/7 security.',
        propertyType: 'apartment',
        entirePlace: true,
        furnishingStatus: 'fully_furnished',
        rentalType: ['long_term'],
        
        // Location details
        country: 'Qatar',
        city: 'Doha',
        area: 'The Pearl',
        district: 'Porto Arabia',
        zoneNumber: '66',
        streetNumber: '15',
        buildingNumber: 'Tower 23',
        unitNumber: '1205',
        floorNumber: '12',
        buildingName: 'Marina Tower',
        streetName: 'La Croisette',
        coordinates: { lat: 25.3716, lng: 51.5542 },
        
        // Property details
        bedrooms: 2,
        bathrooms: 2,
        beds: 3,
        squareMeters: 120,
        maxGuests: 4,
        maxAdults: 4,
        maxChildren: 2,
        
        // Features and amenities
        inUnitFeatures: ['wifi', 'ac', 'heating', 'kitchen', 'washer', 'dryer', 'tv', 'workspace'],
        buildingFacilities: ['gym', 'pool', 'parking', 'elevator', 'security'],
        compoundAmenities: ['beach_access', 'marina', 'restaurants', 'shopping'],
        safetyFeatures: ['smoke_alarm', 'carbon_monoxide_alarm', 'fire_extinguisher', 'first_aid_kit'],
        
        // Pricing
        currency: 'QAR',
        monthlyPrice: 8500,
        cleaningFee: 300,
        securityDeposit: 2000,
        
        // Booking settings
        minNights: 30,
        maxNights: 365,
        instantBook: true,
        
        // Photos (using Unsplash URLs)
        photos: [
          'https://images.unsplash.com/photo-1565623006066-82f23c79210b?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800&h=600&fit=crop'
        ],
        
        // Additional info
        tier: 'premium',
        isVerified: true,
        isActive: true,
        publishedAt: new Date()
      },
      {
        hostId: host.id,
        status: 'active',
        title: 'Modern Studio in West Bay Business District',
        slug: 'modern-studio-west-bay',
        description: 'Perfectly located studio apartment in the heart of West Bay. Ideal for business travelers and professionals. Walking distance to major offices and City Center Mall.',
        propertyType: 'studio',
        entirePlace: true,
        furnishingStatus: 'fully_furnished',
        rentalType: ['long_term'],
        
        // Location details
        country: 'Qatar',
        city: 'Doha',
        area: 'West Bay',
        district: 'Diplomatic Area',
        zoneNumber: '61',
        streetNumber: '8',
        buildingNumber: 'Tower 5',
        unitNumber: '803',
        floorNumber: '8',
        buildingName: 'Sky Tower',
        streetName: 'Al Corniche',
        coordinates: { lat: 25.3225, lng: 51.5256 },
        
        // Property details
        bedrooms: 0,
        bathrooms: 1,
        beds: 1,
        squareMeters: 45,
        maxGuests: 2,
        maxAdults: 2,
        maxChildren: 0,
        
        // Features and amenities
        inUnitFeatures: ['wifi', 'ac', 'kitchen', 'tv', 'workspace'],
        buildingFacilities: ['gym', 'parking', 'elevator', 'security'],
        compoundAmenities: ['restaurants', 'shopping', 'metro_station'],
        safetyFeatures: ['smoke_alarm', 'fire_extinguisher'],
        
        // Pricing
        currency: 'QAR',
        monthlyPrice: 4500,
        cleaningFee: 200,
        securityDeposit: 1000,
        
        // Booking settings
        minNights: 30,
        maxNights: 180,
        instantBook: true,
        
        // Photos
        photos: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1558442074-3c19857bc1dc?w=800&h=600&fit=crop'
        ],
        
        // Additional info
        tier: 'standard',
        isVerified: true,
        isActive: true,
        publishedAt: new Date()
      },
      {
        hostId: host.id,
        status: 'active',
        title: 'Spacious Villa with Private Pool in Al Waab',
        slug: 'spacious-villa-al-waab',
        description: 'Beautiful 4-bedroom villa perfect for families. Features private pool, garden, and maid room. Located in quiet residential area with easy access to schools and shopping.',
        propertyType: 'villa',
        entirePlace: true,
        furnishingStatus: 'fully_furnished',
        rentalType: ['long_term'],
        
        // Location details
        country: 'Qatar',
        city: 'Doha',
        area: 'Al Waab',
        district: 'Al Waab',
        zoneNumber: '55',
        streetNumber: '23',
        buildingNumber: 'Villa 15',
        unitNumber: '15',
        floorNumber: '1',
        buildingName: 'Al Waab Villas',
        streetName: 'Street 920',
        coordinates: { lat: 25.2450, lng: 51.4470 },
        
        // Property details
        bedrooms: 4,
        bathrooms: 5,
        beds: 5,
        squareMeters: 350,
        maxGuests: 8,
        maxAdults: 6,
        maxChildren: 4,
        
        // Features and amenities
        inUnitFeatures: ['wifi', 'ac', 'heating', 'kitchen', 'washer', 'dryer', 'tv', 'workspace', 'maid_room'],
        buildingFacilities: ['private_pool', 'garden', 'parking', 'security'],
        compoundAmenities: ['playground', 'mosque', 'shopping'],
        safetyFeatures: ['smoke_alarm', 'carbon_monoxide_alarm', 'fire_extinguisher', 'first_aid_kit', 'security_cameras'],
        familyFeatures: ['crib', 'high_chair', 'toys', 'baby_gates'],
        
        // Pricing
        currency: 'QAR',
        monthlyPrice: 15000,
        cleaningFee: 500,
        securityDeposit: 5000,
        
        // Booking settings
        minNights: 30,
        maxNights: 365,
        instantBook: false,
        
        // Photos
        photos: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
        ],
        
        // Additional info
        tier: 'gold',
        isVerified: true,
        isActive: true,
        publishedAt: new Date()
      }
    ];

    // Create listings
    for (const listing of listings) {
      const created = await prisma.listing.create({
        data: listing
      });
      console.log(`Created listing: ${created.title}`);
    }

    console.log('Successfully seeded listings!');
  } catch (error) {
    console.error('Error seeding listings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedListings();