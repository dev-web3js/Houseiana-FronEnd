# 📚 Houseiana Design System Documentation

This repository contains comprehensive Storybook documentation for the Houseiana Frontend UI components.

## 🌐 Live Documentation

**🚀 [View Live Storybook Documentation](https://dev-web3js.github.io/Houseiana-FronEnd/)**

The documentation is automatically deployed to GitHub Pages whenever changes are made to the components.

## 🏠 About Houseiana

Houseiana is a premium property rental platform for the Qatar market, connecting property owners with guests seeking luxury accommodations. Our component library provides a consistent, accessible, and culturally-appropriate user interface.

## 📖 What's Documented

### UI Components
- **Button** - Versatile button component with multiple variants and sizes
- **Input Fields** - Form inputs with validation and styling
- **Cards** - Content containers for various use cases
- **Modals & Dialogs** - Overlay components for user interactions

### Property Components  
- **PropertyCard** - Property listing display with images and details
- **PropertyMap** - Interactive maps for property locations
- **ListingCard** - Simplified property cards for search results

### Booking Components
- **BookingWidget** - Complete booking interface with date selection
- **PricingBreakdown** - Detailed price calculation display
- **AvailabilityCalendar** - Interactive calendar for date selection

### Navigation Components
- **UserNavbar** - Main navigation with user authentication states  
- **SearchBar** - Property search with location and date filters
- **Footer** - Site footer with links and information

### Form Components
- **Authentication Forms** - Login, register, and password reset
- **Search Forms** - Property search with advanced filters
- **Contact Forms** - User inquiry and support forms

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/dev-web3js/Houseiana-FronEnd.git
   cd Houseiana-FronEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Storybook development server**
   ```bash
   npm run storybook
   ```

4. **Open your browser**
   Navigate to `http://localhost:6006`

### Building Documentation

To build the documentation for production:

```bash
npm run build-storybook
```

This creates a `storybook-static` folder with the built documentation.

## 🎨 Design System Features

### Responsive Design
All components are tested and documented across multiple breakpoints:
- Mobile: 375px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

### Accessibility
Every component follows WCAG 2.1 AA guidelines:
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels and roles
- Color contrast compliance

### Cultural Considerations
Components are designed for the Middle Eastern market:
- Arabic language support (RTL)
- Cultural color preferences
- Local business practices
- Qatar-specific requirements

### Technology Stack
- **React 19** - Latest React features and performance
- **Next.js 15** - Full-stack React framework
- **Tailwind CSS 4** - Utility-first styling with custom design tokens
- **Radix UI** - Headless components for accessibility
- **Lucide React** - Modern icon library

## 📱 Component Categories

### 1. Foundation
Base components that form the building blocks of the interface.

### 2. Layout
Components that structure page layouts and content organization.

### 3. Navigation  
Components for site navigation and user flow management.

### 4. Data Display
Components for presenting information and data to users.

### 5. User Input
Form components and interactive elements for user input.

### 6. Feedback
Components for showing loading states, errors, and success messages.

### 7. Specialized
Business-specific components for property rental workflows.

## 🔧 Development Scripts

```bash
# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook

# Run component tests
npm test

# Run accessibility tests
npm run test:a11y

# Lint components
npm run lint
```

## 📦 Deployment

### Automatic Deployment
The documentation is automatically deployed to GitHub Pages via GitHub Actions when:
- Changes are pushed to the `main` branch
- Component files are modified
- Storybook configuration is updated

### Manual Deployment
You can also trigger deployment manually from the GitHub Actions tab.

### Custom Domain (Optional)
To use a custom domain, add a `CNAME` file to the repository root with your domain name.

## 🤝 Contributing

### Adding New Components

1. **Create the component** in `src/components/`
2. **Add component stories** in the same directory as `ComponentName.stories.js`
3. **Include comprehensive examples** showing all variants and states
4. **Test responsive behavior** across different screen sizes
5. **Verify accessibility** with built-in a11y addon

### Story Structure
```javascript
import Component from './Component';

export default {
  title: 'Category/ComponentName',
  component: Component,
  parameters: {
    docs: {
      description: {
        component: 'Detailed component description'
      }
    }
  },
  tags: ['autodocs']
};

export const Default = {
  args: {
    // Default props
  }
};

export const Variant = {
  args: {
    // Variant props
  }
};
```

## 📞 Support

### Documentation Issues
If you find issues with the documentation:
- Open an issue in the GitHub repository
- Include steps to reproduce
- Provide screenshots if applicable

### Component Questions
For questions about component usage:
- Check the component's documentation page
- Review the interactive examples
- Examine the code snippets provided

### Technical Support
For technical implementation questions:
- Review the README in the main repository
- Check the component prop documentation
- Consult the development team

## 🔗 Useful Links

- **Live Documentation**: https://dev-web3js.github.io/Houseiana-FronEnd/
- **Main Repository**: https://github.com/dev-web3js/Houseiana-FronEnd
- **Backend API**: https://github.com/dev-web3js/Houseiana-BackEnd
- **Mobile App**: https://github.com/dev-web3js/Houseiana-Mobile-app

## 📄 License

This project is private and proprietary. All rights reserved.

---

Built with ❤️ for the Qatar market by the Houseiana team.