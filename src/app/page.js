"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    fetchFeaturedProperties();
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await fetch('/api/properties/search?limit=8');
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.append('location', searchLocation);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    router.push(`/search?${params.toString()}`);
  };

  const categories = [
    { id: 'all', name: 'All homes', icon: '🏠' },
    { id: 'beachfront', name: 'Beachfront', icon: '🏖️' },
    { id: 'amazing-views', name: 'Amazing views', icon: '🌅' },
    { id: 'luxury', name: 'Luxe', icon: '💎' },
    { id: 'amazing-pools', name: 'Amazing pools', icon: '🏊' },
    { id: 'villas', name: 'Villas', icon: '🏰' },
    { id: 'apartments', name: 'Apartments', icon: '🏢' },
    { id: 'new', name: 'New', icon: '✨' },
    { id: 'trending', name: 'Trending', icon: '🔥' },
    { id: 'family-friendly', name: 'Family-friendly', icon: '👨‍👩‍👧‍👦' },
    { id: 'workspace', name: 'Remote work', icon: '💻' },
    { id: 'parking', name: 'Free parking', icon: '🚗' }
  ];

  const popularDestinations = [
    {
      city: 'The Pearl',
      country: 'Qatar',
      image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&h=600&fit=crop',
      properties: '120+ properties',
      description: 'Island living with marina views'
    },
    {
      city: 'West Bay',
      country: 'Doha',
      image: 'https://images.unsplash.com/photo-1572252821143-035a024857ac?w=800&h=600&fit=crop',
      properties: '85+ properties',
      description: 'Business district & skyline views'
    },
    {
      city: 'Lusail',
      country: 'Qatar',
      image: 'https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=800&h=600&fit=crop',
      properties: '65+ properties',
      description: 'Modern planned city'
    },
    {
      city: 'Al Waab',
      country: 'Doha',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      properties: '50+ properties',
      description: 'Family-friendly neighborhood'
    },
    {
      city: 'Al Rayyan',
      country: 'Qatar',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      properties: '40+ properties',
      description: 'Traditional meets modern'
    },
    {
      city: 'Al Wakrah',
      country: 'Qatar',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      properties: '30+ properties',
      description: 'Coastal heritage town'
    }
  ];

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <MainLayout>
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        {/* Hero Section with Search */}
        <div style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=2000&h=1000&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: isMobile ? '60px 20px 80px' : '100px 20px 150px',
        position: 'relative',
        minHeight: isMobile ? '500px' : '600px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: isMobile ? '32px' : isTablet ? '42px' : '56px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '24px',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            lineHeight: '1.1'
          }}>
            Find Your Perfect Stay
          </h1>
          <p style={{
            fontSize: isMobile ? '18px' : '24px',
            color: 'white',
            textAlign: 'center',
            marginBottom: isMobile ? '32px' : '48px',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            padding: '0 20px'
          }}>
            Discover comfort-first homes for daily, weekly or monthly rentals
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{
            backgroundColor: 'white',
            borderRadius: isMobile ? '16px' : '999px',
            padding: isMobile ? '16px' : '8px 8px 8px 32px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '0',
            maxWidth: '850px',
            margin: '0 auto',
            boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
            alignItems: isMobile ? 'stretch' : 'center'
          }}>
            <div style={{
              flex: 1,
              padding: isMobile ? '12px 16px' : '0 16px',
              borderRight: isMobile ? 'none' : '1px solid #dddddd',
              borderBottom: isMobile ? '1px solid #dddddd' : 'none'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '4px',
                color: '#222'
              }}>
                Location
              </label>
              <input
                type="text"
                placeholder="Where are you going?"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  width: '100%',
                  color: '#222',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            <div style={{
              minWidth: isMobile ? 'auto' : '140px',
              padding: isMobile ? '12px 16px' : '0 16px',
              borderRight: isMobile ? 'none' : '1px solid #dddddd',
              borderBottom: isMobile ? '1px solid #dddddd' : 'none'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '4px',
                color: '#222'
              }}>
                Check in
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
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#717171',
                  backgroundColor: 'transparent',
                  width: '100%'
                }}
              />
            </div>

            <div style={{
              minWidth: isMobile ? 'auto' : '140px',
              padding: isMobile ? '12px 16px' : '0 16px',
              borderRight: isMobile ? 'none' : '1px solid #dddddd',
              borderBottom: isMobile ? '1px solid #dddddd' : 'none'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '4px',
                color: '#222'
              }}>
                Check out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]} // At least 1 day after check-in
                disabled={!checkIn} // Can't select checkout without check-in
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#717171',
                  backgroundColor: 'transparent',
                  width: '100%',
                  opacity: !checkIn ? 0.5 : 1,
                  cursor: !checkIn ? 'not-allowed' : 'pointer'
                }}
              />
            </div>

            <div style={{
              minWidth: isMobile ? 'auto' : '120px',
              padding: isMobile ? '12px 16px' : '0 16px',
              borderBottom: isMobile ? '1px solid #dddddd' : 'none'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '4px',
                color: '#222'
              }}>
                Guests
              </label>
              <input
                type="number"
                min="1"
                placeholder="Add guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  width: '100%',
                  color: '#717171',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(to right, #FF385C 0%, #E61E4D 50%, #D70466 100%)',
                color: 'white',
                border: 'none',
                borderRadius: isMobile ? '12px' : '50%',
                width: isMobile ? '100%' : '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'box-shadow 0.2s',
                marginTop: isMobile ? '8px' : '0'
              }}
              onMouseEnter={(e) => !isMobile && (e.currentTarget.style.boxShadow = '0 0 0 8px rgba(255,56,92,0.1)')}
              onMouseLeave={(e) => !isMobile && (e.currentTarget.style.boxShadow = 'none')}
            >
              {isMobile ? 'Search' : (
                <svg viewBox="0 0 32 32" style={{ width: '16px', height: '16px', fill: 'white' }}>
                  <path d="M13 0a13 13 0 0 1 10.5 20.67l7.91 7.92a2 2 0 0 1-2.82 2.82l-7.92-7.91A13 13 0 1 1 13 0zm0 4a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
                </svg>
              )}
            </button>
          </form>

          {/* Quick Search - Hidden on mobile */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '32px',
              flexWrap: 'wrap'
            }}>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>Popular:</span>
              {['The Pearl', 'West Bay', 'Lusail', 'Flexible dates'].map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    if (tag === 'Flexible dates') {
                      setCheckIn('');
                      setCheckOut('');
                    } else {
                      setSearchLocation(tag);
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '24px',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div style={{
        padding: isMobile ? '16px 20px' : '24px 20px',
        borderBottom: '1px solid #ebebeb',
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 100,
        boxShadow: '0 1px 0 rgba(0,0,0,0.08)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: isMobile ? '24px' : '40px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' },
          paddingBottom: '4px'
        }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 0',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                minWidth: 'fit-content',
                borderBottom: activeCategory === category.id ? '2px solid #222' : '2px solid transparent',
                opacity: activeCategory === category.id ? 1 : 0.64,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== category.id) e.currentTarget.style.opacity = 0.8;
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== category.id) e.currentTarget.style.opacity = 0.64;
              }}
            >
              <span style={{ fontSize: isMobile ? '20px' : '24px' }}>{category.icon}</span>
              <span style={{
                fontSize: '12px',
                fontWeight: activeCategory === category.id ? '600' : '500',
                whiteSpace: 'nowrap',
                color: activeCategory === category.id ? '#222' : '#717171'
              }}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div style={{ padding: isMobile ? '32px 20px' : '48px 20px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#222'
          }}>
            Popular destinations
          </h2>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#717171',
            marginBottom: isMobile ? '24px' : '32px'
          }}>
            Explore our most sought-after locations for your stay
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {popularDestinations.map((dest, index) => (
              <Link
                key={index}
                href={`/search?location=${dest.city}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  aspectRatio: '4/3',
                  backgroundImage: `url(${dest.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.7) 100%)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}>
                    <h3 style={{
                      fontSize: isMobile ? '16px' : '18px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '2px'
                    }}>
                      {dest.city}
                    </h3>
                    <p style={{
                      fontSize: isMobile ? '12px' : '14px',
                      color: 'rgba(255,255,255,0.9)'
                    }}>
                      {dest.properties}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div style={{ padding: isMobile ? '32px 20px' : '48px 20px', backgroundColor: '#f7f7f7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '700',
            marginBottom: isMobile ? '24px' : '32px',
            color: '#222'
          }}>
            Featured rentals
          </h2>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  backgroundColor: '#e0e0e0',
                  borderRadius: '12px',
                  height: '320px',
                  animation: 'pulse 1.5s infinite'
                }} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {properties.slice(0, 8).map(property => (
                <Link
                  key={property.id}
                  href={`/property/${property.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    backgroundColor: 'white'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{
                      aspectRatio: '20/19',
                      backgroundImage: `url(${property.photos?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px'
                        }}
                      >
                        <svg viewBox="0 0 32 32" style={{ 
                          width: '24px', 
                          height: '24px', 
                          fill: 'rgba(0,0,0,0.5)',
                          stroke: 'white',
                          strokeWidth: '2'
                        }}>
                          <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z" />
                        </svg>
                      </button>
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '4px'
                      }}>
                        <h3 style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#222',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {property.title}
                        </h3>
                        {property.averageRating > 0 && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            marginLeft: '8px'
                          }}>
                            <span style={{ fontSize: '12px' }}>⭐</span>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                              {property.averageRating.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: '#717171',
                        marginBottom: '8px'
                      }}>
                        {property.area}, {property.city}
                      </p>
                      <div style={{
                        fontSize: '14px',
                        color: '#717171',
                        marginBottom: '8px'
                      }}>
                        {property.bedrooms} bed · {property.bathrooms} bath
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '4px'
                      }}>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#222'
                        }}>
                          QAR {property.monthlyPrice?.toLocaleString() || property.price?.toLocaleString()}
                        </span>
                        <span style={{
                          fontSize: '14px',
                          color: '#717171'
                        }}>
                          / night
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{
            textAlign: 'center',
            marginTop: '40px'
          }}>
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
                fontWeight: '600',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Show all properties
            </Link>
          </div>
        </div>
      </div>

      {/* Host CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: isMobile ? '48px 20px' : '80px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '40px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            Become a Host
          </h2>
          <p style={{
            fontSize: isMobile ? '16px' : '20px',
            marginBottom: '32px',
            opacity: 0.95,
            lineHeight: '1.5'
          }}>
            Earn extra income and unlock new opportunities by sharing your space worldwide
          </p>
          <Link
            href="/host/sign-in"
            style={{
              display: 'inline-block',
              padding: '16px 48px',
              backgroundColor: 'white',
              color: '#764ba2',
              borderRadius: '999px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Get started
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#f7f7f7',
        padding: isMobile ? '32px 20px' : '48px 20px',
        borderTop: '1px solid #dddddd'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '32px' : '40px'
        }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#222' }}>
              Support
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Help Center', 'Safety information', 'Cancellation options', 'Report a concern'].map(item => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <a href="#" style={{ color: '#717171', textDecoration: 'none', fontSize: '14px' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#222' }}>
              Community
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Houseiana.org', 'Support refugees', 'Diversity & belonging', 'Combat discrimination'].map(item => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <a href="#" style={{ color: '#717171', textDecoration: 'none', fontSize: '14px' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#222' }}>
              Hosting
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Try hosting', 'Host protection', 'Explore hosting resources', 'Visit our forum'].map(item => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <a href="#" style={{ color: '#717171', textDecoration: 'none', fontSize: '14px' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#222' }}>
              About
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Newsroom', 'Learn about features', 'Careers', 'Investors'].map(item => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <a href="#" style={{ color: '#717171', textDecoration: 'none', fontSize: '14px' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid #dddddd',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: isMobile ? '16px' : '0'
        }}>
          <div style={{ fontSize: '14px', color: '#717171', textAlign: isMobile ? 'center' : 'left' }}>
            © 2024 Houseiana, Inc. · Privacy · Terms · Sitemap
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: '#222' }}>🌐 English (US)</a>
            <a href="#" style={{ color: '#222' }}>QAR</a>
          </div>
        </div>
      </footer>

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