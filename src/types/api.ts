// types/api.ts - Enhanced with category support

// Base types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Enhanced CoinData interface based on the actual API response structure
export interface CoinData {
  __typename: string;
  id: string;
  name: string;
  description: string;
  address: string;
  symbol: string;
  totalSupply: string;
  totalVolume: string;
  volume24h: string;
  createdAt: string;
  creatorAddress: string;
  creatorEarnings: Array<{
    amount: {
      currencyAddress: string;
      amountRaw: string;
      amountDecimal: number;
    };
    amountUsd: string;
  }>;
  poolCurrencyToken: {
    address: string;
    name: string;
    decimals: number;
  };
  tokenPrice: {
    priceInUsdc: string;
    currencyAddress: string;
    priceInPoolToken: string;
  };
  marketCap: string;
  marketCapDelta24h: string;
  chainId: number;
  tokenUri: string;
  platformReferrerAddress: string;
  payoutRecipientAddress: string;
  creatorProfile: {
    id: string;
    handle: string;
    avatar: {
      previewImage: {
        blurhash: string;
        medium: string;
        small: string;
      };
    } | null;
  };
  mediaContent: {
    mimeType: string;
    originalUri: string;
    previewImage: {
      small: string;
      medium: string;
      blurhash: string;
    };
  };
  uniqueHolders: number;
  uniswapV4PoolKey: {
    token0Address: string;
    token1Address: string;
    fee: number;
    tickSpacing: number;
    hookAddress: string;
  };
}

// Transformed coin data for UI consumption
export interface CoinPost {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change24h: string;
  marketCap: string;
  volume24h: string;
  holders: number;
  verified: boolean;
  description: string;
  image?: string;
  address: string;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  coinPostId: string;
  type: 'above' | 'below';
  targetPrice: string;
  currentPrice: string;
  isActive: boolean;
  createdAt?: string;
}

export interface WatchlistItem extends CoinPost {
  alertsCount?: number;
  isAlertsActive?: boolean;
}

// NEW: Category types for different coin data sources
export type CoinCategory = 'trending' | 'topGainers' | 'mostValuable' | 'new';

// Category configuration interface
export interface CategoryConfig {
  label: string;
  icon: string;
  color: string;
}

// Enhanced API Endpoints
export interface CoinApiEndpoints {
  new: () => Promise<ApiResponse<CoinData[]>>;
  trending: () => Promise<ApiResponse<CoinData[]>>;
  topGainers: () => Promise<ApiResponse<CoinData[]>>;
  mostValuable: () => Promise<ApiResponse<CoinData[]>>;
  details: (address: string) => Promise<ApiResponse<CoinData>>;
  summary: (address: string) => Promise<ApiResponse<string>>;
}

// Watchlist and Alert endpoints
export interface WatchlistApiEndpoints {
  getWatchlist: () => Promise<ApiResponse<string[]>>;
  addToWatchlist: (coinId: string) => Promise<ApiResponse<void>>;
  removeFromWatchlist: (coinId: string) => Promise<ApiResponse<void>>;
  getAlerts: () => Promise<ApiResponse<PriceAlert[]>>;
  createAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => Promise<ApiResponse<PriceAlert>>;
  updateAlert: (alertId: string, updates: Partial<PriceAlert>) => Promise<ApiResponse<PriceAlert>>;
  deleteAlert: (alertId: string) => Promise<ApiResponse<void>>;
}

// Enhanced search and filtering interfaces
export interface SearchFilters {
  categories?: CoinCategory[];
  minMarketCap?: number;
  maxMarketCap?: number;
  minVolume?: number;
  maxVolume?: number;
  verified?: boolean;
  hasAlerts?: boolean;
}

export interface WatchlistData {
  totalWatching: number;
  activeAlerts: number;
  gainers: number;
  losers: number;
  lastUpdated: string;
  categoryBreakdown?: Record<CoinCategory, number>;
}

// Market statistics interface
export interface MarketStats {
  totalCoins: number;
  totalMarketCap: string;
  totalVolume24h: string;
  avgChange24h: string;
  topGainer: {
    name: string;
    change: string;
  };
  topLoser: {
    name: string;
    change: string;
  };
  categoryStats?: Record<CoinCategory, {
    count: number;
    avgChange: string;
    totalVolume: string;
  }>;
}

// Enhanced error handling
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Pagination support for large datasets
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Real-time data subscription interfaces
export interface WebSocketMessage {
  type: 'price_update' | 'alert_triggered' | 'market_update';
  data: any;
  timestamp: string;
}

export interface PriceUpdate {
  coinId: string;
  price: string;
  change24h: string;
  marketCap: string;
  volume24h: string;
  timestamp: string;
}

export interface AlertTriggered {
  alertId: string;
  coinId: string;
  coinName: string;
  targetPrice: string;
  currentPrice: string;
  type: 'above' | 'below';
  timestamp: string;
}