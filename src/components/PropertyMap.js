"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function PropertyMap({ location, coordinates, title }) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Import Leaflet and set icon
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      // Fix default marker icon issue
      delete leaflet.default.Icon.Default.prototype._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    });
  }, []);

  if (!isClient || !L || !coordinates) {
    return (
      <div style={{
        width: '100%',
        height: '400px',
        backgroundColor: '#f0f0f0',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📍</div>
          <div>Loading map...</div>
        </div>
      </div>
    );
  }

  const position = [coordinates.lat, coordinates.lng];

  return (
    <>
      {/* Import Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      
      <div style={{ position: 'relative' }}>
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ 
            height: '480px', 
            width: '100%',
            borderRadius: '12px',
            zIndex: 1
          }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>{title}</strong>
                <br />
                {location.area}, {location.city}
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Map overlay with location info */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          backgroundColor: 'white',
          padding: '16px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          maxWidth: '300px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
            Exact location provided after booking
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            {location.area}, {location.city}, {location.country}
          </div>
        </div>

        {/* Neighborhood highlights */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
            Neighborhood
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🚶</span>
              <span>Walkable</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🛒</span>
              <span>Shopping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🍽️</span>
              <span>Dining</span>
            </div>
          </div>
        </div>
      </div>

      {/* What's nearby section */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          What's nearby
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {getNearbyPlaces(location.area).map((place, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: '#f7f7f7',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>{place.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{place.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{place.distance}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting around section */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          Getting around
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>🚗</span>
              <span style={{ fontWeight: '500' }}>By Car</span>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Free parking available on premises. Easy access to major highways.
            </div>
          </div>
          <div style={{
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>🚌</span>
              <span style={{ fontWeight: '500' }}>Public Transport</span>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Bus stops within walking distance. Metro station nearby.
            </div>
          </div>
          <div style={{
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>✈️</span>
              <span style={{ fontWeight: '500' }}>Airport</span>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Hamad International Airport - 20-30 min drive
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper function to get nearby places based on area
function getNearbyPlaces(area) {
  const places = {
    'The Pearl': [
      { icon: '🏖️', name: 'Pearl Beach', distance: '5 min walk' },
      { icon: '🛍️', name: 'Porto Arabia', distance: '3 min walk' },
      { icon: '🍽️', name: 'Medina Centrale', distance: '7 min walk' },
      { icon: '☕', name: 'Starbucks', distance: '2 min walk' },
      { icon: '🏪', name: 'Carrefour Market', distance: '5 min walk' },
      { icon: '🏊', name: 'Beach Club', distance: '10 min walk' }
    ],
    'West Bay': [
      { icon: '🏢', name: 'Business District', distance: '5 min walk' },
      { icon: '🛍️', name: 'City Center Mall', distance: '10 min walk' },
      { icon: '🏖️', name: 'Corniche Beach', distance: '15 min walk' },
      { icon: '🍽️', name: 'Restaurant District', distance: '5 min walk' },
      { icon: '☕', name: 'Coffee Shops', distance: '3 min walk' },
      { icon: '🚇', name: 'Metro Station', distance: '8 min walk' }
    ],
    'Al Waab': [
      { icon: '🛍️', name: 'Villagio Mall', distance: '10 min drive' },
      { icon: '🏫', name: 'American School', distance: '5 min drive' },
      { icon: '⛳', name: 'Aspire Park', distance: '7 min drive' },
      { icon: '🏪', name: 'Al Meera Supermarket', distance: '3 min drive' },
      { icon: '🍽️', name: 'Local Restaurants', distance: '5 min drive' },
      { icon: '🏥', name: 'Al Ahli Hospital', distance: '10 min drive' }
    ]
  };

  return places[area] || [
    { icon: '🛍️', name: 'Shopping Center', distance: '10 min' },
    { icon: '🍽️', name: 'Restaurants', distance: '5 min' },
    { icon: '☕', name: 'Cafes', distance: '3 min' },
    { icon: '🏪', name: 'Supermarket', distance: '5 min' },
    { icon: '🏥', name: 'Medical Center', distance: '10 min' },
    { icon: '🏫', name: 'Schools', distance: '7 min' }
  ];
}