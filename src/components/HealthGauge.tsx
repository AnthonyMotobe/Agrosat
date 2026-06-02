import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { fontSize, fontWeight, spacing } from '../theme';
import { CropHealth } from '../types';
import { StatusBadge } from './ui';

export function HealthGauge({ health }: { health: CropHealth }) {
  const { theme } = useTheme();
  const color =
    health.status === 'healthy'
      ? theme.colors.healthy
      : health.status === 'warning'
        ? theme.colors.warning
        : theme.colors.critical;

  return (
    <View style={styles.row}>
      <View style={[styles.disc, { borderColor: color, backgroundColor: color + '18' }]}>
        <Text style={[styles.score, { color }]}>{health.score}</Text>
        <Text style={[styles.unit, { color: theme.colors.textMuted }]}>/ 100</Text>
      </View>
      <View style={styles.info}>
        <StatusBadge status={health.status} />
        <Text style={[styles.ndvi, { color: theme.colors.text }]}>Índice NDVI (proxy): {health.ndvi.toFixed(2)}</Text>
        <Text style={[styles.summary, { color: theme.colors.textMuted }]}>{health.summary}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  disc: { width: 96, height: 96, borderRadius: 48, borderWidth: 6, alignItems: 'center', justifyContent: 'center' },
  score: { fontSize: fontSize.display, fontWeight: fontWeight.bold, lineHeight: 38 },
  unit: { fontSize: fontSize.xs },
  info: { flex: 1, gap: spacing.xs },
  ndvi: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  summary: { fontSize: fontSize.sm, lineHeight: 19 },
});
