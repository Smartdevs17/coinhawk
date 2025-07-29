// types/api.ts - Updated types based on actual API response

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CreatorEarning {
  amount: {
    currencyAddress: string;
    amountRaw: string;
    amountDecimal: number;
  };
  amountUsd: string;
}

export interface PoolCurrencyToken {
  address: string;
  name: string;
  decimals: number;
}

export interface TokenPrice {
  priceInUsdc: string | null;
  currencyAddress: string;
  priceInPoolToken: string;
}

export interface CreatorProfile {
  id: string;
  handle: string;
  avatar: {
    previewImage: {
      blurhash: string;
      medium: string;
      small: string;
    };
  } | null;
}

export interface MediaContent {
  mimeType: string;
  originalUri: string;
  previewImage: {
    small: string;
    medium: string;
    blurhash: string | null;
  };
}

export interface UniswapPoolKey {
  token0Address: string;
  token1Address: string;
  fee: number;
  tickSpacing: number;
  hookAddress: string;
}

export interface CoinData {
  __typename: 'GraphQLZora20V4Token' | 'GraphQLZora20Token';
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
  creatorEarnings: CreatorEarning[];
  poolCurrencyToken: PoolCurrencyToken;
  tokenPrice: TokenPrice;
  marketCap: string;
  marketCapDelta24h: string;
  chainId: number;
  tokenUri: string;
  platformReferrerAddress: string;
  payoutRecipientAddress: string;
  creatorProfile: CreatorProfile;
  mediaContent: MediaContent;
  uniqueHolders: number;
  uniswapV4PoolKey?: UniswapPoolKey;
  uniswapV3PoolAddress?: string;
  isFromBaseApp?: boolean;
}

// Updated types for components
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
  rank?: number;
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

// API Endpoints
export interface CoinApiEndpoints {
  new: () => Promise<ApiResponse<CoinData[]>>;
  trending: () => Promise<ApiResponse<CoinData[]>>;
  topGainers: () => Promise<ApiResponse<CoinData[]>>;
  mostValuable: () => Promise<ApiResponse<CoinData[]>>;
  details: (address: string) => Promise<ApiResponse<CoinData>>;
  summary: (address: string) => Promise<ApiResponse<string>>;
}

// For future watchlist/alert endpoints
export interface WatchlistApiEndpoints {
  getWatchlist: () => Promise<ApiResponse<string[]>>;
  addToWatchlist: (coinId: string) => Promise<ApiResponse<void>>;
  removeFromWatchlist: (coinId: string) => Promise<ApiResponse<void>>;
  getAlerts: () => Promise<ApiResponse<PriceAlert[]>>;
  createAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => Promise<ApiResponse<PriceAlert>>;
  updateAlert: (alertId: string, updates: Partial<PriceAlert>) => Promise<ApiResponse<PriceAlert>>;
  deleteAlert: (alertId: string) => Promise<ApiResponse<void>>;
}