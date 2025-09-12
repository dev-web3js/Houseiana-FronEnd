"use client";

import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PhoneVerification from '@/components/PhoneVerification';
import EmailVerification from '@/components/EmailVerification';

export default function AccountSettingsPage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    messages: true,
    bookings: true,
    promotions: false,
    account: true
  });
  const [privacy, setPrivacy] = useState({
    searchEngines: true,
    activityData: false
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    iban: '',
    swiftCode: '',
    routingNumber: '',
    branchCode: '',
    bankAddress: '',
    accountType: 'savings',
    currency: 'QAR'
  });

  // Tax Information states
  const [taxInformation, setTaxInformation] = useState(null);
  const [showAddTaxModal, setShowAddTaxModal] = useState(false);
  
  // Phone Verification states
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [taxForm, setTaxForm] = useState({
    taxIdType: 'qid',
    taxId: '',
    legalName: '',
    phoneNumber: '',
    businessType: 'individual',
    taxCountry: 'QA',
    taxAddress: '',
    taxCity: '',
    taxState: '',
    taxPostalCode: '',
    subjectToBackupWith: false,
    exemptFromBackupWith: false,
    taxWithholdingRate: null,
    fatcaStatus: '',
    crsStatus: '',
    requiresReporting: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        language: user.language || 'English',
        currency: user.currency || 'QAR',
        timezone: user.timezone || 'Asia/Qatar'
      });
      
      if (user.notificationSettings) {
        setNotifications(user.notificationSettings);
      }
      
      if (user.privacySettings) {
        setPrivacy(user.privacySettings);
      }
      
      // Fetch payment methods, bank accounts, and tax information
      fetchPaymentMethods();
      fetchBankAccounts();
      fetchTaxInformation();
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/payments/methods?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  if (!loading && !user) {
    router.push('/auth/sign-in');
  }

  const handleSave = async (updateType, data) => {
    setSaving(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          updateType,
          data
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        updateUser(result.user);
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
        
        if (updateType === 'password') {
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
      } else {
        setMessage(result.error || 'Failed to save settings');
      }
    } catch (error) {
      setMessage('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePersonalInfoSave = () => {
    handleSave('personal', formData);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }
    handleSave('password', passwordData);
  };

  const handleNotificationsSave = () => {
    handleSave('notifications', notifications);
  };

  const handlePrivacySave = () => {
    handleSave('privacy', privacy);
  };

  const handlePreferencesSave = () => {
    handleSave('preferences', {
      language: formData.language,
      currency: formData.currency,
      timezone: formData.timezone
    });
  };

  // Card validation functions
  const validateCardNumber = (cardNumber) => {
    const cleanCard = cardNumber.replace(/\s/g, '');
    
    // Check if card number is 13-19 digits
    if (!/^\d{13,19}$/.test(cleanCard)) {
      return false;
    }
    
    // Luhn algorithm validation
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanCard.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanCard[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const validateExpiryDate = (month, year) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth <= currentMonth) return false;
    
    return true;
  };

  const validateCVV = (cvv, cardNumber) => {
    const cleanCard = cardNumber.replace(/\s/g, '');
    // American Express has 4-digit CVV, others have 3-digit
    const isAmex = /^3[47]/.test(cleanCard);
    const expectedLength = isAmex ? 4 : 3;
    
    return /^\d+$/.test(cvv) && cvv.length === expectedLength;
  };

  const handleAddPaymentMethod = async () => {
    if (!user) return;
    
    // Enhanced validation
    if (!paymentForm.cardNumber || !paymentForm.expiryMonth || !paymentForm.expiryYear || !paymentForm.cvv || !paymentForm.cardholderName) {
      setMessage('Please fill in all card details');
      return;
    }

    // Validate card number
    if (!validateCardNumber(paymentForm.cardNumber)) {
      setMessage('Please enter a valid card number');
      return;
    }

    // Validate expiry date
    if (!validateExpiryDate(paymentForm.expiryMonth, paymentForm.expiryYear)) {
      setMessage('Please enter a valid expiry date (card must not be expired)');
      return;
    }

    // Validate CVV
    if (!validateCVV(paymentForm.cvv, paymentForm.cardNumber)) {
      setMessage('Please enter a valid CVV (3 digits for most cards, 4 for Amex)');
      return;
    }

    // Validate cardholder name (at least 2 characters)
    if (paymentForm.cardholderName.trim().length < 2) {
      setMessage('Please enter a valid cardholder name');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/payments/methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...paymentForm
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Payment method added successfully!');
        setShowAddPaymentModal(false);
        setPaymentForm({
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cardholderName: ''
        });
        fetchPaymentMethods(); // Refresh the list
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.error || 'Failed to add payment method');
      }
    } catch (error) {
      setMessage('Failed to add payment method. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId) => {
    if (!user || !confirm('Are you sure you want to remove this payment method?')) return;

    try {
      const response = await fetch(`/api/payments/methods?id=${paymentMethodId}&userId=${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Payment method removed successfully!');
        fetchPaymentMethods(); // Refresh the list
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to remove payment method');
      }
    } catch (error) {
      setMessage('Failed to remove payment method');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    if (!user) return;

    try {
      const response = await fetch('/api/payments/methods', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId,
          userId: user.id
        })
      });

      if (response.ok) {
        setMessage('Default payment method updated!');
        fetchPaymentMethods(); // Refresh the list
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update default payment method');
      }
    } catch (error) {
      setMessage('Failed to update default payment method');
    }
  };

  const fetchBankAccounts = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/bank-accounts?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setBankAccounts(data.bankAccounts || []);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    }
  };

  // Bank account validation functions
  const validateIBAN = (iban) => {
    if (!iban) return true; // IBAN is optional
    // Remove spaces and convert to uppercase
    const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();
    
    // Basic IBAN format check (2 letters + 2 digits + up to 30 alphanumeric)
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
    if (!ibanRegex.test(cleanIBAN)) {
      return false;
    }
    
    // Qatar IBAN should start with QA and be 29 characters
    if (cleanIBAN.startsWith('QA') && cleanIBAN.length !== 29) {
      return false;
    }
    
    return true;
  };

  const validateAccountNumber = (accountNumber) => {
    if (!accountNumber) return false;
    // Account number should be at least 8 digits and only contain numbers
    const cleanAccountNumber = accountNumber.replace(/\s/g, '');
    return /^\d{8,}$/.test(cleanAccountNumber);
  };

  const validateSWIFT = (swiftCode) => {
    if (!swiftCode) return true; // SWIFT is optional
    // SWIFT code should be 8 or 11 characters, alphanumeric
    const cleanSWIFT = swiftCode.replace(/\s/g, '').toUpperCase();
    return /^[A-Z0-9]{8}$|^[A-Z0-9]{11}$/.test(cleanSWIFT);
  };

  const handleAddBankAccount = async () => {
    if (!user) return;
    
    // Basic validation
    if (!bankForm.bankName || !bankForm.accountNumber || !bankForm.accountHolderName) {
      setMessage('Please fill in Bank Name, Account Number, and Account Holder Name');
      return;
    }

    // Validate IBAN if provided
    if (bankForm.iban && !validateIBAN(bankForm.iban)) {
      setMessage('Please enter a valid IBAN format');
      return;
    }

    // Validate account number
    if (!validateAccountNumber(bankForm.accountNumber)) {
      setMessage('Account number must be at least 8 digits');
      return;
    }

    // Validate SWIFT code if provided
    if (bankForm.swiftCode && !validateSWIFT(bankForm.swiftCode)) {
      setMessage('SWIFT code must be 8 or 11 characters');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/bank-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...bankForm
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Bank account added successfully!');
        setShowAddBankModal(false);
        setBankForm({
          bankName: '',
          accountNumber: '',
          accountHolderName: '',
          iban: '',
          swiftCode: '',
          routingNumber: '',
          branchCode: '',
          bankAddress: '',
          accountType: 'savings',
          currency: 'QAR'
        });
        fetchBankAccounts(); // Refresh the list
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.error || 'Failed to add bank account');
      }
    } catch (error) {
      setMessage('Failed to add bank account. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveBankAccount = async (bankAccountId) => {
    if (!user || !confirm('Are you sure you want to remove this bank account?')) return;

    try {
      const response = await fetch(`/api/bank-accounts?id=${bankAccountId}&userId=${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Bank account removed successfully!');
        fetchBankAccounts(); // Refresh the list
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to remove bank account');
      }
    } catch (error) {
      setMessage('Failed to remove bank account');
    }
  };

  const handleSetDefaultBankAccount = async (bankAccountId) => {
    if (!user) return;

    try {
      const response = await fetch('/api/bank-accounts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bankAccountId,
          userId: user.id
        })
      });

      if (response.ok) {
        setMessage('Default bank account updated!');
        fetchBankAccounts(); // Refresh the list
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update default bank account');
      }
    } catch (error) {
      setMessage('Failed to update default bank account');
    }
  };

  // Tax Information functions
  const fetchTaxInformation = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/tax-information?userId=${user.id}`);
      const result = await response.json();
      
      if (response.ok) {
        setTaxInformation(result.taxInformation);
        if (result.taxInformation) {
          setTaxForm({
            taxIdType: result.taxInformation.taxIdType || 'qid',
            taxId: result.taxInformation.taxId || '',
            legalName: result.taxInformation.legalName || '',
            phoneNumber: result.taxInformation.phoneNumber || '',
            businessType: result.taxInformation.businessType || 'individual',
            taxCountry: result.taxInformation.taxCountry || 'QA',
            taxAddress: result.taxInformation.taxAddress || '',
            taxCity: result.taxInformation.taxCity || '',
            taxState: result.taxInformation.taxState || '',
            taxPostalCode: result.taxInformation.taxPostalCode || '',
            subjectToBackupWith: result.taxInformation.subjectToBackupWith || false,
            exemptFromBackupWith: result.taxInformation.exemptFromBackupWith || false,
            taxWithholdingRate: result.taxInformation.taxWithholdingRate || null,
            fatcaStatus: result.taxInformation.fatcaStatus || '',
            crsStatus: result.taxInformation.crsStatus || '',
            requiresReporting: result.taxInformation.requiresReporting !== undefined ? result.taxInformation.requiresReporting : true
          });
        }
      }
    } catch (error) {
      console.error('Error fetching tax information:', error);
    }
  };

  const handleAddTaxInformation = async () => {
    if (!user) return;
    
    if (!taxForm.taxId || !taxForm.legalName || !taxForm.phoneNumber || !taxForm.taxAddress || !taxForm.taxCity) {
      setMessage('Please fill in Tax ID, Legal Name, Phone Number, Address, and City');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/tax-information', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...taxForm
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Tax information saved successfully!');
        setShowAddTaxModal(false);
        fetchTaxInformation(); // Refresh the data
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.error || 'Failed to save tax information');
      }
    } catch (error) {
      setMessage('Failed to save tax information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTaxInformation = async () => {
    if (!user || !confirm('Are you sure you want to delete your tax information?')) return;

    try {
      const response = await fetch(`/api/tax-information?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Tax information deleted successfully!');
        setTaxInformation(null);
        setTaxForm({
          taxIdType: 'qid',
          taxId: '',
          legalName: '',
          phoneNumber: '',
          businessType: 'individual',
          taxCountry: 'QA',
          taxAddress: '',
          taxCity: '',
          taxState: '',
          taxPostalCode: '',
          subjectToBackupWith: false,
          exemptFromBackupWith: false,
          taxWithholdingRate: null,
          fatcaStatus: '',
          crsStatus: '',
          requiresReporting: true
        });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to delete tax information');
      }
    } catch (error) {
      setMessage('Failed to delete tax information');
    }
  };

  const settingsSections = [
    { id: 'personal', label: 'Personal info', icon: '👤' },
    { id: 'security', label: 'Login & security', icon: '🔒' },
    { id: 'payments', label: 'Payments & payouts', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy & sharing', icon: '👁️' },
    { id: 'preferences', label: 'Global preferences', icon: '🌐' },
  ];

  return (
    <MainLayout>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f7f7f7'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            marginBottom: '32px'
          }}>
            Account Settings
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '32px'
          }}>
            {/* Sidebar */}
            <div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
              }}>
                {settingsSections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: activeTab === section.id ? '#f7f7f7' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{section.icon}</span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: activeTab === section.id ? '600' : '400'
                    }}>
                      {section.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
              {activeTab === 'personal' && (
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                    Personal Information
                  </h2>
                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                        Legal name
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <input
                          type="text"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          style={{
                            padding: '12px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          style={{
                            padding: '12px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                        Email address
                      </label>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          style={{
                            flex: 1,
                            padding: '12px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                          }}
                        />
                        {formData.email && (
                          <button
                            type="button"
                            onClick={() => setShowEmailVerification(true)}
                            style={{
                              padding: '12px 16px',
                              backgroundColor: emailVerified ? '#10b981' : '#00a699',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {emailVerified ? '✓ Verified' : 'Verify'}
                          </button>
                        )}
                      </div>
                      {emailVerified && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '8px',
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          <span>✅</span>
                          <span>Email verified</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                        Phone number
                      </label>
                      <input
                        type="tel"
                        placeholder="Add phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                    Login & Security
                  </h2>
                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div style={{
                      padding: '16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px'
                    }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Password</h3>
                      <p style={{ fontSize: '14px', color: '#717171', marginBottom: '12px' }}>
                        Last updated 3 months ago
                      </p>
                      <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                        <input
                          type="password"
                          placeholder="Current password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          style={{
                            padding: '12px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                        <input
                          type="password"
                          placeholder="New password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          style={{
                            padding: '12px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          style={{
                            padding: '12px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                      <button 
                        onClick={handlePasswordChange}
                        disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                        style={{
                          padding: '8px 16px',
                          border: '1px solid #222',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          opacity: saving || !passwordData.currentPassword || !passwordData.newPassword ? 0.6 : 1
                        }}>
                        {saving ? 'Updating...' : 'Update password'}
                      </button>
                    </div>
                    <div style={{
                      padding: '16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px'
                    }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                        Two-factor authentication
                      </h3>
                      <p style={{ fontSize: '14px', color: '#717171', marginBottom: '12px' }}>
                        Add an extra layer of security to your account
                      </p>
                      <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#FF385C',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                    Notification Preferences
                  </h2>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {[
                      { label: 'Messages', desc: 'Receive messages from hosts and guests' },
                      { label: 'Booking updates', desc: 'Updates about your reservations' },
                      { label: 'Promotions', desc: 'Deals and special offers' },
                      { label: 'Account activity', desc: 'Security alerts and account changes' }
                    ].map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: index < 3 ? '1px solid #e0e0e0' : 'none'
                      }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: '14px', color: '#717171' }}>
                            {item.desc}
                          </div>
                        </div>
                        <label style={{
                          position: 'relative',
                          display: 'inline-block',
                          width: '48px',
                          height: '24px'
                        }}>
                          <input
                            type="checkbox"
                            checked={index === 0 ? notifications.messages : index === 1 ? notifications.bookings : index === 2 ? notifications.promotions : notifications.account}
                            onChange={(e) => {
                              const key = index === 0 ? 'messages' : index === 1 ? 'bookings' : index === 2 ? 'promotions' : 'account';
                              setNotifications({...notifications, [key]: e.target.checked});
                            }}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#00a699',
                            borderRadius: '24px',
                            transition: '0.4s'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '',
                              height: '18px',
                              width: '18px',
                              left: '3px',
                              bottom: '3px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              transition: '0.4s',
                              transform: 'translateX(24px)'
                            }} />
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                    Payments & Payouts
                  </h2>
                  
                  {/* Payment Methods Section */}
                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                      Payment Methods
                    </h3>
                    <p style={{ fontSize: '14px', color: '#717171', marginBottom: '20px' }}>
                      Add and manage your payment methods for bookings
                    </p>
                    
                    {/* Saved Cards */}
                    <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                      {paymentMethods.length === 0 ? (
                        <div style={{
                          padding: '32px',
                          textAlign: 'center',
                          color: '#6b7280',
                          fontSize: '14px'
                        }}>
                          No payment methods added yet. Add your first payment method below.
                        </div>
                      ) : (
                        paymentMethods.map((method) => (
                          <div key={method.id} style={{
                            padding: '16px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{
                                width: '48px',
                                height: '32px',
                                backgroundColor: method.cardType === 'Visa' ? '#1a1f71' : method.cardType === 'Mastercard' ? '#eb001b' : '#333',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 'bold'
                              }}>
                                {method.cardType === 'Visa' ? 'VISA' : method.cardType === 'Mastercard' ? 'MC' : method.cardType.substring(0, 4).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '500' }}>
                                  {method.cardType} •••• {method.last4}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                  Expires {String(method.expiryMonth).padStart(2, '0')}/{method.expiryYear}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {method.isDefault ? (
                                <div style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '500'
                                }}>
                                  Default
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleSetDefaultPaymentMethod(method.id)}
                                  style={{
                                    padding: '6px 12px',
                                    border: '1px solid #e0e0e0',
                                    backgroundColor: 'white',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                  }}>
                                  Set as default
                                </button>
                              )}
                              <button 
                                onClick={() => handleRemovePaymentMethod(method.id)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}>
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <button 
                      onClick={() => setShowAddPaymentModal(true)}
                      style={{
                        padding: '12px 24px',
                        border: '2px dashed #e0e0e0',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        color: '#374151'
                      }}>
                      <span style={{ fontSize: '20px' }}>+</span>
                      Add New Payment Method
                    </button>
                  </div>

                  {/* Payout Methods Section (for hosts) */}
                  {(user?.isHost || user?.role === 'host' || user?.role === 'both') && (
                    <div style={{ marginBottom: '40px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                        Payout Methods
                      </h3>
                      <p style={{ fontSize: '14px', color: '#717171', marginBottom: '20px' }}>
                        Choose how you want to receive your earnings
                      </p>
                      
                      {/* Bank Accounts */}
                      <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                        {bankAccounts.length === 0 ? (
                          <div style={{
                            padding: '32px',
                            textAlign: 'center',
                            color: '#6b7280',
                            fontSize: '14px'
                          }}>
                            No bank accounts added yet. Add your first bank account below.
                          </div>
                        ) : (
                          bankAccounts.map((account) => (
                            <div key={account.id} style={{
                              padding: '16px',
                              border: '1px solid #e0e0e0',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                  width: '48px',
                                  height: '48px',
                                  backgroundColor: '#f3f4f6',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '24px'
                                }}>
                                  🏦
                                </div>
                                <div>
                                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                                    {account.bankName}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                    Account ending in ••••{account.accountNumber.slice(-4)}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {account.accountHolderName} • {account.accountType}
                                  </div>
                                  {account.isDefault && (
                                    <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                                      ✓ Default payout method
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                {account.isDefault ? (
                                  <div style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                  }}>
                                    Default
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => handleSetDefaultBankAccount(account.id)}
                                    style={{
                                      padding: '6px 12px',
                                      border: '1px solid #e0e0e0',
                                      backgroundColor: 'white',
                                      borderRadius: '6px',
                                      fontSize: '12px',
                                      fontWeight: '500',
                                      cursor: 'pointer'
                                    }}>
                                    Set as default
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleRemoveBankAccount(account.id)}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#fee2e2',
                                    color: '#dc2626',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                  }}>
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <button 
                        onClick={() => setShowAddBankModal(true)}
                        style={{
                          padding: '12px 24px',
                          border: '2px dashed #e0e0e0',
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          color: '#374151'
                        }}>
                        <span style={{ fontSize: '20px' }}>+</span>
                        Add Bank Account
                      </button>
                    </div>
                  )}

                  {/* Tax Information Section (for hosts) */}
                  {(user?.isHost || user?.role === 'host' || user?.role === 'both') && (
                    <div style={{ marginBottom: '40px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                        Tax Information
                      </h3>
                      <p style={{ fontSize: '14px', color: '#717171', marginBottom: '20px' }}>
                        Provide your tax information to continue receiving payouts
                      </p>

                      {!taxInformation ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px',
                          backgroundColor: '#fef7f0',
                          border: '1px solid #fed7aa',
                          borderRadius: '12px',
                          marginBottom: '20px'
                        }}>
                          <div style={{ fontSize: '24px', marginRight: '12px' }}>⚠️</div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#ea580c' }}>
                              Tax documents required
                            </div>
                            <div style={{ fontSize: '13px', color: '#9a3412', marginTop: '4px' }}>
                              Please provide your tax information to continue receiving payouts
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px',
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '12px',
                          marginBottom: '20px'
                        }}>
                          <div style={{ fontSize: '24px', marginRight: '12px' }}>✅</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#15803d' }}>
                              Tax information submitted
                            </div>
                            <div style={{ fontSize: '13px', color: '#166534', marginTop: '4px' }}>
                              Legal Name: {taxInformation.legalName} • Tax ID: {taxInformation.taxIdType.toUpperCase()}: ****{taxInformation.taxId.slice(-4)}
                            </div>
                            <div style={{ fontSize: '13px', color: '#166534' }}>
                              Status: {taxInformation.isVerified ? '✓ Verified' : 'Pending verification'}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setShowAddTaxModal(true);
                              }}
                              style={{
                                padding: '8px 16px',
                                backgroundColor: 'white',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}>
                              Edit
                            </button>
                            <button
                              onClick={handleDeleteTaxInformation}
                              style={{
                                padding: '8px 16px',
                                backgroundColor: 'white',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: '#ef4444',
                                cursor: 'pointer'
                              }}>
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setShowAddTaxModal(true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '12px',
                          border: '2px dashed #d1d5db',
                          borderRadius: '12px',
                          backgroundColor: 'transparent',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          cursor: 'pointer'
                        }}>
                        <span style={{ fontSize: '20px' }}>📄</span>
                        {taxInformation ? 'Update Tax Info' : 'Add Tax Info'}
                      </button>
                    </div>
                  )}

                  {/* Payment History */}
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                      Payment History
                    </h3>
                    <div style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f9fafb' }}>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                              DATE
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                              DESCRIPTION
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                              TYPE
                            </th>
                            <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                              AMOUNT
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderTop: '1px solid #e0e0e0' }}>
                            <td style={{ padding: '12px', fontSize: '14px' }}>Dec 15, 2024</td>
                            <td style={{ padding: '12px', fontSize: '14px' }}>Booking - Villa in West Bay</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '4px 8px',
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                Payment
                              </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>
                              -QAR 15,000
                            </td>
                          </tr>
                          <tr style={{ borderTop: '1px solid #e0e0e0' }}>
                            <td style={{ padding: '12px', fontSize: '14px' }}>Dec 10, 2024</td>
                            <td style={{ padding: '12px', fontSize: '14px' }}>Host Payout - November Earnings</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '4px 8px',
                                backgroundColor: '#dcfce7',
                                color: '#16a34a',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                Payout
                              </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>
                              +QAR 25,500
                            </td>
                          </tr>
                          <tr style={{ borderTop: '1px solid #e0e0e0' }}>
                            <td style={{ padding: '12px', fontSize: '14px' }}>Nov 28, 2024</td>
                            <td style={{ padding: '12px', fontSize: '14px' }}>Booking - Apartment in Pearl</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '4px 8px',
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                Payment
                              </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>
                              -QAR 8,000
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div style={{
                        padding: '12px',
                        backgroundColor: '#f9fafb',
                        textAlign: 'center'
                      }}>
                        <button style={{
                          color: '#2563eb',
                          fontSize: '14px',
                          fontWeight: '500',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}>
                          View All Transactions →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tax Information */}
                  {(user?.isHost || user?.role === 'host' || user?.role === 'both') && (
                    <div style={{ marginTop: '40px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                        Tax Information
                      </h3>
                      <div style={{
                        padding: '16px',
                        backgroundColor: '#fef3c7',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}>
                        <span style={{ fontSize: '20px' }}>⚠️</span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            Tax documents required
                          </div>
                          <div style={{ fontSize: '13px', color: '#92400e', marginBottom: '12px' }}>
                            Please provide your tax information to continue receiving payouts
                          </div>
                          <button style={{
                            padding: '8px 16px',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}>
                            Add Tax Info
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                    Privacy & Sharing
                  </h2>
                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                        Data Sharing
                      </h3>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={privacy.searchEngines}
                            onChange={(e) => setPrivacy({...privacy, searchEngines: e.target.checked})}
                            style={{ marginTop: '2px' }} 
                          />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>
                              Include my profile in search engines
                            </div>
                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                              Allow search engines like Google to show your profile in search results
                            </div>
                          </div>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={privacy.activityData}
                            onChange={(e) => setPrivacy({...privacy, activityData: e.target.checked})}
                            style={{ marginTop: '2px' }} 
                          />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>
                              Share activity data for personalization
                            </div>
                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                              Help us personalize your experience based on your activity
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                    Global Preferences
                  </h2>
                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                        Preferred Language
                      </label>
                      <select 
                        value={formData.language}
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}>
                        <option value="English">English</option>
                        <option value="Arabic">Arabic</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                        Preferred Currency
                      </label>
                      <select 
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}>
                        <option value="QAR">QAR - Qatari Riyal</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                        Time Zone
                      </label>
                      <select 
                        value={formData.timezone}
                        onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}>
                        <option value="Asia/Qatar">Asia/Qatar (GMT+3)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                        <option value="Europe/London">Europe/London (GMT+0)</option>
                        <option value="America/New_York">America/New_York (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Display */}
              {message && (
                <div style={{
                  marginTop: '20px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: message.includes('success') ? '#dcfce7' : '#fee2e2',
                  color: message.includes('success') ? '#16a34a' : '#dc2626',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {message}
                </div>
              )}

              {/* Context-aware Save button */}
              <div style={{
                marginTop: '32px',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button 
                  onClick={() => {
                    if (activeTab === 'personal') handlePersonalInfoSave();
                    else if (activeTab === 'notifications') handleNotificationsSave();
                    else if (activeTab === 'privacy') handlePrivacySave();
                    else if (activeTab === 'preferences') handlePreferencesSave();
                  }}
                  disabled={saving}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: saving ? '#9ca3af' : '#FF385C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}>
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
                Add Payment Method
              </h2>
              <button
                onClick={() => {
                  setShowAddPaymentModal(false);
                  setPaymentForm({
                    cardNumber: '',
                    expiryMonth: '',
                    expiryYear: '',
                    cvv: '',
                    cardholderName: ''
                  });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="Full name as shown on card"
                  value={paymentForm.cardholderName}
                  onChange={(e) => setPaymentForm({...paymentForm, cardholderName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentForm.cardNumber}
                  onChange={(e) => {
                    // Format card number with spaces
                    const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                    if (value.replace(/\s/g, '').length <= 16) {
                      setPaymentForm({...paymentForm, cardNumber: value});
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Expiry Month
                  </label>
                  <select
                    value={paymentForm.expiryMonth}
                    onChange={(e) => setPaymentForm({...paymentForm, expiryMonth: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">MM</option>
                    {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {String(month).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Expiry Year
                  </label>
                  <select
                    value={paymentForm.expiryYear}
                    onChange={(e) => setPaymentForm({...paymentForm, expiryYear: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">YYYY</option>
                    {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={paymentForm.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        setPaymentForm({...paymentForm, cvv: value});
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px'
              }}>
                <button
                  onClick={() => {
                    setShowAddPaymentModal(false);
                    setPaymentForm({
                      cardNumber: '',
                      expiryMonth: '',
                      expiryYear: '',
                      cvv: '',
                      cardholderName: ''
                    });
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    border: '1px solid #e0e0e0',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPaymentMethod}
                  disabled={saving || !paymentForm.cardNumber || !paymentForm.expiryMonth || !paymentForm.expiryYear || !paymentForm.cvv || !paymentForm.cardholderName}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: saving || !paymentForm.cardNumber || !paymentForm.expiryMonth || !paymentForm.expiryYear || !paymentForm.cvv || !paymentForm.cardholderName ? '#9ca3af' : '#FF385C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving || !paymentForm.cardNumber || !paymentForm.expiryMonth || !paymentForm.expiryYear || !paymentForm.cvv || !paymentForm.cardholderName ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Adding...' : 'Add Payment Method'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      {showAddBankModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
                Add Bank Account
              </h2>
              <button
                onClick={() => {
                  setShowAddBankModal(false);
                  setBankForm({
                    bankName: '',
                    accountNumber: '',
                    accountHolderName: '',
                    iban: '',
                    swiftCode: '',
                    routingNumber: '',
                    branchCode: '',
                    bankAddress: '',
                    accountType: 'savings',
                    currency: 'QAR'
                  });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Bank Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Qatar National Bank"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  placeholder="Full name as on bank account"
                  value={bankForm.accountHolderName}
                  onChange={(e) => setBankForm({...bankForm, accountHolderName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Account Number *
                </label>
                <input
                  type="text"
                  placeholder="Account number"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Account Type
                  </label>
                  <select
                    value={bankForm.accountType}
                    onChange={(e) => setBankForm({...bankForm, accountType: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="savings">Savings</option>
                    <option value="checking">Checking</option>
                    <option value="current">Current</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Currency
                  </label>
                  <select
                    value={bankForm.currency}
                    onChange={(e) => setBankForm({...bankForm, currency: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="QAR">QAR - Qatari Riyal</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  IBAN (International Bank Account Number)
                </label>
                <input
                  type="text"
                  placeholder="e.g., QA58DOHB00001234567890ABCDEFG"
                  value={bankForm.iban}
                  onChange={(e) => setBankForm({...bankForm, iban: e.target.value.toUpperCase()})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    SWIFT/BIC Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., QNBAQAQA"
                    value={bankForm.swiftCode}
                    onChange={(e) => setBankForm({...bankForm, swiftCode: e.target.value.toUpperCase()})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Branch Code
                  </label>
                  <input
                    type="text"
                    placeholder="Branch code"
                    value={bankForm.branchCode}
                    onChange={(e) => setBankForm({...bankForm, branchCode: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Bank Address
                </label>
                <textarea
                  placeholder="Bank's full address"
                  value={bankForm.bankAddress}
                  onChange={(e) => setBankForm({...bankForm, bankAddress: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px'
              }}>
                <button
                  onClick={() => {
                    setShowAddBankModal(false);
                    setBankForm({
                      bankName: '',
                      accountNumber: '',
                      accountHolderName: '',
                      iban: '',
                      swiftCode: '',
                      routingNumber: '',
                      branchCode: '',
                      bankAddress: '',
                      accountType: 'savings',
                      currency: 'QAR'
                    });
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    border: '1px solid #e0e0e0',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBankAccount}
                  disabled={saving || !bankForm.bankName || !bankForm.accountNumber || !bankForm.accountHolderName}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: saving || !bankForm.bankName || !bankForm.accountNumber || !bankForm.accountHolderName ? '#9ca3af' : '#FF385C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving || !bankForm.bankName || !bankForm.accountNumber || !bankForm.accountHolderName ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Adding...' : 'Add Bank Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Tax Information Modal */}
      {showAddTaxModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
                {taxInformation ? 'Update Tax Information' : 'Add Tax Information'}
              </h2>
              <button
                onClick={() => {
                  setShowAddTaxModal(false);
                  if (!taxInformation) {
                    setTaxForm({
                      taxIdType: 'qid',
                      taxId: '',
                      legalName: '',
                      phoneNumber: '',
                      businessType: 'individual',
                      taxCountry: 'QA',
                      taxAddress: '',
                      taxCity: '',
                      taxState: '',
                      taxPostalCode: '',
                      subjectToBackupWith: false,
                      exemptFromBackupWith: false,
                      taxWithholdingRate: null,
                      fatcaStatus: '',
                      crsStatus: '',
                      requiresReporting: true
                    });
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Tax ID Type *
                  </label>
                  <select
                    value={taxForm.taxIdType}
                    onChange={(e) => setTaxForm({...taxForm, taxIdType: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="qid">Qatar ID</option>
                    <option value="ssn">Social Security Number (US)</option>
                    <option value="ein">Employer ID Number (US)</option>
                    <option value="cr">Commercial Registration</option>
                    <option value="vat">VAT Number</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Tax ID Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your tax ID number"
                    value={taxForm.taxId}
                    onChange={(e) => setTaxForm({...taxForm, taxId: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Legal Name *
                </label>
                <input
                  type="text"
                  placeholder="Full legal name or business name"
                  value={taxForm.legalName}
                  onChange={(e) => setTaxForm({...taxForm, legalName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Phone Number *
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={taxForm.phoneNumber}
                    onChange={(e) => setTaxForm({...taxForm, phoneNumber: e.target.value})}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  {taxForm.phoneNumber && (
                    <button
                      type="button"
                      onClick={() => setShowPhoneVerification(true)}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: phoneVerified ? '#10b981' : '#00a699',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {phoneVerified ? '✓ Verified' : 'Verify'}
                    </button>
                  )}
                </div>
                {phoneVerified && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#dcfce7',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>✅</span>
                    Phone number verified successfully
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Business Type
                  </label>
                  <select
                    value={taxForm.businessType}
                    onChange={(e) => setTaxForm({...taxForm, businessType: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="individual">Individual</option>
                    <option value="sole_proprietorship">Sole Proprietorship</option>
                    <option value="llc">LLC</option>
                    <option value="corporation">Corporation</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Country *
                  </label>
                  <select
                    value={taxForm.taxCountry}
                    onChange={(e) => setTaxForm({...taxForm, taxCountry: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="QA">Qatar</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="KW">Kuwait</option>
                    <option value="BH">Bahrain</option>
                    <option value="OM">Oman</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                    <option value="CH">Switzerland</option>
                    <option value="AT">Austria</option>
                    <option value="SE">Sweden</option>
                    <option value="NO">Norway</option>
                    <option value="DK">Denmark</option>
                    <option value="FI">Finland</option>
                    <option value="AU">Australia</option>
                    <option value="NZ">New Zealand</option>
                    <option value="JP">Japan</option>
                    <option value="KR">South Korea</option>
                    <option value="CN">China</option>
                    <option value="IN">India</option>
                    <option value="SG">Singapore</option>
                    <option value="HK">Hong Kong</option>
                    <option value="TH">Thailand</option>
                    <option value="MY">Malaysia</option>
                    <option value="ID">Indonesia</option>
                    <option value="PH">Philippines</option>
                    <option value="VN">Vietnam</option>
                    <option value="BD">Bangladesh</option>
                    <option value="PK">Pakistan</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="EG">Egypt</option>
                    <option value="MA">Morocco</option>
                    <option value="NG">Nigeria</option>
                    <option value="KE">Kenya</option>
                    <option value="ZA">South Africa</option>
                    <option value="BR">Brazil</option>
                    <option value="AR">Argentina</option>
                    <option value="MX">Mexico</option>
                    <option value="CL">Chile</option>
                    <option value="CO">Colombia</option>
                    <option value="PE">Peru</option>
                    <option value="TR">Turkey</option>
                    <option value="RU">Russia</option>
                    <option value="UA">Ukraine</option>
                    <option value="PL">Poland</option>
                    <option value="CZ">Czech Republic</option>
                    <option value="HU">Hungary</option>
                    <option value="RO">Romania</option>
                    <option value="BG">Bulgaria</option>
                    <option value="HR">Croatia</option>
                    <option value="SI">Slovenia</option>
                    <option value="SK">Slovakia</option>
                    <option value="EE">Estonia</option>
                    <option value="LV">Latvia</option>
                    <option value="LT">Lithuania</option>
                    <option value="IL">Israel</option>
                    <option value="JO">Jordan</option>
                    <option value="LB">Lebanon</option>
                    <option value="IQ">Iraq</option>
                    <option value="IR">Iran</option>
                    <option value="AF">Afghanistan</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Address *
                </label>
                <input
                  type="text"
                  placeholder="Full address"
                  value={taxForm.taxAddress}
                  onChange={(e) => setTaxForm({...taxForm, taxAddress: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    value={taxForm.taxCity}
                    onChange={(e) => setTaxForm({...taxForm, taxCity: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    State/Province
                  </label>
                  <input
                    type="text"
                    placeholder="State/Province"
                    value={taxForm.taxState}
                    onChange={(e) => setTaxForm({...taxForm, taxState: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={taxForm.taxPostalCode}
                    onChange={(e) => setTaxForm({...taxForm, taxPostalCode: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    FATCA Status
                  </label>
                  <select
                    value={taxForm.fatcaStatus}
                    onChange={(e) => setTaxForm({...taxForm, fatcaStatus: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select status</option>
                    <option value="exempt">Exempt</option>
                    <option value="compliant">Compliant</option>
                    <option value="non_compliant">Non-Compliant</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Withholding Rate (%)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 30"
                    value={taxForm.taxWithholdingRate || ''}
                    onChange={(e) => setTaxForm({...taxForm, taxWithholdingRate: e.target.value ? parseFloat(e.target.value) : null})}
                    min="0"
                    max="100"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={taxForm.subjectToBackupWith}
                    onChange={(e) => setTaxForm({...taxForm, subjectToBackupWith: e.target.checked})}
                  />
                  <span style={{ fontSize: '14px' }}>Subject to backup withholding</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={taxForm.exemptFromBackupWith}
                    onChange={(e) => setTaxForm({...taxForm, exemptFromBackupWith: e.target.checked})}
                  />
                  <span style={{ fontSize: '14px' }}>Exempt from backup withholding</span>
                </label>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px'
              }}>
                <button
                  onClick={() => {
                    setShowAddTaxModal(false);
                    if (!taxInformation) {
                      setTaxForm({
                        taxIdType: 'qid',
                        taxId: '',
                        legalName: '',
                        phoneNumber: '',
                        businessType: 'individual',
                        taxCountry: 'QA',
                        taxAddress: '',
                        taxCity: '',
                        taxState: '',
                        taxPostalCode: '',
                        subjectToBackupWith: false,
                        exemptFromBackupWith: false,
                        taxWithholdingRate: null,
                        fatcaStatus: '',
                        crsStatus: '',
                        requiresReporting: true
                      });
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    border: '1px solid #e0e0e0',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTaxInformation}
                  disabled={saving || !taxForm.taxId || !taxForm.legalName || !taxForm.phoneNumber || !phoneVerified || !taxForm.taxAddress || !taxForm.taxCity}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: saving || !taxForm.taxId || !taxForm.legalName || !taxForm.phoneNumber || !phoneVerified || !taxForm.taxAddress || !taxForm.taxCity ? '#9ca3af' : '#FF385C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving || !taxForm.taxId || !taxForm.legalName || !taxForm.phoneNumber || !phoneVerified || !taxForm.taxAddress || !taxForm.taxCity ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Saving...' : (taxInformation ? 'Update Tax Info' : 'Save Tax Info')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phone Verification Modal */}
      {showPhoneVerification && (
        <PhoneVerification
          phoneNumber={taxForm.phoneNumber}
          userId={user?.id}
          onVerificationComplete={(success) => {
            if (success) {
              setPhoneVerified(true);
              setShowPhoneVerification(false);
              setMessage('Phone number verified successfully!');
              setTimeout(() => setMessage(''), 3000);
            }
          }}
          onCancel={() => setShowPhoneVerification(false)}
        />
      )}

      {showEmailVerification && (
        <EmailVerification
          email={formData.email}
          userId={user?.id}
          type="verification"
          onVerificationComplete={(success) => {
            if (success) {
              setEmailVerified(true);
              setShowEmailVerification(false);
              setMessage('Email address verified successfully!');
              setTimeout(() => setMessage(''), 3000);
            }
          }}
          onCancel={() => setShowEmailVerification(false)}
        />
      )}
    </MainLayout>
  );
}