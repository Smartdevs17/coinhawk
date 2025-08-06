import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  CoinPost, 
  PriceAlert, 
  WatchlistItem 
} from '../types/api';
import { 
  getCoinsByCategory,
  searchCoins,
  getCoinDetails,
  watchlistApi,
} from '../services/api';

export interface UseWatchlistReturn {
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
  
  // Actions with toast support
  addToWatchlist: (coinId: string, coinName?: string) => Promise<boolean>;
  removeFromWatchlist: (coinId: string, coinName?: string) => Promise<boolean>;
  createAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>, coinName?: string) => Promise<boolean>;
  toggleAlert: (alertId: string, coinName?: string) => Promise<boolean>;
  deleteAlert: (alertId: string, coinName?: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

export const useWatchlist = (
  onShowToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
): UseWatchlistReturn => {
  // State
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [allCoins, setAllCoins] = useState<CoinPost[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Helper function to show toast
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    if (onShowToast) {
      onShowToast(message, type);
    }
  };

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

  // Load data from all available endpoints
  const loadAllCoinsData = useCallback(async () => {
    try {
      // Load from all endpoints in parallel
      const [trendingCoins, topGainersCoins, mostValuableCoins, newCoins] = await Promise.all([
        getCoinsByCategory('trending'),
        getCoinsByCategory('topGainers'),
        getCoinsByCategory('mostValuable'),
        getCoinsByCategory('new')
      ]);

      // Combine all coins and remove duplicates based on address
      const allCoinsArray = [...trendingCoins, ...topGainersCoins, ...mostValuableCoins, ...newCoins];
      const uniqueCoins = allCoinsArray.filter((coin, index, self) => 
        self.findIndex(c => c.address === coin.address) === index
      );

      setAllCoins(uniqueCoins);
      return uniqueCoins;
    } catch (err) {
      console.error('Error loading coins data:', err);
      throw err;
    }
  }, []);

  // Persist watchlist and alerts to AsyncStorage
  const persistWatchlist = async (ids: string[]) => {
    try {
      await AsyncStorage.setItem('watchlistIds', JSON.stringify(ids));
    } catch (e) {
      // ignore
    }
  };
  const persistAlerts = async (alerts: PriceAlert[]) => {
    try {
      await AsyncStorage.setItem('watchlistAlerts', JSON.stringify(alerts));
    } catch (e) {
      // ignore
    }
  };

  // Load persisted watchlist and alerts from AsyncStorage
  const loadPersistedWatchlist = async () => {
    try {
      const ids = await AsyncStorage.getItem('watchlistIds');
      if (ids) setWatchlistIds(JSON.parse(ids));
    } catch (e) {}
  };
  const loadPersistedAlerts = async () => {
    try {
      const alertsStr = await AsyncStorage.getItem('watchlistAlerts');
      if (alertsStr) setAlerts(JSON.parse(alertsStr));
    } catch (e) {}
  };

  // Initialize data
  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load persisted watchlist and alerts first
      await Promise.all([loadPersistedWatchlist(), loadPersistedAlerts()]);

      // Load all coins data
      await loadAllCoinsData();

    } catch (err) {
      console.error('Error initializing watchlist data:', err);
      const errorMessage = 'Failed to load watchlist data';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [loadAllCoinsData]);

  // Search coins across all data
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      // Restore original data when search is cleared
      await loadAllCoinsData();
      return;
    }

    try {
      setSearchLoading(true);
      // Search across all categories
      const searchResults = await searchCoins(query, ['trending', 'topGainers', 'mostValuable', 'new']);
      setAllCoins(searchResults);
    } catch (err) {
      console.error('Error searching coins:', err);
      showToast('Search failed. Please try again.', 'warning');
    } finally {
      setSearchLoading(false);
    }
  }, [loadAllCoinsData]);

  // Actions with toast feedback (unchanged logic)
  const addToWatchlist = useCallback(async (coinId: string, coinName?: string): Promise<boolean> => {
    try {
      // Locally add to watchlist
      setWatchlistIds(prev => {
        const updated = [...prev, coinId];
        persistWatchlist(updated);
        return updated;
      });
      setError(null);
      showToast(
        `${coinName || 'Coin'} added to watchlist successfully!`, 
        'success'
      );
      return true;
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      const errorMessage = `Failed to add ${coinName || 'coin'} to watchlist`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return false;
    }
  }, []);

  const removeFromWatchlist = useCallback(async (coinId: string, coinName?: string): Promise<boolean> => {
    try {
      setWatchlistIds(prev => {
        const updated = prev.filter(id => id !== coinId);
        persistWatchlist(updated);
        return updated;
      });
      setAlerts(prev => {
        const updated = prev.filter(alert => alert.coinPostId !== coinId);
        persistAlerts(updated);
        return updated;
      });
      setError(null);
      showToast(
        `${coinName || 'Coin'} removed from watchlist`, 
        'success'
      );
      return true;
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      const errorMessage = `Failed to remove ${coinName || 'coin'} from watchlist`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return false;
    }
  }, []);

  const createAlert = useCallback(async (
    alertData: Omit<PriceAlert, 'id' | 'createdAt'>, 
    coinName?: string
  ): Promise<boolean> => {
    try {
      // Locally create alert
      const newAlert: PriceAlert = {
        ...alertData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setAlerts(prev => {
        const updated = [...prev, newAlert];
        persistAlerts(updated);
        return updated;
      });
      setError(null);
      showToast(
        `Price alert created for ${coinName || 'coin'}!`, 
        'success'
      );
      return true;
    } catch (err) {
      console.error('Error creating alert:', err);
      const errorMessage = `Failed to create price alert for ${coinName || 'coin'}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return false;
    }
  }, []);

  const toggleAlert = useCallback(async (alertId: string, coinName?: string): Promise<boolean> => {
    try {
      setAlerts(prev => {
        const updated = prev.map(a =>
          a.id === alertId ? { ...a, isActive: !a.isActive } : a
        );
        persistAlerts(updated);
        return updated;
      });
      setError(null);
      const alert = alerts.find(a => a.id === alertId);
      const statusText = alert && !alert.isActive ? 'activated' : 'deactivated';
      showToast(
        `Alert ${statusText} for ${coinName || 'coin'}`, 
        'success'
      );
      return true;
    } catch (err) {
      console.error('Error toggling alert:', err);
      const errorMessage = `Failed to update alert for ${coinName || 'coin'}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return false;
    }
  }, [alerts]);

  const deleteAlert = useCallback(async (alertId: string, coinName?: string): Promise<boolean> => {
    try {
      setAlerts(prev => {
        const updated = prev.filter(a => a.id !== alertId);
        persistAlerts(updated);
        return updated;
      });
      setError(null);
      showToast(
        `Alert deleted for ${coinName || 'coin'}`, 
        'success'
      );
      return true;
    } catch (err) {
      console.error('Error deleting alert:', err);
      const errorMessage = `Failed to delete alert for ${coinName || 'coin'}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return false;
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Reload persisted watchlist and alerts
      await Promise.all([loadPersistedWatchlist(), loadPersistedAlerts()]);

      // Refresh all coins data
      await loadAllCoinsData();
      // showToast('Watchlist refreshed successfully!', 'success');

    } catch (err) {
      console.error('Error refreshing data:', err);
      const errorMessage = 'Failed to refresh data';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setRefreshing(false);
    }
  }, [loadAllCoinsData]);

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
    
    // Actions with toast support
    addToWatchlist,
    removeFromWatchlist,
    createAlert,
    toggleAlert,
    deleteAlert,
    refreshData,
  };
};