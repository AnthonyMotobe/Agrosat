import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { radius } from '../../theme';

interface Props {
  width?: DimensionValue;
  height?: number;
  style?: ViewStyle;
  rounded?: number;
}

export function Skeleton({ width = '100%', height = 16, style, rounded = radius.sm }: Props) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ width, height, borderRadius: rounded, backgroundColor: theme.colors.skeleton, opacity }, style]}
    />
  );
}
