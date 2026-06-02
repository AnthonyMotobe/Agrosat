import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { cardShadow, radius, spacing } from '../../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padded?: boolean;
}

export function Card({ children, style, onPress, padded = true }: Props) {
  const { theme } = useTheme();
  const base: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    padding: padded ? spacing.lg : 0,
    ...cardShadow(theme.dark),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [base, style, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[base, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
});
