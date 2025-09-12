"use client";

import { useEffect, useRef, useState } from "react";

export default function PropertyMap({ 
  properties = [], 
  selectedProperty, 
  onPropertySelect, 
  center = { lat: 25.2854, lng: 51.5310 } 
}) {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `QAR ${Math.round(price / 1000)}k`;
    }
    return `QAR ${price}`;
  };

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        console.warn('Google Maps API failed to load, using fallback');
        setMapLoaded(true); // Set to true to show fallback
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 11,
        styles: [
          {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "transit",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM
        }
      });

      googleMapRef.current = map;
      setMapLoaded(true);
    };

    loadGoogleMaps();
  }, [center]);

  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create markers for each property
    properties.forEach((property) => {
      if (!property.coordinates) return;

      // Create custom marker with price overlay
      const markerDiv = document.createElement('div');
      markerDiv.style.cssText = `
        background: ${selectedProperty?.id === property.id ? '#222' : 'white'};
        color: ${selectedProperty?.id === property.id ? 'white' : '#222'};
        border: 2px solid ${selectedProperty?.id === property.id ? '#222' : '#ddd'};
        border-radius: 20px;
        padding: 6px 12px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        transition: all 0.2s ease;
        white-space: nowrap;
        position: relative;
        z-index: ${selectedProperty?.id === property.id ? 1000 : 1};
      `;
      markerDiv.textContent = formatPrice(property.monthlyPrice);

      // Add hover effects
      markerDiv.addEventListener('mouseenter', () => {
        if (selectedProperty?.id !== property.id) {
          markerDiv.style.background = '#222';
          markerDiv.style.color = 'white';
          markerDiv.style.transform = 'scale(1.1)';
          markerDiv.style.zIndex = '999';
        }
      });

      markerDiv.addEventListener('mouseleave', () => {
        if (selectedProperty?.id !== property.id) {
          markerDiv.style.background = 'white';
          markerDiv.style.color = '#222';
          markerDiv.style.transform = 'scale(1)';
          markerDiv.style.zIndex = '1';
        }
      });

      markerDiv.addEventListener('click', () => {
        onPropertySelect?.(property);
      });

      const marker = new window.google.maps.OverlayView();
      
      marker.onAdd = function() {
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(markerDiv);
      };

      marker.draw = function() {
        const projection = this.getProjection();
        const position = projection.fromLatLngToDivPixel(
          new window.google.maps.LatLng(property.coordinates.lat, property.coordinates.lng)
        );
        
        markerDiv.style.left = (position.x - markerDiv.offsetWidth / 2) + 'px';
        markerDiv.style.top = (position.y - markerDiv.offsetHeight / 2) + 'px';
        markerDiv.style.position = 'absolute';
      };

      marker.onRemove = function() {
        if (markerDiv.parentNode) {
          markerDiv.parentNode.removeChild(markerDiv);
        }
      };

      marker.setMap(googleMapRef.current);
      markersRef.current.push(marker);
    });

    // Adjust map bounds to fit all properties
    if (properties.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      properties.forEach(property => {
        if (property.coordinates) {
          bounds.extend(new window.google.maps.LatLng(
            property.coordinates.lat, 
            property.coordinates.lng
          ));
        }
      });
      googleMapRef.current.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(googleMapRef.current, "idle", function() {
        if (googleMapRef.current.getZoom() > 15) {
          googleMapRef.current.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [properties, selectedProperty, mapLoaded, onPropertySelect]);

  // Show fallback when Google Maps is not available
  if (!window.google && mapLoaded) {
    return (
      <div style={{
        height: "100%",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#666",
        fontSize: "16px",
        flexDirection: "column",
        padding: "20px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗺️</div>
        <div style={{ marginBottom: "8px" }}>Map temporarily unavailable</div>
        <div style={{ fontSize: "14px", color: "#999" }}>
          Showing {properties.length} properties in the area
        </div>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div style={{
        height: "100%",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#666",
        fontSize: "16px"
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      
      {/* Map Controls */}
      <div style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        display: "flex",
        gap: "8px"
      }}>
        <button
          onClick={() => {
            if (googleMapRef.current && properties.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              properties.forEach(property => {
                if (property.coordinates) {
                  bounds.extend(new window.google.maps.LatLng(
                    property.coordinates.lat, 
                    property.coordinates.lng
                  ));
                }
              });
              googleMapRef.current.fitBounds(bounds);
            }
          }}
          style={{
            padding: "8px 12px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          Fit all properties
        </button>
      </div>

      {/* Property Count */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        padding: "8px 12px",
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        {properties.length} properties
      </div>

      {/* Selected Property Info */}
      {selectedProperty && (
        <div style={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
          padding: "12px",
          backgroundColor: "white",
          border: "1px solid #ddd",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          maxWidth: "200px"
        }}>
          <div style={{
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {selectedProperty.title}
          </div>
          <div style={{
            fontSize: "12px",
            color: "#717171",
            marginBottom: "4px"
          }}>
            {selectedProperty.area}, {selectedProperty.city}
          </div>
          <div style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#FF385C"
          }}>
            {formatPrice(selectedProperty.monthlyPrice)}/month
          </div>
        </div>
      )}
    </div>
  );
}