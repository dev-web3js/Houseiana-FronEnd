"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { theme, gradients } from '@/lib/theme';

export default function LuxuryNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: scrolled 
        ? 'rgba(255, 255, 255, 0.98)' 
        : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(255, 111, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
      boxShadow: scrolled 
        ? '0 10px 40px rgba(0, 0, 0, 0.08)' 
        : '0 4px 20px rgba(0, 0, 0, 0.03)',
      transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: scrolled ? '16px 24px' : '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'padding 0.3s ease'
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          gap: '12px'
        }}>
          <div style={{
            width: '45px',
            height: '45px',
            background: gradients.primary,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(255, 111, 0, 0.25)',
            transition: 'transform 0.3s ease'
          }}>
            <span style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: '800',
              fontFamily: theme.typography.fonts.luxury
            }}>H</span>
          </div>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '800',
              fontFamily: theme.typography.fonts.luxury,
              background: gradients.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: theme.typography.letterSpacing.wide,
              margin: 0
            }}>
              HOUSEIANA
            </h1>
            <p style={{
              fontSize: '10px',
              fontFamily: theme.typography.fonts.luxury,
              color: theme.colors.dark[400],
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: 0
            }}>
              Luxury Living Redefined
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px'
        }}>
          {/* Nav Links */}
          <div style={{
            display: 'flex',
            gap: '36px',
            '@media (max-width: 768px)': {
              display: 'none'
            }
          }}>
            <NavLink href="/search">Discover</NavLink>
            <NavLink href="/experiences">Experiences</NavLink>
            {user?.isHost && <NavLink href="/host/dashboard">Host</NavLink>}
            <NavLink href="/about">About</NavLink>
          </div>

          {/* User Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Become a Host Button */}
            {!user?.isHost && (
              <button
                onClick={() => router.push('/become-a-host')}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: `2px solid ${theme.colors.primary[500]}`,
                  borderRadius: '10px',
                  color: theme.colors.primary[500],
                  fontFamily: theme.typography.fonts.luxury,
                  fontSize: '13px',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = theme.colors.primary[500];
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = theme.colors.primary[500];
                }}
              >
                Become a Host
              </button>
            )}

            {/* Profile Menu */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    background: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke={theme.colors.dark[600]} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '280px',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    animation: 'fadeInScale 0.3s ease'
                  }}>
                    {/* User Info */}
                    <div style={{
                      padding: '20px',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                      background: 'linear-gradient(135deg, #FFF4E6 0%, #FFFFFF 100%)'
                    }}>
                      <p style={{
                        fontWeight: '600',
                        fontSize: '16px',
                        margin: '0 0 4px 0',
                        color: theme.colors.dark[800]
                      }}>
                        {user.name || 'Welcome'}
                      </p>
                      <p style={{
                        fontSize: '13px',
                        color: theme.colors.dark[500],
                        margin: 0
                      }}>
                        {user.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: '8px' }}>
                      <DropdownLink href="/dashboard" onClick={() => setProfileDropdownOpen(false)}>
                        <span>🏠</span> Dashboard
                      </DropdownLink>
                      <DropdownLink href="/bookings" onClick={() => setProfileDropdownOpen(false)}>
                        <span>📅</span> My Bookings
                      </DropdownLink>
                      <DropdownLink href="/saved" onClick={() => setProfileDropdownOpen(false)}>
                        <span>❤️</span> Saved Properties
                      </DropdownLink>
                      <DropdownLink href="/messages" onClick={() => setProfileDropdownOpen(false)}>
                        <span>💬</span> Messages
                      </DropdownLink>
                      <DropdownLink href="/account-settings" onClick={() => setProfileDropdownOpen(false)}>
                        <span>⚙️</span> Account Settings
                      </DropdownLink>
                      
                      <div style={{
                        height: '1px',
                        background: 'rgba(0, 0, 0, 0.05)',
                        margin: '8px 0'
                      }} />
                      
                      {user.isHost && (
                        <DropdownLink href="/host/properties" onClick={() => setProfileDropdownOpen(false)}>
                          <span>🏘️</span> Manage Properties
                        </DropdownLink>
                      )}
                      
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '14px',
                          color: theme.colors.error || '#FF3D00',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 61, 0, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => router.push('/auth/sign-in')}
                  style={{
                    padding: '10px 24px',
                    background: 'transparent',
                    border: 'none',
                    color: theme.colors.dark[700],
                    fontFamily: theme.typography.fonts.body,
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = theme.colors.primary[500];
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = theme.colors.dark[700];
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/auth/sign-up')}
                  style={{
                    padding: '10px 24px',
                    background: gradients.primary,
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontFamily: theme.typography.fonts.luxury,
                    fontSize: '14px',
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 24px rgba(255, 111, 0, 0.25)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 32px rgba(255, 111, 0, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 24px rgba(255, 111, 0, 0.25)';
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}

// Navigation Link Component
function NavLink({ href, children }) {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push(href)}
      style={{
        background: 'none',
        border: 'none',
        color: theme.colors.dark[700],
        fontFamily: theme.typography.fonts.body,
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer',
        position: 'relative',
        padding: '8px 0',
        transition: 'color 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.color = theme.colors.primary[500];
      }}
      onMouseLeave={(e) => {
        e.target.style.color = theme.colors.dark[700];
      }}
    >
      {children}
      <span style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '0%',
        height: '2px',
        background: theme.colors.primary[500],
        transition: 'width 0.3s ease'
      }} />
    </button>
  );
}

// Dropdown Link Component
function DropdownLink({ href, children, onClick }) {
  const router = useRouter();
  
  return (
    <button
      onClick={() => {
        router.push(href);
        onClick?.();
      }}
      style={{
        width: '100%',
        padding: '12px 16px',
        background: 'transparent',
        border: 'none',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        color: theme.colors.dark[700],
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 111, 0, 0.05)';
        e.currentTarget.style.color = theme.colors.primary[600];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = theme.colors.dark[700];
      }}
    >
      {children}
    </button>
  );
}