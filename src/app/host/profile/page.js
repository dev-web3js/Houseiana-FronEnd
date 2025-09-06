"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HostProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idType: '',
    idNumber: '',
    bio: '',
    languages: [],
    responseTime: '',
    joinedDate: ''
  });
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/host/profile', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const profile = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          idType: data.idType || '',
          idNumber: data.idNumber || '',
          bio: data.bio || '',
          languages: data.languages || ['English'],
          responseTime: data.responseTime || 'Within an hour',
          joinedDate: data.joinedDate || new Date().toLocaleDateString()
        };
        setProfileData(profile);
        setEditData(profile);
      } else {
        router.push('/host/sign-in');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/host/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        setProfileData(editData);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/host/sign-out', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/host/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
      router.push('/host/sign-in');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', textDecoration: 'none' }}>
              Houseiana
            </Link>
            <span style={{
              fontSize: '12px',
              padding: '4px 12px',
              backgroundColor: '#eff6ff',
              color: '#1e40af',
              borderRadius: '6px',
              fontWeight: '500'
            }}>
              Host Profile
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/host/dashboard/welcome" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              Dashboard
            </Link>
            <Link href="/host/listings/new" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              Add Property
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          
          {/* Left Column - Profile Summary */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              {/* Profile Picture */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '48px',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </div>
              
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Host since {profileData.joinedDate}
              </p>
              
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: '20px' }}>
                <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Response Time</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>{profileData.responseTime}</p>
                </div>
                <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Languages</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>{profileData.languages.join(', ')}</p>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Verification</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#dcfce7',
                      color: '#16a34a',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      ✓ Email
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: profileData.idNumber ? '#dcfce7' : '#fee2e2',
                      color: profileData.idNumber ? '#16a34a' : '#dc2626',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {profileData.idNumber ? '✓' : '✗'} ID
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Profile Information</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditData(profileData);
                    }}
                    style={{
                      padding: '8px 20px',
                      backgroundColor: 'white',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: '8px 20px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  First Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '14px', color: '#374151' }}>{profileData.firstName}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Last Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '14px', color: '#374151' }}>{profileData.lastName}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Email
                </label>
                <p style={{ fontSize: '14px', color: '#374151' }}>{profileData.email}</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Phone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '14px', color: '#374151' }}>{profileData.phone || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                About
              </label>
              {editing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  rows="4"
                  placeholder="Tell guests about yourself..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              ) : (
                <p style={{ fontSize: '14px', color: '#374151' }}>
                  {profileData.bio || 'No description provided'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}