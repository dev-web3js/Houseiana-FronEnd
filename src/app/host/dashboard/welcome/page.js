"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUserData({ 
          name: data.firstName || 'Host',
          email: data.email || '',
          id: data.id || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Single Header Navigation - Remove duplicate navbar */}
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
            <Link href="/" style={{ 
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2563eb',
              textDecoration: 'none'
            }}>
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
              Host Dashboard
            </span>
          </div>
          
          
        
 <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
  <Link href="/host/profile" style={{
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500'
  }}>
    Profile
  </Link>
  <Link href="/host/listings/new" style={{
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500'
  }}>
              Add Property
            </Link>
            <Link href="/host/listings" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              My Properties
            </Link>
            <Link href="/host/bookings" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Bookings
            </Link>
            <Link href="/host/earnings" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Earnings
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
                color: '#374151'
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome Banner */}
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

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Total Earnings
                </p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                  QAR {stats.totalEarnings}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                💰
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Upcoming Bookings
                </p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                  {stats.upcomingBookings}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                📅
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Response Rate
                </p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                  {stats.responseRate}%
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fce7f3',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                ⚡
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            Quick Actions
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            <Link href="/host/listings/new" style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'transparent';
              }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>➕</div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                  Add New Property
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  List your property and start earning
                </p>
              </div>
            </Link>

            <Link href="/host/verify" style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'transparent';
              }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>✅</div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                  Verify Identity
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  Get verified badge and build trust
                </p>
              </div>
            </Link>

            <Link href="/host/banking" style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'transparent';
              }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>🏦</div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                  Setup Banking
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  Add bank details for payouts
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}