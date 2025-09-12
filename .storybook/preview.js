import { create } from '@storybook/theming/create';
import '../src/app/globals.css';

// Create Cosmic Orange theme
const cosmicOrangeTheme = create({
  base: 'light',
  brandTitle: 'Houseiana Design System',
  brandUrl: 'https://dev-web3js.github.io/Houseiana-FronEnd/',
  brandImage: null,
  brandTarget: '_self',

  // Colors - Cosmic Orange palette
  colorPrimary: '#FF6B35', // Cosmic Orange primary
  colorSecondary: '#F7931E', // Orange secondary

  // UI colors
  appBg: '#FFF8F5', // Very light orange background
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#FFB896', // Light orange border
  appBorderRadius: 8,

  // Text colors
  textColor: '#2D1B12', // Dark brown for better contrast
  textInverseColor: '#FFFFFF',
  textMutedColor: '#8B5A3C', // Muted brown

  // Toolbar colors
  barTextColor: '#2D1B12',
  barSelectedColor: '#FF6B35',
  barHoverColor: '#FF8A65',
  barBg: '#FFF0EB', // Very light orange

  // Button colors
  buttonBg: '#FF6B35',
  buttonBorder: '#FF6B35',
  booleanBg: '#FFF0EB',
  booleanSelectedBg: '#FF6B35',

  // Input colors
  inputBg: '#FFFFFF',
  inputBorder: '#FFB896',
  inputTextColor: '#2D1B12',
  inputBorderRadius: 6,
});

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    docs: {
      theme: cosmicOrangeTheme,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#FFFFFF',
        },
        {
          name: 'cosmic-orange-light',
          value: '#FFF8F5',
        },
        {
          name: 'cosmic-orange',
          value: '#FF6B35',
        },
        {
          name: 'dark',
          value: '#2D1B12',
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '812px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
  },
};

export default preview;