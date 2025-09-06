"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    city: 'Doha',
    checkIn: '',
    checkOut: '',
    guests: '2'
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Calculate minimum check-out date (day after check-in)
  const getMinCheckOut = () => {
    if (!searchParams.checkIn) return '';
    const checkIn = new Date(searchParams.checkIn);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setSearchParams(prev => {
      const updated = { ...prev, checkIn: newCheckIn };
      
      // Reset check-out if it's before new check-in
      if (prev.checkOut && new Date(prev.checkOut) <= new Date(newCheckIn)) {
        updated.checkOut = '';
      }
      
      return updated;
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    if (!searchParams.checkIn || !searchParams.checkOut) {
      alert('Please select both check-in and check-out dates');
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(`/api/properties/search?${query}`);
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      } else {
        console.error('Search failed');
        setProperties([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (propertyId) => {
    if (!searchParams.checkIn || !searchParams.checkOut) {
      alert('Please search with dates first');
      return;
    }
    router.push(`/booking/new?property=${propertyId}&checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&guests=${searchParams.guests}`);
  };

  // Get today's date for minimum check-in
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Search Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '24px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
            Find Your Perfect Monthly Stay
          </h1>
          
          <form onSubmit={handleSearch} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            alignItems: 'end'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                marginBottom: '4px',
                color: '#6b7280'
              }}>
                City
              </label>
              <select
                value={searchParams.city}
                onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">All Cities</option>
                <option value="Doha">Doha</option>
                <option value="Al Rayyan">Al Rayyan</option>
                <option value="Lusail">Lusail</option>
                <option value="The Pearl">The Pearl</option>
                <option value="West Bay">West Bay</option>
                <option value="Al Wakrah">Al Wakrah</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                marginBottom: '4px',
                color: '#6b7280'
              }}>
                Check-in <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                value={searchParams.checkIn}
                onChange={handleCheckInChange}
                min={today}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                marginBottom: '4px',
                color: '#6b7280'
              }}>
                Check-out <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                value={searchParams.checkOut}
                onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                min={getMinCheckOut()}
                disabled={!searchParams.checkIn}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: !searchParams.checkIn ? '#f9fafb' : 'white',
                  cursor: !searchParams.checkIn ? 'not-allowed' : 'pointer'
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                marginBottom: '4px',
                color: '#6b7280'
              }}>
                Guests
              </label>
              <select
                value={searchParams.guests}
                onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading || !searchParams.checkIn || !searchParams.checkOut}
              style={{
                padding: '12px 24px',
                backgroundColor: loading || !searchParams.checkIn || !searchParams.checkOut ? '#9ca3af' : '#2563eb',
                color: 'white',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: loading || !searchParams.checkIn || !searchParams.checkOut ? 'not-allowed' : 'pointer',
                minWidth: '120px'
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          {searchParams.checkIn && searchParams.checkOut && (
            <div style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#eff6ff',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#1e40af'
            }}>
              {(() => {
                const nights = Math.ceil(
                  (new Date(searchParams.checkOut) - new Date(searchParams.checkIn)) / (1000 * 60 * 60 * 24)
                );
                return `${nights} night${nights !== 1 ? 's' : ''} stay`;
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 24px' }}>
        {!hasSearched && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
              Start Your Search
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280' }}>
              Select your dates and location to find available properties
            </p>
          </div>
        )}

        {hasSearched && !loading && properties.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            backgroundColor: 'white',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>😔</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              No properties found
            </h3>
            <p style={{ fontSize: '16px', color: '#6b7280' }}>
              Try adjusting your search criteria or dates
            </p>
          </div>
        )}

        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            backgroundColor: 'white',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>
              Searching for available properties...
            </div>
          </div>
        )}

        {!loading && properties.length > 0 && (
          <>
            <div style={{ marginBottom: '20px', fontSize: '16px', color: '#6b7280' }}>
              Found {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}
            </div>
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
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
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
                  </div>
                  
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      {property.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                      {property.area}, {property.city}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                      {property.bedrooms} BR • {property.bathrooms} BA • {property.maxGuests} Guests
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        QAR {property.monthlyPrice}/month
                      </p>
                      <button
                        onClick={() => handleBooking(property.id)}
                        style={{
                          padding: '8px 20px',
                          backgroundColor: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}