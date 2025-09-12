"use client";

import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    languages: [],
    work: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || 'Doha, Qatar',
        languages: user.languages || ['English', 'Arabic'],
        work: user.work || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    // Here you would typically make an API call to update the user profile
    updateUser({ ...user, ...formData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}>
          <div style={{ fontSize: '18px', color: '#717171' }}>Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f7f7f7'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '48px'
          }}>
            {/* Left Column - Profile Card */}
            <div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                textAlign: 'center'
              }}>
                {/* Profile Picture */}
                <div style={{
                  width: '128px',
                  height: '128px',
                  borderRadius: '50%',
                  backgroundColor: '#FF385C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '48px',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </div>

                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {user?.firstName} {user?.lastName}
                </h2>

                <p style={{
                  fontSize: '14px',
                  color: '#717171',
                  marginBottom: '24px'
                }}>
                  Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
                </p>

                {/* Stats */}
                <div style={{
                  borderTop: '1px solid #e0e0e0',
                  paddingTop: '24px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px'
                  }}>
                    {user?.firstName}'s confirmed information
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    textAlign: 'left'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ color: '#00a699' }}>✓</span>
                      <span style={{ fontSize: '14px' }}>Email address</span>
                    </div>
                    {user?.phone && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ color: '#00a699' }}>✓</span>
                        <span style={{ fontSize: '14px' }}>Phone number</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verify Identity Button */}
                <button
                  style={{
                    marginTop: '24px',
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #222',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Verify identity
                </button>
              </div>

              {/* Host Badge */}
              {(user?.role === 'host' || user?.role === 'both') && (
                <div style={{
                  marginTop: '24px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '32px' }}>🏆</span>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        Superhost
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#717171'
                      }}>
                        Top-rated host with great reviews
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Profile Details */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
              }}>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '600'
                }}>
                  About {user?.firstName}
                </h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #222',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit profile'}
                </button>
              </div>

              {/* Profile Form/Display */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
              }}>
                {/* Bio Section */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    About
                  </h3>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        minHeight: '100px',
                        resize: 'vertical'
                      }}
                    />
                  ) : (
                    <p style={{
                      fontSize: '14px',
                      color: formData.bio ? '#222' : '#717171',
                      lineHeight: '1.6'
                    }}>
                      {formData.bio || 'Write something about yourself...'}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    Location
                  </h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  ) : (
                    <p style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📍</span> {formData.location}
                    </p>
                  )}
                </div>

                {/* Work */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    Work
                  </h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.work}
                      onChange={(e) => setFormData({ ...formData, work: e.target.value })}
                      placeholder="What do you do for work?"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  ) : (
                    <p style={{
                      fontSize: '14px',
                      color: formData.work ? '#222' : '#717171',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>💼</span> {formData.work || 'Add your work'}
                    </p>
                  )}
                </div>

                {/* Languages */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    Languages
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    {formData.languages.map((lang, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '16px',
                          fontSize: '14px'
                        }}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Phone */}
                <div style={{ marginBottom: isEditing ? '32px' : '0' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    Phone
                  </h3>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Add phone number"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  ) : (
                    <p style={{
                      fontSize: '14px',
                      color: formData.phone ? '#222' : '#717171',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>📱</span> {formData.phone || 'Add phone number'}
                    </p>
                  )}
                </div>

                {/* Save Button */}
                {isEditing && (
                  <button
                    onClick={handleSave}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: '#FF385C',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Save changes
                  </button>
                )}
              </div>

              {/* Additional Sections */}
              <div style={{
                marginTop: '32px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px'
              }}>
                {/* Reviews */}
                <Link
                  href="/profile/reviews"
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>⭐</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    Reviews
                  </h3>
                  <p style={{ fontSize: '14px', color: '#717171' }}>
                    Reviews from hosts and guests
                  </p>
                </Link>

                {/* Verified Info */}
                <Link
                  href="/account-settings"
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    Security
                  </h3>
                  <p style={{ fontSize: '14px', color: '#717171' }}>
                    Manage account security
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}