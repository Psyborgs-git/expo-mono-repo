// Light theme - default theme with light colors
export const lightTheme = {
    // Background colors
    background: '#FFFFFF',
    backgroundStrong: '#F5F5F5',
    backgroundTransparent: 'rgba(255,255,255,0.7)',
    backgroundHover: '#F9F9F9',
    backgroundPress: '#F0F0F0',
    backgroundFocus: '#E8E8E8',
    // Text colors
    color: '#212121',
    colorStrong: '#000000',
    colorPress: '#757575', // Consistent naming with dark theme
    colorDisabled: '#BDBDBD',
    colorInverse: '#FFFFFF',
    // Border colors
    borderColor: '#E0E0E0',
    borderColorStrong: '#BDBDBD',
    borderColorHover: '#9E9E9E',
    borderColorFocus: '#007AFF',
    borderFocus: '#007AFF', // Add this for Tamagui v4
    // Semantic colors - brand
    primary: '#007AFF',
    primaryLight: '#5AC8FA',
    primaryDark: '#0051D5',
    secondary: '#5856D6',
    secondaryLight: '#AF52DE',
    secondaryDark: '#3634A3',
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
// Dark theme - optimized for dark mode
export const darkTheme = {
    // Background colors
    background: '#121212',
    backgroundStrong: '#1E1E1E',
    backgroundTransparent: 'rgba(18,18,18,0.7)',
    backgroundHover: '#1C1C1C',
    backgroundPress: '#252525',
    backgroundFocus: '#2C2C2C',
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
    // Semantic colors - brand (adjusted for dark mode)
    primary: '#5AC8FA',
    primaryLight: '#8CDCFF',
    primaryDark: '#0099CC',
    secondary: '#AF52DE',
    secondaryLight: '#D180F5',
    secondaryDark: '#8E3FB8',
    accent: '#FFB340',
    accentLight: '#FFD166',
    accentDark: '#FF9500',
    // Semantic colors - feedback
    success: '#5DD87F',
    successLight: '#88E5A1',
    successDark: '#34C759',
    error: '#FF6961',
    errorLight: '#FF9590',
    errorDark: '#FF3B30',
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
