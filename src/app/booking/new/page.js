"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CreateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    propertyId: searchParams.get('property'),
    checkIn: searchParams.get('checkIn'),
    checkOut: searchParams.get('checkOut'),
    guests: 2,
    specialRequests: ''
  });

  useEffect(() => {
    fetchPropertyDetails();
  }, []);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`/api/properties/${bookingData.propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data.property);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    }
  };

  const calculateNights = () => {
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!property) return 0;
    const nights = calculateNights();
    const monthlyRate = parseFloat(property.monthlyRent);
    const dailyRate = monthlyRate / 30;
    const subtotal = dailyRate * nights;
    const cleaningFee = parseFloat(property.cleaningFee || 0);
    return (subtotal + cleaningFee).toFixed(2);
  };

  const handleBooking = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...bookingData,
          totalAmount: calculateTotal(),
          status: 'confirmed'
        })
      });
      
      if (response.ok) {
        router.push('/bookings/success');
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return <div>Loading...</div>;
  }

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
              <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                {property.title}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                {property.area}, {property.city}
              </p>
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
                  <span>QAR {(property.monthlyRent / 30).toFixed(2)} × {calculateNights()} nights</span>
                  <span>QAR {((property.monthlyRent / 30) * calculateNights()).toFixed(2)}</span>
                </div>
                {property.cleaningFee && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Cleaning fee</span>
                    <span>QAR {property.cleaningFee}</span>
                  </div>
                )}
                <div style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '12px',
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: '600',
                  fontSize: '18px'
                }}>
                  <span>Total</span>
                  <span>QAR {calculateTotal()}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: loading ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>

              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '12px',
                textAlign: 'center'
              }}>
                By booking, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}