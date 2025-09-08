"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReviewModal from '@/components/ReviewModal';
import MainLayout from '@/components/MainLayout';

export default function BookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    fetchBookings();
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchBookings = async () => {
    // Simulate fetching bookings
    setTimeout(() => {
      setBookings([
        {
          id: 'BK001',
          status: 'upcoming',
          property: {
            title: 'Luxury Villa with Pool in The Pearl',
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
            location: 'The Pearl, Doha',
            type: 'Villa',
            host: 'Sarah Ahmed',
            hostImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
          },
          checkIn: '2025-02-15',
          checkOut: '2025-02-20',
          guests: 4,
          totalPrice: 6000,
          nights: 5,
          pricePerNight: 1200,
          bookingDate: '2025-01-10',
          paymentStatus: 'paid',
          confirmationCode: 'HMBQJTQ545',
          amenities: ['WiFi', 'Pool', 'Parking', 'Kitchen', 'Air conditioning'],
          cancellationPolicy: 'Flexible',
          specialRequests: 'Late check-in requested'
        },
        {
          id: 'BK002',
          status: 'confirmed',
          property: {
            title: 'Modern Apartment in West Bay',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
            location: 'West Bay, Doha',
            type: 'Apartment',
            host: 'Mohammed Ali',
            hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
          },
          checkIn: '2025-03-10',
          checkOut: '2025-03-17',
          guests: 2,
          totalPrice: 4900,
          nights: 7,
          pricePerNight: 700,
          bookingDate: '2025-01-08',
          paymentStatus: 'paid',
          confirmationCode: 'XYZABC123',
          amenities: ['WiFi', 'Gym', 'Parking', 'Workspace'],
          cancellationPolicy: 'Moderate',
          specialRequests: ''
        },
        {
          id: 'BK003',
          status: 'completed',
          property: {
            title: 'Beachfront Suite in Al Wakrah',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
            location: 'Al Wakrah, Qatar',
            type: 'Suite',
            host: 'Fatima Hassan',
            hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
          },
          checkIn: '2024-12-20',
          checkOut: '2024-12-25',
          guests: 3,
          totalPrice: 5000,
          nights: 5,
          pricePerNight: 1000,
          bookingDate: '2024-12-01',
          paymentStatus: 'paid',
          confirmationCode: 'ABCDEF789',
          rating: 5,
          review: 'Amazing stay! The view was spectacular and the host was very helpful.',
          amenities: ['WiFi', 'Beach access', 'Parking', 'Kitchen'],
          cancellationPolicy: 'Strict'
        },
        {
          id: 'BK004',
          status: 'cancelled',
          property: {
            title: 'Cozy Studio in Lusail',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
            location: 'Lusail, Qatar',
            type: 'Studio',
            host: 'Ahmad Khan',
            hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
          },
          checkIn: '2025-01-05',
          checkOut: '2025-01-08',
          guests: 1,
          totalPrice: 1500,
          nights: 3,
          pricePerNight: 500,
          bookingDate: '2024-12-28',
          paymentStatus: 'refunded',
          confirmationCode: 'QWE456RTY',
          cancellationDate: '2024-12-30',
          cancellationReason: 'Change of plans',
          refundAmount: 1500,
          amenities: ['WiFi', 'Kitchen', 'Workspace'],
          cancellationPolicy: 'Flexible'
        },
        {
          id: 'BK005',
          status: 'in_progress',
          property: {
            title: 'Penthouse with City View',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
            location: 'The Pearl, Doha',
            type: 'Penthouse',
            host: 'Lisa Wang',
            hostImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop'
          },
          checkIn: '2025-01-20',
          checkOut: '2025-01-27',
          guests: 6,
          totalPrice: 10500,
          nights: 7,
          pricePerNight: 1500,
          bookingDate: '2025-01-05',
          paymentStatus: 'paid',
          confirmationCode: 'PNT789XYZ',
          amenities: ['WiFi', 'Pool', 'Gym', 'Parking', 'Kitchen', 'Balcony'],
          cancellationPolicy: 'Moderate',
          specialRequests: 'Need baby crib'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#00a849';
      case 'upcoming': return '#ff9500';
      case 'in_progress': return '#0066ff';
      case 'completed': return '#717171';
      case 'cancelled': return '#c13515';
      default: return '#717171';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed': return 'Confirmed';
      case 'upcoming': return 'Upcoming';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return '✓';
      case 'upcoming': return '📅';
      case 'in_progress': return '🏠';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Filter by tab
    if (activeTab === 'all') {
      // Show all bookings
    } else if (activeTab === 'upcoming') {
      if (!['upcoming', 'confirmed'].includes(booking.status)) return false;
    } else if (activeTab === 'current') {
      if (booking.status !== 'in_progress') return false;
    } else if (activeTab === 'past') {
      if (!['completed', 'cancelled'].includes(booking.status)) return false;
    }

    // Filter by search term
    if (searchTerm && !booking.property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !booking.property.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !booking.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by location
    if (filterLocation !== 'all' && !booking.property.location.includes(filterLocation)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.checkIn) - new Date(a.checkIn);
    } else if (sortBy === 'price') {
      return b.totalPrice - a.totalPrice;
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDaysUntil = (checkIn) => {
    const today = new Date();
    const checkInDate = new Date(checkIn);
    const diffTime = checkInDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    // Handle cancellation logic here
    console.log('Cancelling booking:', selectedBooking.id);
    setShowCancelModal(false);
    setSelectedBooking(null);
    // Refresh bookings
    fetchBookings();
  };

  const handleReviewClick = (booking) => {
    setReviewBooking(booking);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        // Refresh bookings to update review status
        await fetchBookings();
        alert('Review submitted successfully!');
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
    
    setShowReviewModal(false);
    setReviewBooking(null);
  };

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => ['upcoming', 'confirmed'].includes(b.status)).length,
    inProgress: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalSpent: bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalPrice, 0)
  };

  return (
    <MainLayout>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f7f7f7'
      }}>
        {/* Header */}
        <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '24px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: '700',
                color: '#222',
                marginBottom: '8px'
              }}>
                My Bookings
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#717171'
              }}>
                Manage and track all your reservations
              </p>
            </div>
            <Link
              href="/search"
              style={{
                padding: '12px 24px',
                backgroundColor: '#FF385C',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                display: 'inline-block',
                transition: 'all 0.2s',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e31c5f';
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF385C';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              + New Booking
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#f7f7f7',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#222' }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '12px', color: '#717171' }}>Total</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#fff8f1',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#ff9500' }}>
                {stats.upcoming}
              </div>
              <div style={{ fontSize: '12px', color: '#717171' }}>Upcoming</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#e6f3ff',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0066ff' }}>
                {stats.inProgress}
              </div>
              <div style={{ fontSize: '12px', color: '#717171' }}>Current</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#00a849' }}>
                {stats.completed}
              </div>
              <div style={{ fontSize: '12px', color: '#717171' }}>Completed</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#fff0f0',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#c13515' }}>
                {stats.cancelled}
              </div>
              <div style={{ fontSize: '12px', color: '#717171' }}>Cancelled</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#f0fff4',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#00a849' }}>
                QAR {stats.totalSpent.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#717171' }}>Total Spent</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flex: 1
            }}>
              {['all', 'upcoming', 'current', 'past'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: activeTab === tab ? '#222' : 'transparent',
                    color: activeTab === tab ? 'white' : '#717171',
                    border: activeTab === tab ? 'none' : '1px solid #e0e0e0',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab === 'current' ? 'In Progress' : tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{
              position: 'relative',
              width: isMobile ? '100%' : '300px'
            }}>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#717171'
              }}>
                🔍
              </span>
            </div>

            {/* Location Filter */}
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Locations</option>
              <option value="The Pearl">The Pearl</option>
              <option value="West Bay">West Bay</option>
              <option value="Lusail">Lusail</option>
              <option value="Al Wakrah">Al Wakrah</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="status">Sort by Status</option>
            </select>

            {/* View Mode */}
            <div style={{
              display: 'flex',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: viewMode === 'grid' ? '#f7f7f7' : 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: viewMode === 'list' ? '#f7f7f7' : 'white',
                  border: 'none',
                  borderLeft: '1px solid #e0e0e0',
                  cursor: 'pointer'
                }}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 20px'
      }}>
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'grid' 
              ? (isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)')
              : '1fr',
            gap: '24px'
          }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                backgroundColor: '#e0e0e0',
                borderRadius: '12px',
                height: viewMode === 'grid' ? '400px' : '200px',
                animation: 'pulse 1.5s infinite'
              }} />
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'grid' 
              ? (isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)')
              : '1fr',
            gap: '24px'
          }}>
            {filteredBookings.map(booking => {
              const daysUntil = calculateDaysUntil(booking.checkIn);
              
              return (
                <div key={booking.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  display: viewMode === 'list' ? 'flex' : 'block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  {/* Property Image */}
                  <div style={{
                    width: viewMode === 'list' ? '200px' : '100%',
                    height: viewMode === 'list' ? '200px' : '200px',
                    flexShrink: 0,
                    backgroundImage: `url(${booking.property.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    {/* Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: getStatusColor(booking.status),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{getStatusIcon(booking.status)}</span>
                      {getStatusText(booking.status)}
                    </div>
                    
                    {/* Days until check-in for upcoming bookings */}
                    {booking.status === 'upcoming' && daysUntil > 0 && daysUntil <= 30 && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        color: '#ff9500',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        In {daysUntil} days
                      </div>
                    )}

                    {/* Property Type Badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {booking.property.type}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div style={{
                    flex: 1,
                    padding: '16px'
                  }}>
                    {/* Property Info */}
                    <div style={{ marginBottom: '12px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#222',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {booking.property.title}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#717171',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        📍 {booking.property.location}
                      </p>
                    </div>

                    {/* Dates */}
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      marginBottom: '12px',
                      fontSize: '14px'
                    }}>
                      <div>
                        <span style={{ color: '#717171' }}>Check-in: </span>
                        <span style={{ fontWeight: '500' }}>{formatDate(booking.checkIn)}</span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      marginBottom: '12px',
                      fontSize: '14px'
                    }}>
                      <div>
                        <span style={{ color: '#717171' }}>Check-out: </span>
                        <span style={{ fontWeight: '500' }}>{formatDate(booking.checkOut)}</span>
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      marginBottom: '12px',
                      fontSize: '13px'
                    }}>
                      <div>
                        <span style={{ color: '#717171' }}>Nights: </span>
                        <span style={{ fontWeight: '500' }}>{booking.nights}</span>
                      </div>
                      <div>
                        <span style={{ color: '#717171' }}>Guests: </span>
                        <span style={{ fontWeight: '500' }}>{booking.guests}</span>
                      </div>
                      <div>
                        <span style={{ color: '#717171' }}>Code: </span>
                        <span style={{ fontWeight: '500', fontFamily: 'monospace' }}>
                          {booking.confirmationCode}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#717171' }}>Total: </span>
                        <span style={{ fontWeight: '600', color: '#222' }}>
                          QAR {booking.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Host Info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      paddingTop: '12px',
                      borderTop: '1px solid #e0e0e0',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundImage: `url(${booking.property.hostImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }} />
                      <div>
                        <p style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#222'
                        }}>
                          Hosted by {booking.property.host}
                        </p>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div style={{
                        padding: '8px',
                        backgroundColor: '#fff8f0',
                        borderRadius: '6px',
                        marginBottom: '12px'
                      }}>
                        <p style={{
                          fontSize: '12px',
                          color: '#ff9500'
                        }}>
                          📝 {booking.specialRequests}
                        </p>
                      </div>
                    )}

                    {/* Cancellation Info */}
                    {booking.status === 'cancelled' && (
                      <div style={{
                        padding: '8px',
                        backgroundColor: '#fff0f0',
                        borderRadius: '6px',
                        marginBottom: '12px'
                      }}>
                        <p style={{
                          fontSize: '12px',
                          color: '#c13515',
                          marginBottom: '4px'
                        }}>
                          Cancelled on {formatDate(booking.cancellationDate)}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          color: '#717171'
                        }}>
                          Reason: {booking.cancellationReason}
                        </p>
                        {booking.refundAmount && (
                          <p style={{
                            fontSize: '12px',
                            color: '#00a849',
                            marginTop: '4px'
                          }}>
                            Refunded: QAR {booking.refundAmount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Review */}
                    {booking.rating && (
                      <div style={{
                        padding: '8px',
                        backgroundColor: '#f0f9ff',
                        borderRadius: '6px',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '4px'
                        }}>
                          <span>⭐</span>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>
                            {booking.rating}/5
                          </span>
                        </div>
                        <p style={{
                          fontSize: '12px',
                          color: '#717171',
                          fontStyle: 'italic'
                        }}>
                          "{booking.review}"
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {(booking.status === 'upcoming' || booking.status === 'confirmed') && (
                        <>
                          <button style={{
                            flex: 1,
                            padding: '8px 12px',
                            backgroundColor: '#222',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                          onClick={() => router.push(`/bookings/${booking.id}`)}
                          >
                            View Details
                          </button>
                          <button style={{
                            flex: 1,
                            padding: '8px 12px',
                            backgroundColor: 'white',
                            color: '#c13515',
                            border: '1px solid #c13515',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleCancelBooking(booking)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'in_progress' && (
                        <>
                          <button style={{
                            flex: 1,
                            padding: '8px 12px',
                            backgroundColor: '#222',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}>
                            Contact Host
                          </button>
                          <button style={{
                            flex: 1,
                            padding: '8px 12px',
                            backgroundColor: '#0066ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}>
                            Check-out
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'completed' && !booking.rating && (
                        <button 
                          onClick={() => handleReviewClick(booking)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: '#ff9500',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Leave Review
                        </button>
                      )}
                      
                      {booking.status === 'completed' && (
                        <button style={{
                          width: '100%',
                          padding: '8px 12px',
                          backgroundColor: '#00a849',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                        onClick={() => router.push(`/property/${booking.property.id}`)}
                        >
                          Book Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '24px'
            }}>
              🏖️
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#222',
              marginBottom: '12px'
            }}>
              No bookings found
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#717171',
              marginBottom: '24px'
            }}>
              {searchTerm || filterLocation !== 'all' 
                ? 'Try adjusting your filters to find bookings'
                : activeTab === 'current'
                ? "You don't have any stays in progress"
                : activeTab === 'upcoming'
                ? "You don't have any upcoming bookings"
                : activeTab === 'past'
                ? "You don't have any past bookings"
                : 'Start exploring and book your perfect stay'}
            </p>
            <Link
              href="/search"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                backgroundColor: '#FF385C',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Explore Properties
            </Link>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Cancel Booking?
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#717171',
              marginBottom: '24px'
            }}>
              Are you sure you want to cancel your booking at {selectedBooking.property.title}?
            </p>
            
            <div style={{
              padding: '16px',
              backgroundColor: '#f7f7f7',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Cancellation Policy: {selectedBooking.cancellationPolicy}
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#717171'
              }}>
                {selectedBooking.cancellationPolicy === 'Flexible' 
                  ? 'Full refund if cancelled 24 hours before check-in'
                  : selectedBooking.cancellationPolicy === 'Moderate'
                  ? '50% refund if cancelled 7 days before check-in'
                  : 'No refund for cancellations'}
              </p>
            </div>

            <div style={{
              marginBottom: '24px'
            }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Reason for cancellation (optional)
              </label>
              <textarea
                placeholder="Tell us why you're cancelling..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'white',
                  color: '#222',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#c13515',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setReviewBooking(null);
        }}
        booking={reviewBooking}
        reviewType="property"
        onSubmit={handleReviewSubmit}
      />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      </div>
    </MainLayout>
  );
}