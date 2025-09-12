import { Button } from './Button';
import { Heart, Search, Plus, Download } from 'lucide-react';

const meta = {
  title: 'UI Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component built with Radix UI and class-variance-authority. Supports multiple variants, sizes, and can be used as a slot component.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual variant of the button'
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled'
    },
    asChild: {
      control: { type: 'boolean' },
      description: 'When true, the button will render as a Slot component'
    },
    children: {
      control: { type: 'text' },
      description: 'The content of the button'
    }
  },
};

export default meta;

// Basic button variants
export const Default = {
  args: {
    children: 'Book Now',
    variant: 'default',
    size: 'default'
  }
};

export const Destructive = {
  args: {
    children: 'Delete Property',
    variant: 'destructive',
    size: 'default'
  }
};

export const Outline = {
  args: {
    children: 'View Details',
    variant: 'outline',
    size: 'default'
  }
};

export const Secondary = {
  args: {
    children: 'Save Draft',
    variant: 'secondary',
    size: 'default'
  }
};

export const Ghost = {
  args: {
    children: 'Cancel',
    variant: 'ghost',
    size: 'default'
  }
};

export const Link = {
  args: {
    children: 'Learn More',
    variant: 'link',
    size: 'default'
  }
};

// Button sizes
export const Small = {
  args: {
    children: 'Small Button',
    size: 'sm'
  }
};

export const Large = {
  args: {
    children: 'Large Button',
    size: 'lg'
  }
};

// Buttons with icons
export const WithIcon = {
  args: {
    children: (
      <>
        <Heart className="w-4 h-4" />
        Add to Favorites
      </>
    ),
    variant: 'outline'
  }
};

export const IconOnly = {
  args: {
    children: <Search className="w-4 h-4" />,
    variant: 'outline',
    size: 'icon'
  }
};

export const IconButton = {
  args: {
    children: <Plus className="w-4 h-4" />,
    variant: 'default',
    size: 'icon'
  }
};

// States
export const Disabled = {
  args: {
    children: 'Disabled Button',
    disabled: true
  }
};

export const Loading = {
  args: {
    children: (
      <>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        Processing...
      </>
    ),
    disabled: true
  }
};

// Real-world examples from Houseiana
export const SearchButton = {
  name: 'Search Properties',
  args: {
    children: (
      <>
        <Search className="w-4 h-4" />
        Search Properties
      </>
    ),
    variant: 'default',
    size: 'lg'
  }
};

export const BookingButton = {
  name: 'Book Property',
  args: {
    children: 'Book Now - $150/night',
    variant: 'default',
    size: 'lg'
  }
};

export const HostButton = {
  name: 'Become a Host',
  args: {
    children: (
      <>
        <Plus className="w-4 h-4" />
        List Your Property
      </>
    ),
    variant: 'outline',
    size: 'default'
  }
};

export const DownloadButton = {
  name: 'Download Invoice',
  args: {
    children: (
      <>
        <Download className="w-4 h-4" />
        Download Invoice
      </>
    ),
    variant: 'secondary',
    size: 'sm'
  }
};

// Button group showcase
export const ButtonGroup = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="default">Primary</Button>
      <Button variant="outline">Secondary</Button>
      <Button variant="ghost">Tertiary</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple buttons working together in a group.'
      }
    }
  }
};

// All variants showcase
export const AllVariants = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants displayed together.'
      }
    }
  }
};

// All sizes showcase
export const AllSizes = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Heart className="w-4 h-4" />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button sizes displayed together.'
      }
    }
  }
};