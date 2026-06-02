import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../theme';
import { DailyForecast } from '../types';
import { dayMonth, formatPercent, formatTemp, weekdayShort } from '../utils/format';
import { describeWeather } from '../utils/weather';

export function ForecastStrip({ daily }: { daily: DailyForecast[] }) {
  const { theme } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {daily.map((day, index) => {
        const weather = describeWeather(day.weatherCode);
        return (
          <View key={day.date} style={[styles.day, { backgroundColor: theme.colors.cardAlt }]}>
            <Text style={[styles.weekday, { color: theme.colors.text }]}>
              {index === 0 ? 'Hoje' : weekdayShort(day.date)}
            </Text>
            <Text style={[styles.date, { color: theme.colors.textMuted }]}>{dayMonth(day.date)}</Text>
            <Ionicons name={weather.icon} size={24} color={theme.colors.primary} style={styles.icon} />
            <Text style={[styles.tempMax, { color: theme.colors.text }]}>{formatTemp(day.tempMax)}</Text>
            <Text style={[styles.tempMin, { color: theme.colors.textMuted }]}>{formatTemp(day.tempMin)}</Text>
            <View style={styles.rain}>
              <Ionicons name="water" size={11} color={theme.colors.accent} />
              <Text style={[styles.rainText, { color: theme.colors.accent }]}>
                {formatPercent(day.precipitationProbability)}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: spacing.xs },
  day: { width: 76, alignItems: 'center', paddingVertical: spacing.md, borderRadius: radius.md, gap: 2 },
  weekday: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  date: { fontSize: fontSize.xs },
  icon: { marginVertical: spacing.xs },
  tempMax: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  tempMin: { fontSize: fontSize.sm },
  rain: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: spacing.xs },
  rainText: { fontSize: fontSize.xs, fontWeight: fontWeight.medium },
});
