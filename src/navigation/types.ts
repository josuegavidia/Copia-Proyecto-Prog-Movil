import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Squad: undefined;
  Packs: undefined;
  Games: undefined;
  Collection: undefined;
  Coach: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
};
