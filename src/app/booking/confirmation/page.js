"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingId = searchParams.get('id');
    if (bookingId) {
      fetchBookingDetails(bookingId);
    } else {
      // Check if there's a recent booking in session storage
      const recentBooking = sessionStorage.getItem('recentBooking');
      if (recentBooking) {
        setBooking(JSON.parse(recentBooking));
        setLoading(false);
        sessionStorage.removeItem('recentBooking');
      } else {
        router.push('/');
      }
    }
  }, [searchParams]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      } else {
        console.error('Failed to fetch booking details');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading confirmation...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '48px' }}>❌</div>
        <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Booking not found</h2>
        <Link href="/" style={{
          padding: '12px 24px',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none'
        }}>
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Success Banner */}
      <div style={{
        backgroundColor: '#10b981',
        color: 'white',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✓</div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            Booking Confirmed!
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.95 }}>
            Your reservation has been successfully confirmed
          </p>
        </div>
      </div>

      {/* Confirmation Details */}
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
        {/* Confirmation Code */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Confirmation Code
          </p>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#2563eb',
            letterSpacing: '2px',
            fontFamily: 'monospace'
          }}>
            {booking.confirmationCode || 'BOOK' + Math.random().toString(36).substr(2, 6).toUpperCase()}
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
            Please save this code for your records
          </p>
        </div>

        {/* Booking Details */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Booking Details
          </h2>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Property Info */}
            <div style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                {booking.listing?.title || booking.propertyTitle || 'Property'}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {booking.listing?.area || booking.propertyArea}, {booking.listing?.city || booking.propertyCity || 'Qatar'}
              </p>
              {(booking.listing?.bedrooms || booking.propertyBedrooms) && (
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                  {booking.listing?.bedrooms || booking.propertyBedrooms} BR • 
                  {booking.listing?.bathrooms || booking.propertyBathrooms} BA
                </p>
              )}
            </div>

            {/* Dates and Guest Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Check-in
                </p>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>
                  {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  After 3:00 PM
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Check-out
                </p>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>
                  {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  Before 11:00 AM
                </p>
              </div>
            </div>

            {/* Guest Information */}
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Guest Information
              </p>
              <p style={{ fontSize: '16px', fontWeight: '500' }}>
                {booking.guest?.firstName} {booking.guest?.lastName || booking.guestName}
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                {booking.guest?.email || booking.guestEmail}
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                {booking.numberOfGuests || booking.guests} guest(s) • {booking.totalNights || booking.nights} night(s)
              </p>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Special Requests
                </p>
                <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#374151' }}>
                  {booking.specialRequests}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Payment Summary
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Accommodation</span>
              <span>QAR {((booking.totalPrice || 0) - (booking.cleaningFee || 0) - (booking.serviceFee || 0)).toFixed(2)}</span>
            </div>
            {booking.cleaningFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Cleaning fee</span>
                <span>QAR {booking.cleaningFee.toFixed(2)}</span>
              </div>
            )}
            {booking.serviceFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Service fee</span>
                <span>QAR {booking.serviceFee.toFixed(2)}</span>
              </div>
            )}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '8px',
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: '600',
              fontSize: '18px'
            }}>
              <span>Total Paid</span>
              <span>QAR {(booking.totalPrice || 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f0fdf4',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#059669'
          }}>
            ✓ Payment completed successfully
          </div>
        </div>

        {/* Important Information */}
        <div style={{
          backgroundColor: '#fef3c7',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#92400e' }}>
            Important Information
          </h3>
          <ul style={{ fontSize: '14px', color: '#92400e', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>A confirmation email has been sent to your registered email address</li>
            <li>Please present this confirmation code at check-in</li>
            <li>Contact the host 24 hours before arrival to coordinate check-in</li>
            <li>Review the property rules and check-in instructions</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '12px 24px',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            🖨️ Print Confirmation
          </button>
          <Link
            href="/dashboard"
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            View My Bookings
          </Link>
        </div>

        {/* Help Section */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '24px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <p style={{ marginBottom: '8px' }}>
            Need help? Contact our support team
          </p>
          <p>
            📧 support@houseiana.com | 📞 +974 1234 5678
          </p>
        </div>
      </div>
    </div>
  );
}