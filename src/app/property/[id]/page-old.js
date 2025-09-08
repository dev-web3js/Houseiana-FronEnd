"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPropertyDetails();
    }
  }, [params.id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        console.error('Failed to fetch property');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    router.push(`/booking/new?property=${property.id}`);
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (typeof photo === 'string') return photo;
    return photo.url || photo;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '48px' }}>🏠</div>
        <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Property not found</h2>
        <Link href="/search" style={{
          padding: '12px 24px',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none'
        }}>
          Back to Search
        </Link>
      </div>
    );
  }

  const photos = property.photos && property.photos.length > 0 ? property.photos : [];
  const amenities = property.inUnitFeatures || {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ 
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2563eb',
            textDecoration: 'none'
          }}>
            Houseiana
          </Link>
          
          <Link href="/search" style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            Back to Search
          </Link>
        </div>
      </nav>

      {/* Photo Gallery */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {photos.length > 0 ? (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: photos.length === 1 ? '1fr' : '2fr 1fr',
              gap: '8px',
              height: '500px',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              {/* Main Photo */}
              <div style={{
                gridRow: photos.length === 1 ? '1' : 'span 2',
                position: 'relative',
                backgroundColor: '#f3f4f6'
              }}>
                <img
                  src={getPhotoUrl(photos[selectedPhoto])}
                  alt={property.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 64px;">🏠</div>';
                  }}
                />
              </div>
              
              {/* Thumbnail Photos */}
              {photos.length > 1 && (
                <>
                  {photos.slice(1, 3).map((photo, index) => (
                    <div 
                      key={index}
                      style={{
                        position: 'relative',
                        backgroundColor: '#f3f4f6',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedPhoto(index + 1)}
                    >
                      <img
                        src={getPhotoUrl(photo)}
                        alt={`${property.title} ${index + 2}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {index === 1 && photos.length > 3 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllPhotos(true);
                          }}
                          style={{
                            position: 'absolute',
                            bottom: '16px',
                            right: '16px',
                            padding: '8px 16px',
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Show all {photos.length} photos
                        </button>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            height: '400px',
            backgroundColor: '#f3f4f6',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
            marginBottom: '32px'
          }}>
            🏠
          </div>
        )}

        {/* Property Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '32px'
        }}>
          {/* Left Column - Details */}
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              {property.title}
            </h1>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '24px' }}>
              {property.area}, {property.city}
            </p>

            <div style={{
              display: 'flex',
              gap: '24px',
              padding: '20px 0',
              borderTop: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '32px'
            }}>
              <div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{property.bedrooms}</span>
                <span style={{ color: '#6b7280', marginLeft: '8px' }}>Bedrooms</span>
              </div>
              <div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{property.bathrooms}</span>
                <span style={{ color: '#6b7280', marginLeft: '8px' }}>Bathrooms</span>
              </div>
              <div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{property.maxGuests}</span>
                <span style={{ color: '#6b7280', marginLeft: '8px' }}>Guests</span>
              </div>
              {property.squareMeters && (
                <div>
                  <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{property.squareMeters}</span>
                  <span style={{ color: '#6b7280', marginLeft: '8px' }}>m²</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
                About this property
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
                {property.description || 'No description available.'}
              </p>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
                Amenities
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {Object.entries({
                  wifi: '📶 Wi-Fi',
                  airConditioning: '❄️ Air Conditioning',
                  heating: '🔥 Heating',
                  kitchen: '🍳 Kitchen',
                  washer: '🌊 Washer',
                  dryer: '👕 Dryer',
                  parking: '🚗 Parking',
                  pool: '🏊 Pool',
                  gym: '💪 Gym',
                  elevator: '🛗 Elevator',
                  balcony: '🏞️ Balcony',
                  workspace: '💻 Workspace',
                  tv: '📺 TV',
                  dishwasher: '🍽️ Dishwasher',
                  petFriendly: '🐕 Pet Friendly'
                }).map(([key, label]) => {
                  if (amenities[key]) {
                    return (
                      <div key={key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '16px'
                      }}>
                        {label}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* House Rules */}
            {property.houseRules && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
                  House Rules
                </h2>
                <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
                  {property.houseRules}
                </p>
              </div>
            )}

            {/* Location */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
                Location
              </h2>
              <p style={{ fontSize: '16px', marginBottom: '16px', color: '#374151' }}>
                {property.buildingName && `${property.buildingName}, `}
                {property.address || property.streetNumber || 'Address available after booking'}
              </p>
              
              {/* Map Placeholder */}
              <div style={{
                height: '400px',
                backgroundColor: '#e5e7eb',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                  <p style={{ color: '#6b7280' }}>
                    {property.area}, {property.city}, Qatar
                  </p>
                  {property.coordinates && (
                    <a
                      href={`https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: '16px',
                        padding: '8px 16px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '14px'
                      }}
                    >
                      View on Google Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div style={{
              position: 'sticky',
              top: '100px',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '32px', fontWeight: 'bold' }}>
                  QAR {property.monthlyPrice}
                  <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#6b7280' }}> /month</span>
                </p>
                {property.weeklyPrice && (
                  <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                    QAR {property.weeklyPrice} /week
                  </p>
                )}
                {property.nightlyPrice && (
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    QAR {property.nightlyPrice} /night
                  </p>
                )}
              </div>

              <button
                onClick={handleBooking}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '16px'
                }}
              >
                Book Now
              </button>

              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong>Check-in:</strong> {property.checkInTime || '3:00 PM'}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>Check-out:</strong> {property.checkOutTime || '11:00 AM'}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>Minimum stay:</strong> {property.minNights || 30} nights
                </div>
                {property.securityDeposit && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Security deposit:</strong> QAR {property.securityDeposit}
                  </div>
                )}
                {property.cleaningFee && (
                  <div>
                    <strong>Cleaning fee:</strong> QAR {property.cleaningFee}
                  </div>
                )}
              </div>

              {property.instantBook && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#059669',
                  textAlign: 'center'
                }}>
                  ⚡ Instant Booking Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* All Photos Modal */}
      {showAllPhotos && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 100,
          overflowY: 'auto'
        }}>
          <div style={{
            padding: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600' }}>
                All Photos ({photos.length})
              </h2>
              <button
                onClick={() => setShowAllPhotos(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '16px'
            }}>
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={getPhotoUrl(photo)}
                  alt={`${property.title} ${index + 1}`}
                  style={{
                    width: '100%',
                    borderRadius: '8px'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}