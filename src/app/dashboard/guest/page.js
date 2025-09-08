"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GuestDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    fetchUserData();
    fetchBookings();
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUserData = async () => {
    // Simulate fetching user data
    setTimeout(() => {
      setUserProfile({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+974 5555 0123',
        joinedDate: 'January 2024',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        verifications: ['Email', 'Phone', 'ID'],
        languages: ['English', 'Arabic'],
        responseRate: '98%',
        responseTime: 'Within an hour'
      });
    }, 500);
  };

  const fetchBookings = async () => {
    // Simulate fetching bookings
    setTimeout(() => {
      setBookings([
        {
          id: '1282647022607994858',
          status: 'confirmed',
          property: {
            title: 'Luxury Villa with Pool in The Pearl',
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
            location: 'The Pearl, Doha',
            host: 'Sarah Ahmed',
            hostImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
          },
          checkIn: '2025-09-19',
          checkOut: '2025-09-23',
          guests: 2,
          totalPrice: 4800,
          nights: 4,
          pricePerNight: 1200,
          bookingCode: 'HMBQJTQ545',
          bookingDate: '2025-01-05',
          paymentStatus: 'paid',
          amenities: ['WiFi', 'Pool', 'Parking', 'Kitchen', 'Air conditioning']
        },
        {
          id: '1282647022607994859',
          status: 'upcoming',
          property: {
            title: 'Modern Apartment in West Bay',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
            location: 'West Bay, Doha',
            host: 'Mohammed Ali',
            hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
          },
          checkIn: '2025-10-15',
          checkOut: '2025-10-20',
          guests: 1,
          totalPrice: 3500,
          nights: 5,
          pricePerNight: 700,
          bookingCode: 'XYZABC123',
          bookingDate: '2025-01-07',
          paymentStatus: 'paid',
          amenities: ['WiFi', 'Gym', 'Parking', 'Workspace']
        },
        {
          id: '1282647022607994860',
          status: 'completed',
          property: {
            title: 'Beachfront Suite in Al Wakrah',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
            location: 'Al Wakrah, Qatar',
            host: 'Fatima Hassan',
            hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
          },
          checkIn: '2024-12-20',
          checkOut: '2024-12-25',
          guests: 3,
          totalPrice: 5000,
          nights: 5,
          pricePerNight: 1000,
          bookingCode: 'ABCDEF789',
          bookingDate: '2024-12-01',
          paymentStatus: 'paid',
          rating: 5,
          review: 'Amazing stay! The view was spectacular and the host was very helpful.',
          amenities: ['WiFi', 'Beach access', 'Parking', 'Kitchen']
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
      case 'completed': return '#717171';
      case 'cancelled': return '#c13515';
      default: return '#717171';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed': return 'Confirmed';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return ['confirmed', 'upcoming'].includes(booking.status);
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
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

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f7f7f7',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div style={{
        width: isMobile ? (sidebarOpen ? '280px' : '0') : '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #e0e0e0',
        position: isMobile ? 'fixed' : 'relative',
        height: '100vh',
        zIndex: 1000,
        left: isMobile && !sidebarOpen ? '-280px' : '0',
        transition: 'left 0.3s ease',
        overflowY: 'auto'
      }}>
        {/* User Profile Section */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundImage: `url(${userProfile?.profileImage || 'https://via.placeholder.com/64'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#222',
                marginBottom: '4px'
              }}>
                {userProfile?.name || 'Loading...'}
              </h3>
              <Link href="/profile/edit" style={{
                fontSize: '14px',
                color: '#717171',
                textDecoration: 'none'
              }}>
                Show profile
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '16px 0' }}>
          <Link href="/dashboard/guest" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            textDecoration: 'none',
            color: '#222',
            backgroundColor: '#f7f7f7',
            borderLeft: '3px solid #222',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            <span>📅</span> Trips
          </Link>
          <Link href="/messages" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            textDecoration: 'none',
            color: '#717171',
            fontSize: '15px',
            transition: 'background 0.2s'
          }}>
            <span>💬</span> Messages
          </Link>
          <Link href="/wishlists" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            textDecoration: 'none',
            color: '#717171',
            fontSize: '15px',
            transition: 'background 0.2s'
          }}>
            <span>❤️</span> Wishlists
          </Link>
          <Link href="/account-settings" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            textDecoration: 'none',
            color: '#717171',
            fontSize: '15px',
            transition: 'background 0.2s'
          }}>
            <span>⚙️</span> Account
          </Link>
          <Link href="/payments" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            textDecoration: 'none',
            color: '#717171',
            fontSize: '15px',
            transition: 'background 0.2s'
          }}>
            <span>💳</span> Payments & payouts
          </Link>
          <Link href="/refer" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            textDecoration: 'none',
            color: '#717171',
            fontSize: '15px',
            transition: 'background 0.2s'
          }}>
            <span>🎁</span> Refer & earn
          </Link>
        </nav>

        {/* Host Section */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <h4 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#717171',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px'
          }}>
            Hosting
          </h4>
          <Link href="/host/sign-in" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 0',
            textDecoration: 'none',
            color: '#222',
            fontSize: '15px'
          }}>
            <span>🏠</span> Switch to hosting
          </Link>
        </div>

        {/* Support Section */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Link href="/help" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 0',
            textDecoration: 'none',
            color: '#222',
            fontSize: '15px'
          }}>
            <span>❓</span> Get help
          </Link>
          <button
            onClick={() => {
              localStorage.clear();
              router.push('/');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 0',
              textDecoration: 'none',
              color: '#222',
              fontSize: '15px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <span>🚪</span> Log out
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 999,
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          ☰ Menu
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: isMobile ? '60px 16px 24px' : '40px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto'
      }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: isMobile ? '28px' : '32px',
            fontWeight: '700',
            color: '#222',
            marginBottom: '8px'
          }}>
            Trips
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#717171'
          }}>
            Manage your bookings and plan your next adventure
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '32px',
          overflowX: 'auto'
        }}>
          {['upcoming', 'completed', 'cancelled', 'all'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #222' : '2px solid transparent',
                color: activeTab === tab ? '#222' : '#717171',
                fontSize: '16px',
                fontWeight: activeTab === tab ? '600' : '400',
                cursor: 'pointer',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap'
              }}
            >
              {tab === 'all' ? 'All trips' : tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div style={{
            display: 'grid',
            gap: '24px'
          }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                backgroundColor: '#e0e0e0',
                borderRadius: '12px',
                height: '200px',
                animation: 'pulse 1.5s infinite'
              }} />
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div style={{
            display: 'grid',
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
                  transition: 'box-shadow 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)'}
                >
                  <div style={{
                    display: isMobile ? 'block' : 'flex',
                    gap: '24px'
                  }}>
                    {/* Property Image */}
                    <div style={{
                      width: isMobile ? '100%' : '280px',
                      height: isMobile ? '200px' : '200px',
                      flexShrink: 0,
                      backgroundImage: `url(${booking.property.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: getStatusColor(booking.status),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {getStatusText(booking.status)}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div style={{
                      flex: 1,
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        {/* Property Info */}
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#222',
                          marginBottom: '4px'
                        }}>
                          {booking.property.title}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          color: '#717171',
                          marginBottom: '16px'
                        }}>
                          {booking.property.location}
                        </p>

                        {/* Dates and Guests */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '24px',
                          marginBottom: '16px'
                        }}>
                          <div>
                            <p style={{
                              fontSize: '12px',
                              color: '#717171',
                              marginBottom: '2px'
                            }}>
                              Check-in
                            </p>
                            <p style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#222'
                            }}>
                              {formatDate(booking.checkIn)}
                            </p>
                          </div>
                          <div>
                            <p style={{
                              fontSize: '12px',
                              color: '#717171',
                              marginBottom: '2px'
                            }}>
                              Check-out
                            </p>
                            <p style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#222'
                            }}>
                              {formatDate(booking.checkOut)}
                            </p>
                          </div>
                          <div>
                            <p style={{
                              fontSize: '12px',
                              color: '#717171',
                              marginBottom: '2px'
                            }}>
                              Guests
                            </p>
                            <p style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#222'
                            }}>
                              {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                            </p>
                          </div>
                          <div>
                            <p style={{
                              fontSize: '12px',
                              color: '#717171',
                              marginBottom: '2px'
                            }}>
                              Total
                            </p>
                            <p style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#222'
                            }}>
                              QAR {booking.totalPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Host Info */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          paddingTop: '16px',
                          borderTop: '1px solid #e0e0e0'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundImage: `url(${booking.property.hostImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }} />
                          <div>
                            <p style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#222'
                            }}>
                              Hosted by {booking.property.host}
                            </p>
                            <p style={{
                              fontSize: '12px',
                              color: '#717171'
                            }}>
                              Booking code: {booking.bookingCode}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '16px',
                        flexWrap: 'wrap'
                      }}>
                        {booking.status === 'upcoming' && daysUntil > 0 && daysUntil <= 7 && (
                          <div style={{
                            flex: 1,
                            padding: '8px 16px',
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            textAlign: 'center'
                          }}>
                            📅 Check-in in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                          </div>
                        )}
                        
                        {(booking.status === 'confirmed' || booking.status === 'upcoming') && (
                          <>
                            <button style={{
                              padding: '10px 20px',
                              backgroundColor: '#222',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#000'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#222'}
                            >
                              View details
                            </button>
                            <button style={{
                              padding: '10px 20px',
                              backgroundColor: 'white',
                              color: '#222',
                              border: '1px solid #222',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}>
                              Message host
                            </button>
                            <button style={{
                              padding: '10px 20px',
                              backgroundColor: 'white',
                              color: '#c13515',
                              border: '1px solid #c13515',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}>
                              Cancel booking
                            </button>
                          </>
                        )}

                        {booking.status === 'completed' && (
                          <>
                            {booking.rating ? (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                backgroundColor: '#f7f7f7',
                                borderRadius: '8px'
                              }}>
                                <span>⭐ {booking.rating}/5</span>
                                <span style={{ color: '#717171' }}>·</span>
                                <span style={{ fontSize: '14px', color: '#717171' }}>
                                  "{booking.review}"
                                </span>
                              </div>
                            ) : (
                              <button style={{
                                padding: '10px 20px',
                                backgroundColor: '#222',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}>
                                Leave a review
                              </button>
                            )}
                            <button style={{
                              padding: '10px 20px',
                              backgroundColor: 'white',
                              color: '#222',
                              border: '1px solid #222',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}>
                              Book again
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🏖️
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#222',
              marginBottom: '8px'
            }}>
              No trips booked...yet!
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#717171',
              marginBottom: '24px'
            }}>
              Time to dust off your bags and start planning your next adventure
            </p>
            <Link
              href="/search"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                backgroundColor: '#222',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Start searching
            </Link>
          </div>
        )}

        {/* Quick Stats */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#222',
            marginBottom: '24px'
          }}>
            Your travel stats
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            <div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#222',
                marginBottom: '4px'
              }}>
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#717171'
              }}>
                Trips completed
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#222',
                marginBottom: '4px'
              }}>
                {bookings.filter(b => ['confirmed', 'upcoming'].includes(b.status)).length}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#717171'
              }}>
                Upcoming trips
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#222',
                marginBottom: '4px'
              }}>
                {bookings.reduce((acc, b) => acc + b.nights, 0)}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#717171'
              }}>
                Nights stayed
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#222',
                marginBottom: '4px'
              }}>
                3
              </div>
              <div style={{
                fontSize: '14px',
                color: '#717171'
              }}>
                Cities visited
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}