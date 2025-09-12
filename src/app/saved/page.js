"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SavedPropertiesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch saved properties
    const fetchSavedProperties = async () => {
      if (!user) return;
      
      setLoadingProperties(true);
      try {
        // For now, use sample data
        setSavedProperties([
          {
            id: '1',
            title: 'Luxury Villa in West Bay',
            location: 'West Bay, Doha',
            price: 15000,
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            bedrooms: 4,
            bathrooms: 3,
            rating: 4.8,
            reviews: 24,
            savedDate: new Date('2024-01-15')
          },
          {
            id: '2',
            title: 'Modern Apartment in The Pearl',
            location: 'The Pearl, Doha',
            price: 8000,
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            bedrooms: 2,
            bathrooms: 2,
            rating: 4.9,
            reviews: 42,
            savedDate: new Date('2024-01-10')
          },
          {
            id: '3',
            title: 'Cozy Studio in Lusail',
            location: 'Lusail City',
            price: 4500,
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            bedrooms: 1,
            bathrooms: 1,
            rating: 4.6,
            reviews: 18,
            savedDate: new Date('2024-01-05')
          }
        ]);
      } catch (error) {
        console.error('Error fetching saved properties:', error);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchSavedProperties();
  }, [user]);

  const handleRemoveFromSaved = (propertyId) => {
    setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
    // Here you would also make an API call to remove from saved
  };

  if (loading || loadingProperties) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f7f7'
      }}>
        <div style={{ fontSize: '18px', color: '#717171' }}>Loading saved properties...</div>
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
              Saved Properties
            </h1>
          </div>

          <div style={{
            fontSize: '14px',
            color: '#717171'
          }}>
            {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {savedProperties.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {savedProperties.map(property => (
              <div key={property.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
              }}>
                {/* Property Image */}
                <div style={{
                  position: 'relative',
                  height: '200px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={property.image} 
                    alt={property.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromSaved(property.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    ❤️
                  </button>
                </div>

                {/* Property Details */}
                <div style={{ padding: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {property.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '14px'
                    }}>
                      ⭐ {property.rating} ({property.reviews})
                    </div>
                  </div>

                  <div style={{
                    fontSize: '14px',
                    color: '#717171',
                    marginBottom: '12px'
                  }}>
                    {property.location}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: '13px',
                    color: '#717171',
                    marginBottom: '12px'
                  }}>
                    <span>{property.bedrooms} bedroom{property.bedrooms > 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{property.bathrooms} bathroom{property.bathrooms > 1 ? 's' : ''}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '600'
                      }}>
                        QAR {property.price.toLocaleString()}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: '#717171'
                      }}> /month</span>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      Saved {property.savedDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '80px 20px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏠</div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              No saved properties yet
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#717171',
              marginBottom: '24px'
            }}>
              Start exploring and save properties you love
            </p>
            <Link href="/search" style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}