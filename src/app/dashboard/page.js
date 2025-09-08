"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AdvancedFilterModal from '@/components/AdvancedFilterModal';

export default function UnifiedDashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [activeView, setActiveView] = useState('guest'); // 'guest' or 'host'
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [location, setLocation] = useState('Doha');
  const [guests, setGuests] = useState('1');
  
  // Advanced filters state
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    placeType: 'any',
    priceMin: 2000,
    priceMax: 240000,
    bedrooms: 'any',
    beds: 'any',
    bathrooms: 'any',
    topAmenities: [],
    amenities: [],
    instantBook: false,
    selfCheckIn: false,
    freeCancellation: false,
    allowsPets: false,
    guestFavorite: false,
    luxe: false,
    propertyTypes: [],
    accessibilityFeatures: [],
    hostLanguages: []
  });

  useEffect(() => {
    // If not logged in, redirect to sign-in
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
    // Set initial view based on user role
    if (user && (user.role === 'host' || user.role === 'both')) {
      setActiveView('host');
    }
  }, [user, loading, router]);

  const handleBecomeHost = async () => {
    try {
      const response = await fetch('/api/user/become-host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setShowBecomeHostModal(false);
        setActiveView('host');
        alert('Congratulations! You are now a host. Welcome to the host dashboard!');
      } else {
        alert('Failed to upgrade to host. Please try again.');
      }
    } catch (error) {
      console.error('Error becoming host:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
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

  if (!user) return null;

  const userName = `${user.firstName} ${user.lastName}`.trim() || user.email;
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const canSwitchViews = user.role === 'both';
  const canBecomeHost = user.role === 'guest';

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px' }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#2563eb',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              H
            </div>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b'
            }}>Houseiana</span>
          </Link>
        </div>

        {/* View Switcher */}
        {canSwitchViews && (
          <div style={{
            padding: '8px',
            backgroundColor: '#f1f5f9',
            borderRadius: '10px',
            marginBottom: '24px',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              onClick={() => setActiveView('guest')}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: activeView === 'guest' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: activeView === 'guest' ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Guest
            </button>
            <button
              onClick={() => setActiveView('host')}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: activeView === 'host' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: activeView === 'host' ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Host
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {activeView === 'guest' ? (
              <>
                <li style={{ marginBottom: '4px' }}>
                  <Link href="/dashboard" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#2563eb',
                    fontWeight: '500',
                    gap: '12px'
                  }}>
                    🏠 Dashboard
                  </Link>
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <Link href="/search" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#64748b',
                    fontWeight: '500',
                    gap: '12px'
                  }}>
                    🔍 Search Properties
                  </Link>
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <Link href="/bookings" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#64748b',
                    fontWeight: '500',
                    gap: '12px'
                  }}>
                    📅 My Bookings
                  </Link>
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <Link href="/saved" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#64748b',
                    fontWeight: '500',
                    gap: '12px'
                  }}>
                    ❤️ Saved Properties
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li style={{ marginBottom: '4px' }}>
                  <Link href="/host/dashboard" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#2563eb',
                    fontWeight: '500',
                    gap: '12px'
                  }}>
                    📊 Host Dashboard
                  </Link>
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <Link href="/host/properties" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#64748b',
                    fontWeight: '500',
                    gap: '12px'
                  }}>
                    🏘️ My Properties
                  </Link>
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <Link href="/host/bookings" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#64748b',
                    fontWeight: '500',
                    gap: '12px'
                  }}>
                    📋 Reservations
                  </Link>
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <Link href="/host/earnings" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#64748b',
                    fontWeight: '500',
                    gap: '12px'
                  }}>
                    💰 Earnings
                  </Link>
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <Link href="/host/properties/create" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#64748b',
                    fontWeight: '500',
                    gap: '12px'
                  }}>
                    ➕ Add Property
                  </Link>
                </li>
              </>
            )}
            
            {/* Common Links */}
            <li style={{ marginBottom: '4px', marginTop: '16px' }}>
              <Link href="/messages" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#64748b',
                fontWeight: '500',
                gap: '12px'
              }}>
                💬 Messages
              </Link>
            </li>
            <li style={{ marginBottom: '4px' }}>
              <Link href="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#64748b',
                fontWeight: '500',
                gap: '12px'
              }}>
                👤 Profile
              </Link>
            </li>
          </ul>
        </nav>

        {/* Become a Host Button */}
        {canBecomeHost && (
          <div style={{
            padding: '16px',
            marginBottom: '16px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setShowBecomeHostModal(true)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              🏡 Become a Host
            </button>
          </div>
        )}

        {/* User Profile Section */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          marginTop: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#2563eb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{userName}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {user.role === 'both' ? 'Host & Guest' : user.role === 'host' ? 'Host' : 'Guest'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#475569',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '280px',
        padding: '32px'
      }}>
        {activeView === 'guest' ? (
          // Guest Dashboard Content
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                Welcome back, {userName}!
              </h1>
              <p style={{ fontSize: '16px', color: '#64748b' }}>
                Find your perfect monthly stay in Qatar
              </p>
            </div>

            {/* Quick Search */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              marginBottom: '32px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '20px'
              }}>
                Quick Search
              </h2>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '14px', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    Location
                  </label>
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                    <option value="Doha">Doha</option>
                    <option value="The Pearl">The Pearl</option>
                    <option value="Lusail">Lusail</option>
                    <option value="West Bay">West Bay</option>
                    <option value="Al Waab">Al Waab</option>
                    <option value="Al Rayyan">Al Rayyan</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '14px', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      // Reset checkout if it's before the new check-in date
                      if (checkOut && new Date(checkOut) <= new Date(e.target.value)) {
                        setCheckOut('');
                      }
                    }}
                    min={new Date().toISOString().split('T')[0]} // Can't book in the past
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '14px', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]} // At least 1 day after check-in
                    disabled={!checkIn} // Can't select checkout without check-in
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      opacity: !checkIn ? 0.5 : 1,
                      cursor: !checkIn ? 'not-allowed' : 'pointer'
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ fontSize: '14px', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    Guests
                  </label>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowAdvancedFilters(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#2563eb',
                    border: '2px solid #2563eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#2563eb';
                  }}
                >
                  <span>🎚️</span> Filters
                  {Object.values(filters).filter(v => 
                    (Array.isArray(v) && v.length > 0) || 
                    (typeof v === 'boolean' && v) ||
                    (typeof v === 'string' && v !== 'any' && v !== '' && v !== '1') ||
                    (typeof v === 'number' && (v !== 2000 && v !== 240000))
                  ).length > 0 && (
                    <span style={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      fontSize: '12px',
                      marginLeft: '4px'
                    }}>
                      {Object.values(filters).filter(v => 
                        (Array.isArray(v) && v.length > 0) || 
                        (typeof v === 'boolean' && v) ||
                        (typeof v === 'string' && v !== 'any' && v !== '' && v !== '1') ||
                        (typeof v === 'number' && (v !== 2000 && v !== 240000))
                      ).length}
                    </span>
                  )}
                </button>
                <Link 
                  href={`/search?location=${location}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}${Object.entries(filters).map(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0) return `&${key}=${value.join(',')}`;
                    if (typeof value === 'boolean' && value) return `&${key}=true`;
                    if (typeof value === 'string' && value !== 'any' && value !== '') return `&${key}=${value}`;
                    if (typeof value === 'number' && (key === 'priceMin' && value !== 2000 || key === 'priceMax' && value !== 240000)) return `&${key}=${value}`;
                    return '';
                  }).join('')}`}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}>
                  Search
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>0</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Active Bookings</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>❤️</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>0</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Saved Properties</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>0</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Messages</div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '20px'
              }}>
                Recent Bookings
              </h2>
              <div style={{
                textAlign: 'center',
                padding: '48px 0',
                color: '#94a3b8'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <p style={{ fontSize: '16px', marginBottom: '8px' }}>No bookings yet</p>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>Start exploring properties to make your first booking</p>
                <Link href="/search" style={{
                  padding: '10px 24px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  Browse Properties
                </Link>
              </div>
            </div>
          </>
        ) : (
          // Host Dashboard Content
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                Host Dashboard
              </h1>
              <p style={{ fontSize: '16px', color: '#64748b' }}>
                Manage your properties and bookings
              </p>
            </div>

            {/* Host Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏠</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>0</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Active Properties</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>0</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Total Bookings</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>QAR 0</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Total Earnings</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>-</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Average Rating</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              marginBottom: '32px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '20px'
              }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Link href="/host/properties/create" style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  ➕ Add New Property
                </Link>
                <Link href="/host/bookings" style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  📋 View Reservations
                </Link>
                <Link href="/host/earnings" style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  💰 Check Earnings
                </Link>
              </div>
            </div>

            {/* Properties List */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '20px'
              }}>
                Your Properties
              </h2>
              <div style={{
                textAlign: 'center',
                padding: '48px 0',
                color: '#94a3b8'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
                <p style={{ fontSize: '16px', marginBottom: '8px' }}>No properties yet</p>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>Start by adding your first property</p>
                <Link href="/host/properties/create" style={{
                  padding: '10px 24px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  Add Property
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Become a Host Modal */}
      {showBecomeHostModal && (
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
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '16px'
            }}>
              Become a Host
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              Start earning by sharing your space with guests. As a host, you'll be able to:
            </p>
            <ul style={{
              fontSize: '14px',
              color: '#475569',
              marginBottom: '24px',
              paddingLeft: '20px',
              lineHeight: '2'
            }}>
              <li>List your properties for monthly stays</li>
              <li>Set your own prices and availability</li>
              <li>Manage bookings and communicate with guests</li>
              <li>Track your earnings and performance</li>
              <li>Get support from our host community</li>
            </ul>
            <div style={{
              padding: '16px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#92400e'
            }}>
              ⚠️ By becoming a host, you agree to our host terms and conditions and commit to providing quality accommodations to guests.
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowBecomeHostModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleBecomeHost}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Become a Host
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Advanced Filter Modal */}
      {showAdvancedFilters && (
        <AdvancedFilterModal
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowAdvancedFilters(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            // Update URL params if needed
          }}
        />
      )}
    </div>
  );
}