import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { cardShadow, fontSize, fontWeight, radius, spacing } from '../../theme';

interface Props {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  tint?: string;
}

export function StatCard({ icon, label, value, tint }: Props) {
  const { theme } = useTheme();
  const color = tint ?? theme.colors.primary;
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        cardShadow(theme.dark),
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.value, { color: theme.colors.text }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={[styles.label, { color: theme.colors.textMuted }]} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
  },
  iconWrap: { width: 34, height: 34, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  value: { fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  label: { fontSize: fontSize.xs, lineHeight: 15 },
});
