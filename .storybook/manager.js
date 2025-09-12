import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

// Create Cosmic Orange theme for manager
const cosmicOrangeManagerTheme = create({
  base: 'light',
  brandTitle: '🏠 Houseiana Design System',
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

  // Typography
  fontBase: '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontCode: 'monaco, Consolas, "Liberation Mono", "Courier New", monospace',

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

  // Grid colors
  gridCellSize: 12,
});

addons.setConfig({
  theme: cosmicOrangeManagerTheme,
  panelPosition: 'bottom',
  showNav: true,
  showPanel: true,
  showToolbar: true,
  isFullscreen: false,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  sidebar: {
    showRoots: false,
    collapsedRoots: ['other'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});