"use client";

import { useState, useEffect } from 'react';

const PERMISSION_LABELS = {
  manage_bookings: { label: 'Manage Bookings', icon: '📅' },
  edit_listing: { label: 'Edit Listing', icon: '✏️' },
  view_analytics: { label: 'View Analytics', icon: '📊' },
  manage_calendar: { label: 'Manage Calendar', icon: '📋' },
  handle_reviews: { label: 'Handle Reviews', icon: '⭐' },
  access_messages: { label: 'Access Messages', icon: '💬' },
  view_earnings: { label: 'View Earnings', icon: '💰' }
};

export default function CoHostManagement({ listingId, userId, isOwner = true }) {
  const [coHosts, setCoHosts] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoHost, setSelectedCoHost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchCoHosts();
    fetchInvitations();
  }, [listingId]);

  const fetchCoHosts = async () => {
    try {
      const response = await fetch(`/api/co-host/manage?listingId=${listingId}`);
      if (response.ok) {
        const data = await response.json();
        setCoHosts(data.coHosts);
      }
    } catch (error) {
      console.error('Fetch co-hosts error:', error);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await fetch(`/api/co-host/invitations?listingId=${listingId}`);
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations);
      }
    } catch (error) {
      console.error('Fetch invitations error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoHost = async (coHostId) => {
    if (!confirm('Are you sure you want to remove this co-host?')) return;

    try {
      const response = await fetch(`/api/co-host/manage?coHostId=${coHostId}&requesterId=${userId}&action=remove`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchCoHosts();
        alert('Co-host removed successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to remove co-host');
      }
    } catch (error) {
      console.error('Remove co-host error:', error);
      alert('An error occurred while removing the co-host');
    }
  };

  const handleSuspendCoHost = async (coHostId) => {
    if (!confirm('Are you sure you want to suspend this co-host?')) return;

    try {
      const response = await fetch(`/api/co-host/manage?coHostId=${coHostId}&requesterId=${userId}&action=suspend`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchCoHosts();
        alert('Co-host suspended successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to suspend co-host');
      }
    } catch (error) {
      console.error('Suspend co-host error:', error);
      alert('An error occurred while suspending the co-host');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'accepted': return '#10b981';
      case 'declined': return '#dc2626';
      case 'expired': return '#6b7280';
      case 'cancelled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'declined': return '❌';
      case 'expired': return '⏰';
      case 'cancelled': return '🚫';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#666'
      }}>
        Loading co-hosts...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Co-Hosts Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '20px', 
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>👥</span>
          Active Co-Hosts ({coHosts.length})
        </h3>

        {coHosts.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '2px dashed #e0e0e0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
              No Co-Hosts Yet
            </h4>
            <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
              Invite someone to help you manage this property
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {coHosts.map((coHost) => (
              <div
                key={coHost.id}
                style={{
                  padding: '20px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    {/* Co-host Info */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      {coHost.coHost.profileImage ? (
                        <img
                          src={coHost.coHost.profileImage}
                          alt={`${coHost.coHost.firstName} ${coHost.coHost.lastName}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            marginRight: '12px',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#00a699',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          marginRight: '12px'
                        }}>
                          {coHost.coHost.firstName?.charAt(0)}{coHost.coHost.lastName?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                          {coHost.coHost.firstName} {coHost.coHost.lastName}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {coHost.coHost.email}
                        </div>
                      </div>
                    </div>

                    {/* Role and Title */}
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#e0f2f1',
                        color: '#00695c',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {coHost.role === 'co_host' ? 'Co-Host' : 
                         coHost.role === 'manager' ? 'Property Manager' : 'Assistant Host'}
                      </span>
                      {coHost.title && (
                        <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>
                          • {coHost.title}
                        </span>
                      )}
                    </div>

                    {/* Permissions */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                        Permissions:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {coHost.permissions.map(permission => (
                          <span
                            key={permission}
                            style={{
                              padding: '2px 6px',
                              backgroundColor: '#f0f9ff',
                              color: '#0369a1',
                              borderRadius: '4px',
                              fontSize: '11px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>{PERMISSION_LABELS[permission]?.icon || '✓'}</span>
                            <span>{PERMISSION_LABELS[permission]?.label || permission}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      Joined {formatDate(coHost.acceptedAt)} • 
                      Last active {coHost.lastActiveAt ? formatDate(coHost.lastActiveAt) : 'Never'}
                    </div>
                  </div>

                  {/* Actions */}
                  {isOwner && (
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                      <button
                        onClick={() => {
                          setSelectedCoHost(coHost);
                          setShowEditModal(true);
                        }}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #e0e0e0',
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleSuspendCoHost(coHost.id)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #f59e0b',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Suspend
                      </button>
                      <button
                        onClick={() => handleRemoveCoHost(coHost.id)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #dc2626',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Invitations Section */}
      <div>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '20px', 
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📮</span>
          Pending Invitations ({invitations.filter(inv => inv.status === 'pending').length})
        </h3>

        {invitations.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '2px dashed #e0e0e0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📮</div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
              No Invitations
            </h4>
            <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
              Send your first co-host invitation to get started
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                style={{
                  padding: '16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px', marginRight: '8px' }}>
                        {getStatusIcon(invitation.status)}
                      </span>
                      <span style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                        {invitation.email}
                      </span>
                      <span
                        style={{
                          marginLeft: '12px',
                          padding: '2px 8px',
                          backgroundColor: getStatusColor(invitation.status) + '20',
                          color: getStatusColor(invitation.status),
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {invitation.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      Role: {invitation.role === 'co_host' ? 'Co-Host' : 
                             invitation.role === 'manager' ? 'Property Manager' : 'Assistant Host'}
                      {invitation.title && ` • ${invitation.title}`}
                    </div>
                    
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      Sent {formatDate(invitation.sentAt)} • 
                      Expires {formatDate(invitation.expiresAt)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {invitation.status === 'pending' && (
                      <button
                        onClick={() => {
                          // Copy invitation link
                          navigator.clipboard.writeText(
                            `${window.location.origin}/co-host/accept/${invitation.token}`
                          );
                          alert('Invitation link copied to clipboard!');
                        }}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #00a699',
                          backgroundColor: '#f0fffe',
                          color: '#00695c',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Copy Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Co-Host Modal (placeholder) */}
      {showEditModal && selectedCoHost && (
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
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ marginBottom: '16px' }}>Edit Co-Host</h3>
            <p>Edit functionality for {selectedCoHost.coHost.firstName} {selectedCoHost.coHost.lastName} will be implemented here.</p>
            <button
              onClick={() => setShowEditModal(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#00a699',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}