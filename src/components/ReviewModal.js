"use client";

import { useState } from 'react';

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  booking, 
  reviewType = 'property', // 'property', 'host', 'guest'
  onSubmit 
}) {
  const [ratings, setRatings] = useState({
    // Property ratings
    overall: 0,
    cleanliness: 0,
    accuracy: 0,
    checkIn: 0,
    communication: 0,
    location: 0,
    value: 0,
    // Host ratings
    hostHospitality: 0,
    hostResponsiveness: 0,
    hostReliability: 0,
    // Guest ratings (for hosts reviewing guests)
    guestCleanliness: 0,
    guestCommunication: 0,
    guestRules: 0,
    guestRecommend: false
  });
  
  const [publicReview, setPublicReview] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [photos, setPhotos] = useState([]);
  const [hoveredRating, setHoveredRating] = useState({});
  const [activeTab, setActiveTab] = useState(reviewType === 'guest' ? 'guest' : 'property');

  if (!isOpen || !booking) return null;

  const ratingCategories = {
    property: [
      { key: 'overall', label: 'Overall Experience', icon: '⭐', required: true },
      { key: 'cleanliness', label: 'Cleanliness', icon: '🧹' },
      { key: 'accuracy', label: 'Accuracy', icon: '✓' },
      { key: 'checkIn', label: 'Check-in', icon: '🔑' },
      { key: 'communication', label: 'Communication', icon: '💬' },
      { key: 'location', label: 'Location', icon: '📍' },
      { key: 'value', label: 'Value for Money', icon: '💰' }
    ],
    host: [
      { key: 'hostHospitality', label: 'Hospitality', icon: '🤝' },
      { key: 'hostResponsiveness', label: 'Responsiveness', icon: '⚡' },
      { key: 'hostReliability', label: 'Reliability', icon: '✅' }
    ],
    guest: [
      { key: 'overall', label: 'Overall Rating', icon: '⭐', required: true },
      { key: 'guestCleanliness', label: 'Cleanliness', icon: '🧹' },
      { key: 'guestCommunication', label: 'Communication', icon: '💬' },
      { key: 'guestRules', label: 'Following House Rules', icon: '📋' }
    ]
  };

  const StarRating = ({ category, value, required = false }) => {
    const stars = [1, 2, 3, 4, 5];
    const displayValue = hoveredRating[category] || value || 0;
    
    const getStarLabel = (star) => {
      const labels = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'];
      return labels[star - 1];
    };

    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <label style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#222',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{category.icon}</span>
            {category.label}
            {required && <span style={{ color: '#FF385C' }}>*</span>}
          </label>
          {displayValue > 0 && (
            <span style={{
              fontSize: '12px',
              color: '#717171',
              fontStyle: 'italic'
            }}>
              {getStarLabel(displayValue)}
            </span>
          )}
        </div>
        <div style={{
          display: 'flex',
          gap: '4px'
        }}>
          {stars.map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRatings(prev => ({ ...prev, [category.key]: star }))}
              onMouseEnter={() => setHoveredRating(prev => ({ ...prev, [category.key]: star }))}
              onMouseLeave={() => setHoveredRating(prev => ({ ...prev, [category.key]: null }))}
              style={{
                fontSize: '28px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                transition: 'transform 0.2s',
                transform: star <= displayValue ? 'scale(1.1)' : 'scale(1)',
                filter: star <= displayValue ? 'none' : 'grayscale(100%)',
                opacity: star <= displayValue ? 1 : 0.3
              }}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!ratings.overall) {
      alert('Please provide an overall rating');
      return;
    }

    if (!publicReview.trim()) {
      alert('Please write a review');
      return;
    }

    const reviewData = {
      bookingId: booking.id,
      reviewType,
      ratings: {
        overall: ratings.overall,
        ...(reviewType !== 'guest' && {
          cleanliness: ratings.cleanliness,
          accuracy: ratings.accuracy,
          checkIn: ratings.checkIn,
          communication: ratings.communication,
          location: ratings.location,
          value: ratings.value
        }),
        ...(activeTab === 'host' && {
          hostHospitality: ratings.hostHospitality,
          hostResponsiveness: ratings.hostResponsiveness,
          hostReliability: ratings.hostReliability
        }),
        ...(reviewType === 'guest' && {
          guestCleanliness: ratings.guestCleanliness,
          guestCommunication: ratings.guestCommunication,
          guestRules: ratings.guestRules,
          guestRecommend: ratings.guestRecommend
        })
      },
      publicReview,
      privateNote: privateNote.trim() || null,
      photos
    };

    await onSubmit(reviewData);
    onClose();
  };

  const isGuestReview = reviewType === 'guest';

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
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              {isGuestReview ? 'Review Your Guest' : 'Leave a Review'}
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#717171'
            }}>
              {isGuestReview 
                ? `Share your experience hosting ${booking.guestName || 'this guest'}`
                : `Share your experience at ${booking.property?.title || 'this property'}`
              }
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f7f7f7'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        {/* Tabs (only for guest reviews) */}
        {!isGuestReview && (
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e0e0e0',
            padding: '0 24px'
          }}>
            <button
              onClick={() => setActiveTab('property')}
              style={{
                padding: '16px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'property' ? '2px solid #222' : '2px solid transparent',
                fontSize: '14px',
                fontWeight: activeTab === 'property' ? '600' : '400',
                cursor: 'pointer',
                color: activeTab === 'property' ? '#222' : '#717171'
              }}
            >
              Property Review
            </button>
            <button
              onClick={() => setActiveTab('host')}
              style={{
                padding: '16px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'host' ? '2px solid #222' : '2px solid transparent',
                fontSize: '14px',
                fontWeight: activeTab === 'host' ? '600' : '400',
                cursor: 'pointer',
                color: activeTab === 'host' ? '#222' : '#717171'
              }}
            >
              Host Review
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px'
        }}>
          {/* Rating Categories */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              {isGuestReview 
                ? 'Rate Your Guest' 
                : activeTab === 'property' 
                  ? 'Rate Your Stay' 
                  : 'Rate Your Host'
              }
            </h3>
            
            {/* Property or Guest Ratings */}
            {(isGuestReview ? ratingCategories.guest : 
              activeTab === 'property' ? ratingCategories.property : 
              [...ratingCategories.property.filter(c => c.key === 'overall'), ...ratingCategories.host]
            ).map(category => (
              <StarRating 
                key={category.key} 
                category={category} 
                value={ratings[category.key]}
                required={category.required}
              />
            ))}

            {/* Recommend Guest Checkbox (for host reviews) */}
            {isGuestReview && (
              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#f7f7f7',
                borderRadius: '8px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={ratings.guestRecommend}
                    onChange={(e) => setRatings(prev => ({ 
                      ...prev, 
                      guestRecommend: e.target.checked 
                    }))}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '4px'
                    }}>
                      Would you recommend this guest to other hosts?
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#717171'
                    }}>
                      This helps other hosts make informed decisions
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Public Review */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Write Your Review <span style={{ color: '#FF385C' }}>*</span>
            </label>
            <p style={{
              fontSize: '14px',
              color: '#717171',
              marginBottom: '12px'
            }}>
              {isGuestReview 
                ? 'This will be visible to other hosts'
                : 'This will be visible to everyone'
              }
            </p>
            <textarea
              value={publicReview}
              onChange={(e) => setPublicReview(e.target.value)}
              placeholder={
                isGuestReview 
                  ? "Share your experience hosting this guest. Were they respectful? Did they follow house rules? Would you host them again?"
                  : activeTab === 'property'
                    ? "Describe your experience. What did you love? What could be better?"
                    : "How was your interaction with the host? Were they helpful and responsive?"
              }
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              maxLength={500}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px'
            }}>
              <span style={{
                fontSize: '12px',
                color: '#717171'
              }}>
                {publicReview.length}/500 characters
              </span>
            </div>
          </div>

          {/* Private Note */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Private Feedback (Optional)
            </label>
            <p style={{
              fontSize: '14px',
              color: '#717171',
              marginBottom: '12px'
            }}>
              {isGuestReview 
                ? 'Only the guest will see this'
                : 'Only the host will see this'
              }
            </p>
            <textarea
              value={privateNote}
              onChange={(e) => setPrivateNote(e.target.value)}
              placeholder={
                isGuestReview
                  ? "Any private feedback for the guest?"
                  : "Any private feedback or suggestions for the host?"
              }
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              maxLength={300}
            />
          </div>

          {/* Photo Upload (only for property reviews) */}
          {!isGuestReview && activeTab === 'property' && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Add Photos (Optional)
              </label>
              <p style={{
                fontSize: '14px',
                color: '#717171',
                marginBottom: '12px'
              }}>
                Share photos from your stay
              </p>
              <div style={{
                border: '2px dashed #e0e0e0',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#222'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              >
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>📷</div>
                <p style={{ fontSize: '14px', color: '#717171' }}>
                  Click to upload photos
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    // Handle file upload here
                    console.log('Files to upload:', files);
                  }}
                />
              </div>
            </div>
          )}

          {/* Review Guidelines */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>ℹ️</span> Review Guidelines
            </h4>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '13px',
              color: '#717171',
              lineHeight: '1.6'
            }}>
              <li>Be honest and constructive</li>
              <li>Focus on your actual experience</li>
              <li>Avoid personal attacks or discriminatory language</li>
              {isGuestReview ? (
                <li>Help other hosts by being specific about guest behavior</li>
              ) : (
                <li>Include both positives and areas for improvement</li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: 'white',
              color: '#222',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '12px 32px',
              backgroundColor: '#FF385C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: ratings.overall && publicReview.trim() ? 1 : 0.5
            }}
            disabled={!ratings.overall || !publicReview.trim()}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}