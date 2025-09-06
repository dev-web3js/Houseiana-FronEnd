"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <nav style={{
      width: '100%',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        width: '100%',
        padding: '12px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <Logo size="default" variant={isMobile ? "icon" : "full"} />
          </Link>

          {/* Center Navigation - Hidden on mobile */}
          <div style={{
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            gap: '32px'
          }}>
            <Link 
              href="/search" 
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#2563eb'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              Search Homes
            </Link>
            <Link 
              href="/become-a-host" 
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#2563eb'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              Become a Host
            </Link>
          </div>

          {/* Right Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <Link
              href="/auth/sign-in"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 16px',
                transition: 'color 0.2s',
                display: isMobile ? 'none' : 'block'
              }}
              onMouseEnter={(e) => e.target.style.color = '#2563eb'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1e40af'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}