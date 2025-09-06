"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HostSignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      const response = await fetch("/api/host/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Force navigation to welcome page
        window.location.href = "/host/dashboard/welcome";
      } else {
        setErrors({ submit: data.error || "Invalid credentials or not registered as host" });
        setLoading(false);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)'
    }}>
      {/* Simple Header - Houseiana logo only */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        zIndex: 10
      }}>
        <Link href="/" style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          Houseiana
        </Link>
      </div>

      {/* Left Side - Info Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        color: 'white',
        display: window.innerWidth < 768 ? 'none' : 'flex'
      }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: 'bold',
          marginBottom: '24px'
        }}>
          Welcome back, Host!
        </h2>
        <p style={{
          fontSize: '18px',
          marginBottom: '40px',
          opacity: 0.9
        }}>
          Access your dashboard to manage properties and bookings
        </p>
        
        <div style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>📊</span>
              <span style={{ fontSize: '16px' }}>Track your earnings and performance</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🏠</span>
              <span style={{ fontSize: '16px' }}>Manage multiple properties</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>📅</span>
              <span style={{ fontSize: '16px' }}>Control your availability calendar</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>💬</span>
              <span style={{ fontSize: '16px' }}>Communicate with guests</span>
            </div>
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>
            Average host earnings
          </p>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>
            $1,500/month
          </p>
          <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
            (QAR 5,500/month)
          </p>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '48px 40px'
        }}>
          {/* Host Portal Badge */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '8px'
            }}>
              Host Sign In
            </h1>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              Host Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '6px',
                color: '#374151'
              }}>
                Email address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="host@example.com"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  opacity: loading ? 0.7 : 1
                }}
              />
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Password
                </label>
                <Link href="/host/forgot-password" style={{
                  fontSize: '12px',
                  color: '#2563eb',
                  textDecoration: 'none'
                }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter your password"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  opacity: loading ? 0.7 : 1
                }}
              />
              {errors.password && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.password}
                </p>
              )}
            </div>

            <div style={{ 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="checkbox"
                id="remember-host"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                disabled={loading}
                style={{
                  width: '16px',
                  height: '16px',
                  marginRight: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              />
              <label htmlFor="remember-host" style={{
                fontSize: '14px',
                color: '#374151',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}>
                Keep me signed in
              </label>
            </div>

            {errors.submit && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '14px' }}>
                  {errors.submit}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: 'white',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in to Host Dashboard'}
            </button>

            {/* Help Links */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
              fontSize: '14px'
            }}>
              <Link href="/host/support" style={{
                color: '#6b7280',
                textDecoration: 'none'
              }}>
                Host Support
              </Link>
              <span style={{ color: '#d1d5db' }}>•</span>
              <Link href="/become-a-host/signup" style={{
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Become a Host
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}