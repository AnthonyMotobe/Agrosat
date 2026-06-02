import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../../theme';
import { CropStatus } from '../../types';
import { STATUS_LABEL } from '../../utils/weather';

export function StatusBadge({ status, label }: { status: CropStatus; label?: string }) {
  const { theme } = useTheme();
  const palette: Record<CropStatus, { bg: string; fg: string }> = {
    healthy: { bg: theme.colors.healthyMuted, fg: theme.colors.healthy },
    warning: { bg: theme.colors.warningMuted, fg: theme.colors.warning },
    critical: { bg: theme.colors.criticalMuted, fg: theme.colors.critical },
  };
  const colors = palette[status];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <View style={[styles.dot, { backgroundColor: colors.fg }]} />
      <Text style={[styles.text, { color: colors.fg }]}>{label ?? STATUS_LABEL[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    gap: spacing.xs,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, textTransform: 'uppercase', letterSpacing: 0.4 },
});
