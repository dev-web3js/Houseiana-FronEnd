"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookingTermsPage() {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve booking details from session storage
    const storedDetails = sessionStorage.getItem('bookingDetails');
    if (storedDetails) {
      setBookingDetails(JSON.parse(storedDetails));
      setLoading(false);
    } else {
      // No booking details, redirect back to search
      router.push('/search');
    }
  }, []);

  const handleAccept = () => {
    if (!termsAccepted) {
      alert('Please accept the terms and conditions to continue');
      return;
    }
    
    // Save acceptance in session storage
    const updatedDetails = {
      ...bookingDetails,
      termsAccepted: true,
      acceptedAt: new Date().toISOString()
    };
    sessionStorage.setItem('bookingDetails', JSON.stringify(updatedDetails));
    
    // Proceed to payment
    router.push('/booking/payment');
  };

  const handleDecline = () => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      sessionStorage.removeItem('bookingDetails');
      router.push('/search');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!bookingDetails) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>
          Terms & Conditions
        </h1>

        {/* Booking Summary Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Booking Summary
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
            <div>
              <span style={{ color: '#6b7280' }}>Property:</span>
              <p style={{ fontWeight: '500' }}>{bookingDetails.property?.title}</p>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Location:</span>
              <p style={{ fontWeight: '500' }}>{bookingDetails.property?.address}</p>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Check-in:</span>
              <p style={{ fontWeight: '500' }}>{bookingDetails.checkIn}</p>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Check-out:</span>
              <p style={{ fontWeight: '500' }}>{bookingDetails.checkOut}</p>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Total Amount:</span>
              <p style={{ fontWeight: '600', fontSize: '16px' }}>QAR {bookingDetails.pricing?.total?.toFixed(2)}</p>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Guest:</span>
              <p style={{ fontWeight: '500' }}>{bookingDetails.user?.name}</p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Rental Agreement Terms
          </h2>
          
          <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#374151' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>
              1. Booking Confirmation
            </h3>
            <p style={{ marginBottom: '12px' }}>
              By accepting these terms, you confirm your booking for the property listed above. The booking will be confirmed upon successful payment processing.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>
              2. Payment Terms
            </h3>
            <p style={{ marginBottom: '12px' }}>
              • Full payment is required at the time of booking<br/>
              • All prices are in Qatari Riyals (QAR)<br/>
              • Service fees and cleaning fees are non-refundable<br/>
              • Security deposit (if applicable) will be refunded within 7 days after check-out, subject to property inspection
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>
              3. Check-in/Check-out
            </h3>
            <p style={{ marginBottom: '12px' }}>
              • Check-in time: 3:00 PM (unless otherwise specified)<br/>
              • Check-out time: 11:00 AM (unless otherwise specified)<br/>
              • Late check-out may incur additional charges<br/>
              • Valid identification required at check-in
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>
              4. Cancellation Policy
            </h3>
            <p style={{ marginBottom: '12px' }}>
              • Cancellations made 30+ days before check-in: Full refund minus service fee<br/>
              • Cancellations made 7-29 days before check-in: 50% refund<br/>
              • Cancellations made less than 7 days before check-in: No refund<br/>
              • No-shows will not be refunded
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>
              5. Guest Responsibilities
            </h3>
            <p style={{ marginBottom: '12px' }}>
              • Maintain the property in good condition<br/>
              • Report any damages immediately<br/>
              • Respect quiet hours and neighborhood rules<br/>
              • No unauthorized guests or subletting<br/>
              • No smoking in non-smoking properties<br/>
              • Comply with all property-specific house rules
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>
              6. Liability
            </h3>
            <p style={{ marginBottom: '12px' }}>
              • Guests are liable for any damages to the property beyond normal wear and tear<br/>
              • Houseiana acts as a booking platform and is not responsible for disputes between guests and hosts<br/>
              • Travel insurance is recommended
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>
              7. Privacy Policy
            </h3>
            <p style={{ marginBottom: '12px' }}>
              Your personal information will be handled in accordance with our Privacy Policy. By accepting these terms, you consent to the collection and use of your information as described.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '12px' }}>
              8. Governing Law
            </h3>
            <p style={{ marginBottom: '12px' }}>
              These terms are governed by the laws of Qatar. Any disputes will be resolved through arbitration in Doha, Qatar.
            </p>
          </div>
        </div>

        {/* Acceptance Checkbox */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                marginTop: '2px',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontSize: '14px', lineHeight: '1.6' }}>
              I have read and agree to the Terms & Conditions and understand that this booking is binding upon payment. 
              I acknowledge that I am responsible for any damages to the property and will comply with all house rules.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={handleDecline}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cancel Booking
          </button>
          <button
            onClick={handleAccept}
            disabled={!termsAccepted}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: termsAccepted ? '#2563eb' : '#9ca3af',
              color: 'white',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: termsAccepted ? 'pointer' : 'not-allowed'
            }}
          >
            Accept & Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}