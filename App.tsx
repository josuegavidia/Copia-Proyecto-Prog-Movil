import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SquadProvider } from './src/context/SquadContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LoadingScreen } from './src/screens/LoadingScreen';

export default function App() {
  const [appLoading, setAppLoading] = useState(true);

  if (appLoading) {
    return <LoadingScreen onFinishLoading={() => setAppLoading(false)} />;
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <SquadProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SquadProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
