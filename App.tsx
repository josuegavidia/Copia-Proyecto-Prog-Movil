import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LoadingScreen } from './src/screens/LoadingScreen';

// Root app wrapper consuming theme context for StatusBar and background styling
const MainApp: React.FC = () => {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
};

export default function App() {
  const [appLoading, setAppLoading] = useState(true);

  if (appLoading) {
    return <LoadingScreen onFinishLoading={() => setAppLoading(false)} />;
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <MainApp />
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
