"use client";

import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import Link from 'next/link';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      articles: [
        'How to create an account',
        'Booking your first stay',
        'Understanding the search filters',
        'Payment methods accepted'
      ]
    },
    {
      id: 'bookings',
      title: 'Bookings & Reservations',
      icon: '📅',
      articles: [
        'How to book a property',
        'Cancellation policies',
        'Changing your reservation',
        'Check-in and check-out process'
      ]
    },
    {
      id: 'hosting',
      title: 'Hosting',
      icon: '🏠',
      articles: [
        'How to become a host',
        'Setting your prices',
        'Managing your calendar',
        'Host protection and insurance'
      ]
    },
    {
      id: 'payments',
      title: 'Payments',
      icon: '💳',
      articles: [
        'Payment methods',
        'When you will be charged',
        'Currency conversion',
        'Refunds and credits'
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      icon: '🔒',
      articles: [
        'Verification process',
        'Reporting issues',
        'Emergency contacts',
        'Privacy and data protection'
      ]
    },
    {
      id: 'account',
      title: 'Account Management',
      icon: '⚙️',
      articles: [
        'Updating your profile',
        'Password reset',
        'Two-factor authentication',
        'Deleting your account'
      ]
    }
  ];

  const filteredCategories = selectedCategory === 'all' 
    ? helpCategories 
    : helpCategories.filter(cat => cat.id === selectedCategory);

  return (
    <MainLayout>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f7f7f7'
      }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 24px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '24px'
          }}>
            How can we help you?
          </h1>
          
          {/* Search Bar */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 24px',
                fontSize: '16px',
                borderRadius: '30px',
                border: 'none',
                color: '#222'
              }}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px'
        }}>
          {/* Category Filter */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === 'all' ? '#FF385C' : 'white',
                color: selectedCategory === 'all' ? 'white' : '#222',
                border: '1px solid #e0e0e0',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              All Topics
            </button>
            {helpCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedCategory === cat.id ? '#FF385C' : 'white',
                  color: selectedCategory === cat.id ? 'white' : '#222',
                  border: '1px solid #e0e0e0',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Help Categories Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '60px'
          }}>
            {filteredCategories.map(category => (
              <div
                key={category.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <span style={{ fontSize: '32px' }}>{category.icon}</span>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600'
                  }}>
                    {category.title}
                  </h2>
                </div>
                
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {category.articles.map((article, index) => (
                    <li key={index}>
                      <Link
                        href={`/help/${category.id}/${index}`}
                        style={{
                          display: 'block',
                          padding: '12px 0',
                          color: '#222',
                          textDecoration: 'none',
                          fontSize: '14px',
                          borderBottom: index < category.articles.length - 1 ? '1px solid #e0e0e0' : 'none',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#FF385C';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#222';
                        }}
                      >
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Still need help?
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#717171',
              marginBottom: '32px'
            }}>
              Our support team is here to assist you 24/7
            </p>
            
            <div style={{
              display: 'flex',
              gap: '24px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                href="/messages"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px',
                  backgroundColor: '#f7f7f7',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#222',
                  minWidth: '200px',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '32px', marginBottom: '12px' }}>💬</span>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Live Chat</span>
                <span style={{ fontSize: '14px', color: '#717171', marginTop: '4px' }}>
                  Chat with our team
                </span>
              </Link>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px',
                  backgroundColor: '#f7f7f7',
                  borderRadius: '12px',
                  minWidth: '200px'
                }}
              >
                <span style={{ fontSize: '32px', marginBottom: '12px' }}>📧</span>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Email</span>
                <span style={{ fontSize: '14px', color: '#717171', marginTop: '4px' }}>
                  support@houseiana.qa
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px',
                  backgroundColor: '#f7f7f7',
                  borderRadius: '12px',
                  minWidth: '200px'
                }}
              >
                <span style={{ fontSize: '32px', marginBottom: '12px' }}>📞</span>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Phone</span>
                <span style={{ fontSize: '14px', color: '#717171', marginTop: '4px' }}>
                  +974 4444 5555
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}