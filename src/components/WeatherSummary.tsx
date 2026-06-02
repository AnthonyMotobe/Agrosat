import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../theme';
import { WeatherSnapshot } from '../types';
import { formatMm, formatPercent, formatTemp } from '../utils/format';
import { describeWeather } from '../utils/weather';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export function WeatherSummary({ current }: { current: WeatherSnapshot }) {
  const { theme } = useTheme();
  const weather = describeWeather(current.weatherCode, current.isDay);

  const metrics: { icon: IoniconName; label: string; value: string }[] = [
    { icon: 'thermometer-outline', label: 'Sensação', value: formatTemp(current.apparentTemperature) },
    { icon: 'water-outline', label: 'Umidade', value: formatPercent(current.humidity) },
    { icon: 'rainy-outline', label: 'Precipitação', value: formatMm(current.precipitation) },
    {
      icon: 'leaf-outline',
      label: 'Umidade do solo',
      value: current.soilMoisture != null ? formatPercent(current.soilMoisture * 100) : '--',
    },
    { icon: 'navigate-outline', label: 'Vento', value: `${Math.round(current.windSpeed)} km/h` },
  ];

  return (
    <View style={styles.wrap}>
      <View style={styles.heroRow}>
        <Ionicons name={weather.icon} size={48} color={theme.colors.primary} />
        <View>
          <Text style={[styles.temp, { color: theme.colors.text }]}>{formatTemp(current.temperature)}</Text>
          <Text style={[styles.desc, { color: theme.colors.textMuted }]}>{weather.label}</Text>
        </View>
      </View>
      <View style={styles.grid}>
        {metrics.map((metric) => (
          <View key={metric.label} style={[styles.metric, { backgroundColor: theme.colors.cardAlt }]}>
            <Ionicons name={metric.icon} size={16} color={theme.colors.textMuted} />
            <Text style={[styles.metricValue, { color: theme.colors.text }]}>{metric.value}</Text>
            <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>{metric.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  temp: { fontSize: fontSize.display, fontWeight: fontWeight.bold, lineHeight: 40 },
  desc: { fontSize: fontSize.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metric: { width: '31%', flexGrow: 1, padding: spacing.sm, borderRadius: radius.md, gap: 2 },
  metricValue: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  metricLabel: { fontSize: fontSize.xs },
});
