'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function KYCStatusCard({ className = '', showDetails = true }) {
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchKYCStatus();
    }
  }, [user]);

  const fetchKYCStatus = async () => {
    try {
      const response = await fetch('/api/kyc/submit');
      if (response.ok) {
        const data = await response.json();
        setKycStatus(data);
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = () => {
    if (!kycStatus?.verification) {
      return {
        title: 'Identity Verification Required',
        message: 'Verify your identity to unlock all platform features',
        status: 'not_started',
        color: 'gray',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-800',
        icon: '🔒',
        action: 'Start Verification',
        href: '/kyc/verify'
      };
    }

    const verification = kycStatus.verification;
    const statusConfig = {
      pending: {
        title: 'Verification Pending',
        message: 'Your documents are being reviewed',
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        icon: '⏳',
        action: 'Check Status'
      },
      under_review: {
        title: 'Under Review',
        message: 'Our team is reviewing your verification',
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        icon: '👀',
        action: 'Check Status'
      },
      approved: {
        title: 'Verification Complete',
        message: 'Your identity has been successfully verified',
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        icon: '✅',
        action: 'View Status'
      },
      rejected: {
        title: 'Verification Rejected',
        message: 'Please resubmit with correct documents',
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        icon: '❌',
        action: 'Resubmit'
      },
      flagged: {
        title: 'Additional Review Required',
        message: 'Your verification needs additional review',
        color: 'orange',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800',
        icon: '🚩',
        action: 'Contact Support'
      }
    };

    const config = statusConfig[verification.status] || statusConfig.pending;
    return {
      ...config,
      href: '/kyc/verify'
    };
  };

  const calculateProgress = () => {
    if (!kycStatus) return 0;
    
    const { verification, documents } = kycStatus;
    let completed = 0;
    const total = user?.isHost ? 5 : 3;

    // Check documents
    const documentTypes = documents?.map(doc => doc.type) || [];
    const hasIdentity = ['passport', 'national_id', 'drivers_license'].some(type => 
      documentTypes.includes(type)
    );
    const hasSelfie = documentTypes.includes('selfie');
    const hasAddress = ['utility_bill', 'bank_statement', 'rental_agreement'].some(type => 
      documentTypes.includes(type)
    );

    if (hasIdentity) completed++;
    if (hasSelfie) completed++;
    if (verification) completed++;
    
    if (user?.isHost) {
      if (hasAddress) completed++;
      if (verification?.status === 'approved') completed++;
    }

    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const progress = calculateProgress();

  return (
    <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{statusInfo.icon}</div>
          <div className="flex-1">
            <h3 className={`font-semibold ${statusInfo.textColor}`}>
              {statusInfo.title}
            </h3>
            <p className={`text-sm ${statusInfo.textColor} opacity-80 mt-1`}>
              {statusInfo.message}
            </p>
            
            {showDetails && (
              <div className="mt-3">
                {/* Progress Bar */}
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex-1 bg-white bg-opacity-50 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        statusInfo.color === 'green' ? 'bg-green-500' :
                        statusInfo.color === 'blue' ? 'bg-blue-500' :
                        statusInfo.color === 'yellow' ? 'bg-yellow-500' :
                        statusInfo.color === 'red' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${statusInfo.textColor}`}>
                    {progress}%
                  </span>
                </div>

                {/* Missing Requirements */}
                {kycStatus?.missingDocuments && kycStatus.missingDocuments.length > 0 && (
                  <div className="mt-2">
                    <p className={`text-xs ${statusInfo.textColor} opacity-70 mb-1`}>
                      Missing:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {kycStatus.missingDocuments.map((missing, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-50 ${statusInfo.textColor}`}
                        >
                          {missing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents Summary */}
                {kycStatus?.documents && kycStatus.documents.length > 0 && (
                  <div className="mt-2">
                    <p className={`text-xs ${statusInfo.textColor} opacity-70 mb-1`}>
                      Documents: {kycStatus.documents.length} uploaded
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {kycStatus?.verification?.status === 'approved' && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium text-green-600">Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4">
        <Link
          href={statusInfo.href}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            statusInfo.color === 'green' 
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : statusInfo.color === 'blue'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : statusInfo.color === 'red'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : statusInfo.color === 'yellow'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {statusInfo.action}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Additional Info for Hosts */}
      {user?.isHost && kycStatus?.verification?.status !== 'approved' && (
        <div className="mt-3 pt-3 border-t border-white border-opacity-30">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className={`text-xs ${statusInfo.textColor} opacity-80`}>
              Enhanced verification required for host features
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for navigation/header
export function KYCStatusBadge({ className = '' }) {
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    if (user) {
      fetch('/api/kyc/submit')
        .then(res => res.json())
        .then(data => setKycStatus(data))
        .catch(console.error);
    }
  }, [user]);

  if (!user || kycStatus?.verification?.status === 'approved') {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const status = kycStatus?.verification?.status || 'not_started';

  return (
    <Link
      href="/kyc/verify"
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} hover:opacity-80 transition-opacity ${className}`}
    >
      {status === 'not_started' ? '🔒 Verify ID' : 
       status === 'pending' ? '⏳ Pending' :
       status === 'under_review' ? '👀 Review' :
       status === 'rejected' ? '❌ Rejected' :
       status === 'flagged' ? '🚩 Flagged' : 'Verify'}
    </Link>
  );
}