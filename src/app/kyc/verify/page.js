'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const KYC_DOCUMENT_TYPES = {
  identity: [
    { value: 'passport', label: 'Passport', description: 'Valid passport with clear photo page' },
    { value: 'national_id', label: 'National ID Card', description: 'Qatar ID or other national ID' },
    { value: 'drivers_license', label: 'Driver\'s License', description: 'Valid driver\'s license with photo' }
  ],
  address: [
    { value: 'utility_bill', label: 'Utility Bill', description: 'Recent utility bill (last 3 months)' },
    { value: 'bank_statement', label: 'Bank Statement', description: 'Bank statement showing your address' },
    { value: 'rental_agreement', label: 'Rental Agreement', description: 'Lease or rental contract' }
  ],
  photo: [
    { value: 'selfie', label: 'Selfie Photo', description: 'Clear selfie photo for identity verification' }
  ]
};

export default function KYCVerifyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [kycData, setKycData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    country: 'Qatar',
    postalCode: '',
    documentType: '',
    documentNumber: '',
    documentCountry: 'Qatar',
    documentExpiry: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    
    if (user) {
      // Pre-fill form with existing user data
      setPersonalInfo(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      }));
      
      // Fetch existing KYC data
      fetchKYCStatus();
    }
  }, [user, loading, router]);

  const fetchKYCStatus = async () => {
    try {
      const response = await fetch('/api/kyc/submit');
      if (response.ok) {
        const data = await response.json();
        setKycData(data);
        setUploadedDocs(data.documents || []);
        
        if (data.verification) {
          setPersonalInfo(prev => ({
            ...prev,
            ...data.verification
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    }
  };

  const handleFileUpload = async (file, documentType) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    try {
      const response = await fetch('/api/kyc/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setUploadedDocs(prev => [...prev, result.document]);
        alert('Document uploaded successfully!');
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitVerification = async () => {
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(personalInfo)
      });

      if (response.ok) {
        const result = await response.json();
        alert('KYC verification submitted successfully!');
        setCurrentStep(4); // Go to status step
        fetchKYCStatus();
      } else {
        const error = await response.json();
        alert(`Submission failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit verification');
    } finally {
      setSubmitting(false);
    }
  };

  const getDocumentStatus = (type) => {
    return uploadedDocs.find(doc => doc.type === type);
  };

  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Identity Verification (KYC)
          </h1>
          <p className="text-gray-600">
            Verify your identity to unlock all platform features and become a trusted user
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Documents Upload', description: 'Upload required documents' },
              { step: 2, title: 'Personal Information', description: 'Complete your profile' },
              { step: 3, title: 'Review & Submit', description: 'Review and submit for verification' },
              { step: 4, title: 'Verification Status', description: 'Track your verification' }
            ].map((item) => (
              <div key={item.step} className="flex-1">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    getStepStatus(item.step) === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : getStepStatus(item.step) === 'current'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {getStepStatus(item.step) === 'completed' ? '✓' : item.step}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  {item.step < 4 && (
                    <div className={`absolute top-4 left-8 w-full h-0.5 ${
                      getStepStatus(item.step + 1) === 'completed' || getStepStatus(item.step + 1) === 'current'
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentStep === 1 && (
            <DocumentUploadStep
              documentTypes={KYC_DOCUMENT_TYPES}
              uploadedDocs={uploadedDocs}
              onFileUpload={handleFileUpload}
              uploading={uploading}
              getDocumentStatus={getDocumentStatus}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <PersonalInfoStep
              personalInfo={personalInfo}
              setPersonalInfo={setPersonalInfo}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <ReviewStep
              personalInfo={personalInfo}
              uploadedDocs={uploadedDocs}
              onSubmit={handleSubmitVerification}
              onBack={() => setCurrentStep(2)}
              submitting={submitting}
            />
          )}

          {currentStep === 4 && (
            <StatusStep
              kycData={kycData}
              onBack={() => setCurrentStep(1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Document Upload Step Component
function DocumentUploadStep({ documentTypes, uploadedDocs, onFileUpload, uploading, getDocumentStatus, onNext }) {
  const [selectedFiles, setSelectedFiles] = useState({});

  const handleFileSelect = (event, docType) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [docType]: file }));
    }
  };

  const handleUpload = (docType) => {
    const file = selectedFiles[docType];
    if (file) {
      onFileUpload(file, docType);
      setSelectedFiles(prev => ({ ...prev, [docType]: null }));
    }
  };

  const requiredDocs = ['passport', 'national_id', 'drivers_license'];
  const hasRequiredIdentity = requiredDocs.some(type => getDocumentStatus(type));
  const hasSelfie = getDocumentStatus('selfie');

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Upload Required Documents</h2>
      
      {/* Identity Documents */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Identity Document (Required - Choose One)
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentTypes.identity.map((doc) => {
            const status = getDocumentStatus(doc.value);
            return (
              <DocumentUploadCard
                key={doc.value}
                doc={doc}
                status={status}
                selectedFile={selectedFiles[doc.value]}
                onFileSelect={(e) => handleFileSelect(e, doc.value)}
                onUpload={() => handleUpload(doc.value)}
                uploading={uploading}
              />
            );
          })}
        </div>
      </div>

      {/* Selfie */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Selfie Photo (Required)
        </h3>
        <div className="max-w-md">
          <DocumentUploadCard
            doc={documentTypes.photo[0]}
            status={getDocumentStatus('selfie')}
            selectedFile={selectedFiles['selfie']}
            onFileSelect={(e) => handleFileSelect(e, 'selfie')}
            onUpload={() => handleUpload('selfie')}
            uploading={uploading}
          />
        </div>
      </div>

      {/* Address Proof (Optional) */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Address Proof (Optional - Recommended for Hosts)
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentTypes.address.map((doc) => {
            const status = getDocumentStatus(doc.value);
            return (
              <DocumentUploadCard
                key={doc.value}
                doc={doc}
                status={status}
                selectedFile={selectedFiles[doc.value]}
                onFileSelect={(e) => handleFileSelect(e, doc.value)}
                onUpload={() => handleUpload(doc.value)}
                uploading={uploading}
              />
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!hasRequiredIdentity || !hasSelfie}
          className={`px-6 py-2 rounded-lg font-medium ${
            hasRequiredIdentity && hasSelfie
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Personal Information
        </button>
      </div>
    </div>
  );
}

// Document Upload Card Component
function DocumentUploadCard({ doc, status, selectedFile, onFileSelect, onUpload, uploading }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{doc.label}</h4>
        {status && (
          <span className={`px-2 py-1 text-xs rounded-full ${
            status.status === 'verified' 
              ? 'bg-green-100 text-green-800'
              : status.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {status.status}
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
      
      {!status && (
        <div>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={onFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {selectedFile && (
            <button
              onClick={onUpload}
              disabled={uploading}
              className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
      )}
      
      {status && (
        <div className="text-sm text-gray-600">
          <p>✓ Uploaded: {status.originalName}</p>
          <p className="text-xs">Status: {status.status}</p>
        </div>
      )}
    </div>
  );
}

// Personal Info Step Component
function PersonalInfoStep({ personalInfo, setPersonalInfo, onNext, onBack }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const isValid = personalInfo.firstName && personalInfo.lastName && 
                  personalInfo.documentType && personalInfo.documentNumber;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={personalInfo.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={personalInfo.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={personalInfo.dateOfBirth}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nationality
          </label>
          <input
            type="text"
            name="nationality"
            value={personalInfo.nationality}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={personalInfo.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={personalInfo.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            name="country"
            value={personalInfo.country}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Qatar">Qatar</option>
            <option value="UAE">UAE</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Oman">Oman</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type *
          </label>
          <select
            name="documentType"
            value={personalInfo.documentType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Document Type</option>
            <option value="passport">Passport</option>
            <option value="national_id">National ID</option>
            <option value="drivers_license">Driver's License</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Number *
          </label>
          <input
            type="text"
            name="documentNumber"
            value={personalInfo.documentNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Expiry Date
          </label>
          <input
            type="date"
            name="documentExpiry"
            value={personalInfo.documentExpiry}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back to Documents
        </button>
        
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-6 py-2 rounded-lg font-medium ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}

// Review Step Component
function ReviewStep({ personalInfo, uploadedDocs, onSubmit, onBack, submitting }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>
      
      <div className="space-y-6">
        {/* Personal Information Review */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {personalInfo.firstName} {personalInfo.lastName}
            </div>
            <div>
              <span className="font-medium">Date of Birth:</span> {personalInfo.dateOfBirth || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Nationality:</span> {personalInfo.nationality || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Country:</span> {personalInfo.country}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Address:</span> {personalInfo.address || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Document Type:</span> {personalInfo.documentType}
            </div>
            <div>
              <span className="font-medium">Document Number:</span> {personalInfo.documentNumber}
            </div>
          </div>
        </div>
        
        {/* Documents Review */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4">Uploaded Documents</h3>
          <div className="space-y-2">
            {uploadedDocs.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center text-sm">
                <span>{doc.type.replace('_', ' ').toUpperCase()}: {doc.originalName}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  doc.status === 'verified' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Terms */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Important Notes</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your documents will be reviewed by our verification team</li>
            <li>• The review process typically takes 1-3 business days</li>
            <li>• You will be notified via email once your verification is complete</li>
            <li>• All documents are securely stored and encrypted</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back to Personal Info
        </button>
        
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {submitting ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </div>
    </div>
  );
}

// Status Step Component
function StatusStep({ kycData, onBack }) {
  const verification = kycData?.verification;
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'flagged': return 'text-orange-600 bg-orange-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-6">Verification Status</h2>
      
      {verification ? (
        <div className="space-y-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getStatusColor(verification.status)}`}>
            {verification.status.toUpperCase().replace('_', ' ')}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">Verification Details</h3>
            <div className="text-left space-y-2 text-sm">
              <div>
                <span className="font-medium">Verification Code:</span> {verification.verificationCode}
              </div>
              <div>
                <span className="font-medium">Submitted:</span> {new Date(verification.submittedAt).toLocaleDateString()}
              </div>
              {verification.reviewedAt && (
                <div>
                  <span className="font-medium">Reviewed:</span> {new Date(verification.reviewedAt).toLocaleDateString()}
                </div>
              )}
              {verification.rejectionReason && (
                <div>
                  <span className="font-medium">Reason:</span> {verification.rejectionReason}
                </div>
              )}
            </div>
          </div>
          
          {verification.status === 'rejected' && (
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Documents & Resubmit
            </button>
          )}
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">No verification found</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Verification
          </button>
        </div>
      )}
    </div>
  );
}