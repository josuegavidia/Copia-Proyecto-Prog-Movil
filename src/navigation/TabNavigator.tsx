import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { SquadScreen } from '../screens/SquadScreen';
import { PacksScreen } from '../screens/PacksScreen';
import { GamesScreen } from '../screens/GamesScreen';
import { CollectionScreen } from '../screens/CollectionScreen';
import { CoachCreatorScreen } from '../screens/CoachCreatorScreen';
import { useTranslation } from '../i18n/useTranslation';
import { NBA_THEME } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Squad"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: NBA_THEME.nbaNavy,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: [
          styles.tabBar,
          {
            height: 52 + Math.max(insets.bottom, 12),
            paddingBottom: Math.max(insets.bottom, 6),
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'shield';

          if (route.name === 'Squad') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'Packs') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Games') {
            iconName = focused ? 'flash' : 'flash-outline';
          } else if (route.name === 'Collection') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'Coach') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Squad"
        component={SquadScreen}
        options={{ tabBarLabel: t.navigation.squad }}
      />

      <Tab.Screen
        name="Packs"
        component={PacksScreen}
        options={{ tabBarLabel: t.navigation.packs }}
      />

      <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{ tabBarLabel: t.navigation.games }}
      />

      <Tab.Screen
        name="Collection"
        component={CollectionScreen}
        options={{ tabBarLabel: t.navigation.collection }}
      />

      <Tab.Screen
        name="Coach"
        component={CoachCreatorScreen}
        options={{ tabBarLabel: t.navigation.coach }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: -2,
  },
});
