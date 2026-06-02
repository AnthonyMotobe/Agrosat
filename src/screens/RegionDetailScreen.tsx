import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AlertCard,
  BarChart,
  Card,
  EmptyState,
  ErrorState,
  ForecastStrip,
  HealthBar,
  HealthGauge,
  Loading,
  ScreenContainer,
  SectionHeader,
  WeatherSummary,
  YieldCard,
} from '../components';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites, useRegionMonitor, useRegions } from '../hooks';
import { RootStackScreenProps } from '../navigation/types';
import { notifyCriticalRegion } from '../services/notificationService';
import { estimateYield } from '../services/yieldEstimateService';
import { fontSize, fontWeight, spacing } from '../theme';
import { formatNumber, relativeFromNow, weekdayShort } from '../utils/format';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export function RegionDetailScreen({ route, navigation }: RootStackScreenProps<'RegionDetail'>) {
  const { theme } = useTheme();
  const { getRegion } = useRegions();
  const { isFavorite, toggleFavorite } = useFavorites();
  const region = getRegion(route.params.regionId);
  const { data, loading, error, refetch } = useRegionMonitor(region);

  const favorite = region ? isFavorite(region.id) : false;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: region?.name ?? 'Detalhe',
      headerRight: region
        ? () => (
            <TouchableOpacity onPress={() => toggleFavorite(region.id)} hitSlop={8} style={styles.headerButton}>
              <Ionicons
                name={favorite ? 'star' : 'star-outline'}
                size={22}
                color={favorite ? theme.colors.warning : theme.colors.text}
              />
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [navigation, region, favorite, toggleFavorite, theme]);

  useEffect(() => {
    if (region && data?.health.status === 'critical') {
      void notifyCriticalRegion(region.id, region.name);
    }
  }, [region, data]);

  if (!region) {
    return (
      <ScreenContainer>
        <EmptyState icon="alert-circle-outline" title="Região não encontrada" message="Ela pode ter sido removida." />
      </ScreenContainer>
    );
  }
  if (loading && !data) {
    return (
      <ScreenContainer>
        <Loading label="Analisando dados climáticos e agroambientais..." />
      </ScreenContainer>
    );
  }
  if (error && !data) {
    return (
      <ScreenContainer>
        <ErrorState message={error} onRetry={refetch} />
      </ScreenContainer>
    );
  }
  if (!data) return null;

  const yieldEstimate = estimateYield(data.health.score, region.crop, region.areaHa);
  const stressStatus =
    data.health.hydricStress >= 60 ? 'critical' : data.health.hydricStress >= 35 ? 'warning' : 'healthy';
  const balancePositive = data.health.waterBalanceMm >= 0;
  const precipData = data.daily.map((day, index) => ({
    label: index === 0 ? 'Hoje' : weekdayShort(day.date),
    value: Math.max(0, day.precipitationSum),
    highlight: day.precipitationSum >= 20,
  }));

  const info: { icon: IoniconName; label: string; value: string }[] = [
    { icon: 'leaf-outline', label: 'Cultura', value: region.crop },
    {
      icon: 'location-outline',
      label: 'Local',
      value: `${region.locality ?? '—'}${region.state ? `/${region.state}` : ''}`,
    },
    { icon: 'resize-outline', label: 'Área', value: `${formatNumber(region.areaHa)} ha` },
    {
      icon: 'navigate-outline',
      label: 'Coordenadas',
      value: `${region.latitude.toFixed(2)}, ${region.longitude.toFixed(2)}`,
    },
  ];

  return (
    <ScreenContainer scroll refreshing={loading} onRefresh={refetch}>
      <Card>
        <View style={styles.infoGrid}>
          {info.map((item) => (
            <View key={item.label} style={styles.infoItem}>
              <Ionicons name={item.icon} size={16} color={theme.colors.primary} />
              <View style={styles.flex}>
                <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>{item.label}</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Saúde da lavoura" subtitle={`Atualizado ${relativeFromNow(data.updatedAt)}`} />
        <HealthGauge health={data.health} />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <HealthBar value={data.health.hydricStress} status={stressStatus} label="Estresse hídrico" />
        <Text style={[styles.balance, { color: theme.colors.textMuted }]}>
          Balanço hídrico (7 dias):{' '}
          <Text style={{ color: balancePositive ? theme.colors.healthy : theme.colors.critical, fontWeight: fontWeight.semibold }}>
            {balancePositive ? '+' : ''}
            {data.health.waterBalanceMm} mm
          </Text>
        </Text>
      </Card>

      <YieldCard estimate={yieldEstimate} />

      <Card style={styles.card}>
        <SectionHeader title="Clima atual" />
        <WeatherSummary current={data.current} />
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Previsão · próximos dias" />
        <ForecastStrip daily={data.daily} />
        <Text style={[styles.caption, { color: theme.colors.textMuted }]}>Chuva acumulada por dia (mm)</Text>
        <BarChart data={precipData} />
      </Card>

      <View style={styles.section}>
        <SectionHeader title="Alertas climáticos" />
        {data.alerts.length ? (
          <View style={styles.list}>
            {data.alerts.map((alert, index) => (
              <AlertCard key={`${alert.type}-${index}`} alert={alert} />
            ))}
          </View>
        ) : (
          <Card>
            <EmptyState
              icon="checkmark-circle-outline"
              title="Sem alertas"
              message="Nenhum risco climático relevante nos próximos dias."
            />
          </Card>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerButton: { paddingHorizontal: spacing.md },
  flex: { flex: 1 },
  card: { gap: spacing.md },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.md, columnGap: spacing.sm },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, width: '47%', flexGrow: 1 },
  infoLabel: { fontSize: fontSize.xs },
  infoValue: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: spacing.xs },
  balance: { fontSize: fontSize.sm },
  caption: { fontSize: fontSize.xs, marginTop: spacing.xs },
  section: { gap: spacing.sm },
  list: { gap: spacing.sm },
});
