import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../theme';
import { AlertType, ClimateAlert } from '../types';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const ALERT_ICON: Record<AlertType, IoniconName> = {
  frost: 'snow',
  drought: 'sunny',
  heavy_rain: 'rainy',
  heat: 'flame',
};

export function AlertCard({ alert }: { alert: ClimateAlert }) {
  const { theme } = useTheme();

  const color =
    alert.severity === 'high'
      ? theme.colors.critical
      : alert.severity === 'medium'
        ? theme.colors.warning
        : theme.colors.accent;
  const background =
    alert.severity === 'high'
      ? theme.colors.criticalMuted
      : alert.severity === 'medium'
        ? theme.colors.warningMuted
        : theme.colors.accentMuted;

  return (
    <View style={[styles.card, { backgroundColor: background, borderColor: color + '55' }]}>
      <Ionicons name={ALERT_ICON[alert.type]} size={22} color={color} />
      <View style={styles.flex}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{alert.title}</Text>
        <Text style={[styles.desc, { color: theme.colors.textMuted }]}>{alert.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  flex: { flex: 1 },
  title: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  desc: { fontSize: fontSize.sm, marginTop: 2, lineHeight: 18 },
});
