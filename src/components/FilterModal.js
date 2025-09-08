"use client";

export default function FilterModal({ filters, setFilters, amenitiesList, onClose }) {
  const handleAmenityToggle = (amenity) => {
    const updatedAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    setFilters({ ...filters, amenities: updatedAmenities });
  };

  const clearAllFilters = () => {
    setFilters({
      ...filters,
      priceMin: "",
      priceMax: "",
      propertyType: "all",
      amenities: [],
      instantBook: false,
      tier: "all"
    });
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "80vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Filters</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              padding: "0",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px"
        }}>
          {/* Price Range */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
              Price range
            </h3>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", color: "#717171" }}>Minimum</label>
                <input
                  type="number"
                  placeholder="QAR 0"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    marginTop: "4px"
                  }}
                />
              </div>
              <span style={{ marginTop: "20px" }}>-</span>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", color: "#717171" }}>Maximum</label>
                <input
                  type="number"
                  placeholder="QAR 10000+"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    marginTop: "4px"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tier Selection */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
              Comfort Tier
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {["all", "standard", "gold", "premium"].map(tier => (
                <button
                  key={tier}
                  onClick={() => setFilters({...filters, tier})}
                  style={{
                    padding: "12px",
                    border: filters.tier === tier ? "2px solid #222" : "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: filters.tier === tier ? "#f7f7f7" : "white",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    fontWeight: filters.tier === tier ? "600" : "400"
                  }}
                >
                  {tier === "all" ? "All Tiers" : tier}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
              Amenities
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              {amenitiesList.map(amenity => (
                <label
                  key={amenity.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity.value)}
                    onChange={() => handleAmenityToggle(amenity.value)}
                    style={{
                      width: "20px",
                      height: "20px",
                      cursor: "pointer"
                    }}
                  />
                  <span style={{ fontSize: "18px" }}>{amenity.icon}</span>
                  <span style={{ fontSize: "14px" }}>{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Booking Options */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
              Booking options
            </h3>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer"
            }}>
              <input
                type="checkbox"
                checked={filters.instantBook}
                onChange={(e) => setFilters({...filters, instantBook: e.target.checked})}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer"
                }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: "500" }}>Instant Book</div>
                <div style={{ fontSize: "12px", color: "#717171" }}>
                  Book without waiting for host approval
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "20px",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <button
            onClick={clearAllFilters}
            style={{
              background: "none",
              border: "none",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              backgroundColor: "#222",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}