// Create this file: src/hooks/useTrending.ts

import { useState, useEffect, useMemo } from 'react';
import { CoinPost } from '../types/api';
import { getCoinsByCategory, CoinCategory } from '../services/api';

type FilterType = 'All' | 'Gainers' | 'New';
type SortType = 'Market Cap' | 'Volume' | 'Price' | '24h Change';

export const useTrending = () => {
  const [coins, setCoins] = useState<CoinPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedSort, setSelectedSort] = useState<SortType>('Market Cap');
  const [searchQuery, setSearchQuery] = useState('');

  // Load real data from API
  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Load data from all API endpoints
      const [trending, topGainers, mostValuable, newCoins] = await Promise.all([
        getCoinsByCategory('trending'),
        getCoinsByCategory('topGainers'), 
        getCoinsByCategory('mostValuable'),
        getCoinsByCategory('new')
      ]);

      // Combine and deduplicate by address
      const allCoins = [...trending, ...topGainers, ...mostValuable, ...newCoins];
      const uniqueCoins = allCoins.filter((coin, index, self) => 
        self.findIndex(c => c.address === coin.address) === index
      );

      console.log(`Loaded ${uniqueCoins.length} real coins from API`);
      setCoins(uniqueCoins);

    } catch (err) {
      console.error('Error loading trending data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter and sort the real data
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...coins];

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
        // Sort by creation date for new filter
        filtered = filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 20); // Show top 20 newest
        break;
      // 'All' shows everything
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'Market Cap':
          const aMarketCap = parseFloat(a.marketCap.replace(/[$MBK]/g, ''));
          const bMarketCap = parseFloat(b.marketCap.replace(/[$MBK]/g, ''));
          return bMarketCap - aMarketCap;
        case 'Volume':
          const aVolume = parseFloat(a.volume24h.replace(/[$MBK]/g, ''));
          const bVolume = parseFloat(b.volume24h.replace(/[$MBK]/g, ''));
          return bVolume - aVolume;
        case 'Price':
          const aPrice = parseFloat(a.price.replace('$', ''));
          const bPrice = parseFloat(b.price.replace('$', ''));
          return bPrice - aPrice;
        case '24h Change':
          const aChange = parseFloat(a.change24h.replace(/[+%]/g, ''));
          const bChange = parseFloat(b.change24h.replace(/[+%]/g, ''));
          return bChange - aChange;
        default:
          return 0;
      }
    });

    return filtered;
  }, [coins, searchQuery, activeFilter, selectedSort]);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData(true);
  };

  return {
    // Data
    coins: filteredAndSortedPosts,
    loading,
    refreshing,
    error,
    
    // Filters and search
    activeFilter,
    setActiveFilter,
    selectedSort,
    setSelectedSort,
    searchQuery,
    setSearchQuery,
    
    // Actions
    handleRefresh,
    
    // Stats
    totalCoins: coins.length,
    gainersCount: coins.filter(p => p.change24h.startsWith('+')).length,
    losersCount: coins.filter(p => p.change24h.startsWith('-')).length,
    newTodayCount: coins.filter(p => {
      const created = new Date(p.createdAt);
      const today = new Date();
      return created.toDateString() === today.toDateString();
    }).length,
  };
};