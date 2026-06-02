import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { RegionsProvider } from './src/contexts/RegionsContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RegionsProvider>
          <FavoritesProvider>
            <ThemedStatusBar />
            <RootNavigator />
          </FavoritesProvider>
        </RegionsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
