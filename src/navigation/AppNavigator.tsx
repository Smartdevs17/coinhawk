import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
import { HomeScreen } from '../screens/HomeScreen';
import { TrendingScreen } from '../screens/TrendingScreen';
import { PortfolioScreen } from '../screens/PortfolioScreen';
// import { WatchlistScreen } from '../screens/WatchlistScreen';
// import { TradeScreen } from '../screens/TradeScreen';

// Import UI components
import { Icon } from '../components/ui';

const Tab = createBottomTabNavigator();

// Placeholder screens for remaining tabs
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View className="flex-1 bg-dark-bg items-center justify-center">
    <Icon name="🚧" size={48} color="#fbbf24" />
    <Text className="text-dark-text-primary text-xl font-semibold mt-4">{title}</Text>
    <Text className="text-dark-text-secondary text-center mt-2">Coming Soon</Text>
  </View>
);

const WatchlistScreen = () => <PlaceholderScreen title="Watchlist" />;
const TradeScreen = () => <PlaceholderScreen title="Trade" />;

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1e293b', // dark-surface
            borderTopColor: '#475569', // dark-border
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 80,
          },
          tabBarActiveTintColor: '#fbbf24', // hawk-accent
          tabBarInactiveTintColor: '#94a3b8', // dark-text-muted
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
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
            
            return <Icon name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Tab.Screen 
          name="Trending" 
          component={TrendingScreen}
          options={{ title: 'Trending' }}
        />
        <Tab.Screen 
          name="Portfolio" 
          component={PortfolioScreen}
          options={{ title: 'Portfolio' }}
        />
        <Tab.Screen 
          name="Watchlist" 
          component={WatchlistScreen}
          options={{ title: 'Watchlist' }}
        />
        <Tab.Screen 
          name="Trade" 
          component={TradeScreen}
          options={{ title: 'Trade' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};