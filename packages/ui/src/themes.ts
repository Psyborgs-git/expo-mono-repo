// Light theme - default theme with light colors and Gen-Z gradients
export const lightTheme = {
  // Background colors with subtle gradients
  background: '#FFFFFF',
  backgroundStrong: '#F9FAFB',
  backgroundTransparent: 'rgba(255,255,255,0.7)',
  backgroundHover: '#FFF1F8',
  backgroundPress: '#FFE4F0',
  backgroundFocus: '#E8E8E8',
  backgroundGradientStart: '#FFF1F8',
  backgroundGradientEnd: '#F5F3FF',
  cardGradientStart: '#FFFFFF',
  cardGradientEnd: '#FFF1F8',

  // Text colors
  color: '#212121',
  colorStrong: '#000000',
  colorPress: '#757575', // Consistent naming with dark theme
  colorDisabled: '#BDBDBD',
  colorInverse: '#FFFFFF',
  text: '#212121',
  textWeak: '#757575',
  textDisabled: '#BDBDBD',

  // Border colors
  borderColor: '#E0E0E0',
  borderColorStrong: '#BDBDBD',
  borderColorHover: '#9E9E9E',
  borderColorFocus: '#007AFF',
  borderFocus: '#007AFF', // Add this for Tamagui v4

  // Semantic colors - brand (Gen-Z vibrant palette)
  primary: '#FF006E',
  primaryLight: '#FF4D9D',
  primaryDark: '#D1004F',
  
  secondary: '#8B5CF6',
  secondaryLight: '#A78BFA',
  secondaryDark: '#7C3AED',
  
  // Gradient colors
  gradientPink: '#FF006E',
  gradientPurple: '#8B5CF6',
  gradientBlue: '#3B82F6',
  gradientOrange: '#F59E0B',
  gradientTeal: '#14B8A6',
  
  accent: '#FF9500',
  accentLight: '#FFB340',
  accentDark: '#C77700',

  // Semantic colors - feedback
  success: '#34C759',
  successLight: '#5DD87F',
  successDark: '#248A3D',
  
  error: '#FF3B30',
  errorLight: '#FF6961',
  errorDark: '#C41E3A',
  errorBackground: '#FFE5E5',
  
  warning: '#FFCC00',
  warningLight: '#FFD833',
  warningDark: '#CC9900',
  
  info: '#007AFF',
  infoLight: '#5AC8FA',
  infoDark: '#0051D5',

  // Overlays and shadows
  shadowColor: 'rgba(0,0,0,0.1)',
  shadowColorStrong: 'rgba(0,0,0,0.2)',
  overlay: 'rgba(0,0,0,0.5)',
  
  placeholder: '#9E9E9E',
  // placeholder token (single entry)

  // Red scale
  red5: '#FFE5E5',
  red10: '#FF3B30',
  red11: '#C41E3A',
  
  // Green scale
  green5: '#E5F5E8',
  green9: '#5DD87F',
  green10: '#34C759',
  green11: '#248A3D',
  
  // Blue scale
  blue5: '#E5F2FF',
  blue9: '#5AC8FA',
  blue10: '#007AFF',
  blue11: '#0051D5',
  
  // Yellow scale
  yellow10: '#FFCC00',
  yellow11: '#CC9900',
  
  // Orange scale
  orange5: '#FFF3E5',
  orange10: '#FF9500',
  orange11: '#C77700',
  
  // Purple scale
  purple9: '#D180F5',
};

// Dark theme - optimized for dark mode with Gen-Z gradients
export const darkTheme = {
  // Background colors with gradient support
  background: '#0A0A0A',
  backgroundStrong: '#1A1A1A',
  backgroundTransparent: 'rgba(10,10,10,0.7)',
  backgroundHover: '#1C1C1C',
  backgroundPress: '#252525',
  backgroundFocus: '#2C2C2C',
  backgroundGradientStart: '#1A0A1F',
  backgroundGradientEnd: '#0A0A0A',
  cardGradientStart: '#1A1A1A',
  cardGradientEnd: '#1A0A1F',

  // Text colors
  color: '#E5E5E5',
  // color11: Use 'color' instead for Tamagui v4
  colorStrong: '#FFFFFF',
  colorPress: '#9E9E9E', // Renamed from colorWeak
  colorDisabled: '#616161',
  colorInverse: '#121212',

  // Border colors
  borderColor: '#424242',
  borderColorStrong: '#616161',
  borderColorHover: '#757575',
  borderColorFocus: '#5AC8FA',
  borderFocus: '#5AC8FA', // Add this for Tamagui v4

  // Semantic colors - brand (Gen-Z palette for dark mode)
  primary: '#FF4D9D',
  primaryLight: '#FF80B8',
  primaryDark: '#FF006E',
  
  secondary: '#A78BFA',
  secondaryLight: '#C4B5FD',
  secondaryDark: '#8B5CF6',
  
  // Gradient colors (darker variants)
  gradientPink: '#FF4D9D',
  gradientPurple: '#A78BFA',
  gradientBlue: '#60A5FA',
  gradientOrange: '#FBBF24',
  gradientTeal: '#2DD4BF',
  
  accent: '#FFB340',
  accentLight: '#FFD166',
  accentDark: '#FF9500',

  // Semantic colors - feedback
  success: '#5DD87F',
  successLight: '#88E5A1',
  successDark: '#34C759',
  
  error: '#FF6961',
  errorLight: '#FF9B99',
  errorDark: '#FF3B30',
  errorBackground: '#4D1A1A',
  
  warning: '#FFD833',
  warningLight: '#FFE566',
  warningDark: '#FFCC00',
  
  info: '#5AC8FA',
  infoLight: '#8CDCFF',
  infoDark: '#007AFF',

  // Overlays and shadows
  shadowColor: 'rgba(0,0,0,0.4)',
  shadowColorStrong: 'rgba(0,0,0,0.6)',
  overlay: 'rgba(0,0,0,0.7)',
  
  placeholder: '#757575',

  // Red scale
  red5: '#3D1F1F',
  
  // Green scale
  green5: '#1F3D25',
  green9: '#88E5A1',
  green10: '#5DD87F',
  green11: '#88E5A1',
  
  // Blue scale
  blue5: '#1F2D3D',
  blue9: '#8CDCFF',
  blue10: '#5AC8FA',
  blue11: '#8CDCFF',
  
  // Yellow scale
  yellow10: '#FFE566',
  yellow11: '#FFD833',
  
  // Orange scale
  orange5: '#3D2F1F',
  orange10: '#FFB340',
  orange11: '#FFD166',
  
  // Purple scale
  purple9: '#D180F5',
};

// Component-specific themes
export const componentThemes = {
  // Button themes
  button: {
    background: '$primary',
    backgroundHover: '$primaryDark',
    backgroundPress: '$primaryDark',
    color: '$colorInverse',
  },
  button_outlined: {
    background: 'transparent',
    backgroundHover: '$backgroundHover',
    backgroundPress: '$backgroundPress',
    borderColor: '$primary',
    color: '$primary',
  },
  button_ghost: {
    background: 'transparent',
    backgroundHover: '$backgroundHover',
    backgroundPress: '$backgroundPress',
    color: '$primary',
  },

  // Input themes
  input: {
    background: '$background',
    backgroundFocus: '$backgroundFocus',
    borderColor: '$borderColor',
    borderColorFocus: '$borderFocus',
    color: '$color',
    placeholderColor: '$placeholder',
  },

  // Card themes
  card: {
    background: '$background',
    backgroundHover: '$backgroundHover',
    borderColor: '$borderColor',
    shadowColor: '$shadowColor',
  },
};
