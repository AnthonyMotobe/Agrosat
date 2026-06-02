import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { fontSize, radius, spacing } from '../../theme';

export interface BarDatum {
  label: string;
  value: number;
  highlight?: boolean;
}

interface Props {
  data: BarDatum[];
  height?: number;
}

export function BarChart({ data, height = 110 }: Props) {
  const { theme } = useTheme();
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <View style={[styles.container, { height: height + 38 }]}>
      {data.map((datum, index) => {
        const barHeight = Math.max(3, (datum.value / max) * height);
        const color = datum.highlight ? theme.colors.accent : theme.colors.primary;
        return (
          <View key={`${datum.label}-${index}`} style={styles.col}>
            <Text style={[styles.value, { color: theme.colors.textMuted }]}>
              {datum.value > 0 ? Math.round(datum.value) : ''}
            </Text>
            <View style={[styles.bar, { height: barHeight, backgroundColor: color }]} />
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>{datum.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.xs },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  bar: { width: '60%', minWidth: 10, borderRadius: radius.sm },
  value: { fontSize: 10 },
  label: { fontSize: 10 },
});
