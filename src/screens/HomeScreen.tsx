import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Import our types and utilities
import { CoinPost } from '../types';
import { MOCK_MARKET_DATA } from '../utils';
import { Icon, LoadingSpinner } from '../components/ui';
import { getCoinsByCategory } from '../services/api';

// Navigation types
type RootStackParamList = {
  MainTabs: undefined;
  CoinDetails: {
    coin?: CoinPost;
    coinId?: string;
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Define our category types
type CoinCategory = 'trending' | 'new' | 'topGainers';

const CATEGORIES = [
  { key: 'trending' as CoinCategory, label: 'Trending', icon: '🔥' },
  { key: 'new' as CoinCategory, label: 'New', icon: '✨' },
  { key: 'topGainers' as CoinCategory, label: 'Top Gainers', icon: '📈' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<CoinCategory>('trending');
  const [coins, setCoins] = useState<CoinPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load coins for the selected category
  const loadCoins = async (category: CoinCategory, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await getCoinsByCategory(category);
      // Ensure we have valid data and limit to 10 coins
      const validCoins = (data || []).slice(0, 10);
      setCoins(validCoins);
    } catch (error) {
      console.error('Failed to load coins:', error);
      // Fallback to empty array on error
      setCoins([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load coins when category changes
  useEffect(() => {
    loadCoins(selectedCategory);
  }, [selectedCategory]);

  // Handle refresh
  const onRefresh = () => {
    loadCoins(selectedCategory, true);
  };

  // Handle coin press - navigate to coin details
  const handleCoinPress = (coin: CoinPost) => {
    navigation.navigate('CoinDetails', { coin });
  };

  const renderCoinItem = ({ item, index }: { item: CoinPost; index: number }) => {
    // Defensive checks to prevent undefined values
    if (!item) return null;
    
    return (
      <TouchableOpacity 
        onPress={() => handleCoinPress(item)}
        className="bg-dark-surface rounded-xl p-4 mb-3 border border-dark-border"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 bg-hawk-accent rounded-full items-center justify-center mr-3">
              <Text className="text-hawk-primary font-bold">
                #{index + 1}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-dark-text-primary font-semibold text-lg mr-2">
                  {item.name || 'Unknown'}
                </Text>
                {item.verified && (
                  <Icon name="✓" size={16} color="#10b981" />
                )}
              </View>
              <Text className="text-dark-text-secondary">
                {item.symbol || '---'}
              </Text>
              {item.holders && (
                <Text className="text-dark-text-muted text-xs mt-1">
                  {item.holders.toLocaleString()} holders
                </Text>
              )}
            </View>
          </View>
          <View className="items-end">
            <Text className="text-dark-text-primary font-semibold text-lg">
              {item.price || '$0.00'}
            </Text>
            <Text className={`font-medium ${
              (item.change24h || '').startsWith('+') ? 'text-success-500' : 'text-danger-500'
            }`}>
              {item.change24h || '0.0%'}
            </Text>
          </View>
        </View>
        
        <View className="mt-3 pt-3 border-t border-dark-border">
          <View className="flex-row justify-between">
            <Text className="text-dark-text-muted text-sm">
              Market Cap: {item.marketCap || 'N/A'}
            </Text>
            <Text className="text-dark-text-muted text-sm">
              Volume: {item.volume24h || 'N/A'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="items-center py-12">
      <Icon name="📊" size={48} color="#94a3b8" />
      <Text className="text-dark-text-muted text-lg mt-4">
        No coins available
      </Text>
      <Text className="text-dark-text-muted text-sm mt-2 text-center px-8">
        Try refreshing or check back later
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-8 mt-4 mb-1 bg-dark-surface border-b border-dark-border">
        <View className="flex-row items-center">
          <Icon name="🦅" size={24} />
          <Text className="text-xl font-bold text-dark-text-primary ml-2">CoinHawk</Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity className="mr-3">
            <Icon name="🔔" size={20} color="#cbd5e1" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="👤" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Market Overview */}
        <View className="p-4">
          <Text className="text-lg font-semibold text-dark-text-primary mb-3">
            Market Overview
          </Text>
          <View className="bg-dark-surface rounded-2xl p-4 border border-dark-border">
            <Text className="text-sm text-dark-text-secondary mb-1">
              Total Market Cap
            </Text>
            <Text className="text-2xl font-bold text-dark-text-primary">
              {MOCK_MARKET_DATA?.totalMarketCap || '$0'}
            </Text>
            <Text className="text-sm text-success-500 mt-1">
              ▲ {MOCK_MARKET_DATA?.changePercent24h || '0%'} (24h)
            </Text>
          </View>
        </View>

        {/* Category Selector - Replacing Timeframe Selector */}
        <View className="px-4 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-x-2">
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  onPress={() => setSelectedCategory(category.key)}
                  className={`px-4 py-3 rounded-xl flex-row items-center ${
                    selectedCategory === category.key 
                      ? 'bg-hawk-accent' 
                      : 'bg-dark-surface border border-dark-border'
                  }`}
                >
                  <Icon 
                    name={category.icon || '📊'} 
                    size={16} 
                    color={selectedCategory === category.key ? '#1e293b' : '#94a3b8'} 
                  />
                  <Text className={`ml-2 ${
                    selectedCategory === category.key 
                      ? 'text-hawk-primary font-medium' 
                      : 'text-dark-text-secondary'
                  }`}>
                    {category.label || 'Unknown'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Category Section */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-dark-text-primary">
              {CATEGORIES.find(cat => cat.key === selectedCategory)?.icon || '📊'}{' '}
              {CATEGORIES.find(cat => cat.key === selectedCategory)?.label || 'Unknown'}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                // For now, just log since we're within the same tab navigator
                console.log('Navigate to full category:', selectedCategory);
                // In a real app, you might want to navigate to a dedicated category screen
                // or pass the category filter to the trending screen
              }}
            >
              <Text className="text-hawk-accent text-sm font-medium">View all →</Text>
            </TouchableOpacity>
          </View>
          
          {/* Loading State */}
          {loading && (
            <View className="py-8 items-center">
              <LoadingSpinner size="large" />
              <Text className="text-dark-text-muted mt-2">
                Loading coins...
              </Text>
            </View>
          )}

          {/* Coins List */}
          {!loading && (
            <FlatList
              data={coins}
              renderItem={renderCoinItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
            />
          )}
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};