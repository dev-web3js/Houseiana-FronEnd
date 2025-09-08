"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  useEffect(() => {
    // Retrieve booking details from session storage
    const storedDetails = sessionStorage.getItem('bookingDetails');
    if (storedDetails) {
      const details = JSON.parse(storedDetails);
      // Check if terms were accepted
      if (!details.termsAccepted) {
        router.push('/booking/terms');
        return;
      }
      setBookingDetails(details);
      setLoading(false);
    } else {
      router.push('/search');
    }
  }, []);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardDetails({ ...cardDetails, cardNumber: formatted });
    }
  };

  const handleExpiryMonthChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value <= 12) {
      setCardDetails({ ...cardDetails, expiryMonth: value });
    }
  };

  const handleExpiryYearChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setCardDetails({ ...cardDetails, expiryYear: value });
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCardDetails({ ...cardDetails, cvv: value });
    }
  };

  const validateCard = () => {
    if (!cardDetails.cardNumber.replace(/\s/g, '') || cardDetails.cardNumber.replace(/\s/g, '').length < 13) {
      alert('Please enter a valid card number');
      return false;
    }
    if (!cardDetails.cardHolder.trim()) {
      alert('Please enter the cardholder name');
      return false;
    }
    if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
      alert('Please enter the expiry date');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      alert('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }

    setProcessing(true);

    try {
      // Create booking in database
      const bookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: bookingDetails.propertyId,
          checkIn: bookingDetails.checkIn,
          checkOut: bookingDetails.checkOut,
          guests: bookingDetails.guests,
          specialRequests: bookingDetails.specialRequests,
          pricing: bookingDetails.pricing,
          paymentMethod: paymentMethod,
          // Don't send actual card details to backend in production
          paymentDetails: {
            last4: cardDetails.cardNumber.replace(/\s/g, '').slice(-4),
            cardHolder: cardDetails.cardHolder
          }
        })
      });

      if (bookingResponse.ok) {
        const booking = await bookingResponse.json();
        
        // Clear session storage
        sessionStorage.removeItem('bookingDetails');
        
        // Redirect to confirmation page
        router.push(`/booking/confirmation?id=${booking.id}`);
      } else {
        const error = await bookingResponse.json();
        alert(error.message || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
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
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>
          Complete Payment
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Payment Form */}
          <div>
            {/* Payment Method Selection */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                Payment Method
              </h2>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: paymentMethod === 'card' ? '2px solid #2563eb' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: paymentMethod === 'card' ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  💳 Credit/Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: paymentMethod === 'paypal' ? '2px solid #2563eb' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: paymentMethod === 'paypal' ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  💰 PayPal
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleCardNumberChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.cardHolder}
                      onChange={(e) => setCardDetails({...cardDetails, cardHolder: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>
                        Expiry Date
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="MM"
                          value={cardDetails.expiryMonth}
                          onChange={handleExpiryMonthChange}
                          maxLength="2"
                          style={{
                            width: '60px',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '16px',
                            textAlign: 'center'
                          }}
                        />
                        <span style={{ alignSelf: 'center' }}>/</span>
                        <input
                          type="text"
                          placeholder="YY"
                          value={cardDetails.expiryYear}
                          onChange={handleExpiryYearChange}
                          maxLength="2"
                          style={{
                            width: '60px',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '16px',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}>
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleCvvChange}
                        maxLength="4"
                        style={{
                          width: '100px',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>
                    You will be redirected to PayPal to complete your payment
                  </p>
                  <div style={{ fontSize: '48px' }}>💰</div>
                </div>
              )}
            </div>

            {/* Billing Address */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                Billing Information
              </h2>
              
              <div style={{ 
                padding: '16px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p style={{ fontSize: '14px', color: '#1e40af' }}>
                  ℹ️ Billing information will be taken from your account profile
                </p>
              </div>

              <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.8' }}>
                <p><strong>Name:</strong> {bookingDetails.user?.name}</p>
                <p><strong>Email:</strong> {bookingDetails.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              position: 'sticky',
              top: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                Order Summary
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  {bookingDetails.property?.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  {bookingDetails.property?.address}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  {bookingDetails.checkIn} to {bookingDetails.checkOut}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  {bookingDetails.pricing?.nights} nights • {bookingDetails.guests} guests
                </p>
              </div>

              <div style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px' }}>
                    QAR {bookingDetails.pricing?.nightlyPrice?.toFixed(2)} × {bookingDetails.pricing?.nights} nights
                  </span>
                  <span style={{ fontSize: '14px' }}>
                    QAR {bookingDetails.pricing?.subtotal?.toFixed(2)}
                  </span>
                </div>
                {bookingDetails.pricing?.cleaningFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px' }}>Cleaning fee</span>
                    <span style={{ fontSize: '14px' }}>
                      QAR {bookingDetails.pricing?.cleaningFee?.toFixed(2)}
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px' }}>Service fee</span>
                  <span style={{ fontSize: '14px' }}>
                    QAR {bookingDetails.pricing?.serviceFee?.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '16px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '600',
                fontSize: '18px'
              }}>
                <span>Total (QAR)</span>
                <span>QAR {bookingDetails.pricing?.total?.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: processing ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: processing ? 'not-allowed' : 'pointer'
                }}
              >
                {processing ? 'Processing...' : `Pay QAR ${bookingDetails.pricing?.total?.toFixed(2)}`}
              </button>

              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'center'
              }}>
                <p style={{ marginBottom: '8px' }}>
                  🔒 Your payment information is secure and encrypted
                </p>
                <p>
                  By completing this payment, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}