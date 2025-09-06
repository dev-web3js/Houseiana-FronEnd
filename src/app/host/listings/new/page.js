"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function AddPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [propertyData, setPropertyData] = useState({
    // Basic Info
    title: '',
    propertyType: 'apartment',
    bedrooms: '1',
    bathrooms: '1',
    maxGuests: '2',
    size: '',
    
    // Location
    address: '',
    city: 'Doha',
    area: '',
    buildingName: '',
    floorNumber: '',
    
    // Pricing
    monthlyRent: '',
    weeklyRent: '',
    dailyRent: '',
    securityDeposit: '',
    cleaningFee: '',
    
    // Amenities
    amenities: {
      wifi: false,
      airConditioning: false,
      heating: false,
      kitchen: false,
      washer: false,
      dryer: false,
      parking: false,
      pool: false,
      gym: false,
      elevator: false,
      balcony: false,
      workspace: false,
      tv: false,
      dishwasher: false,
      petFriendly: false
    },
    
    // Description
    description: '',
    houseRules: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    minimumStay: '30',
    
    // Photos
    photos: [],
    
    // Availability
    availableFrom: '',
    instantBooking: false
  });

  const totalSteps = 6;

  // Validation for mandatory fields
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!propertyData.title.trim()) {
        newErrors.title = "Property title is required";
      }
      if (!propertyData.size) {
        newErrors.size = "Property size is required";
      }
    }
    
    if (step === 2) {
      if (!propertyData.area.trim()) {
        newErrors.area = "Area/District is required";
      }
      if (!propertyData.address.trim()) {
        newErrors.address = "Street address is required";
      }
    }
    
    if (step === 4) {
      if (uploadedImages.length === 0) {
        newErrors.photos = "Please add at least one photo of your property";
      }
    }
    
    if (step === 5) {
      if (!propertyData.monthlyRent) {
        newErrors.monthlyRent = "Monthly rent is required";
      }
    }
    
    if (step === 6) {
      if (!propertyData.description.trim()) {
        newErrors.description = "Property description is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file,
      name: file.name
    }));
    
    setUploadedImages([...uploadedImages, ...newImages]);
    setErrors({ ...errors, photos: null });
  };

  const removePhoto = (id) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== id));
  };

 const handleSubmit = async () => {
  if (!validateStep(6)) {
    alert('Please fill in all required fields');
    return;
  }
  
  setLoading(true);
  
  try {
    const response = await fetch('/api/host/properties/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...propertyData,
        photos: uploadedImages.map(img => img.url)
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      setShowSuccessModal(true);
      setTimeout(() => {
        window.location.href = '/host/listings';
      }, 2000);
    } else {
      throw new Error(result.error || 'Failed to publish');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
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
          <Link href="/host/dashboard/welcome" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
            <Logo size="default" variant="full" />
            <span style={{
              fontSize: '12px',
              padding: '4px 12px',
              backgroundColor: '#eff6ff',
              color: '#1e40af',
              borderRadius: '6px',
              fontWeight: '500'
            }}>
              Host Dashboard
            </span>
          </Link>
          
          <button
            onClick={() => router.push('/host/dashboard/welcome')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            Save & Exit
          </button>
        </div>
      </nav>

      {/* Progress Bar */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Step {currentStep} of {totalSteps}
            </span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#2563eb',
              width: `${(currentStep / totalSteps) * 100}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
        {/* Step 1: Property Type & Basics */}
        {currentStep === 1 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              Let's start with the basics
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              Tell us about your property type and size
            </p>

            {(errors.title || errors.size) && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '24px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Please fill in all required fields:
                </p>
                {errors.title && <p style={{ color: '#dc2626', fontSize: '14px' }}>• {errors.title}</p>}
                {errors.size && <p style={{ color: '#dc2626', fontSize: '14px' }}>• {errors.size}</p>}
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Property Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Cozy 2BR Apartment in West Bay"
                value={propertyData.title}
                onChange={(e) => setPropertyData({...propertyData, title: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.title ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Property Type <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {['Apartment', 'Villa', 'Studio', 'Townhouse', 'Penthouse', 'Room'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPropertyData({...propertyData, propertyType: type.toLowerCase()})}
                    style={{
                      padding: '16px',
                      border: propertyData.propertyType === type.toLowerCase() ? '2px solid #2563eb' : '1px solid #d1d5db',
                      backgroundColor: propertyData.propertyType === type.toLowerCase() ? '#eff6ff' : 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: propertyData.propertyType === type.toLowerCase() ? '600' : '400'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Bedrooms <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={propertyData.bedrooms}
                  onChange={(e) => setPropertyData({...propertyData, bedrooms: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                >
                  <option value="0">Studio</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Bathrooms <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={propertyData.bathrooms}
                  onChange={(e) => setPropertyData({...propertyData, bathrooms: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Max Guests <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={propertyData.maxGuests}
                  onChange={(e) => setPropertyData({...propertyData, maxGuests: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Property Size (m²) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 120"
                value={propertyData.size}
                onChange={(e) => setPropertyData({...propertyData, size: e.target.value})}
                style={{
                  width: '200px',
                  padding: '12px',
                  border: errors.size ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              onClick={handleNextStep}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              Where's your property located?
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              Guests will only see exact address after booking
            </p>

            {(errors.area || errors.address) && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '24px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Please fill in all required fields:
                </p>
                {errors.area && <p style={{ color: '#dc2626', fontSize: '14px' }}>• {errors.area}</p>}
                {errors.address && <p style={{ color: '#dc2626', fontSize: '14px' }}>• {errors.address}</p>}
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                City <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={propertyData.city}
                onChange={(e) => setPropertyData({...propertyData, city: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="Doha">Doha</option>
                <option value="Al Rayyan">Al Rayyan</option>
                <option value="Lusail">Lusail</option>
                <option value="The Pearl">The Pearl</option>
                <option value="West Bay">West Bay</option>
                <option value="Al Wakrah">Al Wakrah</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Area/District <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Marina District"
                value={propertyData.area}
                onChange={(e) => setPropertyData({...propertyData, area: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.area ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Street Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Building number and street name"
                value={propertyData.address}
                onChange={(e) => setPropertyData({...propertyData, address: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.address ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Building/Tower Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Marina Tower"
                  value={propertyData.buildingName}
                  onChange={(e) => setPropertyData({...propertyData, buildingName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Floor Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., 15"
                  value={propertyData.floorNumber}
                  onChange={(e) => setPropertyData({...propertyData, floorNumber: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePreviousStep}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Amenities - No changes needed */}
        {currentStep === 3 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              What amenities do you offer?
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              Select all that apply
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {Object.entries({
                wifi: '📶 Wi-Fi',
                airConditioning: '❄️ Air Conditioning',
                heating: '🔥 Heating',
                kitchen: '🍳 Kitchen',
                washer: '🌊 Washer',
                dryer: '👕 Dryer',
                parking: '🚗 Parking',
                pool: '🏊 Pool',
                gym: '💪 Gym',
                elevator: '🛗 Elevator',
                balcony: '🏞️ Balcony',
                workspace: '💻 Workspace',
                tv: '📺 TV',
                dishwasher: '🍽️ Dishwasher',
                petFriendly: '🐕 Pet Friendly'
              }).map(([key, label]) => (
                <label
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    border: propertyData.amenities[key] ? '2px solid #2563eb' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: propertyData.amenities[key] ? '#eff6ff' : 'white'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={propertyData.amenities[key]}
                    onChange={(e) => setPropertyData({
                      ...propertyData,
                      amenities: {
                        ...propertyData.amenities,
                        [key]: e.target.checked
                      }
                    })}
                    style={{ marginRight: '12px' }}
                  />
                  <span style={{ fontSize: '14px' }}>{label}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePreviousStep}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Photos - Updated with validation and image management */}
        {currentStep === 4 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              Add photos of your property <span style={{ color: '#ef4444' }}>*</span>
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              Properties with 10+ photos get 2x more bookings
            </p>

            {errors.photos && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '24px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '14px' }}>
                  {errors.photos}
                </p>
              </div>
            )}

            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '24px',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
              <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                Drag and drop photos here
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                or click to browse
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Select Photos
              </label>
            </div>

            {/* Display uploaded photos */}
            {uploadedImages.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                  Uploaded Photos ({uploadedImages.length})
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '16px'
                }}>
                  {uploadedImages.map((img) => (
                    <div key={img.id} style={{
                      position: 'relative',
                      paddingBottom: '100%',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={img.url} 
                        alt={img.name}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <button
                        onClick={() => removePhoto(img.id)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: 'bold',
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
              </div>
            )}

            <div style={{
              backgroundColor: '#eff6ff',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '32px'
            }}>
              <p style={{ fontSize: '14px', color: '#1e40af' }}>
                <strong>Photo tips:</strong> Include photos of all rooms, bathrooms, kitchen, and any special amenities. 
                Use natural lighting and ensure photos are clear and high quality.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePreviousStep}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Pricing - Updated with validation */}
        {currentStep === 5 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              Set your pricing
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              Competitive pricing helps you get more bookings
            </p>

            {errors.monthlyRent && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '24px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '14px' }}>
                  {errors.monthlyRent}
                </p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Monthly Rate (QAR) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 3500"
                  value={propertyData.monthlyRent}
                  onChange={(e) => setPropertyData({...propertyData, monthlyRent: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.monthlyRent ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Weekly Rate (QAR)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 1200"
                  value={propertyData.weeklyRent}
                  onChange={(e) => setPropertyData({...propertyData, weeklyRent: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Daily Rate (QAR)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 200"
                  value={propertyData.dailyRent}
                  onChange={(e) => setPropertyData({...propertyData, dailyRent: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Security Deposit (QAR)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 2000"
                  value={propertyData.securityDeposit}
                  onChange={(e) => setPropertyData({...propertyData, securityDeposit: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Cleaning Fee (QAR)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 150"
                  value={propertyData.cleaningFee}
                  onChange={(e) => setPropertyData({...propertyData, cleaningFee: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '32px'
            }}>
              <p style={{ fontSize: '14px', color: '#059669' }}>
                <strong>Pricing tip:</strong> Properties priced 10-15% below market average get booked 3x faster
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePreviousStep}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Description & Rules - Updated with validation */}
        {currentStep === 6 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              Describe your property
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              Help guests understand what makes your property special
            </p>

            {errors.description && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '24px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '14px' }}>
                  {errors.description}
                </p>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Property Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                placeholder="Describe your property, neighborhood, and what makes it unique..."
                value={propertyData.description}
                onChange={(e) => setPropertyData({...propertyData, description: e.target.value})}
                rows="6"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.description ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                House Rules
              </label>
              <textarea
                placeholder="e.g., No smoking, No parties, Quiet hours after 10 PM..."
                value={propertyData.houseRules}
                onChange={(e) => setPropertyData({...propertyData, houseRules: e.target.value})}
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Check-in Time
                </label>
                <input
                  type="time"
                  value={propertyData.checkInTime}
                  onChange={(e) => setPropertyData({...propertyData, checkInTime: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Check-out Time
                </label>
                <input
                  type="time"
                  value={propertyData.checkOutTime}
                  onChange={(e) => setPropertyData({...propertyData, checkOutTime: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Minimum Stay (days)
                </label>
                <input
                  type="number"
                  value={propertyData.minimumStay}
                  onChange={(e) => setPropertyData({...propertyData, minimumStay: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: propertyData.instantBooking ? '#eff6ff' : 'white'
              }}>
                <input
                  type="checkbox"
                  checked={propertyData.instantBooking}
                  onChange={(e) => setPropertyData({...propertyData, instantBooking: e.target.checked})}
                  style={{ marginRight: '12px' }}
                />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>Enable Instant Booking</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Guests can book without waiting for approval
                  </p>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePreviousStep}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
  onClick={handleSubmit}
  disabled={loading}
  style={{
    flex: 1,
    padding: '14px',
    backgroundColor: loading ? '#9ca3af' : '#10b981',
    color: 'white',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1
  }}
>
  {loading ? 'Publishing...' : 'Publish Property'}
</button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '16px',
            maxWidth: '500px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>
              Property Published Successfully!
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '16px' }}>
              Your property is now live and ready to receive bookings. You can manage it from your dashboard.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link
                href="/host/listings"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  display: 'inline-block'
                }}
              >
                View My Properties
              </Link>
              <button
                onClick={() => router.push('/host/dashboard/welcome')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}