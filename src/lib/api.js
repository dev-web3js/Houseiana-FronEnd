// API service for communicating with external Houseiana backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get authorization token from session cookie
  getAuthToken() {
    if (typeof window !== 'undefined') {
      const sessionCookie = document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('houseiana_session='));
      
      if (sessionCookie) {
        return sessionCookie.split('=')[1];
      }
    }
    return null;
  }

  // Make authenticated API request
  async apiRequest(endpoint, options = {}) {
    const token = this.getAuthToken();
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials) {
    return this.apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.apiRequest('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async getProfile() {
    return this.apiRequest('/user/profile');
  }

  async updateProfile(profileData) {
    return this.apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async becomeHost(hostData) {
    return this.apiRequest('/user/become-host', {
      method: 'POST',
      body: JSON.stringify(hostData),
    });
  }

  // Property endpoints
  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.apiRequest(`/properties${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
  }

  async getProperty(id) {
    return this.apiRequest(`/properties/${id}`);
  }

  async createProperty(propertyData) {
    return this.apiRequest('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async updateProperty(id, propertyData) {
    return this.apiRequest(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id) {
    return this.apiRequest(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  async getHostProperties() {
    return this.apiRequest('/properties/host');
  }

  async toggleFavorite(propertyId) {
    return this.apiRequest(`/properties/${propertyId}/favorite`, {
      method: 'POST',
    });
  }

  async searchProperties(searchParams) {
    const queryParams = new URLSearchParams(searchParams);
    return this.apiRequest(`/properties/search?${queryParams.toString()}`);
  }

  // Booking endpoints
  async createBooking(bookingData) {
    return this.apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings() {
    return this.apiRequest('/bookings');
  }

  async getBooking(id) {
    return this.apiRequest(`/bookings/${id}`);
  }

  async updateBookingStatus(id, status) {
    return this.apiRequest(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async cancelBooking(id) {
    return this.apiRequest(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  }

  async getHostBookings() {
    return this.apiRequest('/bookings/host');
  }

  // KYC endpoints
  async submitKYC(kycData) {
    return this.apiRequest('/kyc/submit', {
      method: 'POST',
      body: JSON.stringify(kycData),
    });
  }

  async getKYCStatus() {
    return this.apiRequest('/kyc/status');
  }

  async verifyKYC(verificationData) {
    return this.apiRequest('/kyc/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }

  // Email verification
  async sendVerificationEmail(email) {
    return this.apiRequest('/email-verification/send', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyEmail(token) {
    return this.apiRequest('/email-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Phone verification
  async sendPhoneVerification(phoneNumber) {
    return this.apiRequest('/phone-verification/send', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async verifyPhone(phoneNumber, code) {
    return this.apiRequest('/phone-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, code }),
    });
  }

  // Messages endpoints
  async getMessages(conversationId = null) {
    const endpoint = conversationId ? `/messages/${conversationId}` : '/messages';
    return this.apiRequest(endpoint);
  }

  async sendMessage(messageData) {
    return this.apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Notifications
  async getNotifications() {
    return this.apiRequest('/notifications');
  }

  async markNotificationRead(id) {
    return this.apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  // Co-host endpoints
  async inviteCoHost(invitationData) {
    return this.apiRequest('/co-host/invite', {
      method: 'POST',
      body: JSON.stringify(invitationData),
    });
  }

  async acceptCoHostInvitation(token) {
    return this.apiRequest('/co-host/accept', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async getCoHosts() {
    return this.apiRequest('/co-host');
  }

  // Payment endpoints
  async processPayment(paymentData) {
    return this.apiRequest('/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPaymentMethods() {
    return this.apiRequest('/payments/methods');
  }

  async addPaymentMethod(methodData) {
    return this.apiRequest('/payments/methods', {
      method: 'POST',
      body: JSON.stringify(methodData),
    });
  }

  // Reviews endpoints
  async getPropertyReviews(propertyId) {
    return this.apiRequest(`/reviews/property/${propertyId}`);
  }

  async submitReview(reviewData) {
    return this.apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Health check
  async healthCheck() {
    return this.apiRequest('/health');
  }
}

// Create a singleton instance
const apiService = new APIService();

export default apiService;

// Named exports for convenience
export const api = apiService;
export const {
  login,
  register,
  logout,
  getProfile,
  updateProfile,
  becomeHost,
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getHostProperties,
  toggleFavorite,
  searchProperties,
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getHostBookings,
  submitKYC,
  getKYCStatus,
  verifyKYC,
  sendVerificationEmail,
  verifyEmail,
  sendPhoneVerification,
  verifyPhone,
  getMessages,
  sendMessage,
  getNotifications,
  markNotificationRead,
  inviteCoHost,
  acceptCoHostInvitation,
  getCoHosts,
  processPayment,
  getPaymentMethods,
  addPaymentMethod,
  getPropertyReviews,
  submitReview,
  healthCheck,
} = apiService;