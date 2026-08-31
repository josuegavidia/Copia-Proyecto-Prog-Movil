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
import { useSquad } from '../context/SquadContext';
import { NBA_THEME } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    lineup,
    cards,
    coins,
    updateLineup,
    addCards,
    spendCoins,
    earnCoins,
    addCoach,
  } = useSquad();

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
        tabBarIcon: ({ focused, color, size }) => {
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
        options={{ tabBarLabel: 'Quinteto' }}
      >
        {({ navigation }) => (
          <SquadScreen
            lineup={lineup}
            inventory={cards}
            onUpdateLineup={updateLineup}
            onNavigateToCoachCreator={() => navigation.navigate('Coach')}
            onCoinsEarned={earnCoins}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Packs"
        options={{ tabBarLabel: 'Sobres' }}
      >
        {() => (
          <PacksScreen
            coins={coins}
            onPacksOpened={async (newCards, cost) => {
              await addCards(newCards);
              await spendCoins(cost);
            }}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Games"
        options={{ tabBarLabel: 'Partidos' }}
      >
        {() => (
          <GamesScreen
            lineup={lineup}
            onCoinsEarned={earnCoins}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Collection"
        options={{ tabBarLabel: 'Colección' }}
      >
        {() => (
          <CollectionScreen
            cards={cards}
            onRecycleDuplicates={earnCoins}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Coach"
        options={{ tabBarLabel: 'Entrenador' }}
      >
        {() => (
          <CoachCreatorScreen
            currentCoach={lineup.coach}
            onSaveCoach={addCoach}
            onAssignToLineup={async (coach) => {
              await updateLineup({ ...lineup, coach });
            }}
          />
        )}
      </Tab.Screen>
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
