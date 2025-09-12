"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function HostDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    occupancyRate: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
      return;
    }
    
    if (!loading && user && user.role !== 'host' && user.role !== 'both' && !user.isHost) {
      router.push('/dashboard');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch host statistics
    const fetchStats = async () => {
      if (!user || (user.role !== 'host' && user.role !== 'both' && !user.isHost)) return;
      
      // For now, use sample data
      setStats({
        totalProperties: 3,
        activeBookings: 5,
        totalEarnings: 125000,
        averageRating: 4.8,
        occupancyRate: 78,
        monthlyRevenue: 25500
      });
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f7f7'
      }}>
        <div style={{ fontSize: '18px', color: '#717171' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f7f7f7'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            <Link href="/dashboard" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#222'
            }}>
              <span>←</span>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Back</span>
            </Link>
            
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600'
            }}>
              Host Dashboard
            </h1>
          </div>

          <Link href="/host/properties/create" style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            + Add Property
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {/* Welcome Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Welcome back, {user?.firstName || user?.name || 'Host'}!
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Here's an overview of your hosting performance
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🏠
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Total Properties
              </div>
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              {stats.totalProperties}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                📅
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Active Bookings
              </div>
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#10b981'
            }}>
              {stats.activeBookings}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                💰
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Monthly Revenue
              </div>
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#f59e0b'
            }}>
              QAR {stats.monthlyRevenue.toLocaleString()}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#fce7f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ⭐
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Average Rating
              </div>
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#ec4899'
            }}>
              {stats.averageRating}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            Quick Actions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <Link href="/host/properties" style={{
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}>
              <span style={{ fontSize: '24px' }}>🏘️</span>
              <div>
                <div style={{ fontWeight: '500' }}>Manage Properties</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>View and edit your listings</div>
              </div>
            </Link>

            <Link href="/host/bookings" style={{
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}>
              <span style={{ fontSize: '24px' }}>📋</span>
              <div>
                <div style={{ fontWeight: '500' }}>View Reservations</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Manage guest bookings</div>
              </div>
            </Link>

            <Link href="/host/earnings" style={{
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}>
              <span style={{ fontSize: '24px' }}>💳</span>
              <div>
                <div style={{ fontWeight: '500' }}>Track Earnings</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>View revenue reports</div>
              </div>
            </Link>

            <Link href="/messages" style={{
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}>
              <span style={{ fontSize: '24px' }}>💬</span>
              <div>
                <div style={{ fontWeight: '500' }}>Messages</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Chat with guests</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}