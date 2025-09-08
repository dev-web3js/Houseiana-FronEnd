"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import FilterModal from "@/components/FilterModal";
import AdvancedFilterModal from "@/components/AdvancedFilterModal";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [totalResults, setTotalResults] = useState(0);
  
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("guests") || "1",
    priceMin: searchParams.get("priceMin") || 2000,
    priceMax: searchParams.get("priceMax") || 240000,
    propertyType: searchParams.get("propertyType") || "all",
    amenities: searchParams.get("amenities")?.split(",") || [],
    instantBook: searchParams.get("instantBook") === "true",
    tier: searchParams.get("tier") || "all",
    sortBy: searchParams.get("sortBy") || "relevance",
    // Advanced filters
    placeType: searchParams.get("placeType") || "any",
    bedrooms: searchParams.get("bedrooms") || "any",
    beds: searchParams.get("beds") || "any",
    bathrooms: searchParams.get("bathrooms") || "any",
    topAmenities: searchParams.get("topAmenities")?.split(",") || [],
    selfCheckIn: searchParams.get("selfCheckIn") === "true",
    freeCancellation: searchParams.get("freeCancellation") === "true",
    allowsPets: searchParams.get("allowsPets") === "true",
    guestFavorite: searchParams.get("guestFavorite") === "true",
    luxe: searchParams.get("luxe") === "true",
    propertyTypes: searchParams.get("propertyTypes")?.split(",") || [],
    accessibilityFeatures: searchParams.get("accessibilityFeatures")?.split(",") || [],
    hostLanguages: searchParams.get("hostLanguages")?.split(",") || []
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
        if (value && value !== "all") {
          if (key === "amenities" && Array.isArray(value) && value.length > 0) {
            params.append(key, value.join(","));
          } else if (value) {
            params.append(key, value);
          }
        }
      });

      const response = await fetch(`/api/properties/search?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
        setTotalResults(data.total || 0);
      } else {
        // Use mock data for now
        setProperties(getMockProperties());
        setTotalResults(3);
      }
    } catch (error) {
      console.error("Search error:", error);
      setProperties(getMockProperties());
      setTotalResults(3);
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
      id: 1,
      title: "Luxury Pearl Qatar Apartment",
      location: "The Pearl, Doha",
      price: 3500,
      rating: 4.8,
      reviews: 124,
      images: ["/api/placeholder/400/300"],
      type: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      guests: 4,
      amenities: ["wifi", "parking", "pool", "gym"],
      instantBook: true,
      host: { name: "Ahmed", verified: true }
    },
    {
      id: 2,
      title: "Modern Studio in West Bay",
      location: "West Bay, Doha",
      price: 2200,
      rating: 4.6,
      reviews: 89,
      images: ["/api/placeholder/400/300"],
      type: "studio",
      bedrooms: 0,
      bathrooms: 1,
      guests: 2,
      amenities: ["wifi", "ac", "workspace"],
      instantBook: false,
      host: { name: "Sara", verified: true }
    },
    {
      id: 3,
      title: "Spacious Villa with Pool",
      location: "Al Waab, Doha",
      price: 5500,
      rating: 4.9,
      reviews: 67,
      images: ["/api/placeholder/400/300"],
      type: "villa",
      bedrooms: 4,
      bathrooms: 3,
      guests: 8,
      amenities: ["wifi", "parking", "pool", "kitchen"],
      instantBook: true,
      host: { name: "Mohammed", verified: false }
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
              {totalResults} stays
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
              <PropertyCard key={property.id} property={property} />
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
      </div>

      {showFilters && (
        <FilterModal
          filters={filters}
          setFilters={updateFilters}
          amenitiesList={amenitiesList}
          onClose={() => setShowFilters(false)}
        />
      )}
      
      {showAdvancedFilters && (
        <AdvancedFilterModal
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowAdvancedFilters(false)}
          onApply={(newFilters) => {
            updateFilters(newFilters);
          }}
        />
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