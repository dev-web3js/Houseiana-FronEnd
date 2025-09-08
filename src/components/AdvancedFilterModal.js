"use client";

import { useState } from 'react';

export default function AdvancedFilterModal({ filters, setFilters, onClose, onApply }) {
  const [localFilters, setLocalFilters] = useState({
    // Type of place
    placeType: filters.placeType || 'any', // 'any', 'room', 'entire'
    
    // Price range
    priceMin: filters.priceMin || 2000,
    priceMax: filters.priceMax || 240000,
    
    // Rooms and beds
    bedrooms: filters.bedrooms || 'any',
    beds: filters.beds || 'any',
    bathrooms: filters.bathrooms || 'any',
    
    // Top tier amenities
    topAmenities: filters.topAmenities || [],
    
    // All amenities
    amenities: filters.amenities || [],
    
    // Booking options
    instantBook: filters.instantBook || false,
    selfCheckIn: filters.selfCheckIn || false,
    freeCancellation: filters.freeCancellation || false,
    allowsPets: filters.allowsPets || false,
    
    // Standout stays
    guestFavorite: filters.guestFavorite || false,
    luxe: filters.luxe || false,
    
    // Property type
    propertyTypes: filters.propertyTypes || [],
    
    // Accessibility features
    accessibilityFeatures: filters.accessibilityFeatures || [],
    
    // Host language
    hostLanguages: filters.hostLanguages || []
  });

  // Top tier amenities (shown prominently)
  const topTierAmenities = [
    { id: 'pool', label: 'Pool', icon: '🏊' },
    { id: 'washer', label: 'Washer', icon: '🧺' },
    { id: 'parking', label: 'Free parking', icon: '🚗' },
    { id: 'selfCheckIn', label: 'Self check-in', icon: '🔑' }
  ];

  // All amenities
  const allAmenities = [
    { id: 'wifi', label: 'Wifi', icon: '📶' },
    { id: 'kitchen', label: 'Kitchen', icon: '👨‍🍳' },
    { id: 'ac', label: 'Air conditioning', icon: '❄️' },
    { id: 'gym', label: 'Gym', icon: '🏋️' },
    { id: 'tv', label: 'TV', icon: '📺' },
    { id: 'hairDryer', label: 'Hair dryer', icon: '💨' },
    { id: 'iron', label: 'Iron', icon: '👔' },
    { id: 'workspace', label: 'Dedicated workspace', icon: '💼' },
    { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { id: 'fireplace', label: 'Fireplace', icon: '🔥' },
    { id: 'heating', label: 'Heating', icon: '🌡️' },
    { id: 'smokeAlarm', label: 'Smoke alarm', icon: '🚨' },
    { id: 'carbonMonoxideAlarm', label: 'Carbon monoxide alarm', icon: '⚠️' },
    { id: 'firstAidKit', label: 'First aid kit', icon: '🏥' },
    { id: 'fireExtinguisher', label: 'Fire extinguisher', icon: '🧯' },
    { id: 'lockOnBedroom', label: 'Lock on bedroom door', icon: '🔒' }
  ];

  // Property types
  const propertyTypes = [
    { id: 'house', label: 'House', icon: '🏠' },
    { id: 'apartment', label: 'Apartment', icon: '🏢' },
    { id: 'villa', label: 'Villa', icon: '🏰' },
    { id: 'hotel', label: 'Hotel', icon: '🏨' },
    { id: 'cottage', label: 'Cottage', icon: '🏡' },
    { id: 'bungalow', label: 'Bungalow', icon: '🛖' },
    { id: 'townhouse', label: 'Townhouse', icon: '🏘️' },
    { id: 'condo', label: 'Condo', icon: '🏙️' },
    { id: 'loft', label: 'Loft', icon: '🏭' },
    { id: 'studio', label: 'Studio', icon: '🎨' }
  ];

  // Accessibility features
  const accessibilityFeatures = [
    { id: 'stepFreeAccess', label: 'Step-free guest entrance' },
    { id: 'wideEntrance', label: 'Guest entrance wider than 32 inches' },
    { id: 'wideDoorways', label: 'Wide doorways' },
    { id: 'accessibleParking', label: 'Accessible parking spot' },
    { id: 'widePath', label: 'Wide path to entrance' }
  ];

  // Host languages
  const hostLanguages = [
    { id: 'english', label: 'English' },
    { id: 'arabic', label: 'Arabic' },
    { id: 'french', label: 'French' },
    { id: 'spanish', label: 'Spanish' },
    { id: 'german', label: 'German' },
    { id: 'italian', label: 'Italian' },
    { id: 'chinese', label: 'Chinese' },
    { id: 'japanese', label: 'Japanese' },
    { id: 'hindi', label: 'Hindi' },
    { id: 'urdu', label: 'Urdu' }
  ];

  const [showMoreAmenities, setShowMoreAmenities] = useState(false);
  const [activeSection, setActiveSection] = useState('placeType');

  const handleTopAmenityToggle = (amenityId) => {
    setLocalFilters(prev => ({
      ...prev,
      topAmenities: prev.topAmenities.includes(amenityId)
        ? prev.topAmenities.filter(id => id !== amenityId)
        : [...prev.topAmenities, amenityId]
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    setLocalFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handlePropertyTypeToggle = (typeId) => {
    setLocalFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(typeId)
        ? prev.propertyTypes.filter(id => id !== typeId)
        : [...prev.propertyTypes, typeId]
    }));
  };

  const handleAccessibilityToggle = (featureId) => {
    setLocalFilters(prev => ({
      ...prev,
      accessibilityFeatures: prev.accessibilityFeatures.includes(featureId)
        ? prev.accessibilityFeatures.filter(id => id !== featureId)
        : [...prev.accessibilityFeatures, featureId]
    }));
  };

  const handleLanguageToggle = (langId) => {
    setLocalFilters(prev => ({
      ...prev,
      hostLanguages: prev.hostLanguages.includes(langId)
        ? prev.hostLanguages.filter(id => id !== langId)
        : [...prev.hostLanguages, langId]
    }));
  };

  const clearAll = () => {
    setLocalFilters({
      placeType: 'any',
      priceMin: 2000,
      priceMax: 240000,
      bedrooms: 'any',
      beds: 'any',
      bathrooms: 'any',
      topAmenities: [],
      amenities: [],
      instantBook: false,
      selfCheckIn: false,
      freeCancellation: false,
      allowsPets: false,
      guestFavorite: false,
      luxe: false,
      propertyTypes: [],
      accessibilityFeatures: [],
      hostLanguages: []
    });
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onApply(localFilters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.placeType !== 'any') count++;
    if (localFilters.priceMin !== 2000 || localFilters.priceMax !== 240000) count++;
    if (localFilters.bedrooms !== 'any') count++;
    if (localFilters.beds !== 'any') count++;
    if (localFilters.bathrooms !== 'any') count++;
    count += localFilters.topAmenities.length;
    count += localFilters.amenities.length;
    if (localFilters.instantBook) count++;
    if (localFilters.selfCheckIn) count++;
    if (localFilters.freeCancellation) count++;
    if (localFilters.allowsPets) count++;
    if (localFilters.guestFavorite) count++;
    if (localFilters.luxe) count++;
    count += localFilters.propertyTypes.length;
    count += localFilters.accessibilityFeatures.length;
    count += localFilters.hostLanguages.length;
    return count;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '780px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #dddddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: 0
          }}>
            Filters
          </h2>
          <div style={{ width: '32px' }} />
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 24px'
        }}>
          {/* Top amenities */}
          <div style={{
            padding: '24px 0',
            borderBottom: '1px solid #ebebeb'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {topTierAmenities.map(amenity => (
                <button
                  key={amenity.id}
                  onClick={() => handleTopAmenityToggle(amenity.id)}
                  style={{
                    padding: '24px',
                    border: localFilters.topAmenities.includes(amenity.id) 
                      ? '2px solid #222' 
                      : '1px solid #dddddd',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    {amenity.icon}
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: localFilters.topAmenities.includes(amenity.id) ? '600' : '400'
                  }}>
                    {amenity.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Type of place */}
          <div style={{
            padding: '32px 0',
            borderBottom: '1px solid #ebebeb'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '500',
              marginBottom: '24px'
            }}>
              Type of place
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#717171',
              marginBottom: '24px'
            }}>
              Search rooms, entire homes, or any type of place.
            </p>
            <div style={{
              display: 'flex',
              border: '1px solid #b0b0b0',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setLocalFilters({...localFilters, placeType: 'any'})}
                style={{
                  flex: 1,
                  padding: '24px',
                  border: 'none',
                  backgroundColor: localFilters.placeType === 'any' ? '#222' : 'white',
                  color: localFilters.placeType === 'any' ? 'white' : '#222',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Any type
              </button>
              <button
                onClick={() => setLocalFilters({...localFilters, placeType: 'room'})}
                style={{
                  flex: 1,
                  padding: '24px',
                  border: 'none',
                  borderLeft: '1px solid #b0b0b0',
                  borderRight: '1px solid #b0b0b0',
                  backgroundColor: localFilters.placeType === 'room' ? '#222' : 'white',
                  color: localFilters.placeType === 'room' ? 'white' : '#222',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Room
              </button>
              <button
                onClick={() => setLocalFilters({...localFilters, placeType: 'entire'})}
                style={{
                  flex: 1,
                  padding: '24px',
                  border: 'none',
                  backgroundColor: localFilters.placeType === 'entire' ? '#222' : 'white',
                  color: localFilters.placeType === 'entire' ? 'white' : '#222',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Entire home
              </button>
            </div>
          </div>

          {/* Price range */}
          <div style={{
            padding: '32px 0',
            borderBottom: '1px solid #ebebeb'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Price range
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#717171',
              marginBottom: '24px'
            }}>
              Nightly prices including fees and taxes
            </p>
            
            {/* Price slider visualization */}
            <div style={{
              marginBottom: '32px',
              padding: '0 8px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '24px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#717171', marginBottom: '4px' }}>
                    Minimum
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '500' }}>
                    QAR {localFilters.priceMin.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#717171', marginBottom: '4px' }}>
                    Maximum
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '500' }}>
                    QAR {localFilters.priceMax === 240000 ? '240,000+' : localFilters.priceMax.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Price input fields */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    value={localFilters.priceMin}
                    onChange={(e) => setLocalFilters({...localFilters, priceMin: parseInt(e.target.value) || 0})}
                    min="0"
                    max={localFilters.priceMax}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #b0b0b0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px'
                }}>
                  —
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    value={localFilters.priceMax}
                    onChange={(e) => setLocalFilters({...localFilters, priceMax: parseInt(e.target.value) || 240000})}
                    min={localFilters.priceMin}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #b0b0b0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rooms and beds */}
          <div style={{
            padding: '32px 0',
            borderBottom: '1px solid #ebebeb'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '500',
              marginBottom: '24px'
            }}>
              Rooms and beds
            </h3>
            
            {/* Bedrooms */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '16px', marginBottom: '16px' }}>Bedrooms</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['any', '1', '2', '3', '4', '5', '6', '7', '8+'].map(num => (
                  <button
                    key={num}
                    onClick={() => setLocalFilters({...localFilters, bedrooms: num})}
                    style={{
                      padding: '8px 24px',
                      border: '1px solid #b0b0b0',
                      borderRadius: '30px',
                      backgroundColor: localFilters.bedrooms === num ? '#222' : 'white',
                      color: localFilters.bedrooms === num ? 'white' : '#222',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {num === 'any' ? 'Any' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Beds */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '16px', marginBottom: '16px' }}>Beds</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['any', '1', '2', '3', '4', '5', '6', '7', '8+'].map(num => (
                  <button
                    key={num}
                    onClick={() => setLocalFilters({...localFilters, beds: num})}
                    style={{
                      padding: '8px 24px',
                      border: '1px solid #b0b0b0',
                      borderRadius: '30px',
                      backgroundColor: localFilters.beds === num ? '#222' : 'white',
                      color: localFilters.beds === num ? 'white' : '#222',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {num === 'any' ? 'Any' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <div style={{ fontSize: '16px', marginBottom: '16px' }}>Bathrooms</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['any', '1', '2', '3', '4', '5', '6', '7', '8+'].map(num => (
                  <button
                    key={num}
                    onClick={() => setLocalFilters({...localFilters, bathrooms: num})}
                    style={{
                      padding: '8px 24px',
                      border: '1px solid #b0b0b0',
                      borderRadius: '30px',
                      backgroundColor: localFilters.bathrooms === num ? '#222' : 'white',
                      color: localFilters.bathrooms === num ? 'white' : '#222',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {num === 'any' ? 'Any' : num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div style={{
            padding: '32px 0',
            borderBottom: '1px solid #ebebeb'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '500',
              marginBottom: '24px'
            }}>
              Amenities
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {(showMoreAmenities ? allAmenities : allAmenities.slice(0, 6)).map(amenity => (
                <label
                  key={amenity.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={localFilters.amenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '16px' }}>{amenity.icon}</span>
                  <span style={{ fontSize: '16px' }}>{amenity.label}</span>
                </label>
              ))}
            </div>
            
            {!showMoreAmenities && (
              <button
                onClick={() => setShowMoreAmenities(true)}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  border: '1px solid #222',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#222',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Show more
              </button>
            )}
          </div>

          {/* Booking options */}
          <div style={{
            padding: '32px 0',
            borderBottom: '1px solid #ebebeb'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '500',
              marginBottom: '24px'
            }}>
              Booking options
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>Instant Book</div>
                  <div style={{ fontSize: '14px', color: '#717171' }}>
                    Listings you can book without waiting for host approval
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localFilters.instantBook}
                  onChange={(e) => setLocalFilters({...localFilters, instantBook: e.target.checked})}
                  style={{
                    width: '48px',
                    height: '24px',
                    cursor: 'pointer'
                  }}
                />
              </label>

              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>Self check-in</div>
                  <div style={{ fontSize: '14px', color: '#717171' }}>
                    Easy access to the property once you arrive
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localFilters.selfCheckIn}
                  onChange={(e) => setLocalFilters({...localFilters, selfCheckIn: e.target.checked})}
                  style={{
                    width: '48px',
                    height: '24px',
                    cursor: 'pointer'
                  }}
                />
              </label>

              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>Free cancellation</div>
                  <div style={{ fontSize: '14px', color: '#717171' }}>
                    Only show stays that offer free cancellation
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localFilters.freeCancellation}
                  onChange={(e) => setLocalFilters({...localFilters, freeCancellation: e.target.checked})}
                  style={{
                    width: '48px',
                    height: '24px',
                    cursor: 'pointer'
                  }}
                />
              </label>

              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>Allows pets</div>
                  <div style={{ fontSize: '14px', color: '#717171' }}>
                    Bringing a service animal?
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localFilters.allowsPets}
                  onChange={(e) => setLocalFilters({...localFilters, allowsPets: e.target.checked})}
                  style={{
                    width: '48px',
                    height: '24px',
                    cursor: 'pointer'
                  }}
                />
              </label>
            </div>
          </div>

          {/* Standout stays */}
          <div style={{
            padding: '32px 0',
            borderBottom: '1px solid #ebebeb'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '500',
              marginBottom: '24px'
            }}>
              Standout stays
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>Guest favorite</div>
                  <div style={{ fontSize: '14px', color: '#717171' }}>
                    The most loved homes on Houseiana
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localFilters.guestFavorite}
                  onChange={(e) => setLocalFilters({...localFilters, guestFavorite: e.target.checked})}
                  style={{
                    width: '48px',
                    height: '24px',
                    cursor: 'pointer'
                  }}
                />
              </label>

              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>Luxe</div>
                  <div style={{ fontSize: '14px', color: '#717171' }}>
                    Luxury homes with elevated design
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localFilters.luxe}
                  onChange={(e) => setLocalFilters({...localFilters, luxe: e.target.checked})}
                  style={{
                    width: '48px',
                    height: '24px',
                    cursor: 'pointer'
                  }}
                />
              </label>
            </div>
          </div>

          {/* Property type */}
          <div style={{
            padding: '32px 0',
            borderBottom: '1px solid #ebebeb'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '500',
              marginBottom: '24px'
            }}>
              Property type
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              {propertyTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => handlePropertyTypeToggle(type.id)}
                  style={{
                    padding: '20px',
                    border: localFilters.propertyTypes.includes(type.id) 
                      ? '2px solid #222' 
                      : '1px solid #dddddd',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    {type.icon}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: localFilters.propertyTypes.includes(type.id) ? '600' : '400'
                  }}>
                    {type.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility features */}
          <div style={{
            padding: '32px 0',
            borderBottom: '1px solid #ebebeb'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '500',
              marginBottom: '24px'
            }}>
              Accessibility features
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {accessibilityFeatures.map(feature => (
                <label
                  key={feature.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={localFilters.accessibilityFeatures.includes(feature.id)}
                    onChange={() => handleAccessibilityToggle(feature.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '16px' }}>{feature.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Host language */}
          <div style={{
            padding: '32px 0'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '500',
              marginBottom: '24px'
            }}>
              Host language
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {hostLanguages.map(lang => (
                <label
                  key={lang.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={localFilters.hostLanguages.includes(lang.id)}
                    onChange={() => handleLanguageToggle(lang.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '16px' }}>{lang.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #dddddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={clearAll}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            Clear all
          </button>
          <button
            onClick={applyFilters}
            style={{
              padding: '14px 24px',
              backgroundColor: '#222',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Show {getActiveFiltersCount() > 0 ? `${getActiveFiltersCount()} filtered` : ''} places
          </button>
        </div>
      </div>
    </div>
  );
}