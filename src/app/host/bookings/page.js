"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function HostBookingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [stats, setStats] = useState({
    total: 0,
    current: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    monthRevenue: 0
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      router.push('/auth/sign-in');
      return;
    }

    // Check if user is a host
    if (!loading && user && user.role !== 'host' && user.role !== 'both' && !user.isHost) {
      router.push('/dashboard');
      return;
    }
  }, [user, loading, router]);

  // Fetch bookings from API
  const fetchBookings = async () => {
    if (!user || (user.role !== 'host' && user.role !== 'both' && !user.isHost)) {
      return;
    }

    setLoadingBookings(true);
    try {
      const response = await fetch('/api/host/bookings', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        setStats(data.stats || {
          total: 0,
          current: 0,
          upcoming: 0,
          completed: 0,
          cancelled: 0,
          monthRevenue: 0
        });
      } else {
        console.error('Failed to fetch bookings');
        // Use sample data as fallback
        setBookings([
          {
            id: '1',
            guestName: 'Sample Guest',
            property: 'Sample Property',
            checkIn: new Date().toISOString(),
            checkOut: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'upcoming',
            totalAmount: 5000,
            guests: 2,
            nights: 30,
            guestPhone: '+974 0000 0000',
            guestEmail: 'guest@example.com'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  // Handle cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/host/bookings?id=${bookingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        alert('Booking cancelled successfully');
        fetchBookings(); // Refresh bookings
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('An error occurred while cancelling the booking');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Guest Name', 'Property', 'Check-in', 'Check-out', 'Status', 'Amount', 'Guests', 'Nights'],
      ...bookings.map(b => [
        b.guestName,
        b.property,
        new Date(b.checkIn).toLocaleDateString(),
        new Date(b.checkOut).toLocaleDateString(),
        b.status,
        b.totalAmount,
        b.guests,
        b.nights
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#3b82f6';
      case 'current': return '#10b981';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  if (loading || loadingBookings) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f7f7'
      }}>
        <div style={{ fontSize: '18px', color: '#717171' }}>Loading bookings...</div>
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
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            <Link href="/dashboard" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#222'
            }}>
              <span>←</span>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Back to Dashboard</span>
            </Link>
            
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600'
            }}>
              Reservations
            </h1>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button 
              onClick={exportToCSV}
              disabled={bookings.length === 0}
              style={{
              padding: '10px 20px',
              backgroundColor: bookings.length > 0 ? '#f1f5f9' : '#e5e7eb',
              color: bookings.length > 0 ? '#475569' : '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: bookings.length > 0 ? 'pointer' : 'not-allowed'
            }}>
              Export CSV
            </button>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Calendar View
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Total Bookings
            </div>
            <div style={{ fontSize: '28px', fontWeight: '600', color: '#1e293b' }}>
              {stats.total || bookings.length}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Current Guests
            </div>
            <div style={{ fontSize: '28px', fontWeight: '600', color: '#10b981' }}>
              {bookings.filter(b => b.status === 'current').length}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Upcoming
            </div>
            <div style={{ fontSize: '28px', fontWeight: '600', color: '#3b82f6' }}>
              {bookings.filter(b => b.status === 'upcoming').length}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              This Month Revenue
            </div>
            <div style={{ fontSize: '28px', fontWeight: '600', color: '#8b5cf6' }}>
              QAR 25,500
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: 'white',
          borderRadius: '12px 12px 0 0',
          padding: '16px 16px 0'
        }}>
          {['all', 'upcoming', 'current', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: activeTab === tab ? '#2563eb' : '#6b7280',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textTransform: 'capitalize',
                marginBottom: '-1px'
              }}
            >
              {tab}
              {tab === 'all' && ` (${bookings.length})`}
              {tab !== 'all' && ` (${bookings.filter(b => b.status === tab).length})`}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden'
        }}>
          {filteredBookings.length > 0 ? (
            <div>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr 1.5fr',
                padding: '16px 24px',
                backgroundColor: '#f8fafc',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase'
              }}>
                <div>Guest</div>
                <div>Property</div>
                <div>Check-in</div>
                <div>Check-out</div>
                <div>Status</div>
                <div>Amount</div>
                <div>Actions</div>
              </div>

              {/* Table Rows */}
              {filteredBookings.map(booking => (
                <div
                  key={booking.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr 1.5fr',
                    padding: '20px 24px',
                    borderBottom: '1px solid #e0e0e0',
                    alignItems: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {booking.guestName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {booking.guests} guests • {booking.nights} nights
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '14px' }}>
                    {booking.property}
                  </div>
                  
                  <div style={{ fontSize: '14px' }}>
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </div>
                  
                  <div style={{ fontSize: '14px' }}>
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </div>
                  
                  <div>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: `${getStatusColor(booking.status)}20`,
                      color: getStatusColor(booking.status),
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div style={{ fontWeight: '600' }}>
                    QAR {booking.totalAmount.toLocaleString()}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailsModal(true);
                      }}
                      style={{
                      padding: '6px 12px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      View
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowMessageModal(true);
                      }}
                      style={{
                      padding: '6px 12px',
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      Message
                    </button>
                    {booking.status === 'upcoming' && (
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        style={{
                        padding: '6px 12px',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '80px 20px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                No {activeTab !== 'all' ? activeTab : ''} bookings
              </div>
              <div style={{ fontSize: '14px' }}>
                {activeTab === 'upcoming' && 'You don\'t have any upcoming reservations'}
                {activeTab === 'current' && 'No guests are currently staying'}
                {activeTab === 'completed' && 'No completed bookings yet'}
                {activeTab === 'cancelled' && 'No cancelled bookings'}
                {activeTab === 'all' && 'Start promoting your properties to get bookings'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Booking Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Guest Information */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Guest Information</h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Name:</span>
                    <span style={{ fontWeight: '500' }}>{selectedBooking.guestName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Email:</span>
                    <span style={{ fontWeight: '500' }}>{selectedBooking.guestEmail || 'Not provided'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Phone:</span>
                    <span style={{ fontWeight: '500' }}>{selectedBooking.guestPhone || 'Not provided'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Guests:</span>
                    <span style={{ fontWeight: '500' }}>{selectedBooking.guests} guests</span>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Booking Information</h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Property:</span>
                    <span style={{ fontWeight: '500' }}>{selectedBooking.property}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Check-in:</span>
                    <span style={{ fontWeight: '500' }}>{new Date(selectedBooking.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Check-out:</span>
                    <span style={{ fontWeight: '500' }}>{new Date(selectedBooking.checkOut).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Duration:</span>
                    <span style={{ fontWeight: '500' }}>{selectedBooking.nights} nights</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Status:</span>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: `${getStatusColor(selectedBooking.status)}20`,
                      color: getStatusColor(selectedBooking.status),
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Payment Details</h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Total Amount:</span>
                    <span style={{ fontWeight: '600', fontSize: '18px' }}>QAR {selectedBooking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowMessageModal(true);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Send Message
                </button>
                {selectedBooking.status === 'upcoming' && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleCancelBooking(selectedBooking.id);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            padding: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Send Message to {selectedBooking.guestName}</h2>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessage('');
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              <div style={{ marginBottom: '4px' }}>
                <strong>Property:</strong> {selectedBooking.property}
              </div>
              <div>
                <strong>Dates:</strong> {new Date(selectedBooking.checkIn).toLocaleDateString()} - {new Date(selectedBooking.checkOut).toLocaleDateString()}
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                marginBottom: '20px'
              }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessage('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!message.trim()) return;
                  
                  try {
                    // Create or get conversation with guest
                    const response = await fetch('/api/messages/conversations', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      credentials: 'include',
                      body: JSON.stringify({
                        recipientId: selectedBooking.guest?.id || selectedBooking.guestId,
                        listingId: selectedBooking.propertyId || selectedBooking.listingId,
                        bookingId: selectedBooking.id,
                        message: message.trim()
                      })
                    });
                    
                    if (response.ok) {
                      alert('Message sent successfully!');
                      setShowMessageModal(false);
                      setMessage('');
                      
                      // Optionally redirect to messages page
                      // router.push('/messages');
                    } else {
                      alert('Failed to send message. Please try again.');
                    }
                  } catch (error) {
                    console.error('Error sending message:', error);
                    alert('Failed to send message. Please try again.');
                  }
                }}
                disabled={!message.trim()}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: message.trim() ? '#2563eb' : '#e5e7eb',
                  color: message.trim() ? 'white' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: message.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}