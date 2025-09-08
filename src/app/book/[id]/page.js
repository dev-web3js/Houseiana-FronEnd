"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  // Get booking details from URL params
  const checkIn = searchParams.get('checkin') || '';
  const checkOut = searchParams.get('checkout') || '';
  const guests = parseInt(searchParams.get('numberOfGuests') || '1');
  const adults = parseInt(searchParams.get('numberOfAdults') || '1');
  const children = parseInt(searchParams.get('numberOfChildren') || '0');
  const infants = parseInt(searchParams.get('numberOfInfants') || '0');
  const pets = parseInt(searchParams.get('numberOfPets') || '0');
  const isWorkTrip = searchParams.get('isWorkTrip') === 'true';

  // Guest info state
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+974'
  });

  // Payment info state
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: 'Qatar'
  });

  useEffect(() => {
    fetchPropertyDetails();
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPropertyDetails = async () => {
    // Simulate fetching property details
    setTimeout(() => {
      setProperty({
        id: params.id,
        title: 'Luxury Villa with Pool in The Pearl',
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
        ],
        location: {
          address: 'The Pearl, Doha',
          area: 'The Pearl',
          city: 'Doha',
          country: 'Qatar'
        },
        host: {
          name: 'Sarah Ahmed',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
          superhost: true,
          responseRate: '100%',
          responseTime: 'within an hour',
          joinedDate: 'January 2020'
        },
        price: 1200,
        cleaningFee: 150,
        serviceFee: 180,
        taxes: 120,
        rating: 4.92,
        reviews: 128,
        maxGuests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 2,
        amenities: [
          'WiFi', 'Pool', 'Free parking', 'Kitchen', 
          'Air conditioning', 'Washer', 'Dryer', 'TV'
        ],
        houseRules: [
          'Check-in: 3:00 PM - 11:00 PM',
          'Check-out: 11:00 AM',
          'No smoking',
          'No parties or events',
          'Pets allowed'
        ],
        cancellationPolicy: {
          type: 'Flexible',
          description: 'Full refund for cancellations made within 48 hours of booking, if the check-in date is at least 14 days away. 50% refund for cancellations made at least 7 days before check-in.'
        }
      });
      setLoading(false);
    }, 1000);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const nights = calculateNights();
  const basePrice = property ? property.price * nights : 0;
  const totalPrice = property ? basePrice + property.cleaningFee + property.serviceFee + property.taxes : 0;

  const handlePayment = async () => {
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setBookingConfirmed(true);
    }, 3000);
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  if (bookingConfirmed) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '48px',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '24px'
          }}>
            ✅
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#222',
            marginBottom: '16px'
          }}>
            Booking Confirmed!
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#717171',
            marginBottom: '32px'
          }}>
            Your booking has been confirmed. We've sent a confirmation email to {guestInfo.email}
          </p>
          <div style={{
            backgroundColor: '#f7f7f7',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Booking Details
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <strong>Confirmation Code:</strong> HMBQJTQ545
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Property:</strong> {property?.title}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Check-in:</strong> {formatDate(checkIn)}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Check-out:</strong> {formatDate(checkOut)}
            </div>
            <div>
              <strong>Total Paid:</strong> QAR {totalPrice.toLocaleString()}
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center'
          }}>
            <Link
              href="/dashboard/guest"
              style={{
                padding: '14px 32px',
                backgroundColor: '#222',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              View My Trips
            </Link>
            <Link
              href="/"
              style={{
                padding: '14px 32px',
                backgroundColor: 'white',
                color: '#222',
                border: '1px solid #222',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Browse More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f7f7f7'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#FF385C',
            textDecoration: 'none'
          }}>
            Houseiana
          </Link>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#717171',
            fontSize: '14px'
          }}>
            <span>🔒</span>
            <span>Secure checkout</span>
          </div>
        </div>
      </header>

      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <div style={{
            fontSize: '24px',
            color: '#717171'
          }}>
            Loading booking details...
          </div>
        </div>
      ) : (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 400px',
          gap: '40px'
        }}>
          {/* Left Column - Booking Form */}
          <div>
            {/* Step Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px',
              fontSize: '14px',
              color: '#717171'
            }}>
              <span style={{ color: '#222', fontWeight: '600' }}>1. Review</span>
              <span>→</span>
              <span style={{ color: '#222', fontWeight: '600' }}>2. Guest details</span>
              <span>→</span>
              <span style={{ color: '#222', fontWeight: '600' }}>3. Payment</span>
            </div>

            {/* Your Trip Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '600',
                marginBottom: '24px',
                color: '#222'
              }}>
                Your trip
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      Dates
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#717171'
                    }}>
                      {formatDate(checkIn)} - {formatDate(checkOut)}
                    </p>
                  </div>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Edit
                  </button>
                </div>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      Guests
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#717171'
                    }}>
                      {guests} {guests === 1 ? 'guest' : 'guests'}
                      {children > 0 && ` (${adults} ${adults === 1 ? 'adult' : 'adults'}, ${children} ${children === 1 ? 'child' : 'children'})`}
                      {infants > 0 && `, ${infants} ${infants === 1 ? 'infant' : 'infants'}`}
                      {pets > 0 && `, ${pets} ${pets === 1 ? 'pet' : 'pets'}`}
                    </p>
                  </div>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Edit
                  </button>
                </div>
              </div>

              {isWorkTrip && (
                <div style={{
                  marginTop: '20px',
                  padding: '12px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>💼</span>
                  <span style={{ fontSize: '14px' }}>This is a work trip</span>
                </div>
              )}
            </div>

            {/* Guest Information */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '600',
                marginBottom: '24px',
                color: '#222'
              }}>
                Guest information
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    First name
                  </label>
                  <input
                    type="text"
                    value={guestInfo.firstName}
                    onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #b0b0b0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Last name
                  </label>
                  <input
                    type="text"
                    value={guestInfo.lastName}
                    onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #b0b0b0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #b0b0b0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  placeholder="john.doe@example.com"
                />
                <p style={{
                  fontSize: '12px',
                  color: '#717171',
                  marginTop: '4px'
                }}>
                  We'll send your confirmation and receipt to this email
                </p>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Phone number
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <select
                    value={guestInfo.countryCode}
                    onChange={(e) => setGuestInfo({...guestInfo, countryCode: e.target.value})}
                    style={{
                      padding: '12px',
                      border: '1px solid #b0b0b0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="+974">🇶🇦 +974</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <input
                    type="tel"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '1px solid #b0b0b0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="5555 0123"
                  />
                </div>
                <p style={{
                  fontSize: '12px',
                  color: '#717171',
                  marginTop: '4px'
                }}>
                  We'll only call if there's an issue with your booking
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '600',
                marginBottom: '24px',
                color: '#222'
              }}>
                Payment method
              </h2>

              {/* Payment Options */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <button
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: paymentMethod === 'card' ? '2px solid #222' : '1px solid #b0b0b0',
                    borderRadius: '8px',
                    backgroundColor: paymentMethod === 'card' ? '#f7f7f7' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: paymentMethod === 'card' ? '600' : '400'
                  }}
                >
                  💳 Credit/Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: paymentMethod === 'paypal' ? '2px solid #222' : '1px solid #b0b0b0',
                    borderRadius: '8px',
                    backgroundColor: paymentMethod === 'paypal' ? '#f7f7f7' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: paymentMethod === 'paypal' ? '600' : '400'
                  }}
                >
                  PayPal
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      Card number
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #b0b0b0',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px'
                      }}>
                        Expiry date
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #b0b0b0',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px'
                      }}>
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #b0b0b0',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      Cardholder name
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardholderName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #b0b0b0',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      placeholder="John Doe"
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      Billing address
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.billingAddress}
                      onChange={(e) => setPaymentInfo({...paymentInfo, billingAddress: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #b0b0b0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        marginBottom: '8px'
                      }}
                      placeholder="Street address"
                    />
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr',
                      gap: '8px'
                    }}>
                      <input
                        type="text"
                        value={paymentInfo.city}
                        onChange={(e) => setPaymentInfo({...paymentInfo, city: e.target.value})}
                        style={{
                          padding: '12px',
                          border: '1px solid #b0b0b0',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                        placeholder="City"
                      />
                      <input
                        type="text"
                        value={paymentInfo.postalCode}
                        onChange={(e) => setPaymentInfo({...paymentInfo, postalCode: e.target.value})}
                        style={{
                          padding: '12px',
                          border: '1px solid #b0b0b0',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                        placeholder="Postal code"
                      />
                      <select
                        value={paymentInfo.country}
                        onChange={(e) => setPaymentInfo({...paymentInfo, country: e.target.value})}
                        style={{
                          padding: '12px',
                          border: '1px solid #b0b0b0',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      >
                        <option value="Qatar">Qatar</option>
                        <option value="UAE">UAE</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div style={{
                  padding: '40px',
                  backgroundColor: '#f7f7f7',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '24px',
                    marginBottom: '16px'
                  }}>
                    PayPal
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#717171',
                    marginBottom: '24px'
                  }}>
                    You will be redirected to PayPal to complete your payment
                  </p>
                  <button style={{
                    padding: '12px 32px',
                    backgroundColor: '#0070ba',
                    color: 'white',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Connect with PayPal
                  </button>
                </div>
              )}
            </div>

            {/* Cancellation Policy */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#222'
              }}>
                Cancellation policy
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>ℹ️</span>
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    {property?.cancellationPolicy.type}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#717171',
                    lineHeight: '1.5'
                  }}>
                    {property?.cancellationPolicy.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Ground Rules */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#222'
              }}>
                Ground rules
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#717171',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                We ask every guest to remember a few simple things about what makes a great guest.
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                  fontSize: '14px'
                }}>
                  <span>✓</span>
                  Follow the house rules
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                  fontSize: '14px'
                }}>
                  <span>✓</span>
                  Treat your Host's home like your own
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px'
                }}>
                  <span>✓</span>
                  Communicate with your Host if any issues arise
                </li>
              </ul>
            </div>

            {/* Terms Agreement */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  style={{
                    marginTop: '2px',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  I agree to the <a href="#" style={{ color: '#222', fontWeight: '600' }}>House Rules</a>, <a href="#" style={{ color: '#222', fontWeight: '600' }}>Cancellation Policy</a>, and <a href="#" style={{ color: '#222', fontWeight: '600' }}>Terms of Service</a>. I also agree that Houseiana may charge my payment method if I'm responsible for damage.
                </span>
              </label>
            </div>

            {/* Book Button */}
            <button
              onClick={handlePayment}
              disabled={!agreeToTerms || processingPayment}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: agreeToTerms && !processingPayment ? '#FF385C' : '#dddddd',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: agreeToTerms && !processingPayment ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {processingPayment ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Processing payment...
                </>
              ) : (
                `Confirm and pay QAR ${totalPrice.toLocaleString()}`
              )}
            </button>
          </div>

          {/* Right Column - Booking Summary */}
          {!isMobile && (
            <div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                position: 'sticky',
                top: '100px'
              }}>
                {/* Property Card */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid #e0e0e0',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: '120px',
                    height: '96px',
                    borderRadius: '8px',
                    backgroundImage: `url(${property?.images[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: '#717171',
                      marginBottom: '4px'
                    }}>
                      {property?.location.area}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#222',
                      marginBottom: '8px'
                    }}>
                      {property?.title}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '14px'
                    }}>
                      <span>⭐</span>
                      <span style={{ fontWeight: '600' }}>{property?.rating}</span>
                      <span style={{ color: '#717171' }}>({property?.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Price Details */}
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px'
                  }}>
                    Price details
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    <span>QAR {property?.price} × {nights} nights</span>
                    <span>QAR {basePrice.toLocaleString()}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    <span>Cleaning fee</span>
                    <span>QAR {property?.cleaningFee}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    <span>Service fee</span>
                    <span>QAR {property?.serviceFee}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    fontSize: '14px'
                  }}>
                    <span>Taxes</span>
                    <span>QAR {property?.taxes}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '20px',
                    borderTop: '1px solid #e0e0e0',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    <span>Total (QAR)</span>
                    <span>QAR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Rare Find Badge */}
              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#fff8f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '24px' }}>💎</span>
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    This is a rare find
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#717171'
                  }}>
                    {property?.host.name}'s place is usually booked
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}