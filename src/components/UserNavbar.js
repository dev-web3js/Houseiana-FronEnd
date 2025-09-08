"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserNavbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHostMenu, setShowHostMenu] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowHostMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
    setIsOpen(false);
  };

  const menuItems = [
    {
      section: 'main',
      items: [
        { 
          label: 'Wishlists', 
          href: '/wishlists', 
          icon: '❤️',
          description: 'Save your favorite properties'
        },
        { 
          label: 'Trips', 
          href: '/trips', 
          icon: '✈️',
          description: 'Upcoming and past bookings'
        },
        { 
          label: 'Messages', 
          href: '/messages', 
          icon: '💬',
          badge: 3, // Example unread count
          description: 'Chat with hosts'
        }
      ]
    },
    {
      section: 'account',
      title: 'Account',
      items: [
        { 
          label: 'Profile', 
          href: '/profile', 
          icon: '👤',
          description: 'View and edit profile'
        },
        { 
          label: 'Account settings', 
          href: '/account-settings', 
          icon: '⚙️',
          description: 'Manage your account'
        },
        { 
          label: 'Languages & currency', 
          href: '/preferences', 
          icon: '🌐',
          description: 'Choose your preferences'
        }
      ]
    },
    {
      section: 'hosting',
      title: 'Hosting',
      items: [
        { 
          label: 'Become a host', 
          href: '/become-host', 
          icon: '🏠',
          highlight: true,
          description: 'Start earning today'
        },
        { 
          label: 'Host dashboard', 
          href: '/host/dashboard', 
          icon: '📊',
          description: 'Manage your listings',
          requiresHost: true
        },
        { 
          label: 'Find a co-host', 
          href: '/find-cohost', 
          icon: '🤝',
          description: 'Get help managing'
        },
        { 
          label: 'Refer a Host', 
          href: '/refer-host', 
          icon: '🎁',
          description: 'Earn rewards'
        }
      ]
    },
    {
      section: 'support',
      title: 'Support & More',
      items: [
        { 
          label: 'Help Center', 
          href: '/help', 
          icon: '❓',
          description: 'Get assistance'
        },
        { 
          label: 'Gift cards', 
          href: '/gift-cards', 
          icon: '🎴',
          description: 'Buy or redeem'
        }
      ]
    }
  ];

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '40px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          minWidth: '77px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Hamburger Menu */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          marginLeft: '8px'
        }}>
          <span style={{
            width: '16px',
            height: '2px',
            backgroundColor: '#222',
            borderRadius: '1px'
          }}></span>
          <span style={{
            width: '16px',
            height: '2px',
            backgroundColor: '#222',
            borderRadius: '1px'
          }}></span>
          <span style={{
            width: '16px',
            height: '2px',
            backgroundColor: '#222',
            borderRadius: '1px'
          }}></span>
        </div>
        
        {/* User Avatar */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: user?.profileImage ? 'transparent' : '#717171',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          overflow: 'hidden',
          marginRight: '4px'
        }}>
          {user?.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name || 'User'} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
          )}
        </div>

        {/* Notification Badge */}
        {menuItems.some(section => 
          section.items.some(item => item.badge > 0)
        ) && (
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: '#FF385C',
            borderRadius: '50%',
            border: '2px solid white'
          }} />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '52px',
          right: 0,
          width: '280px',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'slideDown 0.2s ease-out'
        }}>
          {/* User Info Header */}
          {user && (
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#f7f7f7'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {user.name || 'Guest User'}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#717171'
              }}>
                {user.email}
              </div>
            </div>
          )}

          {/* Menu Sections */}
          <div style={{
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            {menuItems.map((section, sectionIndex) => (
              <div key={section.section}>
                {section.title && (
                  <div style={{
                    padding: '12px 16px 8px',
                    fontSize: '12px',
                    color: '#717171',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {section.title}
                  </div>
                )}
                
                {section.items.map((item, index) => {
                  // Skip host-only items if user is not a host
                  if (item.requiresHost && !user?.isHost) return null;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        textDecoration: 'none',
                        color: '#222',
                        transition: 'background 0.2s',
                        cursor: 'pointer',
                        backgroundColor: item.highlight ? '#fff8f1' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = item.highlight ? '#ffede1' : '#f7f7f7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = item.highlight ? '#fff8f1' : 'transparent';
                      }}
                    >
                      {/* Icon */}
                      <span style={{
                        fontSize: '20px',
                        marginRight: '12px',
                        width: '24px',
                        textAlign: 'center'
                      }}>
                        {item.icon}
                      </span>
                      
                      {/* Label and Description */}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: item.highlight ? '600' : '400',
                          color: item.highlight ? '#FF385C' : '#222',
                          marginBottom: item.description ? '2px' : 0
                        }}>
                          {item.label}
                        </div>
                        {item.description && (
                          <div style={{
                            fontSize: '12px',
                            color: '#717171'
                          }}>
                            {item.description}
                          </div>
                        )}
                      </div>
                      
                      {/* Badge */}
                      {item.badge && (
                        <div style={{
                          backgroundColor: '#FF385C',
                          color: 'white',
                          borderRadius: '10px',
                          padding: '2px 8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          minWidth: '20px',
                          textAlign: 'center'
                        }}>
                          {item.badge}
                        </div>
                      )}
                    </Link>
                  );
                })}
                
                {/* Section Divider */}
                {sectionIndex < menuItems.length - 1 && (
                  <div style={{
                    height: '1px',
                    backgroundColor: '#e0e0e0',
                    margin: '8px 0'
                  }} />
                )}
              </div>
            ))}

            {/* Logout Button */}
            <div style={{
              borderTop: '1px solid #e0e0e0',
              padding: '8px 0'
            }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  color: '#222'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f7f7f7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{
                  fontSize: '20px',
                  marginRight: '12px',
                  width: '24px',
                  textAlign: 'center'
                }}>
                  🚪
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Log out
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}