// Watchlist-specific types for BaseGecko
export interface PriceAlert {
  id: string;
  coinPostId: string;
  type: 'above' | 'below';
  targetPrice: string;
  currentPrice: string;
  isActive: boolean;
  createdAt?: string;
  triggeredAt?: string;
}

export interface WatchlistItem {
  id: string;
  coinPostId: string;
  addedAt: string;
  alertsCount?: number;
  isAlertsActive?: boolean;
}

export interface WatchlistData {
  totalWatching: number;
  activeAlerts: number;
  gainers: number;
  losers: number;
  lastUpdated: string;
}

// Alert notification types
export interface AlertNotification {
  id: string;
  alertId: string;
  coinName: string;
  coinSymbol: string;
  alertType: 'above' | 'below';
  targetPrice: string;
  currentPrice: string;
  triggeredAt: string;
  isRead: boolean;
}

// Watchlist settings
export interface WatchlistSettings {
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  alertCooldownMinutes: number;
  maxAlertsPerCoin: number;
}