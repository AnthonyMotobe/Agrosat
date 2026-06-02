import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../../theme';

type Variant = 'primary' | 'ghost' | 'danger';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', icon, loading, disabled, style }: Props) {
  const { theme } = useTheme();

  const background =
    variant === 'primary' ? theme.colors.primary : variant === 'danger' ? theme.colors.critical : 'transparent';
  const foreground = variant === 'ghost' ? theme.colors.primary : theme.colors.primaryText;
  const borderColor = variant === 'ghost' ? theme.colors.border : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.button,
        { backgroundColor: background, borderColor, borderWidth: variant === 'ghost' ? 1 : 0, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={foreground} /> : null}
          <Text style={[styles.label, { color: foreground }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  label: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
});
