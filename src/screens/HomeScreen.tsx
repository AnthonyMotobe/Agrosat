import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ApodCard,
  BarChart,
  Card,
  ErrorState,
  Loading,
  RegionCard,
  ScreenContainer,
  SectionHeader,
  StatCard,
} from '../components';
import { useTheme } from '../contexts/ThemeContext';
import { useApod, useMonitors, useRegions } from '../hooks';
import { TabScreenProps } from '../navigation/types';
import { fontSize, fontWeight, spacing } from '../theme';
import { formatArea, formatTemp } from '../utils/format';
import { statusFromScore } from '../utils/weather';

export function HomeScreen({ navigation }: TabScreenProps<'Home'>) {
  const { theme } = useTheme();
  const { regions } = useRegions();
  const { data: monitors, loading, error, refetch } = useMonitors(regions);
  const apod = useApod();

  const healthTint = (score: number) => {
    const status = statusFromScore(score);
    return status === 'healthy' ? theme.colors.healthy : status === 'warning' ? theme.colors.warning : theme.colors.critical;
  };

  const stats = useMemo(() => {
    if (!monitors.length) return null;
    const avg = Math.round(monitors.reduce((s, m) => s + m.health.score, 0) / monitors.length);
    const inAlert = monitors.filter((m) => m.alerts.length > 0 || m.health.status === 'critical').length;
    const totalArea = monitors.reduce((s, m) => s + m.region.areaHa, 0);
    return { avg, inAlert, totalArea, count: monitors.length };
  }, [monitors]);

  const chartData = useMemo(
    () =>
      monitors.map((m) => ({
        label: (m.region.locality ?? m.region.name).slice(0, 4),
        value: m.health.score,
        highlight: m.health.status === 'critical',
      })),
    [monitors],
  );

  if (loading && !monitors.length) {
    return (
      <ScreenContainer>
        <Loading label="Carregando dados das lavouras..." />
      </ScreenContainer>
    );
  }

  if (error && !monitors.length) {
    return (
      <ScreenContainer>
        <ErrorState message={error} onRetry={refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll refreshing={loading} onRefresh={refetch}>
      <View>
        <Text style={[styles.kicker, { color: theme.colors.primary }]}>TERRAMIND · MONITORAMENTO AGROCLIMÁTICO</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>Painel das lavouras</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Índice de saúde (proxy de NDVI) e risco climático por lavoura, a partir de dados climáticos e agroambientais — modelo heurístico explicável.
        </Text>
      </View>

      {stats ? (
        <View style={styles.statsGrid}>
          <StatCard icon="pulse" label="Saúde média (proxy NDVI)" value={`${stats.avg}`} tint={healthTint(stats.avg)} />
          <StatCard icon="warning-outline" label="Lavouras em alerta" value={`${stats.inAlert}`} tint={theme.colors.warning} />
          <StatCard icon="leaf-outline" label="Regiões monitoradas" value={`${stats.count}`} />
          <StatCard icon="resize-outline" label="Área total" value={formatArea(stats.totalArea)} tint={theme.colors.accent} />
        </View>
      ) : null}

      {chartData.length ? (
        <Card>
          <SectionHeader title="Saúde por lavoura" subtitle="Índice 0–100 (proxy de NDVI)" />
          <View style={styles.chartWrap}>
            <BarChart data={chartData} />
          </View>
        </Card>
      ) : null}

      {apod.data ? <ApodCard apod={apod.data} onPress={() => navigation.navigate('ApodDetail')} /> : null}

      <View style={styles.section}>
        <SectionHeader title="Minhas lavouras" actionLabel="Ver todas" onAction={() => navigation.navigate('Regions')} />
        <View style={styles.list}>
          {monitors.slice(0, 3).map((monitor) => (
            <RegionCard
              key={monitor.region.id}
              monitor={monitor}
              onPress={() => navigation.navigate('RegionDetail', { regionId: monitor.region.id })}
            />
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  kicker: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, letterSpacing: 1 },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, marginTop: 2 },
  subtitle: { fontSize: fontSize.sm, lineHeight: 20, marginTop: spacing.xs },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chartWrap: { marginTop: spacing.sm },
  section: { gap: spacing.sm },
  list: { gap: spacing.md },
});
