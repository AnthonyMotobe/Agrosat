import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../../theme';
import { CropStatus } from '../../types';

interface Props {
  value: number; // 0-100
  status: CropStatus;
  label?: string;
  showValue?: boolean;
}

export function HealthBar({ value, status, label, showValue = true }: Props) {
  const { theme } = useTheme();
  const color =
    status === 'healthy' ? theme.colors.healthy : status === 'warning' ? theme.colors.warning : theme.colors.critical;
  const pct = Math.max(4, Math.min(100, value));

  return (
    <View style={styles.wrap}>
      {label || showValue ? (
        <View style={styles.header}>
          {label ? <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text> : <View />}
          {showValue ? <Text style={[styles.value, { color }]}>{Math.round(value)}</Text> : null}
        </View>
      ) : null}
      <View style={[styles.track, { backgroundColor: theme.colors.cardAlt }]}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  label: { fontSize: fontSize.sm },
  value: { fontSize: fontSize.md, fontWeight: fontWeight.bold },
  track: { height: 10, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});
