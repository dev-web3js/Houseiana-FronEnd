"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { 
  ssr: false,
  loading: () => <div style={{ height: '100%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>
});

// Import the Airbnb-style property card
import AirbnbPropertyCard from '@/components/AirbnbPropertyCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    checkin: searchParams.get("checkin") || "",
    checkout: searchParams.get("checkout") || "",
    guests: searchParams.get("guests") || "1",
    minPrice: searchParams.get("minPrice") || null,
    maxPrice: searchParams.get("maxPrice") || null,
    propertyType: searchParams.get("propertyType") || "all",
    bedrooms: searchParams.get("bedrooms") || null,
    bathrooms: searchParams.get("bathrooms") || null,
    amenities: searchParams.get("amenities")?.split(",") || [],
    instantBook: searchParams.get("instantBook") === "true",
    superhost: searchParams.get("superhost") === "true",
    sortBy: searchParams.get("sortBy") || "relevance",
    page: parseInt(searchParams.get("page")) || 1
  });

  const propertyTypes = [
    { value: "all", label: "All types", icon: "🏠" },
    { value: "apartment", label: "Apartments", icon: "🏢" },
    { value: "house", label: "Houses", icon: "🏡" },
    { value: "villa", label: "Villas", icon: "🏰" },
    { value: "studio", label: "Studios", icon: "🏨" }
  ];

  const amenitiesList = [
    { value: "wifi", label: "Wi-Fi", icon: "📶" },
    { value: "parking", label: "Free parking", icon: "🚗" },
    { value: "pool", label: "Pool", icon: "🏊" },
    { value: "gym", label: "Gym", icon: "🏋️" },
    { value: "kitchen", label: "Kitchen", icon: "🍳" },
    { value: "washer", label: "Washer", icon: "🧺" },
    { value: "ac", label: "Air conditioning", icon: "❄️" },
    { value: "workspace", label: "Dedicated workspace", icon: "💼" }
  ];

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== null && value !== "") {
          if (key === "amenities" && Array.isArray(value) && value.length > 0) {
            params.append(key, value.join(","));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/search/properties?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
        setPagination(data.pagination || {
          page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false
        });
      } else {
        console.error("Search API error:", response.statusText);
        setProperties(getMockProperties());
        setPagination({
          page: 1, limit: 20, total: 3, totalPages: 1, hasNext: false, hasPrev: false
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      setProperties(getMockProperties());
      setPagination({
        page: 1, limit: 20, total: 3, totalPages: 1, hasNext: false, hasPrev: false
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        if (key === "amenities" && Array.isArray(value) && value.length > 0) {
          params.append(key, value.join(","));
        } else if (value) {
          params.append(key, value);
        }
      }
    });
    router.push(`/search?${params}`);
  };

  const getMockProperties = () => [
    {
      id: "1",
      title: "Luxury Pearl Qatar Apartment",
      city: "Doha",
      area: "The Pearl",
      coordinates: { lat: 25.3678, lng: 51.5310 },
      monthlyPrice: 3500,
      averageRating: 4.8,
      reviewCount: 124,
      photos: ["/api/placeholder/400/300"],
      propertyType: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      inUnitFeatures: ["wifi", "parking", "pool", "gym"],
      instantBook: true,
      tier: "luxury",
      host: { firstName: "Ahmed", lastName: "Al-Thani", hostVerified: "verified" }
    },
    {
      id: "2",
      title: "Modern Studio in West Bay",
      city: "Doha",
      area: "West Bay",
      coordinates: { lat: 25.3189, lng: 51.5263 },
      monthlyPrice: 2200,
      averageRating: 4.6,
      reviewCount: 89,
      photos: ["/api/placeholder/400/300"],
      propertyType: "studio",
      bedrooms: 0,
      bathrooms: 1,
      maxGuests: 2,
      inUnitFeatures: ["wifi", "ac", "workspace"],
      instantBook: false,
      tier: "standard",
      host: { firstName: "Sara", lastName: "Ahmed", hostVerified: "verified" }
    },
    {
      id: "3",
      title: "Spacious Villa with Pool",
      city: "Doha",
      area: "Al Waab",
      coordinates: { lat: 25.3548, lng: 51.4326 },
      monthlyPrice: 5500,
      averageRating: 4.9,
      reviewCount: 67,
      photos: ["/api/placeholder/400/300"],
      propertyType: "villa",
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      inUnitFeatures: ["wifi", "parking", "pool", "kitchen"],
      instantBook: true,
      tier: "luxury",
      host: { firstName: "Mohammed", lastName: "Hassan", hostVerified: "pending" }
    }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f7f7" }}>
      {/* Search Header */}
      <div style={{
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px" }}>
          {/* Search Bar */}
          <div style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "16px"
          }}>
            <Link href="/" style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#FF385C",
              textDecoration: "none",
              marginRight: "16px"
            }}>
              Houseiana
            </Link>
            <div style={{
              flex: 1,
              display: "flex",
              backgroundColor: "#f7f7f7",
              borderRadius: "40px",
              padding: "8px 16px",
              gap: "12px",
              alignItems: "center"
            }}>
              <input
                type="text"
                placeholder="Where to?"
                value={filters.location}
                onChange={(e) => updateFilters({...filters, location: e.target.value})}
                style={{
                  flex: 1,
                  border: "none",
                  backgroundColor: "transparent",
                  outline: "none",
                  fontSize: "14px"
                }}
              />
              <div style={{ width: "1px", height: "24px", backgroundColor: "#ddd" }} />
              <input
                type="date"
                value={filters.checkIn}
                onChange={(e) => updateFilters({...filters, checkIn: e.target.value})}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  outline: "none",
                  fontSize: "14px"
                }}
              />
              <div style={{ width: "1px", height: "24px", backgroundColor: "#ddd" }} />
              <input
                type="date"
                value={filters.checkOut}
                min={filters.checkIn}
                onChange={(e) => updateFilters({...filters, checkOut: e.target.value})}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  outline: "none",
                  fontSize: "14px"
                }}
              />
              <div style={{ width: "1px", height: "24px", backgroundColor: "#ddd" }} />
              <select
                value={filters.guests}
                onChange={(e) => updateFilters({...filters, guests: e.target.value})}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  outline: "none",
                  fontSize: "14px"
                }}
              >
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                ))}
              </select>
              <button
                onClick={() => fetchProperties()}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#FF385C",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                🔍
              </button>
            </div>
          </div>

          {/* Property Type Filters */}
          <div style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "8px"
          }}>
            {propertyTypes.map(type => (
              <button
                key={type.value}
                onClick={() => updateFilters({...filters, propertyType: type.value})}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "8px 16px",
                  backgroundColor: filters.propertyType === type.value ? "#fff" : "transparent",
                  border: filters.propertyType === type.value ? "2px solid #222" : "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  minWidth: "80px",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ fontSize: "24px", marginBottom: "4px" }}>{type.icon}</span>
                <span style={{ fontSize: "12px", fontWeight: filters.propertyType === type.value ? "600" : "400" }}>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        padding: "12px 0"
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => setShowAdvancedFilters(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "white",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              <span>🎚️</span> Filters
            </button>

            {filters.priceMin || filters.priceMax ? (
              <span style={{
                padding: "8px 16px",
                backgroundColor: "#f0f0f0",
                borderRadius: "20px",
                fontSize: "14px"
              }}>
                QAR {filters.priceMin || "0"} - {filters.priceMax || "10000+"}
              </span>
            ) : null}

            {filters.instantBook && (
              <span style={{
                padding: "8px 16px",
                backgroundColor: "#f0f0f0",
                borderRadius: "20px",
                fontSize: "14px"
              }}>
                ⚡ Instant Book
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#717171" }}>
              {pagination.total || 0} stays
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({...filters, sortBy: e.target.value})}
              style={{
                padding: "8px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "white",
                fontSize: "14px"
              }}
            >
              <option value="relevance">Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px 16px"
      }}>
        {loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{
                backgroundColor: "#f0f0f0",
                borderRadius: "12px",
                height: "320px",
                animation: "pulse 1.5s infinite"
              }} />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {properties.map(property => (
              <AirbnbPropertyCard 
                key={property.id} 
                property={property}
                onMouseEnter={() => setSelectedProperty(property)}
                onMouseLeave={() => setSelectedProperty(null)}
                selected={selectedProperty?.id === property.id}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "48px",
            backgroundColor: "white",
            borderRadius: "12px"
          }}>
            <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
              No exact matches
            </p>
            <p style={{ color: "#717171" }}>
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* Map */}
        {showMap && (
          <div style={{
            flex: "0 0 50%",
            position: "sticky",
            top: "200px",
            height: "calc(100vh - 200px)"
          }}>
            <PropertyMap 
              properties={properties}
              selectedProperty={selectedProperty}
              onPropertySelect={setSelectedProperty}
              center={properties.length > 0 ? properties[0].coordinates : { lat: 25.2854, lng: 51.5310 }}
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && properties.length > 0 && pagination.totalPages > 1 && (
        <div style={{
          padding: "24px 16px",
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          alignItems: "center"
        }}>
          <button
            disabled={!pagination.hasPrev}
            onClick={() => updateFilters({...filters, page: filters.page - 1})}
            style={{
              padding: "8px 16px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              backgroundColor: pagination.hasPrev ? "white" : "#f5f5f5",
              cursor: pagination.hasPrev ? "pointer" : "not-allowed",
              color: pagination.hasPrev ? "#222" : "#999"
            }}
          >
            Previous
          </button>
          <span style={{ margin: "0 16px", fontSize: "14px", color: "#717171" }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNext}
            onClick={() => updateFilters({...filters, page: filters.page + 1})}
            style={{
              padding: "8px 16px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              backgroundColor: pagination.hasNext ? "white" : "#f5f5f5",
              cursor: pagination.hasNext ? "pointer" : "not-allowed",
              color: pagination.hasNext ? "#222" : "#999"
            }}
          >
            Next
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}