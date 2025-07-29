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
      const errorMessage = 'Failed to load watchlist data';
      setError(errorMessage);
      showToast(errorMessage, 'error');
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
      // Don't set main error state for search failures, just show toast
      showToast('Search failed. Please try again.', 'warning');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Actions with toast feedback
  const addToWatchlist = useCallback(async (coinId: string, coinName?: string): Promise<boolean> => {
    try {
      const response = await watchlistApi.addToWatchlist(coinId);
      
      if (response.success) {
        setWatchlistIds(prev => [...prev, coinId]);
        setError(null);
        showToast(
          `${coinName || 'Coin'} added to watchlist successfully!`, 
          'success'
        );
        return true;
      }
      return false;
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
      const response = await watchlistApi.removeFromWatchlist(coinId);
      
      if (response.success) {
        setWatchlistIds(prev => prev.filter(id => id !== coinId));
        // Also remove any alerts for this coin
        setAlerts(prev => prev.filter(alert => alert.coinPostId !== coinId));
        setError(null);
        showToast(
          `${coinName || 'Coin'} removed from watchlist`, 
          'success'
        );
        return true;
      }
      return false;
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
      const response = await watchlistApi.createAlert(alertData);
      
      if (response.success) {
        setAlerts(prev => [...prev, response.data]);
        setError(null);
        showToast(
          `Price alert created for ${coinName || 'coin'}!`, 
          'success'
        );
        return true;
      }
      return false;
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
      const alert = alerts.find(a => a.id === alertId);
      if (!alert) return false;

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
        
        const statusText = !alert.isActive ? 'activated' : 'deactivated';
        showToast(
          `Alert ${statusText} for ${coinName || 'coin'}`, 
          'success'
        );
        return true;
      }
      return false;
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
      const response = await watchlistApi.deleteAlert(alertId);
      
      if (response.success) {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        setError(null);
        showToast(
          `Alert deleted for ${coinName || 'coin'}`, 
          'success'
        );
        return true;
      }
      return false;
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
      
      showToast('Watchlist refreshed successfully!', 'success');

    } catch (err) {
      console.error('Error refreshing data:', err);
      const errorMessage = 'Failed to refresh data';
      setError(errorMessage);
      showToast(errorMessage, 'error');
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
    
    // Actions with toast support
    addToWatchlist,
    removeFromWatchlist,
    createAlert,
    toggleAlert,
    deleteAlert,
    refreshData,
  };
};