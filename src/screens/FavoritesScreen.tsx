import React, { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { EmptyState, ErrorState, Loading, RegionCard } from '../components';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites, useMonitors, useRegions } from '../hooks';
import { TabScreenProps } from '../navigation/types';
import { spacing } from '../theme';

export function FavoritesScreen({ navigation }: TabScreenProps<'Favorites'>) {
  const { theme } = useTheme();
  const { regions } = useRegions();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const favoriteRegions = useMemo(
    () => regions.filter((region) => favorites.includes(region.id)),
    [regions, favorites],
  );

  const { data: monitors, loading, error, refetch } = useMonitors(favoriteRegions);

  if (favoriteRegions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          icon="star-outline"
          title="Nenhum favorito ainda"
          message="Toque na estrela de uma lavoura para acompanhá-la rapidamente aqui."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={monitors}
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
        ListEmptyComponent={
          loading ? (
            <Loading label="Carregando favoritos..." />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 120, flexGrow: 1 },
  separator: { height: spacing.md },
});
