import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoinPost } from '../types';
import { Icon, LoadingSpinner, Button, Card } from '../components/ui';
import { getCoinDetails, getCoinSummary } from '../services/api';

// Navigation types
type RootStackParamList = {
  MainTabs: undefined;
  CoinDetails: {
    coin?: CoinPost;
    coinId?: string;
  };
};

type CoinDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CoinDetails'>;
type CoinDetailsScreenRouteProp = RouteProp<RootStackParamList, 'CoinDetails'>;

export const CoinDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CoinDetailsScreenNavigationProp>();
  const route = useRoute<CoinDetailsScreenRouteProp>();
  
  const { coin: initialCoin, coinId } = route.params;
  
  const [coin, setCoin] = useState<CoinPost | null>(initialCoin || null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  // Load coin details and AI summary
  const loadCoinData = async (address: string) => {
    setLoading(true);
    try {
      // Load coin details if not provided
      if (!coin) {
        const coinDetails = await getCoinDetails(address);
        if (coinDetails) {
          setCoin(coinDetails);
        }
      }

      // Load AI Summary
      setSummaryLoading(true);
      const summary = await getCoinSummary(address);
      setAiSummary(summary);
    } catch (error) {
      console.error('Error loading coin data:', error);
      Alert.alert('Error', 'Failed to load coin details');
    } finally {
      setLoading(false);
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (coinId) {
      loadCoinData(coinId);
    } else if (coin?.address) {
      loadCoinData(coin.address);
    }
  }, [coinId, coin?.address]);

  const handleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
    // TODO: Call watchlist API
  };

  const handleShare = async () => {
    if (!coin) return;
    
    try {
      await Share.share({
        message: `Check out ${coin.name} (${coin.symbol}) on CoinHawk! 🦅\nPrice: ${coin.price}\nChange: ${coin.change24h}`,
        title: `${coin.name} - CoinHawk`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleTrade = (action: 'buy' | 'sell') => {
    if (!coin) return;
    // TODO: Navigate to trading screen with pre-filled coin
    console.log(`${action.toUpperCase()} ${coin.symbol}`);
  };

  if (loading && !coin) {
    return (
      <SafeAreaView className="flex-1 bg-dark-bg">
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" />
          <Text className="text-dark-text-muted mt-4">Loading coin details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!coin) {
    return (
      <SafeAreaView className="flex-1 bg-dark-bg">
        <View className="flex-1 items-center justify-center px-8">
          <Icon name="❌" size={48} color="#ef4444" />
          <Text className="text-dark-text-primary text-lg font-semibold mt-4">
            Coin Not Found
          </Text>
          <Text className="text-dark-text-muted text-center mt-2">
            We couldn't load the details for this coin. Please try again.
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="secondary"
            className="mt-6"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      {/* Header - Add extra top padding */}
      <View
        className="flex-row items-center justify-between px-4 py-2 bg-dark-surface border-b border-dark-border"
        style={{ paddingTop: insets.top + 12 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center py-2">
          <Icon name="←" size={20} color="#cbd5e1" />
          <Text className="text-dark-text-secondary ml-2">Back</Text>
        </TouchableOpacity>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleWatchlist} className="mr-4 p-2">
            <Icon 
              name={isWatchlisted ? "⭐" : "☆"} 
              size={20} 
              color={isWatchlisted ? "#fbbf24" : "#cbd5e1"} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} className="p-2">
            <Icon name="📤" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>
      </View>

// Replace the ScrollView and bottom buttons section in your CoinDetailsScreen:

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        // SIMPLIFIED: Remove complex contentContainerStyle calculations
        contentContainerStyle={{
          paddingBottom: 120, // Fixed bottom padding for buttons
        }}
      >
        {/* Coin Header */}
        <View className="p-4 bg-dark-surface border-b border-dark-border">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-hawk-accent rounded-full items-center justify-center mr-3">
              <Text className="text-hawk-primary font-bold text-lg">
                {coin.symbol.slice(0, 2)}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-dark-text-primary font-bold text-xl mr-2">
                  {coin.name}
                </Text>
                {coin.verified && (
                  <Icon name="✓" size={18} color="#10b981" />
                )}
              </View>
              <Text className="text-dark-text-secondary text-base">{coin.symbol}</Text>
              {coin.holders && (
                <Text className="text-dark-text-muted text-sm">
                  {coin.holders.toLocaleString()} holders
                </Text>
              )}
            </View>
          </View>

          {/* Price and Stats */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-dark-text-primary font-bold text-2xl">
                {coin.price}
              </Text>
              <Text className={`text-base font-semibold ${
                coin.change24h.startsWith('+') ? 'text-success-500' : 'text-danger-500'
              }`}>
                {coin.change24h} (24h)
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="p-4">
          <View className="flex-row justify-between mb-3">
            <Card variant="surface" className="flex-1 mr-2 p-3">
              <Text className="text-dark-text-muted text-xs mb-1">Market Cap</Text>
              <Text className="text-dark-text-primary font-semibold text-base">
                {coin.marketCap}
              </Text>
            </Card>
            <Card variant="surface" className="flex-1 ml-2 p-3">
              <Text className="text-dark-text-muted text-xs mb-1">24h Volume</Text>
              <Text className="text-dark-text-primary font-semibold text-base">
                {coin.volume24h}
              </Text>
            </Card>
          </View>
        </View>

        {/* Description */}
        {coin.description && (
          <View className="px-4 mb-3">
            <Text className="text-dark-text-primary font-semibold text-base mb-2">
              About {coin.name}
            </Text>
            <Card variant="surface" className="p-3">
              <Text className="text-dark-text-secondary leading-5 text-sm">
                {coin.description}
              </Text>
            </Card>
          </View>
        )}

        {/* AI Summary Section */}
        <View className="px-4 mb-3">
          <View className="flex-row items-center mb-2">
            <Icon name="🤖" size={18} color="#fbbf24" />
            <Text className="text-dark-text-primary font-semibold text-base ml-2">
              AI Summary
            </Text>
          </View>
          
          <Card variant="surface" className="p-3">
            {summaryLoading ? (
              <View className="items-center py-4">
                <LoadingSpinner size="small" />
                <Text className="text-dark-text-muted mt-2 text-sm">
                  Generating AI analysis...
                </Text>
              </View>
            ) : aiSummary ? (
              <Text className="text-dark-text-secondary leading-5 text-sm">
                {aiSummary}
              </Text>
            ) : (
              <View className="items-center py-4">
                <Icon name="🔍" size={24} color="#94a3b8" />
                <Text className="text-dark-text-muted mt-2 text-center text-sm">
                  AI summary not available at this time
                </Text>
                <TouchableOpacity 
                  onPress={() => coin.address && loadCoinData(coin.address)}
                  className="mt-2"
                >
                  <Text className="text-hawk-accent text-sm">Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        </View>

        {/* Additional Info */}
        <View className="px-4 mb-4">
          <Text className="text-dark-text-primary font-semibold text-base mb-2">
            Details
          </Text>
          <Card variant="surface" className="p-3">
            <View className="space-y-2">
              <View className="flex-row justify-between items-center py-1">
                <Text className="text-dark-text-muted text-sm">Contract Address</Text>
                <TouchableOpacity>
                  <Text className="text-hawk-accent font-mono text-xs">
                    {coin.address?.slice(0, 6)}...{coin.address?.slice(-4)}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {coin.createdAt && (
                <View className="flex-row justify-between items-center border-t border-dark-border pt-2">
                  <Text className="text-dark-text-muted text-sm">Created</Text>
                  <Text className="text-dark-text-secondary text-sm">
                    {new Date(coin.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              )}
              
              <View className="flex-row justify-between items-center border-t border-dark-border pt-2">
                <Text className="text-dark-text-muted text-sm">Network</Text>
                <Text className="text-dark-text-secondary text-sm">Base</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* FIXED: Simplified floating buttons without absolute positioning */}
      {/* <View className="bg-dark-surface border-t border-dark-border px-4 py-3">
        <View className="flex-row" style={{ gap: 16 }}>
          <Button
            title="Buy"
            onPress={() => handleTrade('buy')}
            variant="primary"
            className="flex-1"
          />
          <Button
            title="Sell"
            onPress={() => handleTrade('sell')}
            variant="secondary"
            className="flex-1"
          />
        </View>
      </View> */}

      {/* Floating Action Buttons - Fixed positioning */}
    <View
      className="absolute left-0 right-0 bg-dark-bg border-t border-dark-border"
      style={{
        bottom: insets.bottom ? insets.bottom + 12 : 24, // Move it down a bit
        // paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
      }}
    >
      <View className="flex-row px-4 py-3" style={{ gap: 16 }}>
        <Button
        title="Buy"
        onPress={() => handleTrade('buy')}
        variant="primary"
        className="flex-1"
        />
        <Button
        title="Sell"
        onPress={() => handleTrade('sell')}
        variant="secondary"
        className="flex-1"
        />
      </View>
    </View>
    </SafeAreaView>
  );
};