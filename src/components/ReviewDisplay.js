"use client";

import { useState } from 'react';

export default function ReviewDisplay({ reviews = [], type = 'property', showHostResponse = true }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [expandedReviews, setExpandedReviews] = useState({});

  // Calculate average ratings
  const calculateAverages = () => {
    if (reviews.length === 0) return null;
    
    const totals = {
      overall: 0,
      cleanliness: 0,
      accuracy: 0,
      checkIn: 0,
      communication: 0,
      location: 0,
      value: 0,
      hostHospitality: 0,
      hostResponsiveness: 0,
      hostReliability: 0,
      count: {
        overall: 0,
        cleanliness: 0,
        accuracy: 0,
        checkIn: 0,
        communication: 0,
        location: 0,
        value: 0,
        hostHospitality: 0,
        hostResponsiveness: 0,
        hostReliability: 0
      }
    };

    reviews.forEach(review => {
      Object.keys(totals).forEach(key => {
        if (key !== 'count' && review[key]) {
          totals[key] += review[key];
          totals.count[key]++;
        }
      });
    });

    const averages = {};
    Object.keys(totals).forEach(key => {
      if (key !== 'count' && totals.count[key] > 0) {
        averages[key] = (totals[key] / totals.count[key]).toFixed(1);
      }
    });

    return averages;
  };

  const averages = calculateAverages();

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === '5star') return review.overall === 5;
    if (filter === '4star') return review.overall === 4;
    if (filter === '3star') return review.overall === 3;
    if (filter === 'withPhotos') return review.photos && review.photos.length > 0;
    if (filter === 'withResponse') return review.response;
    return true;
  });

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'highest') return b.overall - a.overall;
    if (sortBy === 'lowest') return a.overall - b.overall;
    return 0;
  });

  const RatingBar = ({ label, value, icon }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    }}>
      <div style={{
        width: '140px',
        fontSize: '14px',
        color: '#222',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <div style={{
        flex: 1,
        height: '4px',
        backgroundColor: '#e0e0e0',
        borderRadius: '2px',
        marginRight: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${(value / 5) * 100}%`,
          height: '100%',
          backgroundColor: '#222',
          borderRadius: '2px'
        }} />
      </div>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        minWidth: '30px',
        textAlign: 'right'
      }}>
        {value}
      </div>
    </div>
  );

  const StarDisplay = ({ rating, size = 16 }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            fontSize: `${size}px`,
            color: star <= rating ? '#FFB400' : '#e0e0e0'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const toggleExpanded = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div style={{
        padding: '48px',
        textAlign: 'center',
        backgroundColor: '#f7f7f7',
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '8px'
        }}>
          No reviews yet
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#717171'
        }}>
          Be the first to review this {type === 'property' ? 'property' : type === 'host' ? 'host' : 'guest'}!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Overall Rating Summary */}
      {averages && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Overall Score */}
          <div style={{
            textAlign: 'center',
            padding: '32px',
            backgroundColor: '#f7f7f7',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: '64px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              {averages.overall}
            </div>
            <StarDisplay rating={Math.round(averages.overall)} size={24} />
            <p style={{
              fontSize: '14px',
              color: '#717171',
              marginTop: '12px'
            }}>
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
            
            {/* Rating Distribution */}
            <div style={{ marginTop: '24px' }}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => r.overall === star).length;
                const percentage = (count / reviews.length) * 100;
                
                return (
                  <div key={star} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      marginRight: '8px',
                      minWidth: '20px'
                    }}>
                      {star}★
                    </span>
                    <div style={{
                      flex: 1,
                      height: '8px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: '#222',
                        borderRadius: '4px'
                      }} />
                    </div>
                    <span style={{
                      fontSize: '12px',
                      marginLeft: '8px',
                      color: '#717171'
                    }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Ratings */}
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px'
            }}>
              Rating Breakdown
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0 32px'
            }}>
              {type === 'property' && (
                <>
                  {averages.cleanliness && <RatingBar label="Cleanliness" value={averages.cleanliness} icon="🧹" />}
                  {averages.accuracy && <RatingBar label="Accuracy" value={averages.accuracy} icon="✓" />}
                  {averages.checkIn && <RatingBar label="Check-in" value={averages.checkIn} icon="🔑" />}
                  {averages.communication && <RatingBar label="Communication" value={averages.communication} icon="💬" />}
                  {averages.location && <RatingBar label="Location" value={averages.location} icon="📍" />}
                  {averages.value && <RatingBar label="Value" value={averages.value} icon="💰" />}
                </>
              )}
              {type === 'host' && (
                <>
                  {averages.hostHospitality && <RatingBar label="Hospitality" value={averages.hostHospitality} icon="🤝" />}
                  {averages.hostResponsiveness && <RatingBar label="Responsiveness" value={averages.hostResponsiveness} icon="⚡" />}
                  {averages.hostReliability && <RatingBar label="Reliability" value={averages.hostReliability} icon="✅" />}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              backgroundColor: filter === 'all' ? '#222' : 'white',
              color: filter === 'all' ? 'white' : '#222',
              border: filter === 'all' ? 'none' : '1px solid #e0e0e0',
              borderRadius: '20px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            All ({reviews.length})
          </button>
          {[5, 4, 3].map(star => {
            const count = reviews.filter(r => r.overall === star).length;
            if (count === 0) return null;
            
            return (
              <button
                key={star}
                onClick={() => setFilter(`${star}star`)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filter === `${star}star` ? '#222' : 'white',
                  color: filter === `${star}star` ? 'white' : '#222',
                  border: filter === `${star}star` ? 'none' : '1px solid #e0e0e0',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {star}★ ({count})
              </button>
            );
          })}
          {reviews.some(r => r.photos && r.photos.length > 0) && (
            <button
              onClick={() => setFilter('withPhotos')}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === 'withPhotos' ? '#222' : 'white',
                color: filter === 'withPhotos' ? 'white' : '#222',
                border: filter === 'withPhotos' ? 'none' : '1px solid #e0e0e0',
                borderRadius: '20px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              📷 With photos
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews List */}
      <div style={{ display: 'grid', gap: '24px' }}>
        {sortedReviews.map(review => {
          const isExpanded = expandedReviews[review.id];
          const reviewText = review.publicReview || '';
          const isLong = reviewText.length > 280;
          const displayText = isExpanded || !isLong ? reviewText : reviewText.slice(0, 280) + '...';
          
          return (
            <div key={review.id} style={{
              padding: '24px',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px'
            }}>
              {/* Reviewer Info */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#FF385C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {review.reviewerName ? review.reviewerName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {review.reviewerName || 'Anonymous'}
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#717171'
                    }}>
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <StarDisplay rating={review.overall} />
              </div>

              {/* Review Content */}
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#222',
                marginBottom: isLong ? '8px' : '16px'
              }}>
                {displayText}
              </p>
              
              {isLong && (
                <button
                  onClick={() => toggleExpanded(review.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#222',
                    textDecoration: 'underline',
                    fontSize: '14px',
                    cursor: 'pointer',
                    padding: 0,
                    marginBottom: '16px'
                  }}
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}

              {/* Photos */}
              {review.photos && review.photos.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px',
                  flexWrap: 'wrap'
                }}>
                  {review.photos.map((photo, index) => (
                    <div
                      key={index}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '8px',
                        backgroundImage: `url(${photo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Host Response */}
              {showHostResponse && review.response && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#f7f7f7',
                  borderRadius: '8px',
                  borderLeft: '3px solid #FF385C'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      Response from {type === 'property' ? 'Host' : 'Property Owner'}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#717171'
                    }}>
                      • {formatDate(review.respondedAt)}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#222'
                  }}>
                    {review.response}
                  </p>
                </div>
              )}

              {/* Verified Stay Badge */}
              {review.isVerifiedStay && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '16px',
                  padding: '4px 12px',
                  backgroundColor: '#e8f5e9',
                  borderRadius: '16px',
                  fontSize: '12px',
                  color: '#2e7d32'
                }}>
                  <span>✓</span> Verified stay
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {sortedReviews.length > 10 && (
        <div style={{
          textAlign: 'center',
          marginTop: '32px'
        }}>
          <button style={{
            padding: '12px 32px',
            backgroundColor: 'white',
            color: '#222',
            border: '1px solid #222',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Show all {sortedReviews.length} reviews
          </button>
        </div>
      )}
    </div>
  );
}