"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HostSignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    idType: 'qatar_id',
    idNumber: '',
    hasProperty: 'yes',
    propertyType: 'apartment',
    agreeTerms: false
  });

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Required";
    if (!formData.lastName) newErrors.lastName = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!formData.phone) newErrors.phone = "Required";
    if (formData.password.length < 8) newErrors.password = "Min 8 characters";
    if (!formData.idNumber) newErrors.idNumber = "Required";
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to continue";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/host/quick-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        router.push('/host/dashboard/welcome');
      } else {
        setErrors({ submit: data.error || 'Sign up failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #eff6ff, #ffffff)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header with Sign In Option */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ 
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#2563eb',
            textDecoration: 'none'
          }}>
            Houseiana
          </Link>
          
          {/* Already have an account section */}
          <div style={{
            marginTop: '16px',
            padding: '12px 20px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            display: 'inline-block'
          }}>
            <span style={{ fontSize: '14px', color: '#6b7280', marginRight: '8px' }}>
              Already have a host account?
            </span>
            <Link href="/host/sign-in" style={{
              color: '#2563eb',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              Sign in here
            </Link>
          </div>
          
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#dcfce7',
            borderRadius: '9999px',
            fontSize: '14px',
            color: '#166534'
          }}>
            ⏱️ Only 5 minutes to get started
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            {[1, 2, 3].map((step) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: currentStep >= step ? '#2563eb' : '#e5e7eb',
                  color: currentStep >= step ? 'white' : '#9ca3af'
                }}>
                  {step}
                </div>
                {step < 3 && (
                  <div style={{
                    width: '60px',
                    height: '2px',
                    backgroundColor: currentStep > step ? '#2563eb' : '#e5e7eb',
                    marginLeft: '8px'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleQuickSubmit} style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          position: 'relative'
        }}>
          {/* Alternative Sign In Badge */}
          {currentStep === 1 && (
            <div style={{
              position: 'absolute',
              top: '-12px',
              right: '40px',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              New Host Account
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ 
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Let's get you started
              </h2>
              <p style={{ 
                color: '#6b7280',
                marginBottom: '32px'
              }}>
                Basic information to create your host account
              </p>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.firstName ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  {errors.firstName && (
                    <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.firstName}
                    </p>
                  )}
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.lastName ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  {errors.lastName && (
                    <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                {errors.email && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div style={{ 
                display: 'flex',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <select style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  fontSize: '14px',
                  width: '100px'
                }}>
                  <option>+974</option>
                </select>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: errors.phone ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <input
                  type="password"
                  placeholder="Create password (min 8 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                {errors.password && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (formData.firstName && formData.lastName && formData.email && formData.phone && formData.password) {
                    setCurrentStep(2);
                  } else {
                    setErrors({ general: 'Please fill all fields' });
                  }
                }}
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

              {/* Divider with OR */}
              <div style={{
                position: 'relative',
                margin: '24px 0'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '100%',
                    borderTop: '1px solid #e5e7eb'
                  }}></div>
                </div>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    backgroundColor: 'white',
                    padding: '0 16px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    OR
                  </span>
                </div>
              </div>

              {/* Sign in option */}
              <Link href="/host/sign-in" style={{
                display: 'block',
                width: '100%',
                padding: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}>
                Sign in to existing host account
              </Link>
            </div>
          )}

          {/* Step 2 and 3 remain the same... */}
          {currentStep === 2 && (
            // Same Step 2 code as before
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                Quick verification
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                We'll verify your documents later
              </p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  ID Type
                </label>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, idType: 'qatar_id'})}
                    style={{
                      padding: '12px',
                      border: formData.idType === 'qatar_id' ? '2px solid #2563eb' : '1px solid #d1d5db',
                      backgroundColor: formData.idType === 'qatar_id' ? '#eff6ff' : 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Qatar ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, idType: 'passport'})}
                    style={{
                      padding: '12px',
                      border: formData.idType === 'passport' ? '2px solid #2563eb' : '1px solid #d1d5db',
                      backgroundColor: formData.idType === 'passport' ? '#eff6ff' : 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Passport
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder={formData.idType === 'qatar_id' ? 'Qatar ID Number' : 'Passport Number'}
                  value={formData.idNumber}
                  onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.idNumber ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                {errors.idNumber && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {errors.idNumber}
                  </p>
                )}
              </div>

              <div style={{ 
                backgroundColor: '#eff6ff',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '32px'
              }}>
                <p style={{ fontSize: '14px', color: '#1e40af' }}>
                  <strong>Note:</strong> You can upload your ID documents later from your dashboard.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.idNumber) {
                      setCurrentStep(3);
                    } else {
                      setErrors({ idNumber: 'Required' });
                    }
                  }}
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

          {currentStep === 3 && (
            // Same Step 3 code as before
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                Almost done!
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                Tell us about your property plans
              </p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Do you have a property to list?
                </label>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px'
                }}>
                  {['yes', 'soon', 'exploring'].map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({...formData, hasProperty: option})}
                      style={{
                        padding: '12px',
                        border: formData.hasProperty === option ? '2px solid #2563eb' : '1px solid #d1d5db',
                        backgroundColor: formData.hasProperty === option ? '#eff6ff' : 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {option === 'yes' ? 'Yes' : option === 'soon' ? 'Soon' : 'Just exploring'}
                    </button>
                  ))}
                </div>
              </div>

              {formData.hasProperty === 'yes' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Property type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
              )}

              <div style={{ 
                borderTop: '1px solid #e5e7eb',
                paddingTop: '24px',
                marginBottom: '24px'
              }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                    style={{ marginTop: '2px' }}
                  />
                  <div>
                    <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
                      I agree to Houseiana's{' '}
                      <Link href="/terms" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                        Terms of Service
                      </Link>{' '}
                      and understand the{' '}
                      <Link href="/host-terms" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                        Host Agreement
                      </Link>
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Including 12% service fee on confirmed bookings
                    </p>
                  </div>
                </label>
                {errors.agreeTerms && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {errors.submit && (
                <div style={{ 
                  backgroundColor: '#fef2f2',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  <p style={{ fontSize: '14px', color: '#dc2626' }}>
                    {errors.submit}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.agreeTerms}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: loading || !formData.agreeTerms ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: loading || !formData.agreeTerms ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Creating account...' : 'Complete Sign Up'}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Trust Indicators */}
        <div style={{ 
          marginTop: '32px',
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            fontSize: '14px',
            color: '#4b5563'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>🔒</span>
              <span>Secure & Encrypted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✓</span>
              <span>500+ Active Hosts</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>💰</span>
              <span>QAR 2M+ Paid Monthly</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}