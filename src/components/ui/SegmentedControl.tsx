import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../../theme';

export interface Segment<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  scrollable?: boolean;
}

export function SegmentedControl<T extends string>({ segments, value, onChange, scrollable }: Props<T>) {
  const { theme } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.cardAlt,
  };

  const items = segments.map((segment) => {
    const active = segment.value === value;
    return (
      <TouchableOpacity
        key={segment.value}
        onPress={() => onChange(segment.value)}
        activeOpacity={0.8}
        style={[styles.item, { backgroundColor: active ? theme.colors.primary : 'transparent' }]}
      >
        <Text
          style={[
            styles.label,
            {
              color: active ? theme.colors.primaryText : theme.colors.textMuted,
              fontWeight: active ? fontWeight.semibold : fontWeight.medium,
            },
          ]}
        >
          {segment.label}
        </Text>
      </TouchableOpacity>
    );
  });

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={containerStyle}>{items}</View>
      </ScrollView>
    );
  }

  return <View style={containerStyle}>{items}</View>;
}

const styles = StyleSheet.create({
  item: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill },
  label: { fontSize: fontSize.sm },
});
