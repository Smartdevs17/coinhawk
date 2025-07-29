import { useState, useEffect, useCallback } from 'react';
import { 
  CoinPost, 
  PriceAlert, 
  WatchlistItem 
} from '../types/api';
import { 
  getCoinsForWatchlist,
  searchCoins,
  getCoinDetails,
  watchlistApi 
} from '../services/api';

interface UseWatchlistReturn {
  // Data
  watchlistCoins: WatchlistItem[];
  availableCoins: CoinPost[];
  alerts: PriceAlert[];
  
  // Loading states
  loading: boolean;
  refreshing: boolean;
  searchLoading: boolean;
  
  // Error states
  error: string | null;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Actions
  addToWatchlist: (coinId: string) => Promise<void>;
  removeFromWatchlist: (coinId: string) => Promise<void>;
  createAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => Promise<void>;
  toggleAlert: (alertId: string) => Promise<void>;
  deleteAlert: (alertId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useWatchlist = (): UseWatchlistReturn => {
  // State
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [allCoins, setAllCoins] = useState<CoinPost[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Derived state
  const watchlistCoins: WatchlistItem[] = allCoins
    .filter(coin => watchlistIds.includes(coin.id))
    .map(coin => {
      const coinAlerts = alerts.filter(alert => alert.coinPostId === coin.id);
      return {
        ...coin,
        alertsCount: coinAlerts.length,
        isAlertsActive: coinAlerts.some(alert => alert.isActive),
      };
    });

  const availableCoins = allCoins.filter(coin => !watchlistIds.includes(coin.id));

  // Initialize data
  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch watchlist IDs and alerts in parallel
      const [watchlistResponse, alertsResponse] = await Promise.all([
        watchlistApi.getWatchlist(),
        watchlistApi.getAlerts()
      ]);

      if (watchlistResponse.success) {
        setWatchlistIds(watchlistResponse.data);
      }

      if (alertsResponse.success) {
        setAlerts(alertsResponse.data);
      }

      // Fetch available coins
      const coins = await getCoinsForWatchlist();
      setAllCoins(coins);

    } catch (err) {
      console.error('Error initializing watchlist data:', err);
      setError('Failed to load watchlist data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search coins
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      // Reset to all coins when search is cleared
      const coins = await getCoinsForWatchlist();
      setAllCoins(coins);
      return;
    }

    try {
      setSearchLoading(true);
      const searchResults = await searchCoins(query);
      setAllCoins(searchResults);
    } catch (err) {
      console.error('Error searching coins:', err);
      // Don't set main error state for search failures
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Actions
  const addToWatchlist = useCallback(async (coinId: string) => {
    try {
      const response = await watchlistApi.addToWatchlist(coinId);
      
      if (response.success) {
        setWatchlistIds(prev => [...prev, coinId]);
        setError(null);
      }
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      setError('Failed to add coin to watchlist');
    }
  }, []);

  const removeFromWatchlist = useCallback(async (coinId: string) => {
    try {
      const response = await watchlistApi.removeFromWatchlist(coinId);
      
      if (response.success) {
        setWatchlistIds(prev => prev.filter(id => id !== coinId));
        // Also remove any alerts for this coin
        setAlerts(prev => prev.filter(alert => alert.coinPostId !== coinId));
        setError(null);
      }
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError('Failed to remove coin from watchlist');
    }
  }, []);

  const createAlert = useCallback(async (alertData: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    try {
      const response = await watchlistApi.createAlert(alertData);
      
      if (response.success) {
        setAlerts(prev => [...prev, response.data]);
        setError(null);
      }
    } catch (err) {
      console.error('Error creating alert:', err);
      setError('Failed to create price alert');
    }
  }, []);

  const toggleAlert = useCallback(async (alertId: string) => {
    try {
      const alert = alerts.find(a => a.id === alertId);
      if (!alert) return;

      const response = await watchlistApi.updateAlert(alertId, {
        isActive: !alert.isActive
      });
      
      if (response.success) {
        setAlerts(prev => 
          prev.map(a => 
            a.id === alertId 
              ? { ...a, isActive: !a.isActive }
              : a
          )
        );
        setError(null);
      }
    } catch (err) {
      console.error('Error toggling alert:', err);
      setError('Failed to update alert');
    }
  }, [alerts]);

  const deleteAlert = useCallback(async (alertId: string) => {
    try {
      const response = await watchlistApi.deleteAlert(alertId);
      
      if (response.success) {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        setError(null);
      }
    } catch (err) {
      console.error('Error deleting alert:', err);
      setError('Failed to delete alert');
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Refresh all data
      const [watchlistResponse, alertsResponse] = await Promise.all([
        watchlistApi.getWatchlist(),
        watchlistApi.getAlerts()
      ]);

      if (watchlistResponse.success) {
        setWatchlistIds(watchlistResponse.data);
      }

      if (alertsResponse.success) {
        setAlerts(alertsResponse.data);
      }

      // Refresh coins data
      const coins = await getCoinsForWatchlist();
      setAllCoins(coins);

    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Effects
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  return {
    // Data
    watchlistCoins,
    availableCoins: searchQuery ? availableCoins.filter(coin =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    ) : availableCoins,
    alerts,
    
    // Loading states
    loading,
    refreshing,
    searchLoading,
    
    // Error state
    error,
    
    // Search
    searchQuery,
    setSearchQuery,
    
    // Actions
    addToWatchlist,
    removeFromWatchlist,
    createAlert,
    toggleAlert,
    deleteAlert,
    refreshData,
  };
};