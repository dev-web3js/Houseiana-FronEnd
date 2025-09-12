"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'expired'
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('verification');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    verifyEmailToken(token);
  }, [searchParams]);

  const verifyEmailToken = async (token) => {
    try {
      // First check if the token is valid
      const checkResponse = await fetch(`/api/email-verification/verify?token=${token}`);
      const checkData = await checkResponse.json();

      if (!checkResponse.ok || !checkData.valid) {
        setStatus('expired');
        setMessage(checkData.error || 'Invalid or expired verification link');
        return;
      }

      setEmail(checkData.email);
      setType(checkData.type);

      // Now verify the email
      const verifyResponse = await fetch('/api/email-verification/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: checkData.email,
          token: token,
          userId: checkData.userId
        })
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok) {
        setStatus('success');
        setMessage(verifyData.message || 'Email verified successfully');
      } else {
        setStatus('error');
        setMessage(verifyData.error || 'Failed to verify email');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setStatus('error');
      setMessage('An error occurred while verifying your email');
    }
  };

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
        {/* Header */}
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

        {/* Loading State */}
        {status === 'loading' && (
          <div>
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
              Verifying Your Email
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#666',
              lineHeight: '1.5'
            }}>
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div>
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
              Email Verified!
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#666',
              lineHeight: '1.5',
              marginBottom: '8px'
            }}>
              {type === 'change' 
                ? 'Your new email address has been successfully verified.'
                : 'Your email address has been successfully verified.'
              }
            </p>
            {email && (
              <p style={{ 
                fontSize: '14px', 
                color: '#00a699',
                fontWeight: '600',
                marginBottom: '30px'
              }}>
                {email}
              </p>
            )}
            
            <div style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '30px'
            }}>
              <p style={{ 
                color: '#166534', 
                margin: '0',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                🎉 <strong>Welcome to Houseiana!</strong><br />
                You can now access all features of your account.
              </p>
            </div>

            <Link 
              href="/dashboard"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#00a699',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                marginRight: '12px'
              }}
            >
              Go to Dashboard
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
        )}

        {/* Error State */}
        {status === 'error' && (
          <div>
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
              Verification Failed
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#666',
              lineHeight: '1.5',
              marginBottom: '30px'
            }}>
              {message}
            </p>
            
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '30px'
            }}>
              <p style={{ 
                color: '#dc2626', 
                margin: '0',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                <strong>What can you do?</strong><br />
                • Try requesting a new verification email<br />
                • Contact support if the problem persists<br />
                • Make sure you're using the latest email link
              </p>
            </div>

            <Link 
              href="/account-settings"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#00a699',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                marginRight: '12px'
              }}
            >
              Resend Verification
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
        )}

        {/* Expired State */}
        {status === 'expired' && (
          <div>
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
              Link Expired
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#666',
              lineHeight: '1.5',
              marginBottom: '30px'
            }}>
              {message}
            </p>
            
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #fed7aa',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '30px'
            }}>
              <p style={{ 
                color: '#92400e', 
                margin: '0',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                <strong>Verification links expire after 30 minutes</strong><br />
                for security reasons. Please request a new verification email.
              </p>
            </div>

            <Link 
              href="/account-settings"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#00a699',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                marginRight: '12px'
              }}
            >
              Request New Link
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
        )}

        {/* Footer */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
          <p style={{ 
            color: '#999', 
            margin: '0', 
            fontSize: '12px' 
          }}>
            © 2025 Houseiana. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}