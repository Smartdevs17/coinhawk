import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';


// Import our types and utilities
import { CoinPost, Timeframe, TIMEFRAMES } from '../types';
import { MOCK_TRENDING_POSTS, MOCK_MARKET_DATA } from '../utils';
import { Icon } from '../components/ui';

export const HomeScreen: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('24h');

  const renderTrendingPost = ({ item, index }: { item: CoinPost; index: number }) => (
    <TouchableOpacity className="bg-dark-surface rounded-xl p-4 mb-3 border border-dark-border">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-hawk-accent rounded-full items-center justify-center mr-3">
            <Text className="text-hawk-primary font-bold">#{index + 1}</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-dark-text-primary font-semibold text-lg mr-2">
                {item.name}
              </Text>
              {item.verified && (
                <Icon name="✓" size={16} color="#10b981" />
              )}
            </View>
            <Text className="text-dark-text-secondary">{item.symbol}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-dark-text-primary font-semibold text-lg">{item.price}</Text>
          <Text className={`font-medium ${
            item.change24h.startsWith('+') ? 'text-success-500' : 'text-danger-500'
          }`}>
            {item.change24h}
          </Text>
        </View>
      </View>
      
      <View className="mt-3 pt-3 border-t border-dark-border">
        <View className="flex-row justify-between">
          <Text className="text-dark-text-muted text-sm">Market Cap: {item.marketCap}</Text>
          <Text className="text-dark-text-muted text-sm">Volume: {item.volume24h}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-6 bg-dark-surface border-b border-dark-border">
        <View className="flex-row items-center">
          <Icon name="🦅" size={24} />
          <Text className="text-xl font-bold text-dark-text-primary ml-2">CoinHawk</Text>
        </View>
        <View className="flex-row space-x-3">
          <TouchableOpacity>
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
        contentContainerStyle={{ paddingBottom: 112 }} // 64 (tab height) + extra space
      >
        {/* Market Overview */}
        <View className="p-4">
          <Text className="text-lg font-semibold text-dark-text-primary mb-3">Market Overview</Text>
          <View className="bg-dark-surface rounded-2xl p-4 border border-dark-border">
            <Text className="text-sm text-dark-text-secondary mb-1">Total Market Cap</Text>
            <Text className="text-2xl font-bold text-dark-text-primary">
              {MOCK_MARKET_DATA.totalMarketCap}
            </Text>
            <Text className="text-sm text-success-500 mt-1">
              ▲ {MOCK_MARKET_DATA.changePercent24h} (24h)
            </Text>
          </View>
        </View>

        {/* Timeframe Selector */}
        <View className="px-4 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-x-2">
              {TIMEFRAMES.map((tf) => (
                <TouchableOpacity
                  key={tf}
                  onPress={() => setSelectedTimeframe(tf)}
                  className={`px-4 py-2 rounded-xl ${
                    selectedTimeframe === tf 
                      ? 'bg-hawk-accent' 
                      : 'bg-dark-surface border border-dark-border'
                  }`}
                >
                  <Text className={
                    selectedTimeframe === tf 
                      ? 'text-hawk-primary font-medium' 
                      : 'text-dark-text-secondary'
                  }>
                    {tf}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Trending Section */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-dark-text-primary">🔥 Trending</Text>
            <TouchableOpacity>
              <Text className="text-hawk-accent text-sm font-medium">View more →</Text>
            </TouchableOpacity>
          </View>
          
          {/* Trending Posts List */}
          <FlatList
            data={MOCK_TRENDING_POSTS}
            renderItem={renderTrendingPost}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Quick Actions */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-dark-text-primary mb-3">Quick Actions</Text>
          <View className="flex-row gap-x-3">
            <TouchableOpacity className="flex-1 bg-hawk-accent rounded-xl p-4 items-center">
              <Icon name="📈" size={24} color="#1a1f36" />
              <Text className="text-hawk-primary font-semibold mt-2">Trade</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-dark-surface border border-dark-border rounded-xl p-4 items-center">
              <Icon name="👀" size={24} color="#fbbf24" />
              <Text className="text-dark-text-primary font-semibold mt-2">Watchlist</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-dark-surface border border-dark-border rounded-xl p-4 items-center">
              <Icon name="📊" size={24} color="#fbbf24" />
              <Text className="text-dark-text-primary font-semibold mt-2">Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};