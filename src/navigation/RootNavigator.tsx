import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  NavigationContainer,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { AddRegionScreen } from '../screens/AddRegionScreen';
import { ApodDetailScreen } from '../screens/ApodDetailScreen';
import { RegionDetailScreen } from '../screens/RegionDetailScreen';
import { fontWeight } from '../theme';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { theme } = useTheme();
  const base = theme.dark ? NavDarkTheme : NavDefaultTheme;
  const navigationTheme: NavigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
      notification: theme.colors.critical,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { fontWeight: fontWeight.bold },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="RegionDetail" component={RegionDetailScreen} options={{ title: 'Detalhe da lavoura' }} />
        <Stack.Screen
          name="AddRegion"
          component={AddRegionScreen}
          options={{ title: 'Adicionar lavoura', presentation: 'modal' }}
        />
        <Stack.Screen name="ApodDetail" component={ApodDetailScreen} options={{ title: 'NASA · Imagem do dia' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
