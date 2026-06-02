import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { ComponentProps } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { RegionsScreen } from '../screens/RegionsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { fontWeight } from '../theme';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
type IoniconName = ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<keyof TabParamList, { active: IoniconName; inactive: IoniconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Regions: { active: 'leaf', inactive: 'leaf-outline' },
  Favorites: { active: 'star', inactive: 'star-outline' },
  Settings: { active: 'settings', inactive: 'settings-outline' },
};

export function TabNavigator() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: fontWeight.bold },
        headerShadowVisible: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: { backgroundColor: theme.colors.tabBar, borderTopColor: theme.colors.tabBarBorder },
        tabBarIcon: ({ color, size, focused }) => {
          const icon = ICONS[route.name];
          return <Ionicons name={focused ? icon.active : icon.inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Regions" component={RegionsScreen} options={{ title: 'Lavouras' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
    </Tab.Navigator>
  );
}
