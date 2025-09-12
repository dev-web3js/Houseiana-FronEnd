"use client";

import { useState } from 'react';

const PERMISSIONS = {
  manage_bookings: {
    label: 'Manage Bookings',
    description: 'Accept/decline reservations, communicate with guests',
    icon: '📅'
  },
  edit_listing: {
    label: 'Edit Listing',
    description: 'Update property details, photos, and pricing',
    icon: '✏️'
  },
  view_analytics: {
    label: 'View Analytics',
    description: 'See booking statistics and performance data',
    icon: '📊'
  },
  manage_calendar: {
    label: 'Manage Calendar',
    description: 'Block/unblock dates and set availability',
    icon: '📋'
  },
  handle_reviews: {
    label: 'Handle Reviews',
    description: 'Respond to guest reviews',
    icon: '⭐'
  },
  access_messages: {
    label: 'Access Messages',
    description: 'View and respond to guest messages',
    icon: '💬'
  },
  view_earnings: {
    label: 'View Earnings',
    description: 'See financial reports and payouts',
    icon: '💰'
  }
};

const ROLES = [
  { value: 'co_host', label: 'Co-Host' },
  { value: 'manager', label: 'Property Manager' },
  { value: 'assistant', label: 'Assistant Host' }
];

export default function CoHostInvitation({ 
  listingId, 
  listingTitle, 
  userId, 
  onInvitationSent, 
  onClose 
}) {
  const [step, setStep] = useState('form'); // 'form', 'sending', 'success', 'error'
  const [formData, setFormData] = useState({
    email: '',
    role: 'co_host',
    title: '',
    message: '',
    permissions: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePermissionToggle = (permission) => {
    const currentPermissions = [...formData.permissions];
    const index = currentPermissions.indexOf(permission);
    
    if (index > -1) {
      currentPermissions.splice(index, 1);
    } else {
      currentPermissions.push(permission);
    }
    
    setFormData({ ...formData, permissions: currentPermissions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStep('sending');

    try {
      const response = await fetch('/api/co-host/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          email: formData.email,
          permissions: formData.permissions,
          role: formData.role,
          title: formData.title || null,
          message: formData.message || null,
          inviterId: userId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('success');
        if (onInvitationSent) {
          onInvitationSent(data.invitation);
        }
      } else {
        setError(data.error || 'Failed to send invitation');
        setStep('form');
      }
    } catch (error) {
      console.error('Send invitation error:', error);
      setError('An error occurred while sending the invitation');
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'sending') {
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
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            color: '#00a699'
          }}>
            📤
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#333'
          }}>
            Sending Invitation
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            margin: '0'
          }}>
            Please wait while we send the co-host invitation...
          </p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
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
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '20px',
            color: '#10b981'
          }}>
            ✅
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#333'
          }}>
            Invitation Sent!
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '30px'
          }}>
            A co-host invitation has been sent to <strong>{formData.email}</strong>. 
            They'll receive an email with instructions to accept the invitation.
          </p>
          
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: '#00a699',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

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
        padding: '32px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#333'
              }}>
                Invite Co-Host
              </h2>
              <p style={{ 
                fontSize: '14px', 
                color: '#717171',
                margin: '0'
              }}>
                Invite someone to help manage "{listingTitle}"
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Role */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              {ROLES.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Custom Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Assistant Manager, Cleaning Coordinator"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Permissions */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Permissions *
            </label>
            <p style={{ fontSize: '12px', color: '#717171', marginBottom: '16px' }}>
              Select what this co-host can do
            </p>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {Object.entries(PERMISSIONS).map(([key, permission]) => (
                <div
                  key={key}
                  onClick={() => handlePermissionToggle(key)}
                  style={{
                    padding: '16px',
                    border: formData.permissions.includes(key) 
                      ? '2px solid #00a699' 
                      : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: formData.permissions.includes(key) ? '#f0fffe' : 'white',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '20px', marginRight: '12px' }}>
                      {permission.icon}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                      {permission.label}
                    </span>
                    {formData.permissions.includes(key) && (
                      <span style={{ marginLeft: 'auto', color: '#00a699', fontSize: '16px' }}>
                        ✓
                      </span>
                    )}
                  </div>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#717171', 
                    margin: '0',
                    marginLeft: '32px'
                  }}>
                    {permission.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Message */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Personal Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Add a personal note to your invitation..."
              rows={3}
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

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                border: '1px solid #e0e0e0',
                backgroundColor: 'white',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading || formData.permissions.length === 0 || !formData.email}
              style={{
                padding: '12px 24px',
                backgroundColor: loading || formData.permissions.length === 0 || !formData.email 
                  ? '#9ca3af' : '#00a699',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading || formData.permissions.length === 0 || !formData.email 
                  ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}