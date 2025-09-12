"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function HostEarningsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      router.push('/auth/sign-in');
      return;
    }

    // Check if user is a host
    if (!loading && user && user.role !== 'host' && user.role !== 'both' && !user.isHost) {
      router.push('/dashboard');
      return;
    }
  }, [user, loading, router]);

  const earningsData = {
    month: { total: 25500, bookings: 8, growth: '+12%' },
    quarter: { total: 72000, bookings: 24, growth: '+8%' },
    year: { total: 286000, bookings: 95, growth: '+22%' }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f7f7'
      }}>
        <div style={{ fontSize: '18px', color: '#717171' }}>Loading earnings...</div>
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
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Back to Dashboard</span>
            </Link>
            
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600'
            }}>
              Earnings
            </h1>
          </div>

          <button style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Download Report
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {/* Period Selector */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          backgroundColor: 'white',
          padding: '8px',
          borderRadius: '12px',
          width: 'fit-content'
        }}>
          {['month', 'quarter', 'year'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedPeriod === period ? '#2563eb' : 'transparent',
                color: selectedPeriod === period ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              This {period}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              Total Earnings
            </div>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              QAR {earningsData[selectedPeriod].total.toLocaleString()}
            </div>
            <span style={{
              padding: '4px 8px',
              backgroundColor: '#10b98120',
              color: '#10b981',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {earningsData[selectedPeriod].growth}
            </span>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              Total Bookings
            </div>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              {earningsData[selectedPeriod].bookings}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Completed reservations
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              Average per Booking
            </div>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              QAR {Math.round(earningsData[selectedPeriod].total / earningsData[selectedPeriod].bookings).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Per reservation
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            Earnings Breakdown
          </h2>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { property: 'Luxury 2BR Apartment in West Bay', earnings: 12000, bookings: 3 },
              { property: 'Studio in The Pearl', earnings: 8500, bookings: 2 },
              { property: 'Villa in Lusail', earnings: 5000, bookings: 3 }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {item.property}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {item.bookings} bookings
                  </div>
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2563eb'
                }}>
                  QAR {item.earnings.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}