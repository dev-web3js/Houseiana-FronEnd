import PropertyCard from './PropertyCard';

const meta = {
  title: 'Property Components/PropertyCard',
  component: PropertyCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A property card component that displays property information including images, price, location, and amenities. Features image carousel and favorite toggle functionality.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    property: {
      description: 'Property object containing all property information',
      control: { type: 'object' }
    }
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    )
  ]
};

export default meta;

// Mock property data
const mockProperty = {
  id: '1',
  title: 'Luxury Apartment in West Bay',
  location: 'West Bay, Doha, Qatar',
  price: 150,
  rating: 4.8,
  reviewCount: 24,
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
  ],
  bedrooms: 2,
  bathrooms: 2,
  guests: 4,
  amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking'],
  type: 'apartment',
  isAvailable: true
};

const mockVilla = {
  id: '2',
  title: 'Modern Villa with Sea View',
  location: 'The Pearl, Doha, Qatar',
  price: 350,
  rating: 4.9,
  reviewCount: 18,
  images: [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop'
  ],
  bedrooms: 4,
  bathrooms: 3,
  guests: 8,
  amenities: ['Private Pool', 'Sea View', 'WiFi', 'Kitchen', 'Parking'],
  type: 'villa',
  isAvailable: true
};

const mockStudio = {
  id: '3',
  title: 'Cozy Studio Near Souq Waqif',
  location: 'Downtown Doha, Qatar',
  price: 85,
  rating: 4.5,
  reviewCount: 42,
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
  ],
  bedrooms: 0,
  bathrooms: 1,
  guests: 2,
  amenities: ['WiFi', 'Kitchen', 'Air Conditioning'],
  type: 'studio',
  isAvailable: true
};

const unavailableProperty = {
  ...mockProperty,
  id: '4',
  title: 'Unavailable Property',
  isAvailable: false,
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
  ]
};

// Stories
export const Default = {
  args: {
    property: mockProperty
  }
};

export const LuxuryVilla = {
  args: {
    property: mockVilla
  }
};

export const Studio = {
  args: {
    property: mockStudio
  }
};

export const SingleImage = {
  args: {
    property: {
      ...mockProperty,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
      ]
    }
  }
};

export const NoImage = {
  args: {
    property: {
      ...mockProperty,
      images: []
    }
  }
};

export const HighRating = {
  args: {
    property: {
      ...mockProperty,
      rating: 5.0,
      reviewCount: 125,
      title: 'Premium Penthouse Suite'
    }
  }
};

export const LowRating = {
  args: {
    property: {
      ...mockProperty,
      rating: 3.2,
      reviewCount: 8,
      title: 'Budget-Friendly Apartment',
      price: 45
    }
  }
};

export const ExpensiveProperty = {
  args: {
    property: {
      ...mockVilla,
      price: 800,
      title: 'Ultra-Luxury Mansion',
      bedrooms: 6,
      bathrooms: 5,
      guests: 12,
      amenities: ['Private Pool', 'Private Beach', 'Butler Service', 'Chef', 'Spa', 'Gym']
    }
  }
};

export const Unavailable = {
  args: {
    property: unavailableProperty
  }
};

// Property grid showcase
export const PropertyGrid = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PropertyCard property={mockProperty} />
      <PropertyCard property={mockVilla} />
      <PropertyCard property={mockStudio} />
      <PropertyCard property={{
        ...mockProperty,
        id: '5',
        title: 'Family Townhouse',
        location: 'Al Rayyan, Qatar',
        price: 220,
        bedrooms: 3,
        bathrooms: 2,
        guests: 6,
        type: 'townhouse'
      }} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple property cards in a grid layout as they would appear in search results.'
      }
    }
  }
};

// Different property types
export const PropertyTypes = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Luxury Villa</h3>
        <PropertyCard property={mockVilla} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Modern Apartment</h3>
        <PropertyCard property={mockProperty} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Cozy Studio</h3>
        <PropertyCard property={mockStudio} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different property types showcased with the PropertyCard component.'
      }
    }
  }
};

// Interactive states showcase
export const InteractiveStates = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Property</h3>
        <PropertyCard property={mockProperty} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Unavailable Property</h3>
        <PropertyCard property={unavailableProperty} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Property cards showing different availability states.'
      }
    }
  }
};