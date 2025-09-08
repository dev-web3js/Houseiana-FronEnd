"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/MainLayout';

export default function WishlistsPage() {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    // Mock data for now
    setTimeout(() => {
      setWishlists([
        {
          id: '1',
          name: 'Dream Vacation Homes',
          count: 5,
          coverImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
          properties: [
            { id: '1', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=200&fit=crop' },
            { id: '2', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=200&fit=crop' },
            { id: '3', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop' }
          ]
        },
        {
          id: '2',
          name: 'Weekend Getaways',
          count: 3,
          coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
          properties: [
            { id: '4', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&h=200&fit=crop' },
            { id: '5', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=200&h=200&fit=crop' }
          ]
        },
        {
          id: '3',
          name: 'Business Travel',
          count: 2,
          coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
          properties: [
            { id: '6', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=200&fit=crop' }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const createWishlist = () => {
    if (newWishlistName.trim()) {
      const newWishlist = {
        id: Date.now().toString(),
        name: newWishlistName,
        count: 0,
        coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        properties: []
      };
      setWishlists([...wishlists, newWishlist]);
      setNewWishlistName('');
      setShowCreateModal(false);
    }
  };

  return (
    <MainLayout>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f7f7f7'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 24px'
        }}>
          {/* Header */}
          <div style={{
            marginBottom: '32px'
          }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              Wishlists
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#717171'
            }}>
              Save and organize your favorite properties
            </p>
          </div>

          {/* Create New Wishlist Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              marginBottom: '32px',
              padding: '24px',
              width: '100%',
              maxWidth: '300px',
              backgroundColor: 'white',
              border: '2px dashed #222',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#FF385C';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#222';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span style={{ fontSize: '48px' }}>➕</span>
            <span style={{
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Create new wishlist
            </span>
          </button>

          {/* Wishlists Grid */}
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  backgroundColor: '#e0e0e0',
                  borderRadius: '12px',
                  height: '320px',
                  animation: 'pulse 1.5s infinite'
                }} />
              ))}
            </div>
          ) : wishlists.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {wishlists.map(wishlist => (
                <Link
                  key={wishlist.id}
                  href={`/wishlists/${wishlist.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    {/* Cover Image */}
                    <div style={{
                      height: '200px',
                      backgroundImage: `url(${wishlist.coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      {/* Property Thumbnails */}
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        display: 'flex',
                        gap: '4px'
                      }}>
                        {wishlist.properties.slice(0, 3).map((prop, index) => (
                          <div
                            key={prop.id}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '4px',
                              backgroundImage: `url(${prop.image})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              border: '2px solid white'
                            }}
                          />
                        ))}
                        {wishlist.properties.length > 3 && (
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            border: '2px solid white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            +{wishlist.properties.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Wishlist Info */}
                    <div style={{
                      padding: '16px'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        {wishlist.name}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#717171'
                      }}>
                        {wishlist.count} saved {wishlist.count === 1 ? 'property' : 'properties'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              backgroundColor: 'white',
              borderRadius: '12px'
            }}>
              <div style={{
                fontSize: '64px',
                marginBottom: '24px'
              }}>
                💝
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Create your first wishlist
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#717171',
                marginBottom: '24px'
              }}>
                As you search, tap the heart icon to save your favorite places to stay
              </p>
              <Link
                href="/search"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  backgroundColor: '#FF385C',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Start exploring
              </Link>
            </div>
          )}
        </div>

        {/* Create Wishlist Modal */}
        {showCreateModal && (
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
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              width: '90%',
              maxWidth: '500px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '24px'
              }}>
                Create new wishlist
              </h2>
              <input
                type="text"
                placeholder="Enter wishlist name..."
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createWishlist()}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  marginBottom: '24px'
                }}
                autoFocus
              />
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewWishlistName('');
                  }}
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
                  onClick={createWishlist}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#FF385C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    opacity: newWishlistName.trim() ? 1 : 0.5
                  }}
                  disabled={!newWishlistName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </MainLayout>
  );
}