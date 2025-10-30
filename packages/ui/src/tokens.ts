// Comprehensive token set for design system
export const tokens = {
  // Comprehensive size scale (0-20)
  size: {
    0: 0,
    0.25: 2,
    0.5: 4,
    0.75: 6,
    1: 8,
    1.5: 12,
    2: 16,
    2.5: 20,
    3: 24,
    3.5: 28,
    4: 32,
    4.5: 36,
    5: 40,
    6: 48,
    7: 56,
    8: 64,
    9: 72,
    10: 80,
    11: 88,
    12: 96,
    13: 104,
    14: 112,
    15: 120,
    16: 128,
    17: 136,
    18: 144,
    19: 152,
    20: 160,
    true: 16, // default
  },

  // Space scale (matches size, includes negatives)
  space: {
    0: 0,
    0.25: 2,
    0.5: 4,
    0.75: 6,
    1: 8,
    1.5: 12,
    2: 16,
    2.5: 20,
    3: 24,
    3.5: 28,
    4: 32,
    4.5: 36,
    5: 40,
    6: 48,
    7: 56,
    8: 64,
    9: 72,
    10: 80,
    11: 88,
    12: 96,
    '-0.25': -2,
    '-0.5': -4,
    '-0.75': -6,
    '-1': -8,
    '-1.5': -12,
    '-2': -16,
    '-2.5': -20,
    '-3': -24,
    '-3.5': -28,
    '-4': -32,
    true: 16, // default
  },

  // Radius scale
  radius: {
    0: 0,
    1: 2,
    2: 4,
    3: 6,
    4: 8,
    5: 12,
    6: 16,
    7: 20,
    8: 24,
    9: 28,
    10: 32,
    true: 8, // default
  },

  // Z-index scale
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },

  // Color tokens - semantic colors (values set in themes)
  color: {
    // Brand colors
    primary: '#007AFF',
    primaryLight: '#5AC8FA',
    primaryDark: '#0051D5',
    
    secondary: '#5856D6',
    secondaryLight: '#AF52DE',
    secondaryDark: '#3634A3',
    
    accent: '#FF9500',
    accentLight: '#FFB340',
    accentDark: '#C77700',

    // Semantic colors
    success: '#34C759',
    successLight: '#5DD87F',
    successDark: '#248A3D',
    
    error: '#FF3B30',
    errorLight: '#FF6961',
    errorDark: '#C41E3A',
    
    warning: '#FFCC00',
    warningLight: '#FFD833',
    warningDark: '#CC9900',
    
    info: '#007AFF',
    infoLight: '#5AC8FA',
    infoDark: '#0051D5',

    // Neutral/Gray scale
    gray1: '#FAFAFA',
    gray2: '#F5F5F5',
    gray3: '#EEEEEE',
    gray4: '#E0E0E0',
    gray5: '#BDBDBD',
    gray6: '#9E9E9E',
    gray7: '#757575',
    gray8: '#616161',
    gray9: '#424242',
    gray10: '#212121',
    gray11: '#121212',
    gray12: '#000000',

    // Color scale tokens (will be overridden in themes)
    red5: '#FFE5E5',
    red9: '#FF6961',
    red10: '#FF3B30',
    red11: '#C41E3A',
    
    green5: '#E5F5E8',
    green9: '#5DD87F',
    green10: '#34C759',
    green11: '#248A3D',
    
    blue5: '#E5F2FF',
    blue8: '#007AFF',
    blue9: '#5AC8FA',
    blue10: '#007AFF',
    blue11: '#0051D5',
    
    yellow10: '#FFCC00',
    yellow11: '#CC9900',
    
    orange5: '#FFF3E5',
    orange10: '#FF9500',
    orange11: '#C77700',
    
    purple9: '#D180F5',

    // Semantic UI colors (mapped in themes)
    background: '#FFFFFF',
    backgroundStrong: '#F5F5F5',
    backgroundTransparent: 'rgba(255,255,255,0.7)',
    backgroundHover: '#F9F9F9',
    backgroundPress: '#F0F0F0',
    backgroundFocus: '#E8E8E8',
    
    text: '#212121',
    textStrong: '#000000',
    textWeak: '#757575',
    textDisabled: '#BDBDBD',
    textInverse: '#FFFFFF',
    
    border: '#E0E0E0',
    borderStrong: '#BDBDBD',
    borderHover: '#9E9E9E',
    borderFocus: '#007AFF',
    
    placeholder: '#9E9E9E',
    
    // Overlays
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowColorStrong: 'rgba(0,0,0,0.2)',
    overlay: 'rgba(0,0,0,0.5)',
  },
};

