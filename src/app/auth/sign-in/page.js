"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  useEffect(() => {
    // If already logged in, redirect to home or saved URL
    if (user) {
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await login(formData.email, formData.password, formData.rememberMe);
      
      if (success) {
        // Check for redirect URL
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      } else {
        setErrors({ submit: "Invalid email or password" });
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        padding: '48px 40px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#2563eb',
            textDecoration: 'none'
          }}>
            Houseiana
          </Link>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#111827'
          }}>
            Welcome back
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
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
              placeholder="john@example.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
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
              <Link href="/auth/forgot-password" style={{
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
              style={{
                width: '100%',
                padding: '12px 14px',
                border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors.password && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div style={{ 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type="checkbox"
              id="remember"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
              style={{
                width: '16px',
                height: '16px',
                marginRight: '8px',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="remember" style={{
              fontSize: '14px',
              color: '#374151',
              cursor: 'pointer'
            }}>
              Remember me for 30 days
            </label>
          </div>

          {/* Error Message */}
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

          {/* Submit Button */}
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
              transition: 'background-color 0.2s',
              marginBottom: '20px'
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

        </form>

        {/* Sign up link */}
        <div style={{
          textAlign: 'center',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb',
          marginTop: '24px'
        }}>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link href="/auth/sign-up" style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}