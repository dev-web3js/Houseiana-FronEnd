"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CreateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    propertyId: searchParams.get('property'),
    checkIn: searchParams.get('checkIn'),
    checkOut: searchParams.get('checkOut'),
    guests: parseInt(searchParams.get('guests') || '2'),
    specialRequests: ''
  });

  useEffect(() => {
    checkAuthAndLoadProperty();
  }, []);

  const checkAuthAndLoadProperty = async () => {
    try {
      // Check if user is logged in
      const authResponse = await fetch('/api/auth/me');
      if (authResponse.ok) {
        const userData = await authResponse.json();
        setUser(userData);
      } else {
        // Save current URL to redirect back after login
        localStorage.setItem('redirectAfterLogin', window.location.href);
        router.push('/auth/sign-in');
        return;
      }

      // Load property details
      if (bookingData.propertyId) {
        const propResponse = await fetch(`/api/properties/${bookingData.propertyId}`);
        if (propResponse.ok) {
          const propData = await propResponse.json();
          setProperty(propData);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!property) return { nights: 0, subtotal: 0, cleaningFee: 0, serviceFee: 0, total: 0 };
    const nights = calculateNights();
    const nightlyPrice = parseFloat(property.nightlyPrice || property.monthlyPrice / 30);
    const subtotal = nightlyPrice * nights;
    const cleaningFee = parseFloat(property.cleaningFee || 0);
    const serviceFee = subtotal * 0.10; // 10% service fee
    const total = subtotal + cleaningFee + serviceFee;
    return { nights, nightlyPrice, subtotal, cleaningFee, serviceFee, total };
  };

  const handleProceedToTerms = () => {
    // Save booking details to session storage
    const pricing = calculateTotal();
    sessionStorage.setItem('bookingDetails', JSON.stringify({
      ...bookingData,
      pricing,
      property: {
        id: property.id,
        title: property.title,
        address: `${property.area}, ${property.city}`,
        host: property.host
      },
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      }
    }));
    router.push('/booking/terms');
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading booking details...</div>
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
        <div>Property not found</div>
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

  const pricing = calculateTotal();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>
          Complete Your Booking
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Property Details */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Property Details
              </h2>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '120px',
                  height: '90px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px'
                }}>
                  🏠
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                    {property.title}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                    {property.area}, {property.city}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {property.bedrooms} BR • {property.bathrooms} BA • {property.maxGuests} Guests
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Check-in</p>
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>{bookingData.checkIn}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Check-out</p>
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>{bookingData.checkOut}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Guests</p>
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>{bookingData.guests}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Duration</p>
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>{calculateNights()} nights</p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Special Requests
              </h2>
              <textarea
                placeholder="Any special requests or notes for the host..."
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Booking Summary */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              position: 'sticky',
              top: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Booking Summary
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>QAR {pricing.nightlyPrice?.toFixed(2)} × {pricing.nights} nights</span>
                  <span>QAR {pricing.subtotal?.toFixed(2)}</span>
                </div>
                {pricing.cleaningFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Cleaning fee</span>
                    <span>QAR {pricing.cleaningFee?.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Service fee</span>
                  <span>QAR {pricing.serviceFee?.toFixed(2)}</span>
                </div>
                <div style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '12px',
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: '600',
                  fontSize: '18px'
                }}>
                  <span>Total (QAR)</span>
                  <span>QAR {pricing.total?.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToTerms}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Continue to Terms & Conditions
              </button>

              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '12px',
                textAlign: 'center'
              }}>
                You won't be charged yet
              </p>

              {/* Guest Info */}
              <div style={{
                padding: '12px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                marginTop: '16px',
                fontSize: '14px'
              }}>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                  Booking for:
                </p>
                <p>{user?.firstName} {user?.lastName}</p>
                <p style={{ color: '#92400e', fontSize: '13px' }}>
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}