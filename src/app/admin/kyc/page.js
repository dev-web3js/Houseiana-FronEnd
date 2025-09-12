'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminKYCPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [verifications, setVerifications] = useState([]);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [filters, setFilters] = useState({
    status: 'pending',
    page: 1,
    limit: 20
  });

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/');
    }
    
    if (user && user.isAdmin) {
      fetchVerifications();
    }
  }, [user, loading, router, filters]);

  const fetchVerifications = async () => {
    setLoadingData(true);
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/admin/kyc/review?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setVerifications(data.verifications || []);
      } else {
        console.error('Failed to fetch verifications');
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleReviewAction = async (verificationId, action, reason = '') => {
    setProcessing(true);
    try {
      const response = await fetch('/api/admin/kyc/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          verificationId,
          action,
          reason,
          internalNotes: reason
        })
      });

      if (response.ok) {
        alert(`Verification ${action}d successfully`);
        setSelectedVerification(null);
        fetchVerifications();
      } else {
        const error = await response.json();
        alert(`Action failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Review action error:', error);
      alert('Failed to process action');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'flagged': return 'text-orange-600 bg-orange-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            KYC Verification Management
          </h1>
          <p className="text-gray-600">
            Review and manage user identity verification requests
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
                <option value="all">All Status</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Per Page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Verifications List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Verification Requests ({verifications.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {loadingData ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading verifications...</p>
                  </div>
                ) : verifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No verifications found for the selected status
                  </div>
                ) : (
                  verifications.map((verification) => (
                    <div
                      key={verification.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedVerification?.id === verification.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedVerification(verification)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {verification.firstName} {verification.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">{verification.user.email}</p>
                          </div>
                          {verification.user.isHost && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                              Host
                            </span>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                            {verification.status.replace('_', ' ')}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(verification.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          {verification.documentType} • {verification.documentCountry}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(verification.riskLevel)}`}>
                          {verification.riskLevel} risk
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Verification Details */}
          <div className="lg:col-span-1">
            {selectedVerification ? (
              <VerificationDetailsPanel
                verification={selectedVerification}
                onAction={handleReviewAction}
                processing={processing}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm">Select a verification to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Verification Details Panel Component
function VerificationDetailsPanel({ verification, onAction, processing }) {
  const [action, setAction] = useState('');
  const [reason, setReason] = useState('');
  const [showReasonModal, setShowReasonModal] = useState(false);

  const handleActionClick = (actionType) => {
    setAction(actionType);
    if (actionType === 'reject' || actionType === 'flag') {
      setShowReasonModal(true);
    } else {
      onAction(verification.id, actionType);
    }
  };

  const handleReasonSubmit = () => {
    if (reason.trim()) {
      onAction(verification.id, action, reason);
      setShowReasonModal(false);
      setReason('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Verification Details</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* User Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">User Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{verification.firstName} {verification.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{verification.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Type:</span>
              <span className="font-medium">{verification.user.isHost ? 'Host' : 'Guest'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date of Birth:</span>
              <span className="font-medium">
                {verification.dateOfBirth 
                  ? new Date(verification.dateOfBirth).toLocaleDateString() 
                  : 'Not provided'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nationality:</span>
              <span className="font-medium">{verification.nationality || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Document Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Document Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Document Type:</span>
              <span className="font-medium">{verification.documentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Document Number:</span>
              <span className="font-medium">{verification.documentNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Document Country:</span>
              <span className="font-medium">{verification.documentCountry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expiry Date:</span>
              <span className="font-medium">
                {verification.documentExpiry 
                  ? new Date(verification.documentExpiry).toLocaleDateString() 
                  : 'Not provided'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Address Information */}
        {verification.address && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Address Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-medium">{verification.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">City:</span>
                <span className="font-medium">{verification.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country:</span>
                <span className="font-medium">{verification.country}</span>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Documents */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Uploaded Documents</h4>
          <div className="space-y-2">
            {verification.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {doc.type.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-600">{doc.originalName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    doc.status === 'verified' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status}
                  </span>
                  <button
                    onClick={() => window.open(doc.fileUrl, '_blank')}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Status */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Verification Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(verification.status)}`}>
                {verification.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Risk Level:</span>
              <span className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(verification.riskLevel)}`}>
                {verification.riskLevel}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Submitted:</span>
              <span className="font-medium">{new Date(verification.submittedAt).toLocaleDateString()}</span>
            </div>
            {verification.reviewedAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Reviewed:</span>
                <span className="font-medium">{new Date(verification.reviewedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Review Actions */}
        {verification.status === 'pending' && (
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Review Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleActionClick('approve')}
                disabled={processing}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {processing ? 'Processing...' : 'Approve Verification'}
              </button>
              <button
                onClick={() => handleActionClick('reject')}
                disabled={processing}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                Reject Verification
              </button>
              <button
                onClick={() => handleActionClick('flag')}
                disabled={processing}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
              >
                Flag for Review
              </button>
            </div>
          </div>
        )}

        {/* Previous Review Info */}
        {verification.rejectionReason && (
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Previous Review</h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{verification.rejectionReason}</p>
            </div>
          </div>
        )}
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {action === 'reject' ? 'Rejection Reason' : 'Flag Reason'}
            </h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason..."
              className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReasonSubmit}
                disabled={!reason.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function getStatusColor(status) {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'flagged': return 'text-orange-600 bg-orange-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  }

  function getRiskLevelColor(level) {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
}