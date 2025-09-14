# Houseiana Project Pages Brief

## Project Overview
Houseiana is a luxury property rental platform similar to Airbnb, featuring a comprehensive booking system with host and guest functionalities, built with Next.js 15 (frontend) and NestJS (backend).

**Theme**: Cosmic Orange (#FF6B35) luxury design with elegant typography using Playfair Display and Inter fonts.

## Frontend Pages (Next.js)

### 🏠 Core Pages

#### `/` - Homepage
- **Purpose**: Landing page showcasing luxury properties and platform features
- **Features**: Hero section, property search, featured listings
- **Layout**: Uses LuxuryHero and LuxuryNavbar components

#### `/search` - Property Search
- **Purpose**: Advanced property search and filtering
- **Features**: Location-based search, price filters, amenity filters
- **Layout**: Search filters sidebar with results grid

### 🔐 Authentication Pages

#### `/auth/sign-in` - User Login
- **Purpose**: User authentication for guests and hosts
- **Features**: Email/password login, social auth integration
- **Styling**: Cosmic Orange themed forms with luxury styling

#### `/auth/sign-up` - User Registration  
- **Purpose**: New user account creation
- **Features**: Account type selection (Guest/Host), form validation
- **Integration**: Links to email verification flow

#### `/auth/reset-password` - Password Reset
- **Purpose**: Password recovery functionality
- **Features**: Email-based password reset, secure token validation

#### `/verify-email` - Email Verification
- **Purpose**: Email confirmation for new accounts
- **Features**: Token-based email verification system

### 👤 User Profile & Settings

#### `/profile` - User Profile
- **Purpose**: Display and edit user profile information
- **Features**: Profile photo, personal details, user preferences

#### `/account-settings` - Account Management
- **Purpose**: Comprehensive account settings management
- **Features**: Security settings, notification preferences, account deletion

#### `/preferences` - User Preferences
- **Purpose**: Customize user experience preferences
- **Features**: Language, currency, notification settings

### 🏨 Host-Specific Pages

#### `/become-a-host` - Host Onboarding
- **Purpose**: Guide users through becoming a host
- **Features**: Multi-step onboarding process, requirements checklist
- **Flow**: Property listing setup, host verification

#### `/become-a-host/register` - Host Registration
- **Purpose**: Host-specific registration process
- **Features**: Additional host verification, business details

#### `/host/dashboard` - Host Dashboard
- **Purpose**: Central hub for host activities
- **Features**: Earnings overview, booking management, performance metrics

#### `/host/dashboard/welcome` - Host Welcome
- **Purpose**: Welcome page for new hosts
- **Features**: Getting started guide, next steps

#### `/host/properties` - Property Management
- **Purpose**: Manage all host properties
- **Features**: Property list, status management, quick actions

#### `/host/properties/create` - Add New Property
- **Purpose**: Create new property listings
- **Features**: Multi-step property creation form, photo upload

#### `/host/listings` - Listing Management
- **Purpose**: Manage property listings and availability
- **Features**: Calendar management, pricing controls

#### `/host/listings/new` - Create New Listing
- **Purpose**: Create new property listings
- **Features**: Property details, amenities, photos, pricing

#### `/host/bookings` - Host Booking Management
- **Purpose**: Manage incoming bookings and reservations
- **Features**: Booking approval, guest communication, calendar

#### `/host/earnings` - Earnings Dashboard
- **Purpose**: Track host earnings and payouts
- **Features**: Revenue analytics, payout history, tax documents

#### `/host/profile` - Host Profile
- **Purpose**: Manage host-specific profile information
- **Features**: Host verification status, reviews, response rate

### 🎫 Booking & Travel Pages

#### `/property/[id]` - Property Details
- **Purpose**: Display detailed property information
- **Features**: Photo gallery, amenities, reviews, booking widget
- **Dynamic**: Property ID-based routing

#### `/book/[id]` - Booking Process
- **Purpose**: Handle property booking flow
- **Features**: Date selection, guest count, payment processing
- **Dynamic**: Property ID-based booking

#### `/booking/new` - New Booking
- **Purpose**: Start new booking process
- **Features**: Property selection, date picker, guest details

#### `/booking/payment` - Payment Processing
- **Purpose**: Handle booking payments
- **Features**: Payment methods, pricing breakdown, confirmation

#### `/booking/terms` - Terms & Conditions
- **Purpose**: Display booking terms and cancellation policies
- **Features**: Legal terms, cancellation policies, user agreements

#### `/booking/confirmation` - Booking Confirmation
- **Purpose**: Confirm successful booking
- **Features**: Booking details, host contact, check-in instructions

#### `/bookings` - User Bookings
- **Purpose**: View all user bookings (guest perspective)
- **Features**: Upcoming trips, booking history, cancellations

#### `/trips` - Trip Management
- **Purpose**: Manage upcoming and past trips
- **Features**: Trip details, itineraries, reviews

### 📱 User Dashboard Pages

#### `/dashboard` - Main Dashboard
- **Purpose**: Central user dashboard (guest view)
- **Features**: Quick actions, recent bookings, recommendations

#### `/dashboard/welcome` - Welcome Dashboard
- **Purpose**: Welcome page for new users
- **Features**: Getting started guide, platform introduction

#### `/dashboard/guest` - Guest Dashboard
- **Purpose**: Guest-specific dashboard view
- **Features**: Upcoming trips, favorite properties, recommendations

### 💬 Communication & Social

#### `/messages` - Message Center
- **Purpose**: Communication between guests and hosts
- **Features**: Message threads, notifications, file sharing

#### `/saved` - Saved Properties
- **Purpose**: User's saved/favorited properties
- **Features**: Wishlist management, property comparison

#### `/wishlists` - Wishlists
- **Purpose**: Organize saved properties into lists
- **Features**: Multiple wishlists, sharing capabilities

### 🔧 Administrative & Support

#### `/help` - Help Center
- **Purpose**: Customer support and FAQ
- **Features**: Help articles, contact forms, live chat

#### `/admin/kyc` - KYC Administration
- **Purpose**: Admin panel for KYC verification
- **Features**: Document review, verification status

#### `/kyc/verify` - KYC Verification
- **Purpose**: User identity verification process
- **Features**: Document upload, identity verification

#### `/co-host/accept/[token]` - Co-host Invitation
- **Purpose**: Accept co-host invitations
- **Features**: Token-based invitation acceptance
- **Dynamic**: Token-based routing

## Backend API Structure (NestJS)

### 🔐 Authentication Module
- **Controller**: `auth.controller.ts`
- **Purpose**: Handle user authentication and authorization
- **Endpoints**: Login, register, password reset, email verification

### 📊 Core Modules
- **Prisma Module**: Database ORM integration
- **App Module**: Main application module
- **App Controller**: Root application controller

## Database Schema (Prisma)
Located in `../houseiana-backend/prisma/schema.prisma`
- User management and authentication
- Property and listing management  
- Booking and reservation system
- Payment processing
- Review and rating system

## Design System

### 🎨 Theme Colors
- **Primary**: #FF6B35 (Cosmic Orange)
- **Secondary**: #F7931E (Orange Secondary)
- **Light**: #FFB896 (Cosmic Orange Light)
- **Background**: #FFF8F5 (Cosmic Orange Background)
- **Text**: #2D1B12 (Dark Brown)

### 📝 Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Luxury**: Montserrat (sans-serif)

### 🎯 Component Library
- **Storybook**: Available at https://dev-web3js.github.io/Houseiana-FronEnd/
- **Components**: LuxuryHero, LuxuryNavbar, PricingBreakdown
- **Styling**: Tailwind CSS with custom Cosmic Orange theme

## Development Servers
- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:5000 (NestJS)
- **Storybook**: Component documentation and testing
- **Database**: PostgreSQL with Prisma ORM

## Key Features
1. **Dual User Types**: Guests and Hosts with role-based access
2. **Property Management**: Complete CRUD for properties and listings
3. **Booking System**: End-to-end reservation management
4. **Payment Integration**: Secure payment processing
5. **Communication**: In-app messaging between users
6. **Verification**: KYC and identity verification
7. **Admin Panel**: Administrative controls and monitoring
8. **Mobile Responsive**: Optimized for all device sizes
9. **Luxury Design**: Premium UI/UX with Cosmic Orange theme
10. **Real-time Features**: Live updates and notifications