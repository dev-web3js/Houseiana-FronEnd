"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingWidget({ listing }) {
  const router = useRouter();
  const [dates, setDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [pricing, setPricing] = useState(null);
  const [error, setError] = useState('');

  const minDate = new Date().toISOString().split('T')[0];

  const handleCheck = async () => {
    setError('');
    setPricing(null);
    setChecking(true);
    
    try {
      const response = await fetch('/api/bookings/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          ...dates
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Cannot check availability');
        return;
      }
      
      setPricing(data.pricing);
      
    } catch (err) {
      setError('Failed to check availability');
    } finally {
      setChecking(false);
    }
  };

  const handleBooking = async () => {
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          ...dates
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/sign-in');
          return;
        }
        setError(data.error || 'Booking failed');
        return;
      }
      
      // Success - redirect to booking confirmation
      router.push(`/bookings/${data.booking.id}`);
      
    } catch (err) {
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 shadow-lg bg-white sticky top-4">
      <div className="text-2xl font-bold mb-2">
        ${listing.monthlyPrice}/month
      </div>
      <div className="text-sm text-gray-600 mb-4">
        Minimum stay: {listing.minNights} nights
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Check-in</label>
          <input
            type="date"
            min={minDate}
            value={dates.checkIn}
            onChange={(e) => setDates({...dates, checkIn: e.target.value})}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Check-out</label>
          <input
            type="date"
            min={dates.checkIn || minDate}
            value={dates.checkOut}
            onChange={(e) => setDates({...dates, checkOut: e.target.value})}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Guests</label>
          <select
            value={dates.guests}
            onChange={(e) => setDates({...dates, guests: parseInt(e.target.value)})}
            className="w-full p-2 border rounded-lg"
          >
            {[...Array(listing.maxGuests)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        
        {!pricing && (
          <button
            onClick={handleCheck}
            disabled={checking || !dates.checkIn || !dates.checkOut}
            className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            {checking ? 'Checking...' : 'Check Availability'}
          </button>
        )}
        
        {pricing && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>${pricing.nightlyRate} x {pricing.nights} nights</span>
              <span>${pricing.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cleaning fee</span>
              <span>${pricing.cleaningFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service fee</span>
              <span>${pricing.serviceFee}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>${pricing.totalPrice}</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {pricing && (
          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Reserve Now'}
          </button>
        )}
      </div>
    </div>
  );
}