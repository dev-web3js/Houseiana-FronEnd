import BookingWidget from './BookingWidget';

const meta = {
  title: 'Booking Components/BookingWidget',
  component: BookingWidget,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A booking widget that allows users to select dates, number of guests, check availability, and proceed with booking. Features real-time pricing calculation and availability checking.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    listing: {
      description: 'Listing object containing property information',
      control: { type: 'object' }
    }
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Story />
      </div>
    )
  ]
};

export default meta;

// Mock listing data
const mockListing = {
  id: '1',
  title: 'Luxury Apartment in West Bay',
  pricePerNight: 150,
  cleaningFee: 25,
  serviceFee: 15,
  maxGuests: 4,
  minNights: 1,
  location: 'West Bay, Doha',
  host: {
    name: 'Ahmed Al-Rashid',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking'],
  isInstantBook: true
};

const expensiveListing = {
  ...mockListing,
  id: '2',
  title: 'Premium Villa with Private Pool',
  pricePerNight: 450,
  cleaningFee: 75,
  serviceFee: 45,
  maxGuests: 8,
  minNights: 2,
  location: 'The Pearl, Doha',
  isInstantBook: false
};

const budgetListing = {
  ...mockListing,
  id: '3',
  title: 'Cozy Studio Near Souq',
  pricePerNight: 65,
  cleaningFee: 15,
  serviceFee: 8,
  maxGuests: 2,
  minNights: 1,
  location: 'Downtown Doha',
  isInstantBook: true
};

// Stories
export const Default = {
  args: {
    listing: mockListing
  }
};

export const PremiumProperty = {
  args: {
    listing: expensiveListing
  }
};

export const BudgetProperty = {
  args: {
    listing: budgetListing
  }
};

export const LargeGroup = {
  args: {
    listing: {
      ...mockListing,
      maxGuests: 12,
      pricePerNight: 320,
      title: 'Large Family Villa'
    }
  }
};

export const MinimumStay = {
  args: {
    listing: {
      ...mockListing,
      minNights: 7,
      title: 'Weekly Rental Only',
      pricePerNight: 120
    }
  }
};

export const InstantBook = {
  args: {
    listing: {
      ...mockListing,
      isInstantBook: true,
      title: 'Instant Book Available'
    }
  }
};

export const RequestToBook = {
  args: {
    listing: {
      ...mockListing,
      isInstantBook: false,
      title: 'Request to Book Required'
    }
  }
};

// Widget variations showcase
export const BookingOptions = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Instant Book</h3>
        <BookingWidget listing={{
          ...mockListing,
          isInstantBook: true,
          title: 'Modern Apartment'
        }} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Request to Book</h3>
        <BookingWidget listing={{
          ...mockListing,
          isInstantBook: false,
          title: 'Luxury Villa'
        }} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of booking widgets with different booking types - instant book vs request to book.'
      }
    }
  }
};

// Price range comparison
export const PriceComparison = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Budget ($65/night)</h3>
        <BookingWidget listing={budgetListing} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Standard ($150/night)</h3>
        <BookingWidget listing={mockListing} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Premium ($450/night)</h3>
        <BookingWidget listing={expensiveListing} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Booking widgets showing different price ranges to demonstrate pricing display variations.'
      }
    }
  }
};

// Different property capacities
export const GuestCapacity = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Studio (2 guests max)</h3>
        <BookingWidget listing={{
          ...budgetListing,
          maxGuests: 2,
          title: 'Cozy Studio'
        }} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Villa (12 guests max)</h3>
        <BookingWidget listing={{
          ...mockListing,
          maxGuests: 12,
          pricePerNight: 380,
          title: 'Large Villa'
        }} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Booking widgets for properties with different guest capacities.'
      }
    }
  }
};

// Mobile responsive view
export const Mobile = {
  args: {
    listing: mockListing
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px', margin: '0 auto' }}>
        <Story />
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Mobile view of the booking widget optimized for smaller screens.'
      }
    }
  }
};