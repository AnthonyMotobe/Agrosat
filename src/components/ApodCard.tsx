import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../theme';
import { Apod } from '../types';
import { Card } from './ui';

export function ApodCard({ apod, onPress }: { apod: Apod; onPress?: () => void }) {
  const { theme } = useTheme();
  return (
    <Card onPress={onPress} padded={false} style={styles.card}>
      <Image source={{ uri: apod.url }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <View style={[styles.tag, { backgroundColor: theme.colors.accentMuted }]}>
          <Ionicons name="planet" size={12} color={theme.colors.accent} />
          <Text style={[styles.tagText, { color: theme.colors.accent }]}>NASA · Imagem do dia</Text>
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {apod.title}
        </Text>
        <Text style={[styles.date, { color: theme.colors.textMuted }]}>{apod.date}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  image: { width: '100%', height: 168, backgroundColor: '#00000022' },
  body: { padding: spacing.lg, gap: spacing.xs },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  tagText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  title: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, lineHeight: 21 },
  date: { fontSize: fontSize.xs },
});
