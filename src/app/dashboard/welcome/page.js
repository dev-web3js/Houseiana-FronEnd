"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function HostWelcomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState({ 
    name: 'Loading...', 
    email: '',
    id: '' 
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    propertiesListed: 0,
    totalEarnings: 0,
    upcomingBookings: 0,
    responseRate: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/host/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // Important for cookies
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data); // Debug log
        
        setUserData({ 
          name: data.firstName || 'Host',
          email: data.email || '',
          id: data.id || ''
        });
      } else {
        console.error('Failed to fetch profile, status:', response.status);
        // Don't redirect immediately, give it a moment
        setTimeout(() => {
          router.push('/host/sign-in');
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setTimeout(() => {
        router.push('/host/sign-in');
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/host/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (response.ok) {
        router.push('/host/sign-in');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      router.push('/host/sign-in');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid #e5e7eb',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading your dashboard...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
              <Logo size="default" variant="full" />
            </Link>
            <span style={{
              fontSize: '12px',
              padding: '4px 12px',
              backgroundColor: '#eff6ff',
              color: '#1e40af',
              borderRadius: '6px',
              fontWeight: '500'
            }}>
              Host Dashboard
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/host/profile" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                color: '#374151',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome Banner - Shows actual user name */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
          borderRadius: '16px',
          padding: '40px',
          color: 'white',
          marginBottom: '32px'
        }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
            Welcome to Houseiana, {userData.name}! 🎉
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9 }}>
            Your host account is ready. Let's get your first property listed and start earning.
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Stats cards... */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Properties Listed
                </p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                  {stats.propertiesListed}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#eff6ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🏠
              </div>
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            Complete your setup
          </h2>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {/* Setup steps content... */}
            <Link href="/host/verify" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#d97706'
                  }}>
                    1
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                      Verify your identity
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      Upload your ID documents for verification
                    </p>
                  </div>
                </div>
                <span style={{ color: '#9ca3af', fontSize: '20px' }}>→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}