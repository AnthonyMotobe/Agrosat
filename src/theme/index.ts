import { TextStyle, ViewStyle } from 'react-native';

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  cardAlt: string;
  text: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryMuted: string;
  primaryText: string;
  accent: string;
  accentMuted: string;
  border: string;
  healthy: string;
  warning: string;
  critical: string;
  healthyMuted: string;
  warningMuted: string;
  criticalMuted: string;
  overlay: string;
  tabBar: string;
  tabBarBorder: string;
  skeleton: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: '#EEF3EE',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardAlt: '#F4F8F4',
  text: '#13211A',
  textMuted: '#5C6B62',
  textInverse: '#FFFFFF',
  primary: '#2E7D4F',
  primaryMuted: '#DCEFE3',
  primaryText: '#FFFFFF',
  accent: '#1366C9',
  accentMuted: '#D8E8FB',
  border: '#E1E8E2',
  healthy: '#2E9E5B',
  warning: '#C98A00',
  critical: '#CF4242',
  healthyMuted: '#DBF0E2',
  warningMuted: '#F8ECCB',
  criticalMuted: '#F7DEDE',
  overlay: 'rgba(10,20,15,0.45)',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E1E8E2',
  skeleton: '#E6ECE7',
};

const darkColors: ThemeColors = {
  background: '#0B1220',
  surface: '#101A2C',
  card: '#15223A',
  cardAlt: '#1B2A45',
  text: '#E8EEF7',
  textMuted: '#94A3BA',
  textInverse: '#0B1220',
  primary: '#3FBF6F',
  primaryMuted: '#143524',
  primaryText: '#06140B',
  accent: '#5AA2FF',
  accentMuted: '#12294A',
  border: '#23324D',
  healthy: '#3FBF6F',
  warning: '#F2B441',
  critical: '#F2685C',
  healthyMuted: '#10331F',
  warningMuted: '#3A2E12',
  criticalMuted: '#3A1B1B',
  overlay: 'rgba(0,0,0,0.6)',
  tabBar: '#101A2C',
  tabBarBorder: '#23324D',
  skeleton: '#1B2A45',
};

export const lightTheme: Theme = { dark: false, colors: lightColors };
export const darkTheme: Theme = { dark: true, colors: darkColors };

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
} as const;

export const fontWeight: Record<'regular' | 'medium' | 'semibold' | 'bold', TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export function cardShadow(dark: boolean): ViewStyle {
  return dark
    ? {
        shadowColor: '#000000',
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }
    : {
        shadowColor: '#1B3A2A',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
      };
}
