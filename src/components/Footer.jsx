import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#111827',
      color: 'white',
      padding: '60px 24px 40px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? 'repeat(4, 1fr)' : '1fr',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Logo Column */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <Logo size="default" variant="full" />
            </div>
            <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.6' }}>
              Qatar's trusted platform for monthly home rentals.
            </p>
          </div>
          
          {/* Other footer columns... */}
        </div>
        
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '24px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            © 2024 Houseiana. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}