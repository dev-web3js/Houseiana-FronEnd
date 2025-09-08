"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TripsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to bookings page since trips and bookings are the same
    router.replace('/bookings');
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f7f7f7'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>✈️</div>
        <p>Redirecting to your trips...</p>
      </div>
    </div>
  );
}