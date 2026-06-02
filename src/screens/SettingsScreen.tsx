import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, ScreenContainer, SectionHeader, SegmentedControl, type Segment } from '../components';
import { ThemeMode, useTheme } from '../contexts/ThemeContext';
import { useFavorites, useRegions } from '../hooks';
import { fontSize, fontWeight, radius, spacing } from '../theme';

const THEME_SEGMENTS: Segment<ThemeMode>[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Sistema' },
];

const TEAM = [
  { name: 'Integrante 1', rm: 'RM000000' },
  { name: 'Integrante 2', rm: 'RM000000' },
  { name: 'Integrante 3', rm: 'RM000000' },
];

const DATA_SOURCES = [
  { label: 'Open-Meteo · clima e previsão', url: 'https://open-meteo.com' },
  { label: 'NASA APOD · imagem astronômica', url: 'https://api.nasa.gov' },
];

function LinkRow({ label, url }: { label: string; url: string }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL(url)} activeOpacity={0.7}>
      <Ionicons name="link-outline" size={16} color={theme.colors.accent} />
      <Text style={[styles.linkText, { color: theme.colors.accent }]}>{label}</Text>
      <Ionicons name="open-outline" size={14} color={theme.colors.textMuted} />
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const { favorites, clearFavorites } = useFavorites();
  const { customRegions, clearCustomRegions } = useRegions();

  const confirmClearFavorites = () => {
    if (!favorites.length) return;
    Alert.alert('Limpar favoritos', `Remover ${favorites.length} lavoura(s) dos favoritos?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clearFavorites },
    ]);
  };

  const confirmClearCustom = () => {
    if (!customRegions.length) return;
    Alert.alert(
      'Remover lavouras adicionadas',
      `Remover ${customRegions.length} lavoura(s) que você cadastrou?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: clearCustomRegions },
      ],
    );
  };

  return (
    <ScreenContainer scroll>
      <Card style={styles.card}>
        <SectionHeader title="Aparência" subtitle="Tema do aplicativo" />
        <SegmentedControl segments={THEME_SEGMENTS} value={mode} onChange={setMode} />
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Sobre o AgroSat" />
        <Text style={[styles.paragraph, { color: theme.colors.textMuted }]}>
          O AgroSat é um MVP mobile de apoio à decisão agrícola: usa dados climáticos e agroambientais para calcular um
          índice de saúde da lavoura por um modelo heurístico explicável (proxy de NDVI, sem processar imagens de
          satélite nesta versão) e antecipar riscos como estresse hídrico, geada e calor. Alinhado aos ODS 2, 13 e 9.
        </Text>
        <View style={styles.odsRow}>
          {['ODS 2', 'ODS 13', 'ODS 9'].map((ods) => (
            <View key={ods} style={[styles.odsPill, { backgroundColor: theme.colors.primaryMuted }]}>
              <Text style={[styles.odsText, { color: theme.colors.primary }]}>{ods}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Fontes de dados" />
        {DATA_SOURCES.map((source) => (
          <LinkRow key={source.url} label={source.label} url={source.url} />
        ))}
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Dados locais" subtitle="Salvos no dispositivo (AsyncStorage)" />
        <Button
          label={`Limpar favoritos (${favorites.length})`}
          icon="star-outline"
          variant="ghost"
          onPress={confirmClearFavorites}
          disabled={!favorites.length}
        />
        <Button
          label={`Remover lavouras adicionadas (${customRegions.length})`}
          icon="trash-outline"
          variant="ghost"
          onPress={confirmClearCustom}
          disabled={!customRegions.length}
        />
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Equipe" subtitle="Preencha com NOME e RM" />
        {TEAM.map((member, index) => (
          <View key={index} style={styles.memberRow}>
            <Ionicons name="person-circle-outline" size={22} color={theme.colors.textMuted} />
            <Text style={[styles.memberName, { color: theme.colors.text }]}>{member.name}</Text>
            <Text style={[styles.memberRm, { color: theme.colors.textMuted }]}>{member.rm}</Text>
          </View>
        ))}
      </Card>

      <Text style={[styles.version, { color: theme.colors.textMuted }]}>AgroSat · v1.0.0 · Expo SDK 55</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  paragraph: { fontSize: fontSize.sm, lineHeight: 21 },
  odsRow: { flexDirection: 'row', gap: spacing.sm },
  odsPill: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill },
  odsText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  linkText: { flex: 1, fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  memberName: { flex: 1, fontSize: fontSize.md },
  memberRm: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  version: { fontSize: fontSize.xs, textAlign: 'center', marginTop: spacing.sm },
});
