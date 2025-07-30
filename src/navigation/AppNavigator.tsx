import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import { HomeScreen } from '../screens/HomeScreen';
import { TrendingScreen } from '../screens/TrendingScreen';
import { PortfolioScreen } from '../screens/PortfolioScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { TradeScreen } from '../screens/TradeScreen';
import { CoinDetailsScreen } from '../screens/CoinDetailsScreen';

// Import UI components
import { Icon } from '../components/ui';

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  CoinDetails: {
    coin?: import('../types').CoinPost;
    coinId?: string;
  };
};

export type TabParamList = {
  Home: undefined;
  Trending: undefined;
  Portfolio: undefined;
  Watchlist: undefined;
  Trade: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1e293b', // dark-surface
          borderTopColor: '#475569', // dark-border
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 8), // Use safe area bottom or minimum 8px
          paddingTop: 8,
          height: 64 + Math.max(insets.bottom, 8), // Adjust height based on safe area
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: '#fbbf24', // hawk-accent
        tabBarInactiveTintColor: '#94a3b8', // dark-text-muted
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '🏠';
          
          switch (route.name) {
            case 'Home':
              iconName = focused ? '🏠' : '🏡';
              break;
            case 'Trending':
              iconName = focused ? '🔥' : '📈';
              break;
            case 'Portfolio':
              iconName = focused ? '💼' : '📊';
              break;
            case 'Watchlist':
              iconName = focused ? '👀' : '⭐';
              break;
            case 'Trade':
              iconName = focused ? '💰' : '🔄';
              break;
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trending" component={TrendingScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
      <Tab.Screen name="Trade" component={TradeScreen} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator that includes tabs and modal screens
const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen 
        name="CoinDetails" 
        component={CoinDetailsScreen}
        options={{
          presentation: 'modal', // Makes it slide up like a modal
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};