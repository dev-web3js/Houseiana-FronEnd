import Link from "next/link";
import Logo from "@/components/Logo";

export default function HomePage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(to bottom, #eff6ff, #ffffff)',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          {/* Logo Display */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '40px'
          }}>
            <Logo size="large" variant="full" />
          </div>
          
          <div style={{ 
            display: 'inline-block',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '8px 20px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '24px'
          }}>
            🏠 Monthly Rentals in Qatar
          </div>
          
          <h1 style={{ 
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Monthly stays for families,<br />
            made simple.
          </h1>
          
          <p style={{ 
            fontSize: '20px',
            color: '#6b7280',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px'
          }}>
            Book comfort-first homes with transparent monthly pricing.
          </p>

          {/* Search Form */}
          <div style={{ 
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            maxWidth: '900px',
            margin: '0 auto 32px'
          }}>
            <form style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <select style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}>
                <option>Select City</option>
                <option>Doha</option>
                <option>Al Rayyan</option>
                <option>Lusail</option>
                <option>The Pearl</option>
                <option>West Bay</option>
                <option>Al Wakrah</option>
              </select>
              
              <input 
                type="date"
                placeholder="Check-in"
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              
              <input 
                type="date"
                placeholder="Check-out"
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              
              <select style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}>
                <option>2 Guests</option>
                <option>1 Guest</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
                <option>5+ Guests</option>
              </select>
              
              <select style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}>
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
              
              <button 
                type="submit"
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </form>
          </div>

          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <Link 
              href="/auth/sign-up"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Create an account
            </Link>
            <Link 
              href="/auth/sign-in"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                color: '#374151'
              }}
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: '80px 24px',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px'
              }}>
                🏠
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Verified Homes
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                All properties inspected
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px'
              }}>
                💰
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Monthly Pricing
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                No hidden fees
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px'
              }}>
                🛡️
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Secure Booking
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Protected payments
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px'
              }}>
                ⭐
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                24/7 Support
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Always here to help
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section style={{ 
        padding: '80px 24px',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '36px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            Choose your comfort level
          </h2>
          <p style={{ 
            textAlign: 'center',
            color: '#6b7280',
            marginBottom: '48px',
            fontSize: '18px'
          }}>
            Three clear tiers. Same transparency and monthly pricing.
          </p>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {/* Standard Tier */}
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Standard</h3>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  fontSize: '12px',
                  borderRadius: '9999px',
                  fontWeight: '600'
                }}>
                  STANDARD
                </span>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Good value monthly stays with essential comforts.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  <span style={{ fontSize: '14px' }}>Essential amenities</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  <span style={{ fontSize: '14px' }}>Budget-friendly</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  <span style={{ fontSize: '14px' }}>Good ratings</span>
                </li>
              </ul>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
                QAR 1,200-2,500/month
              </p>
              <Link 
                href="/search?tier=standard"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '500'
                }}
              >
                View homes
              </Link>
            </div>

            {/* Gold Tier */}
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              border: '2px solid #2563eb'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Gold</h3>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  fontSize: '12px',
                  borderRadius: '9999px',
                  fontWeight: '600'
                }}>
                  GOLD
                </span>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Upgraded amenities for families and remote work.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  <span style={{ fontSize: '14px' }}>Workspace + fast Wi-Fi</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  <span style={{ fontSize: '14px' }}>Family-friendly</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  <span style={{ fontSize: '14px' }}>Higher ratings</span>
                </li>
              </ul>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
                QAR 2,000-4,000/month
              </p>
              <Link 
                href="/search?tier=gold"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                View homes
              </Link>
            </div>

            {/* Premium Tier */}
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Premium</h3>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#d1fae5',
                  color: '#059669',
                  fontSize: '12px',
                  borderRadius: '9999px',
                  fontWeight: '600'
                }}>
                  PREMIUM
                </span>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Top-tier locations & amenities for longer stays.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  <span style={{ fontSize: '14px' }}>Top locations</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  <span style={{ fontSize: '14px' }}>Gym/pool facilities</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                  <span style={{ fontSize: '14px' }}>Excellent service</span>
                </li>
              </ul>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
                QAR 3,500+/month
              </p>
              <Link 
                href="/search?tier=premium"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  backgroundColor: '#059669',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                View homes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Host CTA Section */}
      <section style={{ 
        padding: '80px 24px',
        backgroundColor: '#2563eb',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px' }}>
            Earn from your property in Qatar
          </h2>
          <p style={{ fontSize: '20px', marginBottom: '32px', color: '#dbeafe' }}>
            Join hundreds of hosts earning steady income
          </p>
          <Link 
            href="/become-a-host/signup"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              backgroundColor: 'white',
              color: '#2563eb',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '16px'
            }}
          >
            Become a Host - Sign Up in 5 Minutes
          </Link>
        </div>
      </section>
    </div>
  );
}