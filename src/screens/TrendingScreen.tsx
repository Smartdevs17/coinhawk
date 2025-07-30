import React, { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { CoinPost } from '../types';
import { Button, Card, PriceChangeIndicator, Icon, LoadingSpinner } from '../components/ui';
import { EXTENDED_TRENDING_POSTS } from '../utils/mockData';

type FilterType = 'All' | 'Gainers' | 'New';
type SortType = 'Market Cap' | 'Volume' | 'Price' | '24h Change';

export const TrendingScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedSort, setSelectedSort] = useState<SortType>('Market Cap');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filters: FilterType[] = ['All', 'Gainers', 'New'];
  const sortOptions: SortType[] = ['Market Cap', 'Volume', 'Price', '24h Change'];

  // Filter and sort logic
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...EXTENDED_TRENDING_POSTS];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'Gainers':
        filtered = filtered.filter(post => post.change24h.startsWith('+'));
        break;
      case 'New':
        // For demo, show coins with rank > 5 as "new"
        filtered = filtered.filter(post => (post.rank || 0) > 5);
        break;
      // 'All' shows everything
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'Market Cap':
          return parseFloat(b.marketCap.replace(/[$M]/g, '')) - parseFloat(a.marketCap.replace(/[$M]/g, ''));
        case 'Volume':
          return parseFloat(b.volume24h.replace(/[$MK]/g, '')) - parseFloat(a.volume24h.replace(/[$MK]/g, ''));
        case 'Price':
          return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
        case '24h Change':
          const aChange = parseFloat(a.change24h.replace(/[+%]/g, ''));
          const bChange = parseFloat(b.change24h.replace(/[+%]/g, ''));
          return bChange - aChange;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, activeFilter, selectedSort]);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1500);
  };

  const renderMiniChart = () => (
    <View className="w-16 h-8 bg-dark-surface-light rounded items-center justify-center">
      <Icon name="📈" size={12} color="#10b981" />
    </View>
  );

  const renderCoinPost = ({ item, index }: { item: CoinPost; index: number }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CoinDetails', { coin: item })}>
      <Card variant="surface" className="mb-3">
        <View className="flex-row items-center">
          {/* Rank and Icon */}
          <View className="w-8 mr-3">
            <Text className="text-dark-text-muted text-sm font-medium">
              #{item.rank || index + 1}
            </Text>
          </View>
          
          {/* Coin Info */}
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-dark-text-primary font-semibold mr-2">
                {item.name}
              </Text>
              {item.verified && (
                <Icon name="✓" size={14} color="#10b981" />
              )}
            </View>
            <Text className="text-dark-text-secondary text-sm">{item.symbol}</Text>
            <Text className="text-dark-text-muted text-xs mt-1">
              {item.holders.toLocaleString()} holders
            </Text>
          </View>

          {/* Mini Chart */}
          <View className="mr-3">
            {renderMiniChart()}
          </View>

          {/* Price and Change */}
          <View className="items-end">
            <Text className="text-dark-text-primary font-semibold">
              {item.price}
            </Text>
            <PriceChangeIndicator 
              change={item.change24h} 
              size="sm" 
              className="mt-1"
            />
            <View className="mt-1">
              <Text className="text-dark-text-muted text-xs">
                Vol: {item.volume24h}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      {/* Header */}
      <View className="px-4 py-8 mt-4 bg-dark-surface border-b border-dark-border">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-bold text-dark-text-primary">🔥 Trending</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Icon name="🔄" size={20} color="#fbbf24" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-dark-bg rounded-xl px-4 py-3 flex-row items-center border border-dark-border">
          <Icon name="🔍" size={16} color="#94a3b8" />
          <TextInput
            placeholder="Search CoinPosts..."
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

      {/* Market Stats */}
      <View className="px-4 py-3 bg-dark-surface border-b border-dark-border">
        <View className="flex-row justify-between">
          <View>
            <Text className="text-dark-text-muted text-xs">Total Posts</Text>
            <Text className="text-dark-text-primary font-semibold">
              {filteredAndSortedPosts.length}
            </Text>
          </View>
          <View>
            <Text className="text-dark-text-muted text-xs">Gainers</Text>
            <Text className="text-success-500 font-semibold">
              {filteredAndSortedPosts.filter(p => p.change24h.startsWith('+')).length}
            </Text>
          </View>
          <View>
            <Text className="text-dark-text-muted text-xs">Losers</Text>
            <Text className="text-danger-500 font-semibold">
              {filteredAndSortedPosts.filter(p => p.change24h.startsWith('-')).length}
            </Text>
          </View>
          <View>
            <Text className="text-dark-text-muted text-xs">New Today</Text>
            <Text className="text-hawk-accent font-semibold">
              {filteredAndSortedPosts.filter(p => (p.rank || 0) > 5).length}
            </Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      {/* <View className="px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-x-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                title={filter}
                variant={activeFilter === filter ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => setActiveFilter(filter)}
              />
            ))}
          </View>
        </ScrollView>
      </View> */}

      {/* Sort Controls */}
      <View className="px-4 pb-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-dark-text-secondary text-sm">
            {filteredAndSortedPosts.length} results
          </Text>
          
          <View className="relative">
            <Button
              title={`Sort: ${selectedSort}`}
              variant="ghost"
              size="sm"
              icon={<Icon name="⏷" size={12} color="#fbbf24" />}
              onPress={() => setShowSortDropdown(!showSortDropdown)}
            />
            
            {showSortDropdown && (
              <View className="absolute top-full right-0 mt-1 bg-dark-surface border border-dark-border rounded-xl py-2 z-10 min-w-32">
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

      {/* Loading State */}
      {loading && (
        <LoadingSpinner 
          variant="card" 
          text="Updating market data..." 
          className="mx-4 mb-4"
        />
      )}

      {/* Coins List */}
      <FlatList
        data={filteredAndSortedPosts.filter(post => post.rank === 1 || post.rank === 2 || post.rank === 3 || post.rank === 4 || post.rank === 5)}
        renderItem={renderCoinPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card variant="surface" className="py-8">
            <View className="items-center">
              <Icon name="🔍" size={32} color="#94a3b8" />
              <Text className="text-dark-text-secondary text-center mt-3">
                No trending coins found
              </Text>
              <Text className="text-dark-text-muted text-center text-sm mt-1">
                Try adjusting your search or filters
              </Text>
            </View>
          </Card>
        }
      />
    </SafeAreaView>
  );
};