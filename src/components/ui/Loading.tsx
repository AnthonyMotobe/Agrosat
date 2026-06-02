import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { fontSize, spacing } from '../../theme';

export function Loading({ label }: { label?: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {label ? <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  label: { fontSize: fontSize.sm },
});
