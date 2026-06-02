import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { fontSize, fontWeight, spacing } from '../../theme';

interface Props {
  icon?: ComponentProps<typeof Ionicons>['name'];
  title: string;
  message?: string;
}

export function EmptyState({ icon = 'leaf-outline', title, message }: Props) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={theme.colors.textMuted} />
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {message ? <Text style={[styles.message, { color: theme.colors.textMuted }]}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl, gap: spacing.sm },
  title: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, textAlign: 'center' },
  message: { fontSize: fontSize.sm, textAlign: 'center', lineHeight: 20 },
});
