"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HostRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Identity Verification
    idType: 'qatar_id',
    idNumber: '',
    
    // Property Info
    hasProperty: true,
    propertyCount: 1,
    propertyTypes: [],
    
    // Banking
    bankName: '',
    accountNumber: '',
    iban: '',
    
    // Agreement
    agreeTerms: false,
    agreeCommission: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
      if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/host/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        router.push('/become-a-host/verification');
      } else {
        setErrors({ submit: data.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  i <= step ? 'bg-brand text-white' : 'bg-gray-200'
                }`}>
                  {i}
                </div>
                {i < 4 && <div className={`w-full h-1 ${i < step ? 'bg-brand' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Personal Info</span>
            <span>Verification</span>
            <span>Property</span>
            <span>Banking</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select className="p-3 border rounded-lg">
                    <option>+974</option>
                  </select>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="flex-1 p-3 border rounded-lg"
                    placeholder="5555 5555"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Identity Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Identity Verification</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  ID Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.idType}
                  onChange={(e) => setFormData({...formData, idType: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="qatar_id">Qatar ID</option>
                  <option value="passport">Passport</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {formData.idType === 'qatar_id' ? 'Qatar ID Number' : 'Passport Number'} 
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload ID Document <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  <input type="file" className="hidden" />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Continue with Step 3 (Property) and Step 4 (Banking)... */}
        </div>
      </div>
    </main>
  );
}