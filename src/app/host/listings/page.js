"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/host/properties', {
        credentials: 'include'
      });
      
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

  const handleEdit = (propertyId) => {
    router.push(`/host/listings/edit/${propertyId}`);
  };

  const handleRemove = async (propertyId) => {
    if (confirm('Are you sure you want to remove this property?')) {
      try {
        const response = await fetch(`/api/host/properties/${propertyId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          setProperties(properties.filter(p => p.id !== propertyId));
        }
      } catch (error) {
        console.error('Error removing property:', error);
      }
    }
  };

  const handleSuspend = async (propertyId) => {
    try {
      const response = await fetch(`/api/host/properties/${propertyId}/suspend`, {
        method: 'PUT',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchProperties(); // Refresh the list
      }
    } catch (error) {
      console.error('Error suspending property:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ 
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2563eb',
            textDecoration: 'none'
          }}>
            Houseiana
          </Link>
          
          <Link href="/host/dashboard/welcome" style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>My Properties</h1>
          <Link
            href="/host/listings/new"
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            + Add New Property
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            Loading properties...
          </div>
        ) : properties.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              No properties yet
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Start earning by adding your first property
            </p>
            <Link
              href="/host/listings/new"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {properties.map(property => (
              <div key={property.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  height: '200px',
                  backgroundColor: '#f3f4f6',
                  position: 'relative'
                }}>
                  {property.photos && property.photos[0] ? (
                    <img 
                      src={property.photos[0]} 
                      alt={property.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px'
                    }}>
                      🏠
                    </div>
                  )}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 12px',
                    backgroundColor: property.status === 'active' ? '#10b981' : '#f59e0b',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {property.status || 'Active'}
                  </span>
                </div>
                
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    {property.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                    {property.bedrooms} BR • {property.bathrooms} BA • {property.maxGuests} Guests
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                    QAR {property.monthlyRent}/month
                  </p>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(property.id)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleSuspend(property.id)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Suspend
                    </button>
                    <button
                      onClick={() => handleRemove(property.id)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}