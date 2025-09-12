"use client";

import { useState } from 'react';

export default function EmailVerification({ 
  email, 
  userId, 
  type = 'verification', // 'verification' or 'change'
  onVerificationComplete, 
  onCancel 
}) {
  const [step, setStep] = useState('send'); // 'send', 'code', 'success'
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [emailSent, setEmailSent] = useState(false);

  // Start countdown for resend
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendVerificationEmail = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/email-verification/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userId,
          type
        })
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        setStep('code');
        startCountdown();
        console.log('Verification email sent to', email);
      } else {
        setError(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Send verification email error:', error);
      setError('Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/email-verification/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
          userId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('success');
        setTimeout(() => {
          onVerificationComplete(true, data.type);
        }, 2000);
      } else {
        setError(data.error || 'Invalid verification code');
        if (data.error?.includes('attempts remaining')) {
          const remaining = data.error.match(/(\d+) attempts remaining/);
          if (remaining) {
            setAttemptsLeft(parseInt(remaining[1]));
          }
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = () => {
    if (countdown > 0) return;
    sendVerificationEmail();
  };

  if (step === 'send') {
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
          padding: '32px',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px',
              color: '#00a699'
            }}>
              📧
            </div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#333'
            }}>
              {type === 'change' ? 'Verify New Email' : 'Verify Your Email'}
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#717171',
              marginBottom: '8px'
            }}>
              {type === 'change' 
                ? 'We\'ll send a verification code to your new email address:'
                : 'We\'ll send a verification code to:'
              }
            </p>
            <p style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#333'
            }}>
              {email}
            </p>
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

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button
              onClick={sendVerificationEmail}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: loading ? '#9ca3af' : '#00a699',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '20px' }}>📤</span>
              {loading ? 'Sending...' : 'Send Verification Email'}
            </button>

            <button
              onClick={onCancel}
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
          </div>
        </div>
      </div>
    );
  }

  if (step === 'code') {
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
          padding: '32px',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px',
              color: '#00a699'
            }}>
              🔐
            </div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#333'
            }}>
              Check Your Email
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#717171',
              marginBottom: '8px'
            }}>
              We sent a verification code to:
            </p>
            <p style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#333',
              marginBottom: '16px'
            }}>
              {email}
            </p>
            
            <div style={{
              padding: '12px',
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#166534',
              marginBottom: '8px'
            }}>
              ✅ Verification email sent! Check your inbox and spam folder.
            </div>
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

          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
                setError('');
              }}
              style={{
                width: '100%',
                padding: '16px',
                border: error ? '2px solid #dc2626' : '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '24px',
                textAlign: 'center',
                letterSpacing: '4px',
                fontWeight: '600',
                boxSizing: 'border-box'
              }}
              maxLength={6}
              autoFocus
            />
            
            <p style={{ 
              fontSize: '12px', 
              color: '#717171',
              marginTop: '8px'
            }}>
              {attemptsLeft} attempts remaining
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button
              onClick={verifyCode}
              disabled={loading || verificationCode.length !== 6}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: loading || verificationCode.length !== 6 ? '#9ca3af' : '#00a699',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading || verificationCode.length !== 6 ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              onClick={resendEmail}
              disabled={countdown > 0 || loading}
              style={{
                padding: '12px 24px',
                border: '1px solid #e0e0e0',
                backgroundColor: 'white',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: countdown > 0 || loading ? 'not-allowed' : 'pointer',
                opacity: countdown > 0 || loading ? 0.6 : 1
              }}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
            </button>

            <button
              onClick={onCancel}
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
          </div>
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
          padding: '32px',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '16px',
            color: '#10b981'
          }}>
            ✅
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#333'
          }}>
            Email Verified!
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#717171'
          }}>
            {type === 'change' 
              ? 'Your new email address has been successfully verified.'
              : 'Your email address has been successfully verified.'
            }
          </p>
        </div>
      </div>
    );
  }

  return null;
}