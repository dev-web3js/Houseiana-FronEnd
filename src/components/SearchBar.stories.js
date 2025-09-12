import SearchBar from './SearchBar';

const meta = {
  title: 'Search Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive search bar for finding properties by location, dates, and guest count. Features location autocomplete, date picker integration, and guest selector.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onSearch: {
      action: 'search',
      description: 'Callback function called when search is submitted'
    },
    initialValues: {
      description: 'Initial search values to populate the form',
      control: { type: 'object' }
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'large'],
      description: 'Size variant of the search bar'
    },
    showFilters: {
      control: { type: 'boolean' },
      description: 'Whether to show advanced filter button'
    }
  },
};

export default meta;

// Stories
export const Default = {
  args: {
    onSearch: (searchData) => console.log('Search:', searchData),
    showFilters: true
  }
};

export const Large = {
  args: {
    onSearch: (searchData) => console.log('Search:', searchData),
    size: 'large',
    showFilters: true
  }
};

export const WithInitialValues = {
  args: {
    onSearch: (searchData) => console.log('Search:', searchData),
    initialValues: {
      location: 'West Bay, Doha',
      checkIn: '2024-12-25',
      checkOut: '2024-12-28',
      guests: 2
    },
    showFilters: true
  }
};

export const Compact = {
  args: {
    onSearch: (searchData) => console.log('Search:', searchData),
    showFilters: false
  }
};

// Homepage hero version
export const HeroVersion = {
  args: {
    onSearch: (searchData) => console.log('Search:', searchData),
    size: 'large',
    showFilters: true
  },
  decorators: [
    (Story) => (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '4rem 2rem',
        borderRadius: '12px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            color: 'white', 
            textAlign: 'center', 
            marginBottom: '2rem',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            Find Your Perfect Stay in Qatar
          </h1>
          <Story />
        </div>
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Hero section version of the search bar as it appears on the homepage.'
      }
    }
  }
};

// Mobile responsive versions
export const Mobile = {
  args: {
    onSearch: (searchData) => console.log('Search:', searchData),
    showFilters: true
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '375px' }}>
        <Story />
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Mobile view of the search bar with responsive layout.'
      }
    }
  }
};

export const Tablet = {
  args: {
    onSearch: (searchData) => console.log('Search:', searchData),
    showFilters: true
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '768px' }}>
        <Story />
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Tablet view showing the search bar layout on medium screens.'
      }
    }
  }
};

// Different search scenarios
export const WeekendGetaway = {
  args: {
    onSearch: (searchData) => console.log('Weekend Search:', searchData),
    initialValues: {
      location: 'The Pearl, Doha',
      checkIn: '2024-12-20',
      checkOut: '2024-12-22',
      guests: 2
    },
    showFilters: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Search bar configured for a weekend getaway scenario.'
      }
    }
  }
};

export const BusinessTravel = {
  args: {
    onSearch: (searchData) => console.log('Business Search:', searchData),
    initialValues: {
      location: 'West Bay Business District',
      checkIn: '2024-12-15',
      checkOut: '2024-12-20',
      guests: 1
    },
    showFilters: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Search bar configured for business travel with extended stay.'
      }
    }
  }
};

export const FamilyVacation = {
  args: {
    onSearch: (searchData) => console.log('Family Search:', searchData),
    initialValues: {
      location: 'Lusail City',
      checkIn: '2024-12-23',
      checkOut: '2024-12-30',
      guests: 6
    },
    showFilters: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Search bar configured for family vacation with multiple guests.'
      }
    }
  }
};

// Integration examples
export const SearchFlow = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Step 1: Initial Search</h3>
        <SearchBar 
          onSearch={(data) => console.log('Initial search:', data)}
          showFilters={true}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Step 2: Refined Search with Filters</h3>
        <SearchBar 
          onSearch={(data) => console.log('Refined search:', data)}
          initialValues={{
            location: 'Doha, Qatar',
            checkIn: '2024-12-25',
            checkOut: '2024-12-28',
            guests: 2
          }}
          showFilters={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete search flow showing initial search and refinement.'
      }
    }
  }
};

// Popular locations showcase
export const PopularLocations = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold mb-2">West Bay</h4>
        <SearchBar 
          onSearch={(data) => console.log('West Bay search:', data)}
          initialValues={{ location: 'West Bay, Doha' }}
          showFilters={false}
        />
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">The Pearl</h4>
        <SearchBar 
          onSearch={(data) => console.log('Pearl search:', data)}
          initialValues={{ location: 'The Pearl, Doha' }}
          showFilters={false}
        />
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">Lusail City</h4>
        <SearchBar 
          onSearch={(data) => console.log('Lusail search:', data)}
          initialValues={{ location: 'Lusail City, Qatar' }}
          showFilters={false}
        />
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">Al Rayyan</h4>
        <SearchBar 
          onSearch={(data) => console.log('Al Rayyan search:', data)}
          initialValues={{ location: 'Al Rayyan, Qatar' }}
          showFilters={false}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Search bars pre-configured with popular Qatar locations.'
      }
    }
  }
};