# Houseiana Mobile App Development Guide

## 📱 Complete Platform Documentation for Mobile Development

### Project Overview
Houseiana is a world-class luxury property rental platform (global Airbnb alternative) with comprehensive booking, host management, and guest services. Starting with strong presence in the Middle East and expanding globally, this guide provides all necessary information to develop an equivalent mobile app.

---

## 🏗️ System Architecture

### Technology Stack
- **Frontend Web**: Next.js 15, React, Tailwind CSS
- **Backend**: NestJS (Node.js), TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Session-based
- **File Storage**: AWS S3 (for documents/photos)
- **Payments**: Multiple payment gateways
- **Real-time**: WebSockets for messaging
- **Theme**: Cosmic Orange (#FF6B35) luxury design

### Recommended Mobile Stack
- **React Native** or **Flutter** for cross-platform
- **Redux/Zustand** for state management
- **React Navigation** for routing
- **AsyncStorage** for local data
- **WebSocket** client for real-time features
- **Image picker** for photo uploads
- **Maps integration** (Google Maps)
- **Payment SDKs** (Stripe, PayPal, local gateways)
- **Push notifications** (Firebase/OneSignal)

---

## 📊 Database Schema & Models

### Core Models (Prisma Schema)

#### 1. User Model
```typescript
User {
  // Basic Info
  id: String (unique)
  email: String (unique)
  passwordHash: String
  firstName?: String
  lastName?: String
  username?: String (unique)
  phone?: String
  profileImage?: String
  coverImage?: String
  
  // Role & Status
  role: UserRole (guest|host|both|admin)
  isHost: Boolean
  isAdmin: Boolean
  hostVerified: VerificationStatus
  hostSince?: DateTime
  
  // Host Metrics
  responseRate?: Float
  responseTime?: Int (minutes)
  totalEarnings?: Decimal
  
  // Verification
  emailVerified: Boolean
  phoneVerified: Boolean
  idVerifiedAt?: DateTime
  governmentId?: String
  governmentIdType?: String
  
  // Banking
  bankName?: String
  accountNumber?: String
  iban?: String
  swiftCode?: String
  bankVerifiedAt?: DateTime
  
  // Preferences
  language: String (default: "en") // Multi-language support
  currency: String (default: "USD") // Global currency default
  timezone: String (default: "UTC") // User's local timezone
  emailNotifications: Boolean
  smsNotifications: Boolean
  pushNotifications: Boolean
  
  // Security
  twoFactorEnabled: Boolean
  twoFactorSecret?: String
  lastLoginAt?: DateTime
  
  // Relationships
  listings: Listing[]
  bookings: Booking[] (as guest)
  hostBookings: Booking[] (as host)
  favorites: FavoriteListing[]
  messages: Message[]
  reviews: Review[]
  notifications: Notification[]
  sessions: Session[]
}
```

#### 2. Listing Model
```typescript
Listing {
  // Basic Info
  id: String (unique)
  hostId: String
  title: String
  description: String
  slug?: String (unique)
  status: ListingStatus
  
  // Property Details
  propertyType: PropertyType
  country: String // Global property locations
  city: String
  area?: String
  district?: String
  coordinates: Json (lat, lng)
  
  // Capacity
  bedrooms: Int
  bathrooms: Decimal
  beds: Int
  maxGuests: Int
  maxAdults: Int
  maxChildren: Int
  squareMeters?: Int
  
  // Features & Amenities
  inUnitFeatures: Json[]
  buildingFacilities: Json[]
  compoundAmenities: Json[]
  nearbyServices: Json[]
  safetyFeatures: Json[]
  accessibilityFeatures: Json[]
  
  // Pricing
  nightlyPrice?: Decimal
  weeklyPrice?: Decimal
  monthlyPrice: Decimal
  cleaningFee?: Decimal (default: 200 QAR)
  securityDeposit?: Decimal (default: 1000 QAR)
  extraGuestFee?: Decimal
  currency: CurrencyCode (default: USD) // Global currency support
  
  // Booking Rules
  minNights: Int (default: 28)
  maxNights?: Int (default: 365)
  checkInTime: String (default: "15:00")
  checkOutTime: String (default: "11:00")
  instantBook: Boolean
  cancellationPolicy: String (default: "moderate")
  
  // Media
  photos: Json[] (array of photo URLs)
  virtualTourUrl?: String
  videoUrl?: String
  
  // Status & Metrics
  isActive: Boolean
  isVerified: Boolean
  tier: Tier (standard|gold|premium)
  averageRating?: Float
  reviewCount: Int
  viewCount: Int
  bookingCount: Int
  
  // Relationships
  host: User
  bookings: Booking[]
  reviews: Review[]
  favorites: FavoriteListing[]
}
```

#### 3. Booking Model
```typescript
Booking {
  // Booking Info
  id: String (unique)
  bookingCode: String (unique)
  listingId: String
  guestId: String
  hostId?: String
  
  // Dates & Guests
  checkIn: DateTime
  checkOut: DateTime
  totalNights: Int
  adults: Int
  children: Int (default: 0)
  infants: Int (default: 0)
  
  // Pricing
  nightlyRate: Decimal
  subtotal: Decimal
  cleaningFee: Decimal
  serviceFee: Decimal
  taxes: Decimal
  discount: Decimal
  totalPrice: Decimal
  securityDeposit?: Decimal
  
  // Payment
  paymentStatus: PaymentStatus
  paymentMethod?: String
  paymentId?: String
  paidAt?: DateTime
  
  // Status
  status: BookingStatus
  confirmedAt?: DateTime
  cancelledAt?: DateTime
  cancelReason?: String
  
  // Guest Info
  guestMessage?: String
  specialRequests?: String
  guestPhone?: String
  guestEmail?: String
  
  // Check-in/out
  actualCheckIn?: DateTime
  actualCheckOut?: DateTime
  
  // Relationships
  guest: User
  host?: User
  listing: Listing
  review?: Review
  payment?: Payment
  invoice?: Invoice
}
```

---

## 🚀 User Journeys & App Flow

### 📱 Guest Journey

#### 1. **Onboarding & Registration**
**Pages Required:**
- Splash Screen
- Welcome/Intro Screens
- Sign Up Form
- Email Verification
- Profile Setup

**Flow:**
1. **Splash Screen** → App logo with Cosmic Orange theme
2. **Welcome Screens** → 3-4 intro slides showcasing key features
3. **Auth Choice** → Sign up with email, Google, Apple ID
4. **Sign Up Form:**
   - Email address
   - Password (min 8 chars, special chars)
   - First & Last Name
   - Phone number
   - Agree to Terms & Privacy Policy
5. **Email Verification** → 6-digit code sent to email
6. **Profile Setup:**
   - Profile photo (optional)
   - Preferred language (Arabic/English)
   - Currency preference (QAR/USD/EUR)
   - Location access permission

#### 2. **Property Discovery**
**Pages Required:**
- Home/Dashboard
- Search Results
- Map View
- Filters
- Property Details

**Flow:**
1. **Home Screen:**
   - Search bar (location, dates, guests)
   - Featured properties carousel
   - Categories (Villa, Apartment, Studio, etc.)
   - "Nearby Properties"
   - User's recent searches
   
2. **Search Results:**
   - List view with property cards
   - Map toggle button
   - Filter button (price, type, amenities)
   - Sort options (price, rating, distance)
   
3. **Property Details:**
   - Photo gallery (swipeable, zoom)
   - Title, rating, location
   - Host info with profile picture
   - Amenities grid with icons
   - Description (expandable)
   - Location map
   - Reviews section
   - Pricing breakdown
   - "Book Now" CTA button
   - Save/Heart button
   - Share button
   - "Contact Host" button

#### 3. **Booking Process**
**Pages Required:**
- Date Selection
- Guest Count
- Booking Summary
- Payment Method
- Payment Processing
- Booking Confirmation

**Flow:**
1. **Date Selection:**
   - Calendar widget
   - Availability display
   - Dynamic pricing per date
   - Minimum nights validation
   
2. **Guest Details:**
   - Adults/Children/Infants counters
   - Special requests text field
   - Arrival time selection
   
3. **Booking Summary:**
   - Property thumbnail
   - Dates and guest count
   - Pricing breakdown:
     - Nightly rate × nights
     - Cleaning fee
     - Service fee
     - Taxes
     - Security deposit
     - Total amount
   
4. **Payment:**
   - Payment method selection (Card, PayPal, etc.)
   - Add new card form
   - Billing address
   - CVV confirmation
   
5. **Confirmation:**
   - Booking code
   - Host contact info
   - Check-in instructions
   - Add to calendar button
   - Download receipt

#### 4. **Trip Management**
**Pages Required:**
- My Trips
- Trip Details
- Messages with Host
- Reviews

**Flow:**
1. **My Trips Screen:**
   - Upcoming trips
   - Past trips
   - Cancelled trips
   - Filter/search functionality
   
2. **Trip Details:**
   - Property info
   - Booking details
   - Host contact
   - Directions/GPS
   - House rules
   - Check-in instructions
   - Support contact
   - Cancel booking (if allowed)
   - Modify booking (if allowed)

### 🏠 Host Journey

#### 1. **Become a Host**
**Pages Required:**
- Host Onboarding
- Property Setup Wizard
- Photo Upload
- Pricing Setup
- Verification Process

**Flow:**
1. **Host Registration:**
   - Switch to host mode
   - Host requirements checklist
   - Legal compliance info
   - Tax information
   
2. **Property Setup (7-step wizard):**
   
   **Step 1: Property Type & Location**
   - Property type selection
   - Address entry with autocomplete
   - GPS coordinates
   - Area/district selection
   
   **Step 2: Property Details**
   - Bedrooms, bathrooms, beds
   - Square meters
   - Floor number
   - Maximum guests (adults/children)
   
   **Step 3: Amenities & Features**
   - In-unit features checklist
   - Building facilities
   - Compound amenities
   - Safety features
   - Accessibility features
   
   **Step 4: Photos**
   - Upload minimum 5 photos
   - Photo guidelines
   - Drag to reorder
   - Delete/replace photos
   
   **Step 5: Title & Description**
   - Compelling title (max 50 chars)
   - Detailed description
   - House rules
   - Neighborhood info
   
   **Step 6: Booking Settings**
   - Instant book toggle
   - Check-in/out times
   - Minimum/maximum nights
   - Advance notice
   - Cancellation policy
   
   **Step 7: Pricing**
   - Nightly/weekly/monthly rates
   - Cleaning fee
   - Security deposit
   - Extra guest fee
   - Currency selection

#### 2. **Host Dashboard**
**Pages Required:**
- Dashboard Overview
- Earnings
- Reservations/Calendar
- Listings Management
- Messages
- Reviews

**Flow:**
1. **Dashboard:**
   - Earnings this month
   - Upcoming reservations
   - Property performance metrics
   - Tasks/notifications
   - Quick actions (update calendar, respond to messages)
   
2. **Reservations:**
   - Calendar view
   - Booking requests (pending approval)
   - Confirmed bookings
   - Check-ins today
   - Check-outs today
   - Booking details with guest info

#### 3. **Property Management**
**Pages Required:**
- Listings List
- Edit Listing
- Calendar Management
- Pricing Tools
- Performance Analytics

**Flow:**
1. **Manage Listings:**
   - All properties list
   - Status indicators (Active/Inactive/Draft)
   - Quick actions (edit, pause, duplicate)
   - Performance metrics per property
   
2. **Calendar Management:**
   - Availability calendar
   - Block dates
   - Set custom pricing
   - Import from other platforms
   
3. **Pricing Tools:**
   - Dynamic pricing suggestions
   - Seasonal rates
   - Weekend multipliers
   - Last-minute discounts

---

## 🔐 Authentication & Verification System

### Authentication Pages & Flow

#### 1. **Login Pages**
```typescript
// Login Screen
interface LoginScreen {
  fields: {
    email: string;        // Email validation
    password: string;     // Min 8 chars, show/hide toggle
    rememberMe: boolean;  // Keep logged in
  }
  actions: {
    login: () => void;
    forgotPassword: () => void;
    signUp: () => void;
    socialLogin: {
      google: () => void;
      apple: () => void;
      facebook?: () => void;
    }
  }
  validation: {
    email: 'Valid email format required';
    password: 'Password is required';
    networkError: 'Check internet connection';
    invalidCredentials: 'Email or password incorrect';
  }
}
```

#### 2. **Registration Flow**
**Step 1: Basic Info**
- First Name (required)
- Last Name (required)  
- Email (required, unique validation)
- Password (8+ chars, strength meter)
- Confirm Password (must match)
- Phone Number (with country code)
- Date of Birth (18+ validation)

**Step 2: Account Type**
- I want to rent properties (Guest)
- I want to list my property (Host)
- Both (Guest + Host)

**Step 3: Verification**
- Email verification (6-digit code)
- Phone verification (SMS code)
- Optional: Upload profile photo

#### 3. **Password Recovery**
```typescript
interface PasswordResetFlow {
  step1: {
    email: string;
    action: 'Send reset link';
  }
  step2: {
    token: string; // From email link
    newPassword: string;
    confirmPassword: string;
    action: 'Reset password';
  }
}
```

### Verification Requirements

#### 4. **Identity Verification (KYC)**
**Required for Hosts:**
```typescript
interface KYCVerification {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    nationality: string;
    address: string;
    city: string;
    country: string;
  }
  documents: {
    idType: 'passport' | 'national_id' | 'drivers_license';
    idNumber: string;
    idExpiry: Date;
    idFrontPhoto: File; // Camera/gallery
    idBackPhoto: File;  // For national ID
    selfieWithId: File; // Holding ID document
  }
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
}
```

**Document Upload Requirements:**
- High resolution (min 1200x800)
- Clear, non-blurry images
- All text must be readable
- No reflections or shadows
- ID must be within frame borders

#### 5. **Phone Verification**
```typescript
interface PhoneVerification {
  step1: {
    phoneNumber: string; // +974 format for Qatar
    method: 'sms' | 'whatsapp';
    action: 'Send verification code';
  }
  step2: {
    code: string; // 6-digit code
    expiresIn: number; // 5 minutes
    resendAvailable: boolean;
    attempts: number; // Max 3 attempts
  }
}
```

---

## 💰 Payment & Financial System

### Payment Methods
```typescript
interface PaymentMethods {
  cards: {
    visa: boolean;
    mastercard: boolean;
    amex: boolean;
    localCards: boolean; // Qatar local banks
  }
  digitalWallets: {
    paypal: boolean;
    googlePay: boolean;
    applePay: boolean;
    samsungPay: boolean;
  }
  bankTransfer: {
    qatariBanks: boolean;
    international: boolean;
    iban: boolean;
  }
  cryptocurrency?: {
    bitcoin: boolean;
    ethereum: boolean;
  }
}
```

### Pricing Structure
```typescript
interface PricingBreakdown {
  accommodation: {
    nightlyRate: number;
    nights: number;
    subtotal: number;
  }
  fees: {
    cleaningFee: number;      // Default varies by region
    serviceFee: number;       // ~3-5% of subtotal
    processingFee: number;    // Payment processing
  }
  taxes: {
    vatRate: number;          // Local VAT/tax rates
    municipalityTax: number;  // Local/city taxes
    touristTax?: number;      // Tourism taxes where applicable
  }
  deposit: {
    securityDeposit: number;  // Default varies by region/property
    refundable: boolean;
    refundDays: number;       // 7-14 days after checkout
  }
  total: number;
  currency: 'USD' | 'EUR' | 'QAR' | 'GBP' | 'AUD' | 'CAD' // Global currencies;
}
```

### Host Payouts
```typescript
interface HostPayout {
  earnings: {
    grossEarnings: number;
    platformFee: number;      // ~3-5% commission
    netEarnings: number;
  }
  schedule: {
    payoutDate: Date;         // 24-48 hours after guest check-in
    method: 'bank_transfer' | 'paypal' | 'card';
    minimumAmount: number;    // Minimum varies by region
  }
  taxInfo: {
    requiresW9: boolean;      // US hosts
    requiresW8: boolean;      // Non-US hosts
    vatRegistration?: string; // EU/Regional VAT registration
  }
}
```

---

## 📱 Mobile-Specific Features

### 1. **Location Services**
```typescript
interface LocationFeatures {
  permissions: {
    whenInUse: boolean;       // For search and discovery
    always?: boolean;         // For check-in notifications
  }
  features: {
    nearbyProperties: boolean;
    gpsCheckIn: boolean;      // Verify guest location at check-in
    directions: boolean;      // Navigate to property
    locationSearch: boolean;  // Search by current location
  }
}
```

### 2. **Camera & Media**
```typescript
interface CameraFeatures {
  permissions: {
    camera: boolean;
    photoLibrary: boolean;
    microphone?: boolean;     // For video messages
  }
  features: {
    propertyPhotos: {
      maxPhotos: 20;
      minPhotos: 5;
      maxFileSize: '10MB';
      formats: ['jpg', 'png', 'heic'];
      resolution: 'min-1200x800';
    }
    idDocuments: {
      ocrScanning: boolean;   // Auto-extract ID info
      qualityCheck: boolean;  // Blur detection
      guidanceOverlay: boolean; // Frame guides
    }
    profilePhoto: {
      cropping: boolean;
      filters: boolean;
    }
  }
}
```

### 3. **Push Notifications**
```typescript
interface NotificationTypes {
  booking: {
    newBookingRequest: boolean;
    bookingConfirmed: boolean;
    checkInReminder: boolean;   // 24h before
    checkOutReminder: boolean;  // On checkout day
    paymentSuccessful: boolean;
    paymentFailed: boolean;
  }
  messaging: {
    newMessage: boolean;
    hostResponse: boolean;
    urgentMessage: boolean;
  }
  host: {
    newReview: boolean;
    payoutProcessed: boolean;
    listingViews: boolean;      // Daily/weekly summary
    priceRecommendations: boolean;
  }
  marketing: {
    specialOffers: boolean;
    travelInspiration: boolean;
    hostTips: boolean;
  }
  settings: {
    doNotDisturb: {
      enabled: boolean;
      startTime: string;        // "22:00"
      endTime: string;          // "08:00"
    }
    frequency: 'immediate' | 'hourly' | 'daily';
  }
}
```

### 4. **Offline Capabilities**
```typescript
interface OfflineFeatures {
  caching: {
    recentSearches: boolean;
    favoriteProperties: boolean;
    upcomingBookings: boolean;
    messages: boolean;         // Last 50 messages
    userProfile: boolean;
  }
  syncOnReconnect: {
    draftMessages: boolean;
    favoriteChanges: boolean;
    profileUpdates: boolean;
  }
}
```

---

## 🔔 Real-time Features

### 1. **Messaging System**
```typescript
interface MessagingFeatures {
  conversation: {
    participantTypes: 'guest-host' | 'admin-user';
    contextTypes: 'booking' | 'listing-inquiry' | 'support';
    messageTypes: 'text' | 'photo' | 'document' | 'location';
  }
  features: {
    readReceipts: boolean;
    typingIndicators: boolean;
    messageStatus: 'sent' | 'delivered' | 'read';
    fileSharing: boolean;
    maxFileSize: '25MB';
    autoTranslation?: boolean;  // Multi-language translation support
  }
  notifications: {
    sound: boolean;
    vibration: boolean;
    badge: boolean;           // App icon badge count
  }
}
```

### 2. **Live Updates**
```typescript
interface LiveFeatures {
  booking: {
    statusUpdates: boolean;   // Real-time booking status changes
    paymentUpdates: boolean;  // Payment processing status
    hostResponses: boolean;   // Booking approval/rejection
  }
  availability: {
    calendarSync: boolean;    // Real-time availability updates
    priceChanges: boolean;    // Dynamic pricing updates
  }
  location: {
    hostLocation?: boolean;   // Host nearby for check-in
    guestArrival?: boolean;   // Guest approaching property
  }
}
```

---

## 🎨 UI/UX Design System

### Color Palette (Cosmic Orange Theme)
```css
:root {
  /* Primary Colors */
  --cosmic-orange-primary: #FF6B35;
  --cosmic-orange-secondary: #F7931E;
  --cosmic-orange-light: #FFB896;
  --cosmic-orange-bg: #FFF8F5;
  --cosmic-orange-surface: #FFF0EB;
  
  /* Text Colors */
  --cosmic-orange-text: #2D1B12;
  --cosmic-orange-text-muted: #8B5A3C;
  
  /* System Colors */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Neutral Colors */
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-900: #111827;
}
```

### Typography
```typescript
interface TypographySystem {
  fonts: {
    heading: 'Playfair Display';  // Serif for luxury feel
    body: 'Inter';               // Sans-serif for readability
    luxury: 'Montserrat';        // For premium elements
  }
  sizes: {
    h1: '32px';    // Page titles
    h2: '24px';    // Section headers
    h3: '20px';    // Card titles
    body: '16px';  // Regular text
    small: '14px'; // Captions, labels
    xs: '12px';    // Fine print
  }
  weights: {
    light: 300;
    regular: 400;
    medium: 500;
    semibold: 600;
    bold: 700;
  }
}
```

### Component Specifications
```typescript
interface DesignComponents {
  buttons: {
    primary: {
      background: 'linear-gradient(135deg, #FF6B35, #FFB896)';
      color: '#FFFFFF';
      borderRadius: '12px';
      padding: '14px 36px';
      fontWeight: 600;
      textTransform: 'uppercase';
      letterSpacing: '0.08em';
      shadow: '0 10px 30px rgba(255, 107, 53, 0.3)';
    }
    secondary: {
      background: 'transparent';
      color: '#FF6B35';
      border: '2px solid #FF6B35';
      borderRadius: '12px';
      padding: '12px 34px';
    }
  }
  cards: {
    property: {
      background: '#FFFFFF';
      borderRadius: '16px';
      padding: '24px';
      shadow: '0 10px 30px rgba(255, 107, 53, 0.1)';
      border: '1px solid #FFF0EB';
    }
  }
  inputs: {
    textField: {
      background: '#FFFFFF';
      border: '2px solid #FFB896';
      borderRadius: '8px';
      padding: '12px 16px';
      focusBorder: '#FF6B35';
      placeholderColor: '#8B5A3C';
    }
  }
}
```

---

## 📱 Screen Specifications

### Screen Count Summary
**Total Screens: ~85-100 screens**

#### Guest App Screens (45-50 screens)
1. **Authentication (8 screens)**
   - Splash Screen
   - Onboarding (3 screens)
   - Login
   - Sign Up
   - Email Verification
   - Password Reset

2. **Discovery (12 screens)**
   - Home/Dashboard
   - Search Results
   - Map View
   - Filters
   - Property Details
   - Photo Gallery
   - Reviews List
   - Host Profile
   - Wishlist
   - Search History
   - Categories
   - Nearby Properties

3. **Booking (8 screens)**
   - Date Selection
   - Guest Count
   - Special Requests
   - Booking Summary
   - Payment Method
   - Payment Processing
   - Booking Confirmation
   - Booking Receipt

4. **Trip Management (10 screens)**
   - My Trips
   - Upcoming Trips
   - Past Trips
   - Trip Details
   - Check-in Instructions
   - House Rules
   - Contact Host
   - Trip Support
   - Cancel Booking
   - Modify Booking

5. **Profile & Settings (7-12 screens)**
   - Profile
   - Edit Profile
   - Account Settings
   - Notification Settings
   - Payment Methods
   - Privacy Settings
   - Help Center
   - Terms of Service
   - Privacy Policy
   - Delete Account
   - Language Settings
   - Currency Settings

#### Host App Screens (40-50 screens)
1. **Host Onboarding (8 screens)**
   - Become a Host Intro
   - Host Requirements
   - Property Type Selection
   - Property Details
   - Location Setup
   - Amenities Selection
   - Photo Upload
   - Pricing Setup

2. **Dashboard & Analytics (8 screens)**
   - Host Dashboard
   - Earnings Overview
   - Performance Metrics
   - Calendar Overview
   - Recent Activity
   - Notifications
   - Tasks
   - Quick Actions

3. **Property Management (15 screens)**
   - All Listings
   - Create Listing (7-step wizard)
   - Edit Listing
   - Property Photos
   - Amenities Management
   - Pricing Settings
   - Availability Calendar
   - Booking Rules
   - House Rules
   - Check-in Instructions
   - Property Status
   - Duplicate Listing
   - Delete Listing
   - Property Analytics
   - Guest Reviews

4. **Bookings & Guests (10 screens)**
   - Reservations Calendar
   - Booking Requests
   - Confirmed Bookings
   - Current Guests
   - Past Bookings
   - Booking Details
   - Guest Profiles
   - Check-in Management
   - Check-out Management
   - Booking Messages

5. **Financial (8 screens)**
   - Earnings Dashboard
   - Payout History
   - Payment Methods
   - Tax Information
   - Transaction History
   - Invoice Generator
   - Expense Tracking
   - Financial Reports

### Key Screen Details

#### Property Details Screen
```typescript
interface PropertyDetailsScreen {
  header: {
    backButton: boolean;
    shareButton: boolean;
    favoriteButton: boolean;
    photos: {
      gallery: PhotoGallery;
      count: number;
      allowZoom: boolean;
      allowFullscreen: boolean;
    }
  }
  
  content: {
    title: string;
    location: {
      area: string;
      city: string;
      coordinates: [number, number];
    }
    rating: {
      score: number;    // 4.8
      count: number;    // (123 reviews)
      breakdown: RatingBreakdown;
    }
    host: {
      name: string;
      photo: string;
      hostSince: Date;
      responseRate: number;
      responseTime: string;
      isVerified: boolean;
    }
    propertyInfo: {
      type: PropertyType;
      guests: number;
      bedrooms: number;
      bathrooms: number;
      size: number;     // square meters
    }
    description: {
      text: string;
      expandable: boolean;
      maxLines: 3;
    }
    amenities: {
      featured: AmenityItem[];    // Top 6 amenities
      showAllButton: boolean;
    }
    location: {
      mapView: boolean;
      nearbyPlaces: NearbyPlace[];
      directions: boolean;
    }
    availability: {
      calendar: boolean;
      minNights: number;
      maxNights: number;
    }
    policies: {
      checkIn: string;
      checkOut: string;
      cancellation: string;
      houseRules: string[];
    }
    reviews: {
      summary: ReviewSummary;
      recent: Review[];         // Latest 3 reviews
      showAllButton: boolean;
    }
  }
  
  footer: {
    pricing: {
      from: number;
      currency: string;
      per: 'night' | 'week' | 'month';
    }
    bookButton: {
      text: 'Reserve' | 'Check Availability';
      action: () => void;
    }
  }
}
```

#### Booking Flow Screens
```typescript
interface BookingFlowScreens {
  dateSelection: {
    calendar: CalendarComponent;
    availability: AvailabilityData;
    pricing: DynamicPricing;
    minNights: number;
    blockedDates: Date[];
  }
  
  guestDetails: {
    adults: Counter;          // Min 1, Max based on property
    children: Counter;        // Age 2-12
    infants: Counter;         // Under 2
    pets?: Counter;          // If allowed
    specialRequests: TextArea;
  }
  
  bookingSummary: {
    property: PropertySummary;
    dates: {
      checkIn: Date;
      checkOut: Date;
      nights: number;
    }
    guests: GuestCount;
    pricing: {
      basePrice: PriceBreakdown;
      fees: FeeBreakdown;
      taxes: TaxBreakdown;
      total: number;
      deposit: number;
    }
    policies: {
      cancellation: string;
      houseRules: string[];
    }
  }
  
  payment: {
    methods: PaymentMethod[];
    addNewCard: CardForm;
    billingAddress: AddressForm;
    cvvConfirmation: CVVField;
    saveCard: boolean;
    termsAgreement: boolean;
  }
  
  confirmation: {
    bookingCode: string;
    qrCode?: string;
    property: PropertySummary;
    dates: BookingDates;
    host: HostContact;
    checkInInstructions: string;
    supportContact: ContactInfo;
    actions: {
      downloadReceipt: () => void;
      addToCalendar: () => void;
      messageHost: () => void;
      getDirections: () => void;
    }
  }
}
```

---

## 🔧 Technical Implementation

### API Endpoints Structure
```typescript
interface APIEndpoints {
  auth: {
    'POST /auth/register': RegisterRequest;
    'POST /auth/login': LoginRequest;
    'POST /auth/logout': LogoutRequest;
    'POST /auth/refresh': RefreshTokenRequest;
    'POST /auth/forgot-password': ForgotPasswordRequest;
    'POST /auth/reset-password': ResetPasswordRequest;
    'POST /auth/verify-email': VerifyEmailRequest;
    'POST /auth/verify-phone': VerifyPhoneRequest;
  }
  
  users: {
    'GET /users/profile': GetProfileRequest;
    'PUT /users/profile': UpdateProfileRequest;
    'POST /users/upload-avatar': UploadAvatarRequest;
    'GET /users/settings': GetSettingsRequest;
    'PUT /users/settings': UpdateSettingsRequest;
    'DELETE /users/account': DeleteAccountRequest;
  }
  
  listings: {
    'GET /listings': SearchListingsRequest;
    'GET /listings/:id': GetListingRequest;
    'POST /listings': CreateListingRequest;
    'PUT /listings/:id': UpdateListingRequest;
    'DELETE /listings/:id': DeleteListingRequest;
    'GET /listings/:id/availability': GetAvailabilityRequest;
    'GET /listings/:id/reviews': GetListingReviewsRequest;
    'POST /listings/:id/favorite': ToggleFavoriteRequest;
  }
  
  bookings: {
    'GET /bookings': GetBookingsRequest;
    'GET /bookings/:id': GetBookingRequest;
    'POST /bookings': CreateBookingRequest;
    'PUT /bookings/:id': UpdateBookingRequest;
    'DELETE /bookings/:id': CancelBookingRequest;
    'GET /bookings/:id/invoice': GetInvoiceRequest;
  }
  
  payments: {
    'POST /payments/intent': CreatePaymentIntentRequest;
    'POST /payments/confirm': ConfirmPaymentRequest;
    'GET /payments/methods': GetPaymentMethodsRequest;
    'POST /payments/methods': AddPaymentMethodRequest;
    'DELETE /payments/methods/:id': DeletePaymentMethodRequest;
  }
  
  messages: {
    'GET /conversations': GetConversationsRequest;
    'GET /conversations/:id/messages': GetMessagesRequest;
    'POST /conversations/:id/messages': SendMessageRequest;
    'PUT /messages/:id/read': MarkMessageReadRequest;
  }
  
  host: {
    'GET /host/dashboard': GetHostDashboardRequest;
    'GET /host/bookings': GetHostBookingsRequest;
    'GET /host/earnings': GetHostEarningsRequest;
    'GET /host/analytics': GetHostAnalyticsRequest;
    'PUT /host/booking/:id/status': UpdateBookingStatusRequest;
  }
  
  kyc: {
    'POST /kyc/submit': SubmitKYCRequest;
    'POST /kyc/documents': UploadKYCDocumentRequest;
    'GET /kyc/status': GetKYCStatusRequest;
  }
}
```

### State Management Structure
```typescript
interface AppState {
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
  }
  
  listings: {
    searchResults: Listing[];
    currentListing: Listing | null;
    favorites: string[];        // Listing IDs
    searchFilters: SearchFilters;
    loading: boolean;
    pagination: PaginationMeta;
  }
  
  bookings: {
    userBookings: Booking[];
    currentBooking: Booking | null;
    bookingDraft: BookingDraft | null;
    loading: boolean;
  }
  
  host: {
    dashboard: HostDashboard | null;
    listings: Listing[];
    bookings: Booking[];
    earnings: EarningsData | null;
    analytics: AnalyticsData | null;
    loading: boolean;
  }
  
  messages: {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    unreadCount: number;
    loading: boolean;
  }
  
  ui: {
    theme: 'light' | 'dark';
    language: 'en' | 'ar';
    currency: CurrencyCode;
    notifications: NotificationSettings;
    loading: {
      global: boolean;
      overlay: boolean;
    }
  }
}
```

### Local Storage Strategy
```typescript
interface LocalStorageKeys {
  // Authentication
  'auth_token': string;
  'refresh_token': string;
  'user_profile': User;
  
  // User Preferences
  'app_language': 'en' | 'ar';
  'app_currency': CurrencyCode;
  'notification_settings': NotificationSettings;
  
  // Search & Favorites
  'recent_searches': SearchHistory[];
  'favorite_listings': string[];
  'search_filters': SearchFilters;
  
  // Booking Drafts
  'booking_draft': BookingDraft;
  'payment_methods': PaymentMethod[];
  
  // Cache
  'listings_cache': CachedListings;
  'user_bookings_cache': Booking[];
  
  // App State
  'onboarding_completed': boolean;
  'first_launch': boolean;
  'app_version': string;
}
```

---

## 🌟 Advanced Features

### 1. **Smart Recommendations**
```typescript
interface RecommendationEngine {
  algorithms: {
    collaborative: boolean;    // Based on similar users
    contentBased: boolean;     // Based on user preferences
    locationBased: boolean;    // Based on user location/searches
    priceOptimized: boolean;   // Based on budget patterns
  }
  
  inputs: {
    searchHistory: SearchHistory[];
    bookingHistory: Booking[];
    favorites: string[];
    profileData: UserPreferences;
    currentLocation: Location;
    timeOfYear: Date;
  }
  
  outputs: {
    homeFeed: RecommendedListing[];
    searchSuggestions: SearchSuggestion[];
    pricingAlerts: PriceAlert[];
    similarProperties: Listing[];
  }
}
```

### 2. **AR/VR Integration**
```typescript
interface ARFeatures {
  propertyVisualization: {
    arMeasurement: boolean;     // Measure spaces with AR
    furniturePlacement: boolean; // Visualize furniture
    roomScanning: boolean;      // 3D room capture
  }
  
  navigation: {
    arDirections: boolean;      // AR walking directions
    propertyMarkers: boolean;   // AR property markers
    neighborhoodInfo: boolean;  // AR neighborhood data
  }
  
  vrTours: {
    supported: boolean;
    vrHeadsets: string[];      // Oculus, Cardboard, etc.
    immersiveTours: boolean;
  }
}
```

### 3. **AI-Powered Features**
```typescript
interface AIFeatures {
  chatbot: {
    customerSupport: boolean;
    bookingAssistance: boolean;
    hostGuidance: boolean;
    multiLanguage: boolean;    // Arabic & English
  }
  
  imageRecognition: {
    photoQuality: boolean;     // Analyze photo quality
    roomDetection: boolean;    // Detect room types
    amenityDetection: boolean; // Auto-tag amenities
    damageDetection: boolean;  // Property damage assessment
  }
  
  pricing: {
    dynamicPricing: boolean;   // AI-suggested pricing
    marketAnalysis: boolean;   // Competitor analysis
    demandForecasting: boolean; // Predict booking demand
    revenueOptimization: boolean;
  }
  
  fraud: {
    bookingFraud: boolean;     // Detect fraudulent bookings
    identityVerification: boolean; // Enhanced ID verification
    riskScoring: boolean;      // User risk assessment
  }
}
```

---

## 🔄 Data Synchronization

### Sync Strategy
```typescript
interface SyncStrategy {
  realTime: {
    messages: boolean;         // WebSocket
    bookingUpdates: boolean;   // WebSocket
    notifications: boolean;    // Push notifications
    availabilityChanges: boolean;
  }
  
  periodic: {
    userProfile: '15min';
    bookings: '30min';
    earnings: '1hour';
    analytics: '6hours';
  }
  
  onDemand: {
    pullToRefresh: boolean;
    backgroundSync: boolean;
    offlineQueue: boolean;
  }
  
  conflictResolution: {
    strategy: 'server_wins' | 'client_wins' | 'merge';
    userPrompt: boolean;       // Ask user to resolve conflicts
  }
}
```

---

## 🧪 Testing Strategy

### Test Coverage Requirements
```typescript
interface TestingStrategy {
  unitTests: {
    coverage: '90%';
    focus: ['utils', 'validation', 'calculations', 'formatting'];
  }
  
  integrationTests: {
    api: boolean;              // API endpoint testing
    database: boolean;         // Database operations
    paymentGateways: boolean;  // Payment integration
    notifications: boolean;    // Push notification delivery
  }
  
  e2eTests: {
    userJourneys: [
      'guest_booking_flow',
      'host_listing_creation',
      'payment_processing',
      'messaging_system'
    ];
    devices: ['iOS', 'Android'];
    screenSizes: ['small', 'medium', 'large'];
  }
  
  performanceTests: {
    loadTesting: boolean;      // Concurrent users
    stressTesting: boolean;    // Peak load scenarios
    memoryLeaks: boolean;      // Memory management
    batteryUsage: boolean;     // Battery optimization
  }
  
  securityTests: {
    authenticationBypass: boolean;
    dataLeakage: boolean;
    injectionAttacks: boolean;
    encryptionValidation: boolean;
  }
}
```

---

## 📊 Analytics & Monitoring

### Analytics Events
```typescript
interface AnalyticsEvents {
  user: {
    'user_registered': { method: string; };
    'user_verified': { type: 'email' | 'phone' | 'id'; };
    'profile_completed': { completionRate: number; };
  }
  
  search: {
    'search_performed': {
      location: string;
      dates: string;
      guests: number;
      filters: string[];
    };
    'listing_viewed': {
      listingId: string;
      source: string;
      timeSpent: number;
    };
  }
  
  booking: {
    'booking_initiated': { listingId: string; };
    'booking_completed': {
      listingId: string;
      amount: number;
      currency: string;
      paymentMethod: string;
    };
    'booking_cancelled': {
      bookingId: string;
      reason: string;
      timeToCancel: number;
    };
  }
  
  engagement: {
    'message_sent': { conversationType: string; };
    'review_submitted': { rating: number; };
    'property_favorited': { listingId: string; };
    'share_initiated': { content: string; method: string; };
  }
  
  host: {
    'listing_created': { propertyType: string; };
    'instant_book_enabled': { listingId: string; };
    'pricing_updated': { listingId: string; priceChange: number; };
    'booking_approved': { bookingId: string; responseTime: number; };
  }
}
```

---

This comprehensive documentation provides everything needed to develop a mobile app equivalent to the Houseiana web platform. The guide covers all user journeys, technical specifications, design requirements, and implementation details necessary for creating a full-featured property rental mobile application.

**Key Development Priorities:**
1. Start with core booking flow (guest journey)
2. Implement host onboarding and property management
3. Add real-time messaging and notifications
4. Integrate payment processing and KYC verification
5. Implement advanced features (AI recommendations, AR/VR)

The documentation serves as a complete blueprint for mobile app development teams to create a world-class luxury property rental platform with global reach and all the features and functionality of the original web application. Starting with strong presence in the Middle East and expanding to serve users worldwide.