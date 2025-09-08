import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    return (
      <meta httpEquiv="refresh" content="0; url=/auth/sign-in" />
    );
  }

  const userName = session.name || `${session.firstName} ${session.lastName}`.trim() || 'User';
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '48px' }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#2563eb',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              H
            </div>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b'
            }}>Houseiana</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '4px' }}>
              <Link href="/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#eff6ff',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#2563eb',
                fontWeight: '500',
                gap: '12px',
                transition: 'all 0.2s'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '4px' }}>
              <Link href="/bookings" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#64748b',
                fontWeight: '500',
                gap: '12px',
                transition: 'all 0.2s'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                My Bookings
              </Link>
            </li>
            <li style={{ marginBottom: '4px' }}>
              <Link href="/saved" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#64748b',
                fontWeight: '500',
                gap: '12px',
                transition: 'all 0.2s'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Saved Homes
              </Link>
            </li>
            <li style={{ marginBottom: '4px' }}>
              <Link href="/messages" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#64748b',
                fontWeight: '500',
                gap: '12px',
                transition: 'all 0.2s'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Messages
              </Link>
            </li>
            <li style={{ marginBottom: '4px' }}>
              <Link href="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#64748b',
                fontWeight: '500',
                gap: '12px',
                transition: 'all 0.2s'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </Link>
            </li>
          </ul>

          <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
            <Link href="/settings" style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: '#64748b',
              fontWeight: '500',
              gap: '12px',
              transition: 'all 0.2s'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M1 12h6m6 0h6m-13.22 4.22l-4.24 4.24m16.92 0l-4.24-4.24" />
              </svg>
              Settings
            </Link>
          </div>
        </nav>

        {/* User Profile Section */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          marginTop: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#2563eb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{userName}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{session.email}</div>
            </div>
          </div>
          <form action="/api/auth/logout" method="post">
            <button style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#475569',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '280px',
        padding: '32px'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Welcome back, {userName}!
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#64748b'
          }}>
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              backgroundColor: '#dbeafe',
              borderRadius: '50%',
              opacity: '0.5'
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#eff6ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>0</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Active Bookings</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              backgroundColor: '#f0fdf4',
              borderRadius: '50%',
              opacity: '0.5'
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>0</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Saved Properties</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              backgroundColor: '#fef3c7',
              borderRadius: '50%',
              opacity: '0.5'
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>0</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Unread Messages</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '24px'
          }}>
            Quick Actions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <Link href="/search" style={{
              padding: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#eff6ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Browse Properties</span>
            </Link>

            <Link href="/bookings/new" style={{
              padding: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>New Booking</span>
            </Link>

            <Link href="/profile" style={{
              padding: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Edit Profile</span>
            </Link>

            <Link href="/help" style={{
              padding: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fce7f3',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Get Help</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '24px'
          }}>
            Recent Activity
          </h2>
          <div style={{
            textAlign: 'center',
            padding: '48px 0',
            color: '#94a3b8'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No recent activity</p>
            <p style={{ fontSize: '14px' }}>Your recent bookings and activities will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
}