import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ErrorState, Loading } from '../components';
import { useTheme } from '../contexts/ThemeContext';
import { useApod } from '../hooks';
import { RootStackScreenProps } from '../navigation/types';
import { fontSize, fontWeight, spacing } from '../theme';

export function ApodDetailScreen(_props: RootStackScreenProps<'ApodDetail'>) {
  const { theme } = useTheme();
  const { data, loading, error, refetch } = useApod();

  if (loading && !data) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Loading label="Carregando imagem da NASA..." />
      </View>
    );
  }
  if (error && !data) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ErrorState message={error} onRetry={refetch} />
      </View>
    );
  }
  if (!data) return null;

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.content}>
      <Image source={{ uri: data.hdurl ?? data.url }} style={styles.image} resizeMode="cover" />
      <Text style={[styles.title, { color: theme.colors.text }]}>{data.title}</Text>
      <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
        {data.date}
        {data.copyright ? ` · © ${data.copyright.trim()}` : ''}
      </Text>
      <Text style={[styles.explanation, { color: theme.colors.text }]}>{data.explanation}</Text>
      {data.hdurl ? (
        <TouchableOpacity style={styles.link} onPress={() => Linking.openURL(data.hdurl as string)} activeOpacity={0.7}>
          <Ionicons name="open-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>Abrir em alta resolução</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.sm },
  image: { width: '100%', height: 280, borderRadius: 16, backgroundColor: '#00000022' },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, marginTop: spacing.sm },
  meta: { fontSize: fontSize.sm },
  explanation: { fontSize: fontSize.md, lineHeight: 23, marginTop: spacing.xs },
  link: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  linkText: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
});
