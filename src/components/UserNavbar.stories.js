import UserNavbar from './UserNavbar';

const meta = {
  title: 'Navigation Components/UserNavbar',
  component: UserNavbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main navigation bar for authenticated users. Features user menu, notifications, messaging, and host mode toggle. Responsive design with mobile hamburger menu.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;

// Mock user data
const mockUser = {
  id: '1',
  name: 'Ahmed Al-Rashid',
  firstName: 'Ahmed',
  lastName: 'Al-Rashid',
  email: 'ahmed@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  role: 'user',
  isHost: false,
  verified: true
};

const mockHost = {
  ...mockUser,
  id: '2',
  name: 'Fatima Al-Zahra',
  firstName: 'Fatima',
  lastName: 'Al-Zahra',
  email: 'fatima@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332365d?w=100&h=100&fit=crop&crop=face',
  role: 'host',
  isHost: true
};

const unverifiedUser = {
  ...mockUser,
  id: '3',
  name: 'Omar Hassan',
  firstName: 'Omar',
  lastName: 'Hassan',
  email: 'omar@example.com',
  avatar: null,
  verified: false
};

// Create mock context wrapper
const MockAuthProvider = ({ children, user = null }) => {
  const mockAuthValue = {
    user,
    login: () => Promise.resolve(true),
    logout: () => {},
    isAuthenticated: () => !!user,
    loading: false
  };

  // This is a simplified mock - in real Storybook you'd use actual context
  return (
    <div data-mock-auth={JSON.stringify(mockAuthValue)}>
      {children}
    </div>
  );
};

// Stories
export const LoggedOutUser = {
  decorators: [
    (Story) => (
      <MockAuthProvider user={null}>
        <Story />
      </MockAuthProvider>
    )
  ]
};

export const LoggedInUser = {
  decorators: [
    (Story) => (
      <MockAuthProvider user={mockUser}>
        <Story />
      </MockAuthProvider>
    )
  ]
};

export const HostUser = {
  decorators: [
    (Story) => (
      <MockAuthProvider user={mockHost}>
        <Story />
      </MockAuthProvider>
    )
  ]
};

export const UnverifiedUser = {
  decorators: [
    (Story) => (
      <MockAuthProvider user={unverifiedUser}>
        <Story />
      </MockAuthProvider>
    )
  ]
};

export const UserWithoutAvatar = {
  decorators: [
    (Story) => (
      <MockAuthProvider user={{
        ...mockUser,
        avatar: null
      }}>
        <Story />
      </MockAuthProvider>
    )
  ]
};

// Different screen sizes
export const Desktop = {
  decorators: [
    (Story) => (
      <MockAuthProvider user={mockUser}>
        <div style={{ minWidth: '1024px' }}>
          <Story />
        </div>
      </MockAuthProvider>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Desktop view of the navigation bar with full menu options visible.'
      }
    }
  }
};

export const Tablet = {
  decorators: [
    (Story) => (
      <MockAuthProvider user={mockUser}>
        <div style={{ width: '768px' }}>
          <Story />
        </div>
      </MockAuthProvider>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Tablet view showing responsive navigation layout.'
      }
    }
  }
};

export const Mobile = {
  decorators: [
    (Story) => (
      <MockAuthProvider user={mockUser}>
        <div style={{ width: '375px' }}>
          <Story />
        </div>
      </MockAuthProvider>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Mobile view with hamburger menu and collapsed navigation.'
      }
    }
  }
};

// Navigation states comparison
export const NavigationStates = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Guest (Not Logged In)</h3>
        <MockAuthProvider user={null}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Regular User</h3>
        <MockAuthProvider user={mockUser}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Host User</h3>
        <MockAuthProvider user={mockHost}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Unverified User</h3>
        <MockAuthProvider user={unverifiedUser}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of navigation bar for different user states and authentication levels.'
      }
    }
  }
};

// Interactive features showcase
export const InteractiveFeatures = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">User with Notifications</h3>
        <MockAuthProvider user={{
          ...mockUser,
          notifications: 3,
          messages: 2
        }}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Host Mode Active</h3>
        <MockAuthProvider user={{
          ...mockHost,
          hostMode: true
        }}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation bar showing interactive features like notifications, messages, and host mode.'
      }
    }
  }
};