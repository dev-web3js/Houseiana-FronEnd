'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeSearchForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: '2 Guests',
    duration: 'Monthly'
  });

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get tomorrow's date as minimum for checkout
  const getTomorrow = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate dates
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      
      if (checkOutDate <= checkInDate) {
        alert('Check-out date must be after check-in date');
        return;
      }
    }

    // Build query string
    const params = new URLSearchParams();
    if (formData.city) params.set('city', formData.city);
    if (formData.checkIn) params.set('checkIn', formData.checkIn);
    if (formData.checkOut) params.set('checkOut', formData.checkOut);
    if (formData.guests) params.set('guests', formData.guests);
    if (formData.duration) params.set('duration', formData.duration);
    
    // Navigate to search page
    router.push(`/search?${params.toString()}`);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-adjust checkout date if needed
      if (field === 'checkIn' && value) {
        // If checkout is empty or before new checkin, set it to tomorrow
        if (!prev.checkOut || prev.checkOut <= value) {
          updated.checkOut = getTomorrow(value);
        }
      }
      
      // Validate checkout date when it changes
      if (field === 'checkOut' && prev.checkIn && value <= prev.checkIn) {
        alert('Check-out date must be after check-in date');
        return prev; // Don't update if invalid
      }
      
      return updated;
    });
  };

  return (
    <div style={{ 
      backgroundColor: 'white',
      padding: '32px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      maxWidth: '900px',
      margin: '0 auto 32px'
    }}>
      <form 
        onSubmit={handleSubmit}
        style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}
      >
        <select 
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="">Select City</option>
          <option value="Doha">Doha</option>
          <option value="Al Rayyan">Al Rayyan</option>
          <option value="Lusail">Lusail</option>
          <option value="The Pearl">The Pearl</option>
          <option value="West Bay">West Bay</option>
          <option value="Al Wakrah">Al Wakrah</option>
        </select>
        
        <input 
          type="date"
          value={formData.checkIn}
          onChange={(e) => handleInputChange('checkIn', e.target.value)}
          min={today}
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
          value={formData.checkOut}
          onChange={(e) => handleInputChange('checkOut', e.target.value)}
          min={formData.checkIn ? getTomorrow(formData.checkIn) : getTomorrow(today)}
          placeholder="Check-out"
          style={{
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
        
        <select 
          value={formData.guests}
          onChange={(e) => handleInputChange('guests', e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option>1 Guest</option>
          <option>2 Guests</option>
          <option>3 Guests</option>
          <option>4 Guests</option>
          <option>5+ Guests</option>
        </select>
        
        <select 
          value={formData.duration}
          onChange={(e) => handleInputChange('duration', e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
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
  );
}