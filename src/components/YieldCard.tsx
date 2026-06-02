import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../theme';
import { YieldEstimate, YieldRisk } from '../types';
import { formatBRL } from '../utils/format';
import { Card, SectionHeader } from './ui';

const RISK_LABEL: Record<YieldRisk, string> = {
  baixo: 'Risco baixo',
  moderado: 'Risco moderado',
  alto: 'Risco alto',
  crítico: 'Risco crítico',
};

export function YieldCard({ estimate }: { estimate: YieldEstimate }) {
  const { theme } = useTheme();
  const color =
    estimate.risk === 'baixo'
      ? theme.colors.healthy
      : estimate.risk === 'moderado'
        ? theme.colors.warning
        : theme.colors.critical;

  return (
    <Card style={styles.card}>
      <SectionHeader title="Estimativa de safra" subtitle="Projeção relativa baseada no índice de saúde" />

      <View style={styles.row}>
        <View>
          <Text style={[styles.big, { color }]}>{estimate.productivityPct}%</Text>
          <Text style={[styles.bigLabel, { color: theme.colors.textMuted }]}>do potencial produtivo</Text>
        </View>
        <View style={[styles.riskPill, { backgroundColor: color + '22' }]}>
          <Ionicons name="trending-up-outline" size={14} color={color} />
          <Text style={[styles.riskText, { color }]}>{RISK_LABEL[estimate.risk]}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={[styles.metric, { backgroundColor: theme.colors.cardAlt }]}>
          <Text style={[styles.metricValue, { color: theme.colors.text }]}>{estimate.lossPct}%</Text>
          <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Perda estimada</Text>
        </View>
        <View style={[styles.metric, { backgroundColor: theme.colors.cardAlt }]}>
          <Text style={[styles.metricValue, { color: theme.colors.text }]}>{formatBRL(estimate.estimatedLossBRL)}</Text>
          <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Impacto financeiro aprox.</Text>
        </View>
      </View>

      <Text style={[styles.explanation, { color: theme.colors.text }]}>{estimate.explanation}</Text>
      <Text style={[styles.disclaimer, { color: theme.colors.textMuted }]}>
        * Estimativa heurística com valores de referência aproximados (produtividade e preço por cultura). Não é previsão
        financeira garantida.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  big: { fontSize: fontSize.display, fontWeight: fontWeight.bold, lineHeight: 40 },
  bigLabel: { fontSize: fontSize.sm },
  riskPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  riskText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  metrics: { flexDirection: 'row', gap: spacing.sm },
  metric: { flex: 1, padding: spacing.md, borderRadius: radius.md, gap: 2 },
  metricValue: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  metricLabel: { fontSize: fontSize.xs },
  explanation: { fontSize: fontSize.sm, lineHeight: 20 },
  disclaimer: { fontSize: fontSize.xs, lineHeight: 16, fontStyle: 'italic' },
});
