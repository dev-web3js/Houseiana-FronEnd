"use client";

import Link from "next/link";
import { useState } from "react";

export default function AirbnbPropertyCard({ 
  property, 
  onMouseEnter, 
  onMouseLeave, 
  selected = false 
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.photos.length - 1 : prev - 1
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-QA', {
      style: 'currency',
      currency: 'QAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStarRating = (rating) => {
    return "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "☆" : "");
  };

  return (
    <Link 
      href={`/property/${property.slug || property.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.2s ease",
          border: selected ? "2px solid #FF385C" : "1px solid transparent",
          boxShadow: selected ? "0 4px 20px rgba(255, 56, 92, 0.1)" : "0 2px 12px rgba(0,0,0,0.08)"
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Image Section */}
        <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
          <img
            src={property.photos?.[currentImageIndex] || "/api/placeholder/400/240"}
            alt={property.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
          
          {/* Image Navigation */}
          {property.photos?.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  opacity: currentImageIndex === 0 ? 0.5 : 1
                }}
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
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  opacity: currentImageIndex === property.photos.length - 1 ? 0.5 : 1
                }}
              >
                ›
              </button>
              
              {/* Image Dots */}
              <div style={{
                position: "absolute",
                bottom: "12px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "4px"
              }}>
                {property.photos.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: index === currentImageIndex 
                        ? "white" 
                        : "rgba(255,255,255,0.5)"
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Heart Icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle favorite toggle
            }}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.9)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px"
            }}
          >
            ♡
          </button>

          {/* Instant Book Badge */}
          {property.instantBook && (
            <div style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              padding: "4px 8px",
              backgroundColor: "white",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "600",
              color: "#222"
            }}>
              INSTANT BOOK
            </div>
          )}

          {/* Tier Badge */}
          {property.tier === "luxury" && (
            <div style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              padding: "4px 8px",
              backgroundColor: "#FFD700",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "600",
              color: "#222"
            }}>
              LUXURY
            </div>
          )}
        </div>

        {/* Content Section */}
        <div style={{ padding: "16px" }}>
          {/* Location and Rating */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "4px"
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#222",
                margin: "0",
                marginBottom: "2px",
                lineHeight: "1.2"
              }}>
                {property.area}, {property.city}
              </h3>
              <p style={{
                fontSize: "14px",
                color: "#717171",
                margin: "0",
                marginBottom: "2px"
              }}>
                {property.district && `${property.district} • `}
                {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
              </p>
            </div>
            
            {property.averageRating && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "14px"
              }}>
                <span style={{ color: "#222" }}>★</span>
                <span style={{ fontWeight: "600", color: "#222" }}>
                  {property.averageRating.toFixed(1)}
                </span>
                {property.reviewCount && (
                  <span style={{ color: "#717171" }}>
                    ({property.reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Property Details */}
          <p style={{
            fontSize: "14px",
            color: "#717171",
            margin: "0",
            marginBottom: "4px"
          }}>
            {property.maxGuests} guest{property.maxGuests !== 1 ? 's' : ''} • {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''} • {property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}
          </p>

          {/* Amenities */}
          {property.inUnitFeatures?.length > 0 && (
            <p style={{
              fontSize: "14px",
              color: "#717171",
              margin: "0",
              marginBottom: "8px"
            }}>
              {property.inUnitFeatures.slice(0, 3).join(" • ")}
              {property.inUnitFeatures.length > 3 && " • ..."}
            </p>
          )}

          {/* Title */}
          <h2 style={{
            fontSize: "16px",
            fontWeight: "400",
            color: "#222",
            margin: "0",
            marginBottom: "8px",
            lineHeight: "1.3",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {property.title}
          </h2>

          {/* Host Info */}
          {property.host && (
            <p style={{
              fontSize: "14px",
              color: "#717171",
              margin: "0",
              marginBottom: "8px"
            }}>
              Hosted by {property.host.firstName} {property.host.lastName}
              {property.host.hostVerified === "verified" && (
                <span style={{ color: "#00A699", marginLeft: "4px" }}>✓</span>
              )}
            </p>
          )}

          {/* Pricing */}
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
            marginTop: "8px"
          }}>
            <span style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#222"
            }}>
              {formatPrice(property.monthlyPrice)}
            </span>
            <span style={{
              fontSize: "14px",
              color: "#717171"
            }}>
              month
            </span>
          </div>

          {/* Weekly/Nightly Prices */}
          {(property.weeklyPrice || property.nightlyPrice) && (
            <div style={{
              display: "flex",
              gap: "8px",
              fontSize: "12px",
              color: "#717171",
              marginTop: "2px"
            }}>
              {property.weeklyPrice && (
                <span>{formatPrice(property.weeklyPrice)}/week</span>
              )}
              {property.nightlyPrice && (
                <span>{formatPrice(property.nightlyPrice)}/night</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}