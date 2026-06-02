import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../theme';
import { RegionMonitor } from '../types';
import { formatArea, formatTemp } from '../utils/format';
import { describeWeather } from '../utils/weather';
import { Card, HealthBar, StatusBadge } from './ui';

interface Props {
  monitor: RegionMonitor;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function RegionCard({ monitor, onPress, isFavorite, onToggleFavorite }: Props) {
  const { theme } = useTheme();
  const { region, current, health, alerts } = monitor;
  const weather = describeWeather(current.weatherCode, current.isDay);

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.flex}>
          <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
            {region.name}
          </Text>
          <Text style={[styles.sub, { color: theme.colors.textMuted }]} numberOfLines={1}>
            {region.crop}
            {region.locality ? ` · ${region.locality}` : ''}
            {region.state ? `/${region.state}` : ''} · {formatArea(region.areaHa)}
          </Text>
        </View>
        {onToggleFavorite ? (
          <TouchableOpacity onPress={onToggleFavorite} hitSlop={10}>
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={22}
              color={isFavorite ? theme.colors.warning : theme.colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.badgeRow}>
        <StatusBadge status={health.status} />
        {alerts.length > 0 ? (
          <View style={[styles.alertPill, { backgroundColor: theme.colors.criticalMuted }]}>
            <Ionicons name="warning" size={12} color={theme.colors.critical} />
            <Text style={[styles.alertText, { color: theme.colors.critical }]}>
              {alerts.length} alerta{alerts.length > 1 ? 's' : ''}
            </Text>
          </View>
        ) : null}
      </View>

      <HealthBar value={health.score} status={health.status} label="Saúde da lavoura (proxy NDVI)" />

      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <View style={styles.footerItem}>
          <Ionicons name={weather.icon} size={16} color={theme.colors.primary} />
          <Text style={[styles.footerValue, { color: theme.colors.text }]}>{formatTemp(current.temperature)}</Text>
          <Text style={[styles.footerMuted, { color: theme.colors.textMuted }]} numberOfLines={1}>
            {weather.label}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="water-outline" size={16} color={theme.colors.accent} />
          <Text style={[styles.footerMuted, { color: theme.colors.textMuted }]}>
            Estresse hídrico {health.hydricStress}%
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  flex: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  name: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  sub: { fontSize: fontSize.sm, marginTop: 2 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  alertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  alertText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  footerValue: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  footerMuted: { fontSize: fontSize.sm },
});
