import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { CoinPost } from '../types';
import { PriceChangeIndicator, Icon, LoadingSpinner } from '../components/ui';
import { getCoinsByCategory } from '../services/api';

type RootStackParamList = {
  MainTabs: undefined;
  CoinDetails: {
    coin?: CoinPost;
    coinId?: string;
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type FilterType = 'All' | 'Gainers' | 'Losers' | 'New';
type SortType = 'Market Cap' | 'Volume' | 'Price' | '24h Change';

export const TrendingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedSort, setSelectedSort] = useState<SortType>('Market Cap');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [allCoins, setAllCoins] = useState<CoinPost[]>([]);

  const filters: FilterType[] = ['All', 'Gainers', 'Losers', 'New'];
  const sortOptions: SortType[] = ['Market Cap', 'Volume', 'Price', '24h Change'];

  const loadAllCoins = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [trendingCoins, newCoins, topGainersCoins] = await Promise.all([
        getCoinsByCategory('trending'),
        getCoinsByCategory('new'),
        getCoinsByCategory('topGainers')
      ]);

      const allCoinsArray = [...(trendingCoins || []), ...(newCoins || []), ...(topGainersCoins || [])];
      const uniqueCoins = allCoinsArray.filter((coin, index, self) => 
        coin && coin.address && self.findIndex(c => c && c.address === coin.address) === index
      );

      setAllCoins(uniqueCoins);
    } catch (error) {
      console.error('Failed to load trending coins:', error);
      setAllCoins([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllCoins();
  }, []);

  const parseNumericValue = (value: string): number => {
    if (!value) return 0;
    const numericString = value.replace(/[$,KMB]/g, '');
    let multiplier = 1;
    
    if (value.includes('K')) multiplier = 1000;
    else if (value.includes('M')) multiplier = 1000000;
    else if (value.includes('B')) multiplier = 1000000000;
    
    return parseFloat(numericString) * multiplier || 0;
  };

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...allCoins];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post && 
        ((post.name && post.name.toLowerCase().includes(query)) ||
         (post.symbol && post.symbol.toLowerCase().includes(query)))
      );
    }

    switch (activeFilter) {
      case 'Gainers':
        filtered = filtered.filter(post => post.change24h && post.change24h.startsWith('+'));
        break;
      case 'Losers':
        filtered = filtered.filter(post => post.change24h && post.change24h.startsWith('-'));
        break;
      case 'New':
        filtered = filtered.filter((post, index) => index > 10);
        break;
    }

    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      switch (selectedSort) {
        case 'Market Cap':
          return parseNumericValue(b.marketCap || '') - parseNumericValue(a.marketCap || '');
        case 'Volume':
          return parseNumericValue(b.volume24h || '') - parseNumericValue(a.volume24h || '');
        case 'Price':
          return parseNumericValue(b.price || '') - parseNumericValue(a.price || '');
        case '24h Change':
          const aChange = parseFloat((a.change24h || '0').replace(/[+%]/g, ''));
          const bChange = parseFloat((b.change24h || '0').replace(/[+%]/g, ''));
          return bChange - aChange;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allCoins, searchQuery, activeFilter, selectedSort]);

  const handleRefresh = () => {
    loadAllCoins(true);
  };

  const handleCoinPress = (coin: CoinPost) => {
    navigation.navigate('CoinDetails', { coin });
  };

  const renderMiniChart = () => {
    return (
      <View className="w-12 h-8 bg-dark-border rounded flex-row items-end justify-center gap-x-1 p-1">
        <View className="w-1 bg-hawk-accent rounded-full" style={{ height: '30%' }} />
        <View className="w-1 bg-hawk-accent rounded-full" style={{ height: '60%' }} />
        <View className="w-1 bg-hawk-accent rounded-full" style={{ height: '40%' }} />
        <View className="w-1 bg-hawk-accent rounded-full" style={{ height: '80%' }} />
        <View className="w-1 bg-hawk-accent rounded-full" style={{ height: '50%' }} />
      </View>
    );
  };

