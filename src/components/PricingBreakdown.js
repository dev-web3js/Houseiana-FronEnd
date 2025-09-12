"use client";

import { useState } from 'react';
import { calculateBookingPricing, formatCurrency } from '@/lib/pricingCalculator';

export default function PricingBreakdown({ 
  listing, 
  nights = 1, 
  guests = 1,
  checkIn,
  checkOut,
  viewType = 'tenant' // 'tenant' or 'host'
}) {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate pricing
  const pricing = calculateBookingPricing({
    basePrice: listing.nightlyPrice || listing.monthlyPrice / 30,
    nights: nights,
    cleaningFee: listing.cleaningFee || 0,
    securityDeposit: listing.securityDeposit || 0,
    weeklyDiscount: nights >= 7 ? listing.weeklyDiscount : 0,
    monthlyDiscount: nights >= 28 ? listing.monthlyDiscount : 0,
    guests: guests,
    extraGuestFee: listing.extraGuestFee || 0,
    extraGuestThreshold: 2
  });

  const isTenantView = viewType === 'tenant';

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          margin: 0
        }}>
          {isTenantView ? 'Price Details' : 'Earnings Breakdown'}
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          {showDetails ? 'Hide' : 'Show'} details
        </button>
      </div>

      {/* Basic Price Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <span style={{ fontSize: '16px', color: '#374151' }}>
          {formatCurrency(pricing.basePrice)} × {nights} {nights === 1 ? 'night' : 'nights'}
        </span>
        <span style={{ fontSize: '16px', fontWeight: '500' }}>
          {formatCurrency(pricing.accommodationCost)}
        </span>
      </div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          {isTenantView ? (
            // Tenant View
            <>
              {/* Accommodation */}
              <div style={rowStyle}>
                <span>Accommodation</span>
                <span>{formatCurrency(pricing.accommodationCost)}</span>
              </div>

              {/* Discounts */}
              {pricing.discounts.amount > 0 && (
                <div style={rowStyle}>
                  <span style={{ color: '#10b981' }}>
                    {pricing.discounts.type === 'monthly' ? 'Monthly stay discount' :
                     pricing.discounts.type === 'weekly' ? 'Weekly stay discount' :
                     pricing.discounts.type === 'earlyBird' ? 'Early bird discount' :
                     'Last minute discount'} ({pricing.discounts.percentage}%)
                  </span>
                  <span style={{ color: '#10b981' }}>
                    -{formatCurrency(pricing.discounts.amount)}
                  </span>
                </div>
              )}

              {/* Cleaning Fee */}
              {pricing.cleaningFee > 0 && (
                <div style={rowStyle}>
                  <span>Cleaning fee</span>
                  <span>{formatCurrency(pricing.cleaningFee)}</span>
                </div>
              )}

              {/* Extra Guest Fee */}
              {pricing.extraGuestFee > 0 && (
                <div style={rowStyle}>
                  <span>Extra guest fee</span>
                  <span>{formatCurrency(pricing.extraGuestFee)}</span>
                </div>
              )}

              {/* Service Fee */}
              <div style={{
                ...rowStyle,
                paddingTop: '12px',
                marginTop: '12px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div>
                  <span>Service fee</span>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    This helps us run the platform and provide 24/7 support
                  </div>
                </div>
                <span>{formatCurrency(pricing.tenant.serviceFeeAmount)} (7%)</span>
              </div>

              {/* Total before deposit */}
              <div style={{
                ...rowStyle,
                paddingTop: '12px',
                marginTop: '12px',
                borderTop: '1px solid #e5e7eb',
                fontWeight: '600'
              }}>
                <span>Total (before deposit)</span>
                <span>{formatCurrency(pricing.tenant.totalBeforeDeposit)}</span>
              </div>

              {/* Security Deposit */}
              {pricing.securityDeposit > 0 && (
                <div style={{
                  ...rowStyle,
                  paddingTop: '12px'
                }}>
                  <div>
                    <span>Security deposit</span>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      Refundable after checkout
                    </div>
                  </div>
                  <span>{formatCurrency(pricing.securityDeposit)}</span>
                </div>
              )}
            </>
          ) : (
            // Host View
            <>
              {/* Accommodation */}
              <div style={rowStyle}>
                <span>Accommodation revenue</span>
                <span>{formatCurrency(pricing.accommodationCost - pricing.discounts.amount)}</span>
              </div>

              {/* Cleaning Fee */}
              {pricing.cleaningFee > 0 && (
                <div style={rowStyle}>
                  <span>Cleaning fee</span>
                  <span>{formatCurrency(pricing.cleaningFee)}</span>
                </div>
              )}

              {/* Extra Guest Fee */}
              {pricing.extraGuestFee > 0 && (
                <div style={rowStyle}>
                  <span>Extra guest revenue</span>
                  <span>{formatCurrency(pricing.extraGuestFee)}</span>
                </div>
              )}

              {/* Gross Earnings */}
              <div style={{
                ...rowStyle,
                paddingTop: '12px',
                marginTop: '12px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <span>Gross earnings</span>
                <span>{formatCurrency(pricing.host.grossEarnings)}</span>
              </div>

              {/* Platform Commission */}
              <div style={{
                ...rowStyle,
                color: '#ef4444'
              }}>
                <div>
                  <span>Houseiana service fee</span>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    8% commission for using our platform
                  </div>
                </div>
                <span>-{formatCurrency(pricing.host.commissionAmount)}</span>
              </div>

              {/* Net Earnings */}
              <div style={{
                ...rowStyle,
                paddingTop: '12px',
                marginTop: '12px',
                borderTop: '1px solid #e5e7eb',
                fontWeight: '600',
                fontSize: '18px'
              }}>
                <span>Your earnings</span>
                <span style={{ color: '#10b981' }}>
                  {formatCurrency(pricing.host.netEarnings)}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Final Total */}
      <div style={{
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '2px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: '600'
          }}>
            {isTenantView ? 'Total' : 'You will receive'}
          </div>
          {isTenantView && pricing.securityDeposit > 0 && (
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Includes {formatCurrency(pricing.securityDeposit)} refundable deposit
            </div>
          )}
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          color: isTenantView ? '#1e293b' : '#10b981'
        }}>
          {formatCurrency(
            isTenantView 
              ? pricing.tenant.totalWithDeposit 
              : pricing.host.netEarnings
          )}
        </div>
      </div>

      {/* Fee Transparency Note */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#0369a1'
      }}>
        <strong>Fee Transparency:</strong> {
          isTenantView 
            ? `You pay a 7% service fee. The host receives their amount after an 8% platform commission.`
            : `Guests pay a 7% service fee on top of your prices. You receive your earnings after an 8% platform commission.`
        }
      </div>

      {/* Platform Earnings (for admins/debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#92400e'
        }}>
          <strong>Platform Revenue:</strong> {formatCurrency(pricing.platform.total)} 
          <br />
          (Host: {formatCurrency(pricing.platform.fromHost)} + 
          Tenant: {formatCurrency(pricing.platform.fromTenant)})
        </div>
      )}
    </div>
  );
}

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px',
  fontSize: '15px',
  color: '#374151'
};