"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BecomeAHostPage() {
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
            color: '#2563eb',
            textDecoration: 'none'
          }}>
            Houseiana
          </Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/auth/sign-in" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              Host Sign In
            </Link>
            <button
              onClick={() => router.push('/auth/sign-up')}
              style={{
                padding: '10px 24px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Start Earning
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
        padding: '100px 24px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: !isMobile ? '1fr 1fr' : '1fr',
          gap: '60px',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '24px',
              lineHeight: '1.1'
            }}>
              Earn up to QAR 8,000 per month from your property
            </h1>
            <p style={{
              fontSize: '20px',
              marginBottom: '32px',
              opacity: 0.9
            }}>
              Join 500+ successful hosts in Qatar earning steady monthly income with guaranteed long-term tenants.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push('/auth/sign-up')}
                style={{
                  padding: '14px 32px',
                  backgroundColor: 'white',
                  color: '#2563eb',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Get Started - 5 Minutes
              </button>
              <button
                onClick={() => setShowVideo(true)}
                style={{
                  padding: '14px 32px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Watch How It Works
              </button>
            </div>
          </div>
          <div style={{
            display: !isMobile ? 'block' : 'none',
            position: 'relative'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              color: '#111827',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
                Average Host Earnings
              </h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Studio</span>
                  <span style={{ fontWeight: 'bold' }}>QAR 2,500-3,500/mo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>1 Bedroom</span>
                  <span style={{ fontWeight: 'bold' }}>QAR 3,500-5,000/mo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>2 Bedroom</span>
                  <span style={{ fontWeight: 'bold' }}>QAR 4,500-7,000/mo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>3+ Bedroom</span>
                  <span style={{ fontWeight: 'bold' }}>QAR 6,000-10,000/mo</span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '16px' }}>
                *Based on properties in prime locations with standard amenities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section style={{
        backgroundColor: '#f9fafb',
        padding: '40px 24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>500+</div>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>Active Hosts</p>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>QAR 2M+</div>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>Paid Monthly</p>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>95%</div>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>Occupancy Rate</p>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>4.8★</div>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>Average Rating</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            Why hosts love Houseiana
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#dbeafe',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '24px'
              }}>
                💰
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Guaranteed Monthly Income
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  No more worrying about vacancies. Our long-term rental model ensures steady monthly payments directly to your bank account.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#dcfce7',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '24px'
              }}>
                🛡️
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Property Protection
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Your property is covered with up to QAR 50,000 protection against damages. We handle all tenant screening and verification.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '24px'
              }}>
                🎯
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Vetted Tenants
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  We carefully screen all tenants including background checks, employment verification, and previous rental history.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fce7f3',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '24px'
              }}>
                📱
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Easy Management
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Manage everything from your phone. Track earnings, communicate with tenants, and update listings from our dashboard.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#e0e7ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '24px'
              }}>
                🏆
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Premium Support
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  24/7 support team ready to help. We handle maintenance coordination, tenant issues, and emergency situations.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#ffedd5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '24px'
              }}>
                📈
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Dynamic Pricing
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Our algorithm optimizes your pricing based on market demand, ensuring maximum occupancy at the best rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        backgroundColor: '#f9fafb',
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
              { number: '1', title: 'Sign Up', desc: 'Create your host account in just 5 minutes', time: '5 min' },
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
                    color: '#6b7280',
                    transform: selectedFAQ === index ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s'
                  }}>
                    ↓
                  </span>
                </button>
                {selectedFAQ === index && (
                  <div style={{
                    padding: '0 24px 24px',
                    color: '#6b7280',
                    lineHeight: '1.6'
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
            onClick={() => router.push('/auth/sign-up')}
            style={{
              padding: '16px 40px',
              backgroundColor: 'white',
              color: '#2563eb',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Start Your Host Journey
          </button>
        </div>
      </section>
    </div>
  );
}