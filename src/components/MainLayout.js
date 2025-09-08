"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserNavbar from './UserNavbar';
import { useAuth } from '@/contexts/AuthContext';

export default function MainLayout({ children }) {
  const { user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#FF385C',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🏠</span>
            Houseiana
          </Link>

          {/* Center Navigation */}
          <nav style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center'
          }}>
            <Link 
              href="/search" 
              style={{
                color: '#222',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '8px 0',
                borderBottom: '2px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = '#222';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              Explore
            </Link>
            <Link 
              href="/bookings" 
              style={{
                color: '#222',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '8px 0',
                borderBottom: '2px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = '#222';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              My Bookings
            </Link>
            <Link 
              href="/wishlists" 
              style={{
                color: '#222',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '8px 0',
                borderBottom: '2px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = '#222';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              Wishlists
            </Link>
          </nav>

          {/* User Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Become a Host Button - Only show when logged in */}
            {user && (
              <Link
                href="/become-host"
                style={{
                  padding: '10px 16px',
                  color: '#222',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '22px',
                  transition: 'all 0.2s',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f7f7f7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Become a Host
              </Link>
            )}

            {/* Language/Globe Button */}
            <button
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7f7f7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              🌐
            </button>

            {/* User Menu or Login/Signup */}
            {isClient && !loading && (
              user ? (
                <UserNavbar user={user} />
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href="/auth/sign-in"
                    style={{
                      padding: '10px 16px',
                      color: '#222',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderRadius: '8px',
                      transition: 'all 0.2s',
                      backgroundColor: 'transparent',
                      border: '1px solid #e0e0e0'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f7f7f7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#FF385C',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderRadius: '8px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e31c5f';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FF385C';
                    }}
                  >
                    Sign up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}