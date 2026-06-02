import { Ionicons } from '@expo/vector-icons';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  EmptyState,
  ErrorState,
  Loading,
  RegionCard,
  SearchBar,
  SegmentedControl,
  type Segment,
} from '../components';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites, useMonitors, useRegions } from '../hooks';
import { TabScreenProps } from '../navigation/types';
import { spacing } from '../theme';
import { CropStatus } from '../types';

type StatusFilter = 'all' | CropStatus;
type SortKey = 'worst' | 'best' | 'name';

const STATUS_SEGMENTS: Segment<StatusFilter>[] = [
  { value: 'all', label: 'Todas' },
  { value: 'healthy', label: 'Saudável' },
  { value: 'warning', label: 'Atenção' },
  { value: 'critical', label: 'Crítico' },
];

const SORT_SEGMENTS: Segment<SortKey>[] = [
  { value: 'worst', label: 'Pior saúde' },
  { value: 'best', label: 'Melhor saúde' },
  { value: 'name', label: 'Nome' },
];

export function RegionsScreen({ navigation }: TabScreenProps<'Regions'>) {
  const { theme } = useTheme();
  const { regions } = useRegions();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { data: monitors, loading, error, refetch } = useMonitors(regions);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortKey>('worst');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddRegion')} hitSlop={8} style={styles.headerButton}>
          <Ionicons name="add-circle" size={26} color={theme.colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = monitors;
    if (q) {
      list = list.filter((m) =>
        `${m.region.name} ${m.region.crop} ${m.region.locality ?? ''} ${m.region.state ?? ''}`
          .toLowerCase()
          .includes(q),
      );
    }
    if (status !== 'all') list = list.filter((m) => m.health.status === status);

    const sorted = [...list];
    if (sort === 'name') sorted.sort((a, b) => a.region.name.localeCompare(b.region.name));
    else if (sort === 'worst') sorted.sort((a, b) => a.health.score - b.health.score);
    else sorted.sort((a, b) => b.health.score - a.health.score);
    return sorted;
  }, [monitors, query, status, sort]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.region.id}
        renderItem={({ item }) => (
          <RegionCard
            monitor={item}
            onPress={() => navigation.navigate('RegionDetail', { regionId: item.region.id })}
            isFavorite={isFavorite(item.region.id)}
            onToggleFavorite={() => toggleFavorite(item.region.id)}
          />
        )}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar lavoura, cultura ou cidade" />
            <SegmentedControl scrollable segments={STATUS_SEGMENTS} value={status} onChange={setStatus} />
            <SegmentedControl scrollable segments={SORT_SEGMENTS} value={sort} onChange={setSort} />
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <Loading label="Carregando lavouras..." />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : (
            <EmptyState icon="search" title="Nenhuma lavoura encontrada" message="Ajuste a busca ou os filtros aplicados." />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 120, flexGrow: 1 },
  header: { gap: spacing.sm, marginBottom: spacing.md },
  separator: { height: spacing.md },
  headerButton: { paddingHorizontal: spacing.lg },
});
