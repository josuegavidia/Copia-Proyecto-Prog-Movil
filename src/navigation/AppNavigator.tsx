import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { AuthScreen } from '../screens/AuthScreen';
import { ManagerHeader } from '../components/Common/ManagerHeader';
import { ManagerProfileModal } from '../components/Common/ManagerProfileModal';
import { useSquad } from '../context/SquadContext';
import { NBA_THEME } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente contenedor de las pestañas principales con su Header y Modal de Perfil
const MainTabsWrapper: React.FC = () => {
  const {
    coins,
    profileModalVisible,
    setProfileModalVisible,
    logout,
    loadLocalData,
  } = useSquad();

  return (
    <View style={styles.mainContainer}>
      <ManagerHeader
        coins={coins}
        onOpenProfile={() => setProfileModalVisible(true)}
      />
      <TabNavigator />
      <ManagerProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        onSignOut={logout}
        onProfileUpdated={loadLocalData}
      />
    </View>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuth, isLoading, setAuthSuccess } = useSquad();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NBA_THEME.nbaNavy} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {!isAuth ? (
        <Stack.Screen name="Auth">
          {() => <AuthScreen onAuthSuccess={setAuthSuccess} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="MainTabs" component={MainTabsWrapper} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});
