import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Card,
  EmptyState,
  ScreenContainer,
  SearchBar,
  SegmentedControl,
  type Segment,
} from '../components';
import { useTheme } from '../contexts/ThemeContext';
import { useRegions } from '../hooks';
import { RootStackScreenProps } from '../navigation/types';
import { ApiError } from '../services/api';
import { searchLocations } from '../services/geocodingService';
import { fontSize, fontWeight, radius, spacing } from '../theme';
import { GeoResult } from '../types';

const CROPS = ['Soja', 'Milho', 'Café', 'Cana', 'Algodão', 'Outros'];
const CROP_SEGMENTS: Segment<string>[] = CROPS.map((crop) => ({ value: crop, label: crop }));

export function AddRegionScreen({ navigation }: RootStackScreenProps<'AddRegion'>) {
  const { theme } = useTheme();
  const { addRegion, regions } = useRegions();
  const [crop, setCrop] = useState('Soja');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const found = await searchLocations(term);
        if (active) {
          setResults(found);
          setError(null);
        }
      } catch (err) {
        if (active) setError(err instanceof ApiError ? err.message : 'Erro ao buscar localidade.');
      } finally {
        if (active) setLoading(false);
      }
    }, 450);
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [query]);

  const useMyLocation = async () => {
    setLocating(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada. Você ainda pode buscar pela cidade.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = position.coords;

      let name = 'Minha localização';
      let state: string | undefined;
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (place) {
          name = place.subregion ?? place.city ?? place.region ?? name;
          state = place.region ?? undefined;
        }
      } catch {
        // reverse geocoding indisponível (ex.: Web) — seguimos só com as coordenadas
      }

      const id = `gps-${latitude.toFixed(3)}-${longitude.toFixed(3)}`;
      addRegion({ id, name, crop, latitude, longitude, areaHa: 500, locality: name, state, custom: true });
      navigation.navigate('RegionDetail', { regionId: id });
    } catch {
      setError('Não foi possível obter sua localização. Verifique as permissões e tente novamente.');
    } finally {
      setLocating(false);
    }
  };

  const handleAdd = (geo: GeoResult) => {
    const id = `geo-${geo.id}`;
    addRegion({
      id,
      name: geo.name,
      crop,
      latitude: geo.latitude,
      longitude: geo.longitude,
      areaHa: 500,
      locality: geo.name,
      state: geo.state,
      country: geo.country,
      custom: true,
    });
    navigation.navigate('RegionDetail', { regionId: id });
  };

  const showEmpty = !loading && !error && query.trim().length >= 2 && results.length === 0;

  return (
    <ScreenContainer scroll>
      <View>
        <Text style={[styles.title, { color: theme.colors.text }]}>Adicionar lavoura</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Escolha a cultura e localize a lavoura pela cidade (geocoding) ou pelo GPS do aparelho. A lavoura fica salva no
          dispositivo.
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, { color: theme.colors.textMuted }]}>CULTURA</Text>
        <SegmentedControl scrollable segments={CROP_SEGMENTS} value={crop} onChange={setCrop} />
      </View>

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, { color: theme.colors.textMuted }]}>LOCALIDADE</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Ex.: Sorriso, Ribeirão Preto, Balsas..." />
        <Button
          label="Usar minha localização"
          icon="locate"
          variant="ghost"
          onPress={useMyLocation}
          loading={locating}
        />
      </View>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>Buscando localidades...</Text>
        </View>
      ) : null}

      {error ? <Text style={[styles.error, { color: theme.colors.critical }]}>{error}</Text> : null}

      {showEmpty ? (
        <EmptyState icon="search" title="Nada encontrado" message="Tente outro nome de cidade ou região." />
      ) : null}

      <View style={styles.list}>
        {results.map((geo) => {
          const alreadyAdded = regions.some((r) => r.id === `geo-${geo.id}`);
          return (
            <Card
              key={geo.id}
              onPress={alreadyAdded ? undefined : () => handleAdd(geo)}
              style={styles.resultCard}
            >
              <View style={styles.flex}>
                <Text style={[styles.resultName, { color: theme.colors.text }]}>{geo.name}</Text>
                <Text style={[styles.resultSub, { color: theme.colors.textMuted }]}>
                  {[geo.state, geo.country].filter(Boolean).join(' · ')} · {geo.latitude.toFixed(2)}, {geo.longitude.toFixed(2)}
                </Text>
              </View>
              {alreadyAdded ? (
                <View style={[styles.addedPill, { backgroundColor: theme.colors.healthyMuted }]}>
                  <Ionicons name="checkmark" size={14} color={theme.colors.healthy} />
                  <Text style={[styles.addedText, { color: theme.colors.healthy }]}>Adicionada</Text>
                </View>
              ) : (
                <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
              )}
            </Card>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold },
  subtitle: { fontSize: fontSize.sm, lineHeight: 20, marginTop: spacing.xs },
  field: { gap: spacing.sm },
  fieldLabel: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, letterSpacing: 0.6 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  loadingText: { fontSize: fontSize.sm },
  error: { fontSize: fontSize.sm },
  list: { gap: spacing.sm },
  resultCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  resultName: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  resultSub: { fontSize: fontSize.xs, marginTop: 2 },
  addedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  addedText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
});
