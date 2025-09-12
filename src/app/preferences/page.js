"use client";

import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function PreferencesPage() {
  const { user } = useAuth();
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('QAR');
  const [measurementUnit, setMeasurementUnit] = useState('metric');

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇶🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const currencies = [
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
  ];

  return (
    <MainLayout>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        padding: '40px 24px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            marginBottom: '32px'
          }}>
            Languages & Currency
          </h1>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            {/* Language Selection */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                Preferred Language
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {languages.map(lang => (
                  <label
                    key={lang.code}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      border: `2px solid ${language === lang.code ? '#FF385C' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: language === lang.code ? '#fff8f9' : 'white'
                    }}
                  >
                    <input
                      type="radio"
                      value={lang.code}
                      checked={language === lang.code}
                      onChange={(e) => setLanguage(e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>{lang.flag}</span>
                    <span style={{ fontSize: '16px', fontWeight: language === lang.code ? '600' : '400' }}>
                      {lang.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Currency Selection */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                Preferred Currency
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {currencies.map(curr => (
                  <label
                    key={curr.code}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      border: `2px solid ${currency === curr.code ? '#FF385C' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: currency === curr.code ? '#fff8f9' : 'white'
                    }}
                  >
                    <input
                      type="radio"
                      value={curr.code}
                      checked={currency === curr.code}
                      onChange={(e) => setCurrency(e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <span style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      marginRight: '12px',
                      color: '#FF385C'
                    }}>
                      {curr.symbol}
                    </span>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: currency === curr.code ? '600' : '400' }}>
                        {curr.code}
                      </div>
                      <div style={{ fontSize: '14px', color: '#717171' }}>
                        {curr.name}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Measurement Units */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                Measurement Units
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    border: `2px solid ${measurementUnit === 'metric' ? '#FF385C' : '#e0e0e0'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: measurementUnit === 'metric' ? '#fff8f9' : 'white'
                  }}
                >
                  <input
                    type="radio"
                    value="metric"
                    checked={measurementUnit === 'metric'}
                    onChange={(e) => setMeasurementUnit(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: measurementUnit === 'metric' ? '600' : '400' }}>
                      Metric
                    </div>
                    <div style={{ fontSize: '14px', color: '#717171' }}>
                      Square meters, kilometers
                    </div>
                  </div>
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    border: `2px solid ${measurementUnit === 'imperial' ? '#FF385C' : '#e0e0e0'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: measurementUnit === 'imperial' ? '#fff8f9' : 'white'
                  }}
                >
                  <input
                    type="radio"
                    value="imperial"
                    checked={measurementUnit === 'imperial'}
                    onChange={(e) => setMeasurementUnit(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: measurementUnit === 'imperial' ? '600' : '400' }}>
                      Imperial
                    </div>
                    <div style={{ fontSize: '14px', color: '#717171' }}>
                      Square feet, miles
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <button
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#FF385C',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}