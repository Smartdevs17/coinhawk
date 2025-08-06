import React, { createContext, useContext, useMemo } from 'react';
import { useWatchlist as useWatchlistHook } from '../hooks/useWatchlist';
import type { UseWatchlistReturn } from '../hooks/useWatchlist';

const WatchlistContext = createContext<UseWatchlistReturn | null>(null);

import { ReactNode } from 'react';

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider = ({ children }: WatchlistProviderProps) => {
  const watchlist = useWatchlistHook();
  const value = useMemo(() => watchlist, [
    watchlist.watchlistCoins.length,
    watchlist.availableCoins.length,
    watchlist.alerts.length,
    watchlist.loading,
    watchlist.refreshing,
    watchlist.searchLoading,
    watchlist.error,
    watchlist.searchQuery,
  ]);
  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within a WatchlistProvider');
  return ctx;
};