const renderTrendingCoin = ({ item, index }: { item: CoinPost; index: number }) => {
  if (!item) return null;

  const displayName = typeof item.name === 'string' && item.name ? item.name.replace(/\n/g, ' ').trim() : 'Unknown';
  const displaySymbol = typeof item.symbol === 'string' && item.symbol ? item.symbol.replace(/\n/g, ' ').trim() : '---';

  return (
    <TouchableOpacity activeOpacity={0.7} className="mb-3" onPress={() => handleCoinPress(item)}>
      <View className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-hawk-accent rounded-full items-center justify-center mr-3">
            <Text className="text-hawk-primary font-bold text-sm">#{index + 1}</Text>
          </View>
          <View className="flex-1 mr-3">
            <View className="flex-row items-center mb-1">
              <Text className="text-dark-text-primary font-semibold text-base">{displayName}</Text>
              {item.verified && (
                <View className="ml-2">
                  <Icon name="✓" size={14} color="#10b981" />
                </View>
              )}
            </View>
            <Text className="text-dark-text-secondary text-sm mb-1">{displaySymbol}</Text>
            {item.holders && (
              <Text className="text-dark-text-muted text-xs">{item.holders.toLocaleString()} holders</Text>
            )}
          </View>
          <View className="mr-3">{renderMiniChart()}</View>
          <View className="items-end">
            <Text className="text-dark-text-primary font-semibold text-base">{item.price || '$0.00'}</Text>
            {item.change24h && (
              <PriceChangeIndicator change={item.change24h} size="sm" className="mt-1" />
            )}
            {item.volume24h && (
              <Text className="text-dark-text-muted text-xs mt-1">Vol: {item.volume24h}</Text>
            )}
          </View>
        </View>
        <View className="mt-3 pt-3 border-t border-dark-border">
          <View className="flex-row justify-between">
            <Text className="text-dark-text-muted text-xs">Market Cap: {item.marketCap || 'N/A'}</Text>
            <Text className="text-dark-text-muted text-xs">Rank: #{index + 1}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <View className="px-4 py-6 bg-dark-surface border-b border-dark-border">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-dark-text-primary">🔥 Trending</Text>
          <TouchableOpacity onPress={handleRefresh} disabled={loading || refreshing}>
            <Icon name="🔄" size={20} color="#fbbf24" />
          </TouchableOpacity>
        </View>
        <View className="bg-dark-bg rounded-xl px-4 py-3 flex-row items-center border border-dark-border">
          <Icon name="🔍" size={16} color="#94a3b8" />
          <TextInput
            placeholder="Search trending tokens..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-dark-text-primary"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="✕" size={14} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="px-4 py-3 bg-dark-surface border-b border-dark-border">
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-dark-text-muted text-xs">Total</Text>
            <Text className="text-dark-text-primary font-bold text-lg">{filteredAndSortedPosts.length}</Text>
          </View>
          <View className="items-center">
            <Text className="text-dark-text-muted text-xs">Gainers</Text>
            <Text className="text-success-500 font-bold text-lg">
              {filteredAndSortedPosts.filter(p => p.change24h && p.change24h.startsWith('+')).length}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-dark-text-muted text-xs">Losers</Text>
            <Text className="text-danger-500 font-bold text-lg">
              {filteredAndSortedPosts.filter(p => p.change24h && p.change24h.startsWith('-')).length}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-dark-text-muted text-xs">New</Text>
            <Text className="text-hawk-accent font-bold text-lg">
              {filteredAndSortedPosts.filter((p, index) => index > 10).length}
            </Text>
          </View>
        </View>
      </View>
      <View className="px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-x-2">
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl ${
                  activeFilter === filter 
                    ? 'bg-hawk-accent' 
                    : 'bg-dark-surface border border-dark-border'
                }`}
              >
                <Text className={`font-medium ${
                  activeFilter === filter 
                    ? 'text-hawk-primary' 
                    : 'text-dark-text-secondary'
                }`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <View className="px-4 pb-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-dark-text-secondary text-sm">{filteredAndSortedPosts.length} tokens</Text>
          <View className="relative">
            <TouchableOpacity
              onPress={() => setShowSortDropdown(!showSortDropdown)}
              className="flex-row items-center bg-dark-surface border border-dark-border rounded-lg px-3 py-2"
            >
              <Text className="text-dark-text-secondary text-sm mr-2">Sort: {selectedSort}</Text>
              <Icon name="⏷" size={12} color="#fbbf24" />
            </TouchableOpacity>
            {showSortDropdown && (
              <View className="absolute top-full right-0 mt-1 bg-dark-surface border border-dark-border rounded-xl py-2 z-10 min-w-40">
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setSelectedSort(option);
                      setShowSortDropdown(false);
                    }}
                    className="px-4 py-2"
                  >
                    <Text className={`text-sm ${
                      selectedSort === option 
                        ? 'text-hawk-accent font-semibold' 
                        : 'text-dark-text-secondary'
                    }`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
      {loading && (
        <View className="px-4 mb-4">
          <LoadingSpinner variant="card" text="Loading trending tokens..." />
        </View>
      )}
      <FlatList
        data={filteredAndSortedPosts}
        renderItem={renderTrendingCoin}
        keyExtractor={(item) => item.id || item.address || Math.random().toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={
          !loading ? (
            <View className="bg-dark-surface border border-dark-border rounded-xl p-12">
              <View className="items-center">
                <Icon name="🔍" size={48} color="#64748b" />
                <Text className="text-dark-text-secondary text-lg font-medium mt-4">No trending tokens found</Text>
                <Text className="text-dark-text-muted text-center text-sm mt-2 px-8">
                  Try adjusting your search or filters to find trending tokens
                </Text>
              </View>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};