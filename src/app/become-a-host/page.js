"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function BecomeAHostPage() {
  const router = useRouter();
  const { user, loading, updateUser } = useAuth();
  const [showVideo, setShowVideo] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // If user is already a host, redirect to dashboard
    if (!loading && user && (user.role === 'host' || user.role === 'both')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleBecomeHost = async () => {
    if (!user) {
      // If not logged in, redirect to sign-in with redirect back
      localStorage.setItem('redirectAfterLogin', '/become-a-host');
      router.push('/auth/sign-in');
      return;
    }

    setIsUpgrading(true);

    try {
      const response = await fetch('/api/user/become-host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Update the user in auth context
        updateUser(updatedUser);
        
        // Show success and redirect to dashboard
        alert('Congratulations! You are now a host. Redirecting to your dashboard...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        const error = await response.json();
        console.error('Failed to become host:', error);
        alert(error.message || 'Failed to upgrade to host. Please try again.');
        setIsUpgrading(false);
      }
    } catch (error) {
      console.error('Error becoming host:', error);
      alert('An error occurred. Please try again.');
      setIsUpgrading(false);
    }
  };

  const faqs = [
    {
      question: "How much can I earn?",
      answer: "Most hosts in Qatar earn between QAR 3,000-8,000 per month depending on property size, location, and amenities. Premium properties in West Bay or The Pearl can earn even more."
    },
    {
      question: "What are the requirements?",
      answer: "You need to own or have permission to rent out a property in Qatar, provide accurate property information, maintain cleanliness standards, and respond to guest inquiries within 24 hours."
    },
    {
      question: "How do I get paid?",
      answer: "Payments are processed monthly directly to your bank account. You'll receive payment within 5 business days after the guest's check-in."
    },
    {
      question: "Is my property insured?",
      answer: "Yes, we provide property protection coverage up to QAR 50,000 for damages. Additional insurance options are available."
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Navigation */}
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
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#FF385C',
            textDecoration: 'none'
          }}>
            🏠 Houseiana
          </Link>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ color: '#6b7280' }}>
                  Welcome, {user.firstName || user.email}
                </span>
                <Link href="/dashboard" style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  color: '#374151',
                  textDecoration: 'none'
                }}>
                  Dashboard
                </Link>
              </>
            ) : (
              <Link href="/auth/sign-in" style={{
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: isMobile ? '60px 20px' : '120px 24px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: isMobile ? '36px' : '56px',
            fontWeight: 'bold',
            marginBottom: '24px',
            lineHeight: 1.2
          }}>
            Turn Your Space Into Monthly Income
          </h1>
          <p style={{
            fontSize: isMobile ? '18px' : '24px',
            marginBottom: '40px',
            opacity: 0.95
          }}>
            Join 500+ hosts in Qatar earning QAR 3,000-8,000 per month
          </p>
          
          {/* CTA Button based on user status */}
          {loading ? (
            <button disabled style={{
              padding: '16px 32px',
              backgroundColor: '#9ca3af',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              cursor: 'not-allowed'
            }}>
              Loading...
            </button>
          ) : (
            <button
              onClick={handleBecomeHost}
              disabled={isUpgrading}
              style={{
                padding: '16px 32px',
                backgroundColor: isUpgrading ? '#9ca3af' : 'white',
                color: isUpgrading ? 'white' : '#667eea',
                fontSize: '18px',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: isUpgrading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                transform: 'scale(1)',
              }}
              onMouseEnter={(e) => !isUpgrading && (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => !isUpgrading && (e.target.style.transform = 'scale(1)')}
            >
              {isUpgrading ? 'Upgrading...' : (user ? 'Become a Host Now' : 'Get Started')}
            </button>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{
        padding: '80px 24px',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            Why host with Houseiana?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {[
              { icon: '💰', title: 'Higher Earnings', desc: 'Monthly rentals mean stable income with less turnover' },
              { icon: '🛡️', title: 'Property Protection', desc: 'Coverage up to QAR 50,000 for property damages' },
              { icon: '👥', title: 'Quality Tenants', desc: 'Verified professionals and families for monthly stays' },
              { icon: '📱', title: 'Easy Management', desc: 'Simple dashboard to manage bookings and payments' },
              { icon: '🌍', title: 'Global Reach', desc: 'Access to international guests and expats' },
              { icon: '🤝', title: '24/7 Support', desc: 'Dedicated host support team available anytime' }
            ].map((benefit, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{benefit.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  {benefit.title}
                </h3>
                <p style={{ color: '#6b7280' }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section style={{
        backgroundColor: '#f3f4f6',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            Start earning in 4 simple steps
          </h2>
          <div style={{ display: 'grid', gap: '40px' }}>
            {[
              { number: '1', title: 'Sign Up', desc: 'Create your account or upgrade existing account', time: '2 min' },
              { number: '2', title: 'List Your Property', desc: 'Add photos, amenities, and set your price', time: '10 min' },
              { number: '3', title: 'Get Verified', desc: 'We verify your property and documents', time: '24-48 hrs' },
              { number: '4', title: 'Start Earning', desc: 'Receive bookings and monthly payments', time: 'Immediate' }
            ].map((step, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
                padding: '24px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {step.number}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: '#6b7280' }}>{step.desc}</p>
                </div>
                <div style={{
                  padding: '4px 12px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#2563eb',
                  fontWeight: '500'
                }}>
                  {step.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => setSelectedFAQ(selectedFAQ === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{faq.question}</h3>
                  <span style={{
                    fontSize: '24px',
                    transform: selectedFAQ === index ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform 0.3s'
                  }}>
                    +
                  </span>
                </button>
                {selectedFAQ === index && (
                  <div style={{
                    padding: '0 24px 24px',
                    color: '#6b7280'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
        padding: '80px 24px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 'bold',
            marginBottom: '24px'
          }}>
            Ready to start earning?
          </h2>
          <p style={{
            fontSize: '20px',
            marginBottom: '32px',
            opacity: 0.9
          }}>
            Join 500+ successful hosts in Qatar today
          </p>
          <button
            onClick={handleBecomeHost}
            disabled={isUpgrading}
            style={{
              padding: '16px 40px',
              backgroundColor: isUpgrading ? '#9ca3af' : 'white',
              color: isUpgrading ? 'white' : '#2563eb',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: isUpgrading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => !isUpgrading && (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => !isUpgrading && (e.target.style.transform = 'scale(1)')}
          >
            {isUpgrading ? 'Processing...' : 'Start Your Host Journey'}
          </button>
        </div>
      </section>
    </div>
  );
}