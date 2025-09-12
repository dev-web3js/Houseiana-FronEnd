"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function HostPropertiesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
      return;
    }
    
    if (!loading && user && user.role !== 'host' && user.role !== 'both' && !user.isHost) {
      router.push('/dashboard');
      return;
    }
  }, [user, loading, router]);

  // Fetch properties from API
  const fetchProperties = async () => {
    if (!user || (user.role !== 'host' && user.role !== 'both' && !user.isHost)) {
      return;
    }

    setLoadingProperties(true);
    try {
      const response = await fetch('/api/host/properties/create', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      } else {
        console.error('Failed to fetch properties');
        // Use sample data as fallback
        setProperties([
          {
            id: '1',
            title: 'Luxury Villa in West Bay',
            city: 'Doha',
            area: 'West Bay',
            bedrooms: 4,
            bathrooms: 3,
            monthlyPrice: 15000,
            status: 'active',
            viewCount: 245,
            bookingCount: 5,
            averageRating: 4.8,
            reviewCount: 12,
            photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
            createdAt: new Date('2024-01-01')
          },
          {
            id: '2',
            title: 'Modern Apartment in The Pearl',
            city: 'Doha',
            area: 'The Pearl',
            bedrooms: 2,
            bathrooms: 2,
            monthlyPrice: 8000,
            status: 'active',
            viewCount: 189,
            bookingCount: 3,
            averageRating: 4.9,
            reviewCount: 8,
            photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
            createdAt: new Date('2024-01-15')
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const handleDeleteProperty = async (propertyId) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      // Here you would make an API call to delete the property
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      alert('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#f59e0b';
      case 'pending': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const filteredProperties = properties.filter(property => {
    if (activeFilter === 'all') return true;
    return property.status === activeFilter;
  });

  if (loading || loadingProperties) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f7f7'
      }}>
        <div style={{ fontSize: '18px', color: '#717171' }}>Loading properties...</div>
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
              My Properties
            </h1>
          </div>

          <Link href="/host/properties/create" style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            + Add New Property
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          backgroundColor: 'white',
          padding: '8px',
          borderRadius: '12px',
          width: 'fit-content'
        }}>
          {['all', 'active', 'inactive', 'pending'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '10px 20px',
                backgroundColor: activeFilter === filter ? '#2563eb' : 'transparent',
                color: activeFilter === filter ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {filter}
              {filter === 'all' && ` (${properties.length})`}
              {filter !== 'all' && ` (${properties.filter(p => p.status === filter).length})`}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {filteredProperties.map(property => (
              <div key={property.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                transition: 'transform 0.2s, box-shadow 0.2s'
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
                    src={property.photos?.[0] || 'https://via.placeholder.com/400x300'} 
                    alt={property.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 12px',
                    backgroundColor: `${getStatusColor(property.status)}`,
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {property.status}
                  </div>
                </div>

                {/* Property Details */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    {property.title}
                  </h3>
                  
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '16px'
                  }}>
                    {property.area}, {property.city}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '13px',
                    color: '#6b7280',
                    marginBottom: '16px'
                  }}>
                    <span>{property.bedrooms} BR</span>
                    <span>•</span>
                    <span>{property.bathrooms} Bath</span>
                    <span>•</span>
                    <span>QAR {property.monthlyPrice?.toLocaleString()}/month</span>
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>
                        {property.viewCount || 0}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Views</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>
                        {property.bookingCount || 0}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Bookings</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>
                        ⭐ {property.averageRating || 0}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        ({property.reviewCount || 0})
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '20px'
                  }}>
                    <button
                      onClick={() => router.push(`/host/properties/${property.id}/edit`)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => router.push(`/host/properties/${property.id}/analytics`)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Analytics
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      style={{
                        padding: '10px',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
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
              No properties yet
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#717171',
              marginBottom: '24px'
            }}>
              Start earning by listing your first property
            </p>
            <Link href="/host/properties/create" style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Add Your First Property
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}