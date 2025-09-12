"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme, gradients } from '@/lib/theme';

export default function LuxuryHero() {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #FFF4E6 0%, #FFFFFF 50%, #FFE4CC 100%)'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: gradients.primary,
        opacity: 0.1,
        filter: 'blur(100px)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: gradients.luxury,
        opacity: 0.08,
        filter: 'blur(120px)',
        animation: 'float 25s ease-in-out infinite reverse'
      }} />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        textAlign: 'center'
      }}>
        {/* Luxury Badge */}
        <div style={{
          display: 'inline-block',
          padding: '8px 24px',
          background: 'rgba(255, 111, 0, 0.1)',
          borderRadius: '50px',
          marginBottom: '24px',
          animation: 'fadeInDown 0.8s ease'
        }}>
          <span style={{
            color: theme.colors.primary[600],
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: theme.typography.fonts.luxury
          }}>
            ✨ Luxury Living in Qatar
          </span>
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontFamily: theme.typography.fonts.heading,
          fontWeight: '900',
          lineHeight: '1.1',
          marginBottom: '24px',
          animation: 'fadeInUp 1s ease',
          background: gradients.luxury,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Find Your Perfect
          <br />
          <span style={{
            background: gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Luxury Home
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontFamily: theme.typography.fonts.body,
          color: theme.colors.dark[600],
          maxWidth: '600px',
          margin: '0 auto 48px',
          lineHeight: '1.6',
          animation: 'fadeInUp 1.2s ease'
        }}>
          Discover extraordinary properties and unforgettable experiences
          in the heart of Qatar's most prestigious locations
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{
          maxWidth: '700px',
          margin: '0 auto 48px',
          animation: 'fadeInUp 1.4s ease'
        }}>
          <div style={{
            position: 'relative',
            background: 'white',
            borderRadius: '80px',
            padding: '8px',
            boxShadow: searchFocused 
              ? '0 25px 60px rgba(255, 111, 0, 0.25)' 
              : '0 20px 50px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
            transform: searchFocused ? 'translateY(-2px)' : 'translateY(0)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              {/* Location Input */}
              <div style={{
                flex: 1,
                padding: '20px 32px',
                position: 'relative'
              }}>
                <label style={{
                  position: 'absolute',
                  top: '12px',
                  left: '32px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: theme.colors.dark[500],
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    fontFamily: theme.typography.fonts.body,
                    color: theme.colors.dark[800],
                    background: 'transparent',
                    marginTop: '20px'
                  }}
                />
              </div>

              {/* Divider */}
              <div style={{
                width: '1px',
                height: '40px',
                background: 'rgba(0, 0, 0, 0.1)'
              }} />

              {/* Dates */}
              <div style={{
                padding: '20px 24px',
                cursor: 'pointer'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: theme.colors.dark[500],
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}>
                  When
                </label>
                <span style={{
                  fontSize: '16px',
                  color: theme.colors.dark[400]
                }}>
                  Add dates
                </span>
              </div>

              {/* Divider */}
              <div style={{
                width: '1px',
                height: '40px',
                background: 'rgba(0, 0, 0, 0.1)'
              }} />

              {/* Guests */}
              <div style={{
                padding: '20px 24px',
                cursor: 'pointer'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: theme.colors.dark[500],
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}>
                  Guests
                </label>
                <span style={{
                  fontSize: '16px',
                  color: theme.colors.dark[400]
                }}>
                  Add guests
                </span>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: gradients.primary,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginRight: '8px',
                  boxShadow: '0 10px 30px rgba(255, 111, 0, 0.35)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 111, 0, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 111, 0, 0.35)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>

        {/* Popular Searches */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp 1.6s ease'
        }}>
          <span style={{
            color: theme.colors.dark[500],
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Popular:
          </span>
          {['The Pearl', 'West Bay', 'Lusail', 'Al Waab', 'Marina District'].map((location, index) => (
            <button
              key={index}
              onClick={() => router.push(`/search?location=${encodeURIComponent(location)}`)}
              style={{
                padding: '6px 16px',
                background: 'white',
                border: `1px solid ${theme.colors.light[400]}`,
                borderRadius: '20px',
                fontSize: '14px',
                color: theme.colors.dark[700],
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = theme.colors.primary[500];
                e.target.style.color = theme.colors.primary[500];
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = theme.colors.light[400];
                e.target.style.color = theme.colors.dark[700];
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {location}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '32px',
          maxWidth: '600px',
          margin: '80px auto 0',
          animation: 'fadeInUp 1.8s ease'
        }}>
          {[
            { number: '500+', label: 'Luxury Properties' },
            { number: '50K+', label: 'Happy Guests' },
            { number: '4.9', label: 'Average Rating' },
            { number: '24/7', label: 'Support' }
          ].map((stat, index) => (
            <div key={index} style={{
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '32px',
                fontWeight: '800',
                fontFamily: theme.typography.fonts.luxury,
                background: gradients.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px'
              }}>
                {stat.number}
              </h3>
              <p style={{
                fontSize: '13px',
                color: theme.colors.dark[500],
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(-30px, -10px) scale(1.02); }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}