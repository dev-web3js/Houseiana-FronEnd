"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PropertyMap from '@/components/PropertyMap';
import ReviewDisplay from '@/components/ReviewDisplay';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [propertyReviews, setPropertyReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPropertyDetails();
      fetchPropertyReviews();
    }
  }, [params.id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        // Transform the API data to match our new schema
        const transformedData = transformApiData(data);
        setProperty(transformedData);
      } else {
        // Use comprehensive mock data
        setProperty(getMockProperty());
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setProperty(getMockProperty());
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`/api/reviews/property/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPropertyReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const transformApiData = (apiData) => {
    // If the data already has the new structure, return it
    if (apiData.location && apiData.location.area) {
      return apiData;
    }

    // Process photos - handle various formats and add fallbacks
    const processPhotos = (photos) => {
      const defaultPhotos = [
        "https://images.unsplash.com/photo-1565623006066-82f23c79210b?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800&h=600&fit=crop"
      ];

      if (!photos || photos.length === 0) {
        return defaultPhotos;
      }

      // Extract URLs from photo objects if needed
      const processedPhotos = photos.map(photo => {
        if (typeof photo === 'string') {
          // If it's already a string URL, use it
          return photo.startsWith('http') ? photo : `https://images.unsplash.com/photo-1565623006066-82f23c79210b?w=1200&h=800&fit=crop`;
        } else if (photo && photo.url) {
          // If it's an object with a url property
          return photo.url;
        } else {
          // Fallback to a default image
          return defaultPhotos[0];
        }
      });

      // Ensure we have at least 5 photos for the gallery
      while (processedPhotos.length < 5) {
        processedPhotos.push(defaultPhotos[processedPhotos.length % defaultPhotos.length]);
      }

      return processedPhotos;
    };

    // Transform old API structure to new structure
    return {
      id: apiData.id,
      title: apiData.title || "Luxury Apartment in Qatar",
      subtitle: apiData.type || "Entire rental unit",
      location: {
        city: apiData.city || "Doha",
        area: apiData.area || "The Pearl",
        country: "Qatar",
        address: apiData.address || apiData.streetNumber || "Address available after booking"
      },
      coordinates: apiData.coordinates || { lat: 25.3680, lng: 51.5517 },
      host: apiData.host || {
        id: "host123",
        name: "Host",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=56&h=56&fit=crop&facepad=3",
        isSuperhost: false,
        verified: true,
        joinDate: "2020",
        responseRate: 100,
        responseTime: "within an hour",
        languages: ["English", "Arabic"],
        about: "Professional property manager in Doha",
        reviews: 50,
        rating: 4.5
      },
      pricing: {
        basePrice: apiData.monthlyPrice || 3000,
        currency: "QAR",
        monthlyDiscount: 15,
        weeklyDiscount: 10,
        cleaningFee: apiData.cleaningFee || 200,
        securityDeposit: apiData.securityDeposit || 1000,
        serviceFee: 350
      },
      details: {
        propertyType: apiData.propertyType || "Apartment",
        roomType: "Entire place",
        bedrooms: apiData.bedrooms || 2,
        beds: apiData.beds || apiData.bedrooms || 2,
        bathrooms: apiData.bathrooms || 2,
        maxGuests: apiData.maxGuests || 4,
        size: apiData.squareMeters || 100,
        floor: apiData.floor || 1
      },
      highlights: [
        { icon: "🏖️", title: "Great location", description: "Located in prime area" },
        { icon: "💼", title: "Dedicated workspace", description: "Perfect for remote work" },
        { icon: "🚪", title: "Self check-in", description: "Check yourself in" }
      ],
      description: apiData.description || "Beautiful apartment in the heart of Qatar",
      bedrooms: [
        { name: "Master Bedroom", beds: ["1 king bed"], features: ["Ensuite bathroom"] },
        { name: "Guest Bedroom", beds: ["2 single beds"], features: ["Built-in wardrobe"] }
      ],
      amenities: transformAmenities(apiData.inUnitFeatures || apiData.amenities || {}),
      photos: processPhotos(apiData.photos),
      reviews: {
        overall: 4.5,
        count: 20,
        categories: {
          cleanliness: 4.5,
          accuracy: 4.5,
          checkIn: 4.5,
          communication: 4.5,
          location: 4.5,
          value: 4.5
        },
        recent: []
      },
      houseRules: {
        checkIn: apiData.checkInTime || "3:00 PM - 11:00 PM",
        checkOut: apiData.checkOutTime || "11:00 AM",
        additional: [
          "No smoking",
          "No parties or events",
          apiData.houseRules || "Respect the property"
        ]
      },
      cancellationPolicy: {
        type: "Flexible",
        description: "Free cancellation up to 24 hours before check-in"
      },
      availability: {
        minimumStay: apiData.minNights || 30,
        maximumStay: 365,
        instantBook: apiData.instantBook || false
      }
    };
  };

  const transformAmenities = (features) => {
    const amenities = {
      "Guest favorites": [],
      "Bathroom": [],
      "Kitchen and dining": [],
      "Entertainment": [],
      "Heating and cooling": [],
      "Home safety": [],
      "Parking and facilities": [],
      "Services": []
    };

    // Map old amenities structure to new categorized structure
    if (features.wifi) amenities["Guest favorites"].push({ icon: "📶", name: "Wi-Fi", popular: true });
    if (features.parking) amenities["Guest favorites"].push({ icon: "🚗", name: "Free parking", popular: true });
    if (features.kitchen) amenities["Kitchen and dining"].push({ icon: "🍳", name: "Kitchen" });
    if (features.washer) amenities["Services"].push({ icon: "🧺", name: "Washer" });
    if (features.dryer) amenities["Services"].push({ icon: "👔", name: "Dryer" });
    if (features.airConditioning) amenities["Heating and cooling"].push({ icon: "❄️", name: "Air conditioning" });
    if (features.heating) amenities["Heating and cooling"].push({ icon: "🔥", name: "Heating" });
    if (features.pool) amenities["Parking and facilities"].push({ icon: "🏊", name: "Pool" });
    if (features.gym) amenities["Parking and facilities"].push({ icon: "🏋️", name: "Gym" });
    if (features.elevator) amenities["Parking and facilities"].push({ icon: "🛗", name: "Elevator" });
    if (features.balcony) amenities["Guest favorites"].push({ icon: "🌅", name: "Balcony" });
    if (features.workspace) amenities["Guest favorites"].push({ icon: "💼", name: "Dedicated workspace" });
    if (features.tv) amenities["Entertainment"].push({ icon: "📺", name: "TV" });
    if (features.dishwasher) amenities["Kitchen and dining"].push({ icon: "🍽️", name: "Dishwasher" });
    if (features.petFriendly) amenities["Services"].push({ icon: "🐕", name: "Pets allowed" });

    // Add some default amenities if categories are empty
    if (amenities["Guest favorites"].length === 0) {
      amenities["Guest favorites"] = [
        { icon: "📶", name: "Wi-Fi", popular: true },
        { icon: "🍳", name: "Kitchen", popular: true }
      ];
    }

    return amenities;
  };

  const getMockProperty = () => ({
    id: params.id,
    title: "Luxury Marina View Apartment - The Pearl Qatar",
    subtitle: "Entire rental unit",
    location: {
      city: "Doha",
      area: "The Pearl",
      country: "Qatar",
      address: "Porto Arabia, The Pearl",
      coordinates: { lat: 25.3680, lng: 51.5517 }
    },
    host: {
      id: "host123",
      name: "Ahmed",
      image: "/api/placeholder/56/56",
      isSuperhost: true,
      verified: true,
      joinDate: "2019",
      responseRate: 100,
      responseTime: "within an hour",
      languages: ["English", "Arabic", "French"],
      about: "Hi! I'm Ahmed, a property manager passionate about providing exceptional stays in Doha. I've been hosting for 5 years and love helping guests discover the best of Qatar.",
      reviews: 245,
      rating: 4.89
    },
    pricing: {
      basePrice: 3500,
      currency: "QAR",
      monthlyDiscount: 15,
      weeklyDiscount: 10,
      cleaningFee: 200,
      securityDeposit: 1000,
      serviceFee: 350
    },
    details: {
      propertyType: "Apartment",
      roomType: "Entire place",
      bedrooms: 2,
      beds: 3,
      bathrooms: 2.5,
      maxGuests: 4,
      size: 120,
      floor: 15
    },
    highlights: [
      { icon: "🏖️", title: "Marina views", description: "Wake up to stunning marina and sea views" },
      { icon: "🏊", title: "Pool access", description: "Access to rooftop infinity pool" },
      { icon: "💼", title: "Dedicated workspace", description: "Fast wifi and ergonomic desk setup" },
      { icon: "🚪", title: "Self check-in", description: "Check yourself in with the smartlock" }
    ],
    description: `Experience luxury living in this stunning 2-bedroom apartment located in the heart of The Pearl Qatar. With breathtaking marina views and premium amenities, this space offers the perfect blend of comfort and sophistication.

The apartment features floor-to-ceiling windows that flood the space with natural light, highlighting the contemporary décor and high-end finishes throughout. The open-plan living area seamlessly connects to a modern kitchen equipped with state-of-the-art appliances.

Both bedrooms are spacious and elegantly furnished, with the master bedroom featuring an ensuite bathroom and direct balcony access. The second bedroom is perfect for children or additional guests.`,
    bedrooms: [
      { name: "Master Bedroom", beds: ["1 king bed"], features: ["Ensuite bathroom", "Balcony access", "Walk-in closet"] },
      { name: "Guest Bedroom", beds: ["2 single beds"], features: ["Built-in wardrobe", "Workspace"] }
    ],
    amenities: {
      "Guest favorites": [
        { icon: "🌊", name: "Marina view", popular: true },
        { icon: "🍳", name: "Kitchen", popular: true },
        { icon: "📶", name: "Wifi - 250 Mbps", popular: true },
        { icon: "💼", name: "Dedicated workspace", popular: true },
        { icon: "🚗", name: "Free parking", popular: true }
      ],
      "Bathroom": [
        { icon: "🚿", name: "Hair dryer" },
        { icon: "🧴", name: "Shampoo" },
        { icon: "🧼", name: "Body soap" },
        { icon: "🛁", name: "Bathtub" },
        { icon: "🚿", name: "Hot water" }
      ],
      "Bedroom and laundry": [
        { icon: "🧺", name: "Washer" },
        { icon: "👔", name: "Dryer" },
        { icon: "🛏️", name: "Extra pillows and blankets" },
        { icon: "👕", name: "Iron" },
        { icon: "🚪", name: "Room-darkening shades" }
      ],
      "Entertainment": [
        { icon: "📺", name: "55\" HDTV with Netflix, Disney+" },
        { icon: "🎮", name: "PlayStation 5" },
        { icon: "📚", name: "Books and reading material" },
        { icon: "🎵", name: "Sound system" }
      ],
      "Family": [
        { icon: "👶", name: "Crib" },
        { icon: "🪑", name: "High chair" },
        { icon: "🧸", name: "Children's toys" },
        { icon: "🎮", name: "Board games" }
      ],
      "Heating and cooling": [
        { icon: "❄️", name: "Central air conditioning" },
        { icon: "🌡️", name: "Heating" },
        { icon: "🪟", name: "Portable fans" }
      ],
      "Home safety": [
        { icon: "🚨", name: "Smoke alarm" },
        { icon: "🔥", name: "Fire extinguisher" },
        { icon: "🩹", name: "First aid kit" },
        { icon: "🔒", name: "Lock on bedroom door" }
      ],
      "Kitchen and dining": [
        { icon: "🍳", name: "Kitchen" },
        { icon: "☕", name: "Coffee maker" },
        { icon: "🥤", name: "Wine glasses" },
        { icon: "🍴", name: "Dishes and silverware" },
        { icon: "🧊", name: "Freezer" },
        { icon: "🔥", name: "Gas stove" },
        { icon: "🥘", name: "Cooking basics" },
        { icon: "🍞", name: "Toaster" },
        { icon: "🥣", name: "Dining table" }
      ],
      "Location features": [
        { icon: "🏖️", name: "Beach access" },
        { icon: "🌊", name: "Waterfront" },
        { icon: "🚶", name: "Marina walkway" }
      ],
      "Outdoor": [
        { icon: "🌅", name: "Private balcony" },
        { icon: "🪑", name: "Outdoor furniture" },
        { icon: "🍖", name: "BBQ grill" }
      ],
      "Parking and facilities": [
        { icon: "🚗", name: "Free parking on premises" },
        { icon: "🏊", name: "Pool" },
        { icon: "🏋️", name: "Gym" },
        { icon: "🛗", name: "Elevator" }
      ],
      "Services": [
        { icon: "🧹", name: "Cleaning available" },
        { icon: "🔑", name: "Luggage dropoff allowed" }
      ]
    },
    photos: [
      "/api/placeholder/1200/800",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    reviews: {
      overall: 4.85,
      count: 124,
      categories: {
        cleanliness: 4.9,
        accuracy: 4.8,
        checkIn: 4.9,
        communication: 5.0,
        location: 4.7,
        value: 4.6
      },
      recent: [
        {
          id: 1,
          author: "Sarah",
          authorImage: "/api/placeholder/40/40",
          date: "December 2024",
          rating: 5,
          comment: "Amazing apartment with stunning views! Ahmed was a wonderful host, very responsive and helpful. The location is perfect - walking distance to restaurants and shops."
        },
        {
          id: 2,
          author: "Michael",
          authorImage: "/api/placeholder/40/40",
          date: "November 2024",
          rating: 5,
          comment: "Exceeded our expectations! The apartment is exactly as shown in the photos. Very clean, modern, and comfortable. Would definitely stay again."
        }
      ]
    },
    houseRules: {
      checkIn: "3:00 PM - 11:00 PM",
      checkOut: "11:00 AM",
      additional: [
        "No smoking",
        "No parties or events",
        "Pets allowed with prior approval",
        "Quiet hours: 10:00 PM - 8:00 AM"
      ]
    },
    cancellationPolicy: {
      type: "Flexible",
      description: "Free cancellation up to 24 hours before check-in"
    },
    availability: {
      minimumStay: 30,
      maximumStay: 365,
      instantBook: true
    }
  });

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!property) return 0;
    const nights = calculateNights();
    const baseTotal = nights * (property.pricing.basePrice / 30);
    const serviceFee = baseTotal * 0.1;
    return baseTotal + serviceFee + (property.pricing.cleaningFee || 0);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <header style={{
        padding: '20px 0',
        borderBottom: '1px solid #ebebeb',
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF385C', textDecoration: 'none' }}>
              houseiana
            </Link>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <Link href="/search" style={{ color: '#222', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                Explore
              </Link>
              <Link href="/dashboard" style={{ color: '#222', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                Dashboard
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Title Section */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '600', marginBottom: '8px' }}>{property.title}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
            <span>⭐ {property.reviews.overall}</span>
            <span>·</span>
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>{property.reviews.count} reviews</span>
            {property.host.isSuperhost && (
              <>
                <span>·</span>
                <span>🏆 Superhost</span>
              </>
            )}
            <span>·</span>
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              {property.location.area}, {property.location.city}, {property.location.country}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <span>↗</span> Share
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <span style={{ color: isSaved ? '#FF385C' : '#222' }}>{isSaved ? '❤️' : '🤍'}</span> Save
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(2, 280px)',
          gap: '8px',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Main large photo */}
          <div style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
            <img
              src={property.photos[0]}
              alt="Main"
              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => setShowAllPhotos(true)}
            />
          </div>
          {/* Other photos */}
          {property.photos.slice(1, 5).map((photo, index) => (
            <div key={index}>
              <img
                src={photo}
                alt={`View ${index + 2}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => setShowAllPhotos(true)}
              />
            </div>
          ))}
          <button
            onClick={() => setShowAllPhotos(true)}
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '24px',
              padding: '8px 16px',
              backgroundColor: 'white',
              border: '1px solid #222',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <span>⊞</span> Show all photos
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '80px' }}>
          {/* Left Column */}
          <div>
            {/* Host Info */}
            <div style={{ paddingBottom: '32px', borderBottom: '1px solid #ebebeb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '8px' }}>
                    {property.subtitle} hosted by {property.host.name}
                  </h2>
                  <div style={{ display: 'flex', gap: '4px', fontSize: '16px' }}>
                    <span>{property.details.maxGuests} guests</span>
                    <span>·</span>
                    <span>{property.details.bedrooms} bedrooms</span>
                    <span>·</span>
                    <span>{property.details.beds} beds</span>
                    <span>·</span>
                    <span>{property.details.bathrooms} baths</span>
                  </div>
                </div>
                <img
                  src={property.host.image}
                  alt={property.host.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%' }}
                />
              </div>
            </div>

            {/* Highlights */}
            <div style={{ padding: '32px 0', borderBottom: '1px solid #ebebeb' }}>
              {property.highlights.map((highlight, index) => (
                <div key={index} style={{ display: 'flex', gap: '16px', marginBottom: index < property.highlights.length - 1 ? '24px' : 0 }}>
                  <span style={{ fontSize: '24px' }}>{highlight.icon}</span>
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>{highlight.title}</div>
                    <div style={{ fontSize: '14px', color: '#717171' }}>{highlight.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ padding: '32px 0', borderBottom: '1px solid #ebebeb' }}>
              <p style={{ lineHeight: '24px', whiteSpace: 'pre-wrap' }}>{property.description}</p>
            </div>

            {/* Bedroom Details */}
            <div style={{ padding: '32px 0', borderBottom: '1px solid #ebebeb' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '24px' }}>Where you'll sleep</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {property.bedrooms.map((bedroom, index) => (
                  <div key={index} style={{
                    padding: '24px',
                    border: '1px solid #ebebeb',
                    borderRadius: '12px'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛏️</div>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>{bedroom.name}</div>
                    <div style={{ fontSize: '14px' }}>{bedroom.beds.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div style={{ padding: '32px 0', borderBottom: '1px solid #ebebeb' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '24px' }}>What this place offers</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {Object.entries(property.amenities).slice(0, 2).map(([category, items]) =>
                  items.slice(0, 5).map((amenity, index) => (
                    <div key={`${category}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '20px' }}>{amenity.icon}</span>
                      <span style={{ fontSize: '16px' }}>
                        {amenity.name}
                        {amenity.popular && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#717171' }}>Guest favorite</span>}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => setShowAllAmenities(true)}
                style={{
                  marginTop: '24px',
                  padding: '13px 23px',
                  backgroundColor: 'white',
                  border: '1px solid #222',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Show all {Object.values(property.amenities).flat().length} amenities
              </button>
            </div>

            {/* Reviews */}
            <div style={{ padding: '32px 0', borderBottom: '1px solid #ebebeb' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '32px' }}>Guest reviews</h3>
              <ReviewDisplay 
                reviews={propertyReviews} 
                type="property" 
                showHostResponse={true} 
              />
            </div>

            {/* Location */}
            <div style={{ padding: '48px 0' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '24px' }}>Where you'll be</h3>
              <PropertyMap 
                location={property.location}
                coordinates={property.coordinates}
                title={property.title}
              />
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div style={{
              position: 'sticky',
              top: '100px',
              border: '1px solid #dddddd',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '22px', fontWeight: '600' }}>QAR {property.pricing.basePrice}</span>
                  <span style={{ fontSize: '16px' }}>month</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                  <span style={{ fontSize: '14px' }}>⭐ {property.reviews.overall}</span>
                  <span style={{ fontSize: '14px' }}>·</span>
                  <span style={{ fontSize: '14px', textDecoration: 'underline', cursor: 'pointer' }}>
                    {property.reviews.count} reviews
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  border: '1px solid #bbbbbb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <div style={{
                      padding: '10px 12px',
                      borderRight: '1px solid #bbbbbb',
                      cursor: 'pointer'
                    }}>
                      <label style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.04em' }}>CHECK-IN</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => {
                          setCheckIn(e.target.value);
                          // Reset checkout if it's before the new check-in date
                          if (checkOut && new Date(checkOut) <= new Date(e.target.value)) {
                            setCheckOut('');
                          }
                        }}
                        min={new Date().toISOString().split('T')[0]} // Can't book in the past
                        style={{
                          display: 'block',
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: '14px',
                          marginTop: '2px'
                        }}
                      />
                    </div>
                    <div style={{
                      padding: '10px 12px',
                      cursor: 'pointer'
                    }}>
                      <label style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.04em' }}>CHECKOUT</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]} // At least 1 day after check-in
                        disabled={!checkIn} // Can't select checkout without check-in
                        style={{
                          display: 'block',
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: '14px',
                          marginTop: '2px',
                          opacity: !checkIn ? 0.5 : 1,
                          cursor: !checkIn ? 'not-allowed' : 'pointer'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{
                    padding: '10px 12px',
                    borderTop: '1px solid #bbbbbb',
                    cursor: 'pointer'
                  }}>
                    <label style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.04em' }}>GUESTS</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      style={{
                        display: 'block',
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        marginTop: '2px'
                      }}
                    >
                      {[1,2,3,4].map(n => (
                        <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    checkin: checkIn,
                    checkout: checkOut,
                    numberOfGuests: guests.toString(),
                    numberOfAdults: guests.toString(),
                    numberOfChildren: '0',
                    numberOfInfants: '0',
                    numberOfPets: '0',
                    isWorkTrip: 'false'
                  });
                  router.push(`/book/${property.id}?${params.toString()}`);
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#FF385C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '8px'
                }}
              >
                Reserve
              </button>

              <p style={{ textAlign: 'center', fontSize: '14px', color: '#222', marginBottom: '16px' }}>
                You won't be charged yet
              </p>

              {checkIn && checkOut && (
                <>
                  <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ textDecoration: 'underline' }}>
                        QAR {(property.pricing.basePrice / 30).toFixed(0)} × {calculateNights()} nights
                      </span>
                      <span>QAR {(calculateNights() * property.pricing.basePrice / 30).toFixed(0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ textDecoration: 'underline' }}>Cleaning fee</span>
                      <span>QAR {property.pricing.cleaningFee}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ textDecoration: 'underline' }}>Service fee</span>
                      <span>QAR {property.pricing.serviceFee}</span>
                    </div>
                  </div>

                  <div style={{
                    paddingTop: '16px',
                    borderTop: '1px solid #dddddd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '600'
                  }}>
                    <span>Total</span>
                    <span>QAR {calculateTotal().toFixed(0)}</span>
                  </div>
                </>
              )}

              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#f7f7f7',
                borderRadius: '8px',
                border: '1px solid #dddddd'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px' }}>💎</span>
                  <span style={{ fontWeight: '500' }}>This is a rare find</span>
                </div>
                <p style={{ fontSize: '14px', color: '#717171' }}>
                  {property.host.name}'s place is usually booked.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Host Section */}
        <div style={{ padding: '48px 0', borderTop: '1px solid #ebebeb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '24px' }}>Meet your Host</h3>
              <div style={{
                padding: '32px',
                backgroundColor: '#f7f7f7',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <img
                  src={property.host.image}
                  alt={property.host.name}
                  style={{ width: '104px', height: '104px', borderRadius: '50%', margin: '0 auto 16px' }}
                />
                <h4 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '4px' }}>{property.host.name}</h4>
                {property.host.isSuperhost && (
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>🏆 Superhost</span>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '24px 0', fontSize: '14px' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{property.host.reviews}</div>
                    <div style={{ fontSize: '12px' }}>Reviews</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{property.host.rating} ⭐</div>
                    <div style={{ fontSize: '12px' }}>Rating</div>
                  </div>
                </div>

                <div style={{ fontSize: '14px', marginBottom: '24px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>5</div>
                  <div style={{ fontSize: '12px' }}>Years hosting</div>
                </div>
              </div>
            </div>
            
            <div>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '16px' }}>
                  {property.host.about}
                </p>
                <div style={{ fontSize: '14px' }}>
                  <div style={{ marginBottom: '8px' }}>Response rate: {property.host.responseRate}%</div>
                  <div>Response time: {property.host.responseTime}</div>
                </div>
              </div>
              
              <button style={{
                padding: '13px 23px',
                backgroundColor: 'white',
                border: '1px solid #222',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Message Host
              </button>
              
              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#fff8f6',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#717171'
              }}>
                <p>⚠️ To protect your payment, never transfer money or communicate outside of the Houseiana website or app.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Things to Know */}
        <div style={{ padding: '48px 0', borderTop: '1px solid #ebebeb' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '24px' }}>Things to know</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            <div>
              <h4 style={{ fontWeight: '500', marginBottom: '16px' }}>House rules</h4>
              <div style={{ fontSize: '14px', lineHeight: '20px' }}>
                <div style={{ marginBottom: '8px' }}>{property.houseRules.checkIn}</div>
                <div style={{ marginBottom: '8px' }}>Checkout before {property.houseRules.checkOut}</div>
                {property.houseRules.additional.slice(0, 2).map((rule, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>{rule}</div>
                ))}
                <button style={{
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: 0
                }}>
                  Show more
                </button>
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: '500', marginBottom: '16px' }}>Safety & property</h4>
              <div style={{ fontSize: '14px', lineHeight: '20px' }}>
                <div style={{ marginBottom: '8px' }}>Smoke alarm</div>
                <div style={{ marginBottom: '8px' }}>Carbon monoxide alarm</div>
                <div style={{ marginBottom: '8px' }}>Security cameras on property</div>
                <button style={{
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: 0
                }}>
                  Show more
                </button>
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: '500', marginBottom: '16px' }}>Cancellation policy</h4>
              <div style={{ fontSize: '14px', lineHeight: '20px' }}>
                <div style={{ marginBottom: '8px' }}>{property.cancellationPolicy.description}</div>
                <div style={{ marginBottom: '8px' }}>Review the Host's full cancellation policy which applies even if you cancel for illness or disruptions.</div>
                <button style={{
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: 0
                }}>
                  Show more
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #ebebeb',
        backgroundColor: '#f7f7f7',
        padding: '24px 0'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', color: '#717171' }}>
              © 2025 Houseiana, Inc. · Privacy · Terms · Sitemap
            </div>
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
              <span>🌐 English (US)</span>
              <span>QAR</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAllPhotos && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '24px'
          }}>
            <button
              onClick={() => setShowAllPhotos(false)}
              style={{
                position: 'sticky',
                top: '24px',
                left: '24px',
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #222',
                borderRadius: '8px',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              ← Close
            </button>
            <div style={{ marginTop: '24px' }}>
              {property.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  style={{ width: '100%', marginBottom: '8px' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showAllAmenities && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '780px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #ebebeb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: '500' }}>What this place offers</h2>
              <button
                onClick={() => setShowAllAmenities(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {Object.entries(property.amenities).map(([category, items]) => (
                <div key={category} style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>{category}</h3>
                  {items.map((amenity, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      paddingBottom: '16px',
                      borderBottom: index < items.length - 1 ? '1px solid #ebebeb' : 'none',
                      marginBottom: '16px'
                    }}>
                      <span style={{ fontSize: '24px' }}>{amenity.icon}</span>
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}