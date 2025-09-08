"use client";

import { useState } from "react";
import Link from "next/link";

export default function PropertyCard({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: property.id })
      });
      
      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const images = property.images || ["/api/placeholder/400/300"];
  const displayImage = images[currentImageIndex] || "/api/placeholder/400/300";

  return (
    <Link href={`/property/${property.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s",
        position: "relative"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}>
        {/* Image Carousel */}
        <div style={{
          position: "relative",
          paddingBottom: "66.67%", // 3:2 aspect ratio
          backgroundColor: "#f0f0f0"
        }}>
          <img
            src={displayImage}
            alt={property.title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(0, 0, 0, 0.5)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <svg
              viewBox="0 0 24 24"
              style={{
                width: "20px",
                height: "20px",
                fill: isFavorite ? "#FF385C" : "none",
                stroke: isFavorite ? "#FF385C" : "white",
                strokeWidth: 2
              }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0}
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0}
              >
                ›
              </button>
            </>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div style={{
              position: "absolute",
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "4px"
            }}>
              {images.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: index === currentImageIndex ? "white" : "rgba(255, 255, 255, 0.5)",
                    transition: "background-color 0.2s"
                  }}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            display: "flex",
            gap: "8px"
          }}>
            {property.instantBook && (
              <span style={{
                backgroundColor: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                ⚡ Instant Book
              </span>
            )}
            {property.host?.verified && (
              <span style={{
                backgroundColor: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div style={{ padding: "12px 0" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start"
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#222",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {property.title}
              </h3>
              <p style={{
                fontSize: "14px",
                color: "#717171",
                margin: "4px 0"
              }}>
                {property.location}
              </p>
              <p style={{
                fontSize: "14px",
                color: "#717171",
                margin: "4px 0"
              }}>
                {property.bedrooms ? `${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''}` : 'Studio'} · 
                {' '}{property.bathrooms} bath · 
                {' '}{property.guests} guest{property.guests > 1 ? 's' : ''}
              </p>
            </div>
            {property.rating && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span>⭐</span>
                <span style={{
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  {property.rating}
                </span>
                {property.reviews > 0 && (
                  <span style={{
                    fontSize: "14px",
                    color: "#717171"
                  }}>
                    ({property.reviews})
                  </span>
                )}
              </div>
            )}
          </div>
          <div style={{
            marginTop: "8px",
            fontSize: "16px"
          }}>
            <span style={{ fontWeight: "600" }}>QAR {property.price}</span>
            <span style={{ color: "#717171", fontSize: "14px" }}> / month</span>
          </div>
        </div>
      </div>
    </Link>
  );
}