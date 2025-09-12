"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PERMISSION_LABELS = {
  manage_bookings: { label: 'Manage Bookings', icon: '📅' },
  edit_listing: { label: 'Edit Listing', icon: '✏️' },
  view_analytics: { label: 'View Analytics', icon: '📊' },
  manage_calendar: { label: 'Manage Calendar', icon: '📋' },
  handle_reviews: { label: 'Handle Reviews', icon: '⭐' },
  access_messages: { label: 'Access Messages', icon: '💬' },
  view_earnings: { label: 'View Earnings', icon: '💰' }
};

export default function CoHostAcceptPage() {
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState('loading'); // 'loading', 'found', 'expired', 'error', 'accepted', 'declined'
  const [invitation, setInvitation] = useState(null);
  const [message, setMessage] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (params.token) {
      fetchInvitation(params.token);
    }
  }, [params.token]);

  const fetchInvitation = async (token) => {
    try {
      const response = await fetch(`/api/co-host/invitations/accept?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setInvitation(data.invitation);
        if (data.invitation.isExpired) {
          setStatus('expired');
        } else if (data.invitation.status !== 'pending') {
          setStatus(data.invitation.status);
        } else {
          setStatus('found');
        }
      } else {
        setStatus('error');
        setMessage(data.error || 'Invitation not found');
      }
    } catch (error) {
      console.error('Fetch invitation error:', error);
      setStatus('error');
      setMessage('Failed to load invitation');
    }
  };

  const handleAccept = async () => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/auth/sign-in?redirect=/co-host/accept/${params.token}`);
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch('/api/co-host/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: params.token,
          action: 'accept',
          userId: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('accepted');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Accept invitation error:', error);
      setStatus('error');
      setMessage('An error occurred while accepting the invitation');
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = async () => {
    setProcessing(true);

    try {
      const response = await fetch('/api/co-host/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: params.token,
          action: 'decline',
          declineReason: declineReason || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('declined');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to decline invitation');
      }
    } catch (error) {
      console.error('Decline invitation error:', error);
      setStatus('error');
      setMessage('An error occurred while declining the invitation');
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            color: '#00a699'
          }}>
            ⏳
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#333'
          }}>
            Loading Invitation
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            margin: '0'
          }}>
            Please wait while we load your co-host invitation...
          </p>
        </div>
      </div>
    );
  }

  const renderHeader = () => (
    <div style={{ marginBottom: '30px' }}>
      <h1 style={{ 
        color: '#00a699', 
        margin: '0 0 10px 0', 
        fontSize: '32px', 
        fontWeight: 'bold' 
      }}>
        🏠 Houseiana
      </h1>
      <p style={{ 
        color: '#666', 
        margin: '0', 
        fontSize: '16px' 
      }}>
        Luxury Property Rentals
      </p>
    </div>
  );

  if (status === 'expired') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {renderHeader()}
          
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            color: '#f59e0b'
          }}>
            ⏰
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#333'
          }}>
            Invitation Expired
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '30px'
          }}>
            This co-host invitation has expired. Please contact the property owner to request a new invitation.
          </p>
          
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#00a699',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'accepted') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {renderHeader()}
          
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '20px',
            color: '#10b981'
          }}>
            🎉
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#333'
          }}>
            Welcome to the Team!
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '30px'
          }}>
            You've successfully accepted the co-host invitation for <strong>{invitation?.listing?.title}</strong>. 
            You can now help manage this property.
          </p>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/host/dashboard"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#00a699',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Go to Host Dashboard
            </Link>
            
            <Link 
              href="/"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                border: '1px solid #e0e0e0',
                color: '#333',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {renderHeader()}
          
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            color: '#6b7280'
          }}>
            👋
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#333'
          }}>
            Invitation Declined
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '30px'
          }}>
            You've declined the co-host invitation. The property owner has been notified.
          </p>
          
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#00a699',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {renderHeader()}
          
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            color: '#dc2626'
          }}>
            ❌
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#333'
          }}>
            Error
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '30px'
          }}>
            {message}
          </p>
          
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#00a699',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'found' && invitation) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {renderHeader()}
          
          <div style={{ marginBottom: '30px' }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '20px',
              textAlign: 'center',
              color: '#00a699'
            }}>
              🤝
            </div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#333',
              textAlign: 'center'
            }}>
              Co-Host Invitation
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#666',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              You've been invited to be a co-host
            </p>
          </div>

          {/* Property Details */}
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
              Property Details
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                {invitation.listing.title}
              </span>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {invitation.listing.city}, {invitation.listing.area}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
              Property Type: {invitation.listing.propertyType}
            </div>
          </div>

          {/* Inviter Details */}
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
              Invited by
            </h3>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
              {invitation.inviter.firstName} {invitation.inviter.lastName}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {invitation.inviter.email}
            </div>
          </div>

          {/* Role & Permissions */}
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
              Your Role & Permissions
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                {invitation.role === 'co_host' ? 'Co-Host' : 
                 invitation.role === 'manager' ? 'Property Manager' : 'Assistant Host'}
              </span>
              {invitation.title && (
                <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>
                  ({invitation.title})
                </span>
              )}
            </div>
            
            <div style={{ display: 'grid', gap: '8px' }}>
              {invitation.permissions.map(permission => (
                <div key={permission} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>
                    {PERMISSION_LABELS[permission]?.icon || '✓'}
                  </span>
                  <span style={{ fontSize: '14px', color: '#333' }}>
                    {PERMISSION_LABELS[permission]?.label || permission}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Message */}
          {invitation.message && (
            <div style={{
              backgroundColor: '#f0fffe',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Personal Message
              </h3>
              <p style={{ fontSize: '14px', color: '#166534', margin: '0' }}>
                "{invitation.message}"
              </p>
            </div>
          )}

          {/* Actions */}
          {!user ? (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                Please sign in to accept this invitation
              </p>
              <Link 
                href={`/auth/sign-in?redirect=/co-host/accept/${params.token}`}
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#00a699',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Sign In to Accept
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button
                  onClick={handleAccept}
                  disabled={processing}
                  style={{
                    flex: 1,
                    padding: '16px',
                    backgroundColor: processing ? '#9ca3af' : '#00a699',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: processing ? 'not-allowed' : 'pointer'
                  }}
                >
                  {processing ? 'Processing...' : 'Accept Invitation'}
                </button>
                
                <button
                  onClick={() => setStatus('decline_form')}
                  disabled={processing}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: '2px solid #e0e0e0',
                    backgroundColor: 'white',
                    color: '#333',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    opacity: processing ? 0.6 : 1
                  }}
                >
                  Decline
                </button>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <Link 
                  href="/"
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    textDecoration: 'underline'
                  }}
                >
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (status === 'decline_form') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {renderHeader()}
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#333',
              textAlign: 'center'
            }}>
              Decline Invitation
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#666',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              We're sorry to see you go. Would you like to share why you're declining?
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Reason (Optional)
            </label>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Let them know why you can't accept this invitation..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setStatus('found')}
              disabled={processing}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: '1px solid #e0e0e0',
                backgroundColor: 'white',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing ? 0.6 : 1
              }}
            >
              Back
            </button>
            
            <button
              onClick={handleDecline}
              disabled={processing}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: processing ? '#9ca3af' : '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: processing ? 'not-allowed' : 'pointer'
              }}
            >
              {processing ? 'Declining...' : 'Confirm Decline'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}