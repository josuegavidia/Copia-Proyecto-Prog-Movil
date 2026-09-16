import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { AuthScreen } from '../screens/AuthScreen';
import { ManagerHeader } from '../components/Common/ManagerHeader';
import { ManagerProfileModal } from '../components/Common/ManagerProfileModal';
import { AchievementsModal } from '../components/Common/AchievementsModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  initApp,
  loadLocalData,
  logout,
  setAuthSuccess,
  setProfileModalVisible,
  setAchievementsModalVisible,
} from '../store/slices/squadSlice';
import { NBA_THEME } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente contenedor de las pestañas principales con su Header, Perfil y Logros
const MainTabsWrapper: React.FC = () => {
  const dispatch = useAppDispatch();
  const coins = useAppSelector((state) => state.squad.coins);
  const profileModalVisible = useAppSelector((state) => state.squad.profileModalVisible);
  const achievementsModalVisible = useAppSelector((state) => state.squad.achievementsModalVisible);

  return (
    <View style={styles.mainContainer}>
      <ManagerHeader
        coins={coins}
        onOpenProfile={() => dispatch(setProfileModalVisible(true))}
      />
      <TabNavigator />
      <ManagerProfileModal
        visible={profileModalVisible}
        onClose={() => dispatch(setProfileModalVisible(false))}
        onSignOut={() => dispatch(logout())}
        onProfileUpdated={() => dispatch(loadLocalData())}
      />
      <AchievementsModal
        visible={achievementsModalVisible}
        onClose={() => dispatch(setAchievementsModalVisible(false))}
      />
    </View>
  );
};

export const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((state) => state.squad.isAuth);
  const isLoading = useAppSelector((state) => state.squad.isLoading);

  useEffect(() => {
    dispatch(initApp());
  }, [dispatch]);

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
          {() => <AuthScreen onAuthSuccess={() => dispatch(setAuthSuccess())} />}
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
