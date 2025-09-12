"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function CreatePropertyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    propertyType: 'apartment',
    
    // Location
    city: 'Doha',
    area: '',
    buildingName: '',
    address: '',
    floorNumber: '',
    
    // Property Details
    bedrooms: '1',
    bathrooms: '1',
    size: '',
    maxGuests: '2',
    
    // Pricing
    monthlyRent: '',
    weeklyRent: '',
    dailyRent: '',
    securityDeposit: '1000',
    cleaningFee: '200',
    
    // Amenities
    amenities: {
      wifi: false,
      parking: false,
      airConditioning: false,
      heating: false,
      kitchen: false,
      washingMachine: false,
      dryer: false,
      tv: false,
      pool: false,
      gym: false,
      elevator: false,
      balcony: false,
      garden: false,
      security: false,
      furnished: false,
      petsAllowed: false
    },
    
    // Rules & Settings
    houseRules: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    minimumStay: '30',
    instantBooking: false,
    
    // Photos
    photos: []
  });

  const steps = [
    { id: 1, name: 'Basic Info', icon: '📝' },
    { id: 2, name: 'Location', icon: '📍' },
    { id: 3, name: 'Property Details', icon: '🏠' },
    { id: 4, name: 'Pricing', icon: '💰' },
    { id: 5, name: 'Amenities', icon: '✨' },
    { id: 6, name: 'Rules & Photos', icon: '📸' }
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'villa', label: 'Villa', icon: '🏡' },
    { value: 'studio', label: 'Studio', icon: '🏠' },
    { value: 'penthouse', label: 'Penthouse', icon: '🏙️' },
    { value: 'townhouse', label: 'Townhouse', icon: '🏘️' },
    { value: 'compound', label: 'Compound', icon: '🏛️' }
  ];

  const areas = [
    'West Bay', 'The Pearl', 'Lusail', 'Al Sadd', 'Al Dafna',
    'Old Airport', 'Al Rayyan', 'Al Waab', 'Msheireb', 'Al Wakrah'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('amenities.')) {
      const amenityName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          [amenityName]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these to a storage service
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...photoUrls]
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/host/properties/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Property created successfully!');
        router.push('/dashboard');
      } else {
        alert(data.error || 'Failed to create property');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f7f7f7'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#222'
          }}>
            <span>←</span>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>Back to Dashboard</span>
          </Link>
          
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600'
          }}>
            List Your Property
          </h1>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || currentStep !== steps.length}
            style={{
              padding: '10px 24px',
              backgroundColor: currentStep === steps.length && !isSubmitting ? '#FF385C' : '#e0e0e0',
              color: currentStep === steps.length ? 'white' : '#717171',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: currentStep === steps.length && !isSubmitting ? 'pointer' : 'not-allowed'
            }}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Property'}
          </button>
        </div>
      </header>

      {/* Progress Steps */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                opacity: currentStep >= step.id ? 1 : 0.5
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: currentStep >= step.id ? '#FF385C' : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>{step.icon}</span>
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: currentStep === step.id ? '600' : '400',
                textAlign: 'center'
              }}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '0 24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                Basic Information
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Luxury 2BR Apartment in West Bay"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Property Type *
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px'
                }}>
                  {propertyTypes.map(type => (
                    <label
                      key={type.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        border: `2px solid ${formData.propertyType === type.value ? '#FF385C' : '#e0e0e0'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: formData.propertyType === type.value ? '#fff8f9' : 'white'
                      }}
                    >
                      <input
                        type="radio"
                        name="propertyType"
                        value={type.value}
                        checked={formData.propertyType === type.value}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '24px', marginRight: '8px' }}>{type.icon}</span>
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your property..."
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                Property Location
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="Doha">Doha</option>
                    <option value="Al Wakrah">Al Wakrah</option>
                    <option value="Al Rayyan">Al Rayyan</option>
                    <option value="Lusail">Lusail</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Area *
                  </label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Select Area</option>
                    {areas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Building/Compound Name
                </label>
                <input
                  type="text"
                  name="buildingName"
                  value={formData.buildingName}
                  onChange={handleInputChange}
                  placeholder="e.g., Marina Tower"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street name and number"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Floor
                  </label>
                  <input
                    type="text"
                    name="floorNumber"
                    value={formData.floorNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 5th"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Property Details */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                Property Details
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Bedrooms *
                  </label>
                  <select
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num === 0 ? 'Studio' : `${num} Bedroom${num > 1 ? 's' : ''}`}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Bathrooms *
                  </label>
                  <select
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                      <option key={num} value={num}>{num} Bathroom{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Size (sq.m)
                  </label>
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="e.g., 120"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Max Guests *
                  </label>
                  <select
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                Pricing
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Monthly Rent (QAR) *
                </label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleInputChange}
                  placeholder="e.g., 8000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Weekly Rent (QAR)
                  </label>
                  <input
                    type="number"
                    name="weeklyRent"
                    value={formData.weeklyRent}
                    onChange={handleInputChange}
                    placeholder="Optional"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Daily Rent (QAR)
                  </label>
                  <input
                    type="number"
                    name="dailyRent"
                    value={formData.dailyRent}
                    onChange={handleInputChange}
                    placeholder="Optional"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Security Deposit (QAR)
                  </label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                    placeholder="e.g., 1000"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Cleaning Fee (QAR)
                  </label>
                  <input
                    type="number"
                    name="cleaningFee"
                    value={formData.cleaningFee}
                    onChange={handleInputChange}
                    placeholder="e.g., 200"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Amenities */}
          {currentStep === 5 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                Amenities & Features
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px'
              }}>
                {Object.entries({
                  wifi: 'WiFi',
                  parking: 'Parking',
                  airConditioning: 'Air Conditioning',
                  heating: 'Heating',
                  kitchen: 'Kitchen',
                  washingMachine: 'Washing Machine',
                  dryer: 'Dryer',
                  tv: 'TV',
                  pool: 'Swimming Pool',
                  gym: 'Gym',
                  elevator: 'Elevator',
                  balcony: 'Balcony',
                  garden: 'Garden',
                  security: '24/7 Security',
                  furnished: 'Fully Furnished',
                  petsAllowed: 'Pets Allowed'
                }).map(([key, label]) => (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      border: `1px solid ${formData.amenities[key] ? '#FF385C' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: formData.amenities[key] ? '#fff8f9' : 'white'
                    }}
                  >
                    <input
                      type="checkbox"
                      name={`amenities.${key}`}
                      checked={formData.amenities[key]}
                      onChange={handleInputChange}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '14px' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Rules & Photos */}
          {currentStep === 6 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                House Rules & Photos
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  House Rules
                </label>
                <textarea
                  name="houseRules"
                  value={formData.houseRules}
                  onChange={handleInputChange}
                  placeholder="e.g., No smoking, No parties, Quiet hours after 10 PM..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={formData.checkInTime}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={formData.checkOutTime}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Minimum Stay (days)
                  </label>
                  <input
                    type="number"
                    name="minimumStay"
                    value={formData.minimumStay}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="instantBooking"
                    checked={formData.instantBooking}
                    onChange={handleInputChange}
                  />
                  <span style={{ fontSize: '14px' }}>Enable Instant Booking (guests can book without approval)</span>
                </label>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Property Photos
                </label>
                <div style={{
                  border: '2px dashed #e0e0e0',
                  borderRadius: '8px',
                  padding: '32px',
                  textAlign: 'center',
                  backgroundColor: '#fafafa'
                }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" style={{
                    cursor: 'pointer',
                    padding: '12px 24px',
                    backgroundColor: '#FF385C',
                    color: 'white',
                    borderRadius: '8px',
                    display: 'inline-block',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Upload Photos
                  </label>
                  <p style={{ marginTop: '12px', color: '#717171', fontSize: '14px' }}>
                    Upload at least 5 photos of your property
                  </p>
                </div>
                
                {formData.photos.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                    marginTop: '16px'
                  }}>
                    {formData.photos.map((photo, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={photo}
                          alt={`Property ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '32px'
          }}>
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#222',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 1 ? 0.5 : 1
              }}
            >
              Previous
            </button>
            
            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#FF385C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#FF385C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Property'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}