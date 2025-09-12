// Luxury Theme Configuration - Inspired by Louis Vuitton
// Modern, Elegant, and Sophisticated Design System

export const theme = {
  // Louis Vuitton inspired color palette
  colors: {
    // Primary orange - LV signature orange
    primary: {
      50: '#FFF4E6',
      100: '#FFE4CC',
      200: '#FFC999',
      300: '#FFAD66',
      400: '#FF9233',
      500: '#FF6F00', // Main LV Orange
      600: '#E65100',
      700: '#CC4700',
      800: '#B33D00',
      900: '#993300'
    },
    
    // Luxury blacks and grays
    dark: {
      900: '#0A0A0A', // Pure luxury black
      800: '#1A1A1A',
      700: '#2A2A2A',
      600: '#3A3A3A',
      500: '#4A4A4A',
      400: '#5A5A5A',
      300: '#6A6A6A',
      200: '#8A8A8A',
      100: '#AAAAAA'
    },
    
    // Elegant whites and creams
    light: {
      50: '#FFFFFF',
      100: '#FAFAFA',
      200: '#F5F5F5',
      300: '#F0F0F0',
      400: '#E8E8E8',
      500: '#E0E0E0',
      600: '#D8D8D8',
      700: '#CCCCCC',
      800: '#BBBBBB',
      900: '#AAAAAA'
    },
    
    // Accent colors
    accent: {
      gold: '#D4AF37',      // Luxury gold
      bronze: '#CD7F32',    // Bronze accents
      champagne: '#F7E7CE', // Soft champagne
      pearl: '#FFF8E7',     // Pearl white
      copper: '#B87333',    // Copper tone
      rose: '#FFE4E1'       // Rose gold tint
    },
    
    // Semantic colors
    success: '#00C853',
    warning: '#FFB300',
    error: '#FF3D00',
    info: '#00B8D4'
  },
  
  // Typography system
  typography: {
    // Font families
    fonts: {
      heading: "'Playfair Display', 'Didot', 'Georgia', serif",
      body: "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
      luxury: "'Montserrat', 'Futura', 'Helvetica', sans-serif",
      accent: "'Poppins', 'Circular', sans-serif"
    },
    
    // Font sizes
    sizes: {
      hero: '72px',
      h1: '48px',
      h2: '36px',
      h3: '28px',
      h4: '24px',
      h5: '20px',
      h6: '18px',
      body: '16px',
      small: '14px',
      tiny: '12px'
    },
    
    // Font weights
    weights: {
      thin: 100,
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
      black: 900
    },
    
    // Letter spacing
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
      wider: '0.04em',
      widest: '0.08em',
      luxury: '0.12em' // For luxury headings
    }
  },
  
  // Spacing system
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
    huge: '96px'
  },
  
  // Border radius
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '24px',
    full: '9999px'
  },
  
  // Shadows for depth
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.06)',
    md: '0 4px 8px rgba(0,0,0,0.08)',
    lg: '0 8px 16px rgba(0,0,0,0.10)',
    xl: '0 12px 24px rgba(0,0,0,0.12)',
    xxl: '0 24px 48px rgba(0,0,0,0.16)',
    luxury: '0 20px 40px rgba(255, 111, 0, 0.15)', // Orange glow
    gold: '0 20px 40px rgba(212, 175, 55, 0.20)'  // Gold glow
  },
  
  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    luxury: '500ms cubic-bezier(0.165, 0.84, 0.44, 1)' // Smooth luxury transition
  },
  
  // Breakpoints
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px'
  },
  
  // Z-index layers
  zIndex: {
    below: -1,
    base: 0,
    dropdown: 10,
    sticky: 50,
    overlay: 100,
    modal: 200,
    popover: 300,
    tooltip: 400,
    notification: 500,
    top: 999
  }
};

// Gradient presets
export const gradients = {
  // Orange gradients
  primary: 'linear-gradient(135deg, #FF6F00 0%, #FF9233 100%)',
  primaryDark: 'linear-gradient(135deg, #E65100 0%, #FF6F00 100%)',
  primaryLight: 'linear-gradient(135deg, #FF9233 0%, #FFAD66 100%)',
  
  // Luxury gradients
  luxury: 'linear-gradient(135deg, #FF6F00 0%, #D4AF37 100%)',
  gold: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 100%)',
  bronze: 'linear-gradient(135deg, #CD7F32 0%, #D4AF37 100%)',
  
  // Dark gradients
  dark: 'linear-gradient(135deg, #0A0A0A 0%, #2A2A2A 100%)',
  elegant: 'linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)',
  
  // Overlay gradients
  overlay: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
  overlayOrange: 'linear-gradient(180deg, rgba(255,111,0,0.9) 0%, rgba(255,146,51,0.4) 100%)'
};

// Animation presets
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  slideUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 }
  },
  slideDown: {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 }
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 }
  },
  luxury: {
    from: { transform: 'scale(0.98) translateY(10px)', opacity: 0 },
    to: { transform: 'scale(1) translateY(0)', opacity: 1 }
  }
};

// Component styles
export const componentStyles = {
  // Button styles
  button: {
    primary: {
      background: gradients.primary,
      color: theme.colors.light[50],
      padding: '14px 32px',
      borderRadius: theme.radius.lg,
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.semiBold,
      letterSpacing: theme.typography.letterSpacing.wide,
      boxShadow: theme.shadows.lg,
      transition: theme.transitions.luxury,
      border: 'none',
      cursor: 'pointer',
      textTransform: 'uppercase'
    },
    luxury: {
      background: gradients.luxury,
      color: theme.colors.light[50],
      padding: '16px 40px',
      borderRadius: theme.radius.xl,
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.bold,
      letterSpacing: theme.typography.letterSpacing.luxury,
      boxShadow: theme.shadows.luxury,
      transition: theme.transitions.luxury,
      border: 'none',
      cursor: 'pointer',
      textTransform: 'uppercase'
    },
    outline: {
      background: 'transparent',
      color: theme.colors.primary[500],
      padding: '14px 32px',
      borderRadius: theme.radius.lg,
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.semiBold,
      letterSpacing: theme.typography.letterSpacing.wide,
      border: `2px solid ${theme.colors.primary[500]}`,
      transition: theme.transitions.luxury,
      cursor: 'pointer'
    }
  },
  
  // Card styles
  card: {
    luxury: {
      background: theme.colors.light[50],
      borderRadius: theme.radius.xl,
      padding: theme.spacing.xl,
      boxShadow: theme.shadows.xl,
      border: `1px solid ${theme.colors.light[300]}`,
      transition: theme.transitions.luxury
    },
    elevated: {
      background: theme.colors.light[50],
      borderRadius: theme.radius.xxl,
      padding: theme.spacing.xl,
      boxShadow: theme.shadows.xxl,
      transition: theme.transitions.luxury
    }
  },
  
  // Input styles
  input: {
    luxury: {
      padding: '14px 20px',
      borderRadius: theme.radius.lg,
      border: `1px solid ${theme.colors.light[400]}`,
      fontSize: theme.typography.sizes.body,
      background: theme.colors.light[50],
      transition: theme.transitions.normal,
      outline: 'none'
    }
  }
};

// Utility functions
export const utils = {
  // Create box shadow with color
  colorShadow: (color, opacity = 0.3) => {
    return `0 20px 40px ${color}${Math.round(opacity * 255).toString(16)}`;
  },
  
  // Create gradient text
  gradientText: (gradient) => ({
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }),
  
  // Glass morphism effect
  glassMorphism: (opacity = 0.1) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `1px solid rgba(255, 255, 255, ${opacity * 2})`
  })
};

export default theme;