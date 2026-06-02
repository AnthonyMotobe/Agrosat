import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../../theme';

interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={44} color={theme.colors.critical} />
      <Text style={[styles.message, { color: theme.colors.text }]}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity
          onPress={onRetry}
          activeOpacity={0.8}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          <Ionicons name="refresh" size={16} color={theme.colors.primaryText} />
          <Text style={[styles.buttonText, { color: theme.colors.primaryText }]}>Tentar novamente</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl, gap: spacing.md },
  message: { fontSize: fontSize.md, textAlign: 'center', lineHeight: 22 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  buttonText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
});
