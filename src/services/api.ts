// services/api.ts - Updated with support for multiple data categories

import { 
  ApiResponse, 
  CoinData, 
  CoinPost, 
  PriceAlert,
  CoinApiEndpoints,
  WatchlistApiEndpoints 
} from '../types/api';

// Configuration
const API_BASE_URL = 'https://coinhawk-api.blockfuselabs.com/api';

// Add new type for data categories
export type CoinCategory = 'trending' | 'topGainers' | 'mostValuable' | 'new';

// Generic HTTP client (unchanged)
class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create HTTP client instance
const httpClient = new HttpClient(API_BASE_URL);

// Enhanced utility function to transform API data (unchanged)
export const transformCoinData = (coinData: CoinData): CoinPost => {
  const formatChange = (marketCapDelta: string, marketCap: string): string => {
    const delta = parseFloat(marketCapDelta);
    const cap = parseFloat(marketCap);
    
    if (cap === 0) return '+0.0%';
    
    const percentChange = (delta / (cap - delta)) * 100;
    const sign = percentChange >= 0 ? '+' : '';
    return `${sign}${percentChange.toFixed(1)}%`;
  };

  const formatPrice = (priceInUsdc: string | null): string => {
    if (!priceInUsdc) return '$0.00';
    
    const price = parseFloat(priceInUsdc);
    if (price < 0.01) {
      return `$${price.toExponential(2)}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const formatNumber = (value: string): string => {
    const num = parseFloat(value);
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  return {
    id: coinData.address,
    name: coinData.name,
    symbol: coinData.symbol,
    price: formatPrice(coinData.tokenPrice.priceInUsdc),
    change24h: formatChange(coinData.marketCapDelta24h, coinData.marketCap),
    marketCap: formatNumber(coinData.marketCap),
    volume24h: formatNumber(coinData.volume24h),
    holders: coinData.uniqueHolders,
    verified: coinData.creatorProfile?.avatar !== null,
    description: coinData.description,
    image: coinData.mediaContent?.previewImage?.small,
    address: coinData.address,
    createdAt: coinData.createdAt,
  };
};

// Coin API implementation (unchanged)
export const coinApi: CoinApiEndpoints = {
  new: async () => {
    return httpClient.get<CoinData[]>('/coins/new');
  },

  trending: async () => {
    return httpClient.get<CoinData[]>('/coins/trending-coins');
  },

  topGainers: async () => {
    return httpClient.get<CoinData[]>('/coins/top-gainers');
  },

  mostValuable: async () => {
    return httpClient.get<CoinData[]>('/coins/most-valuable');
  },

  details: async (address: string) => {
    return httpClient.get<CoinData>(`/coins/${address}`);
  },

  summary: async (address: string) => {
    return httpClient.get<string>(`/coins/summary?coinAddress=${address}`);
  },
};

// Mock Watchlist API (unchanged)
export const watchlistApi: WatchlistApiEndpoints = {
  getWatchlist: async () => {
    const mockWatchlist = ['0x1f6e1d08368fd4d8b2250ab0600dd2cb7f643287'];
    return { success: true, data: mockWatchlist };
  },

  addToWatchlist: async (coinId: string) => {
    console.log('Added to watchlist:', coinId);
    return { success: true, data: undefined };
  },

  removeFromWatchlist: async (coinId: string) => {
    console.log('Removed from watchlist:', coinId);
    return { success: true, data: undefined };
  },

  getAlerts: async () => {
    const mockAlerts: PriceAlert[] = [];
    return { success: true, data: mockAlerts };
  },

  createAlert: async (alert) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    console.log('Created alert:', newAlert);
    return { success: true, data: newAlert };
  },

  updateAlert: async (alertId: string, updates) => {
    console.log('Updated alert:', alertId, updates);
    const updatedAlert: PriceAlert = {
      id: alertId,
      coinPostId: 'mock',
      type: 'above',
      targetPrice: '$1.00',
      currentPrice: '$0.50',
      isActive: true,
      ...updates,
    };
    return { success: true, data: updatedAlert };
  },

  deleteAlert: async (alertId: string) => {
    console.log('Deleted alert:', alertId);
    return { success: true, data: undefined };
  },
};

// UPDATED: Enhanced API functions that support multiple categories
export const getCoinsByCategory = async (category: CoinCategory): Promise<CoinPost[]> => {
  try {
    let response: ApiResponse<CoinData[]>;
    
    switch (category) {
      case 'trending':
        response = await coinApi.trending();
        break;
      case 'topGainers':
        response = await coinApi.topGainers();
        break;
      case 'mostValuable':
        response = await coinApi.mostValuable();
        break;
      case 'new':
        response = await coinApi.new();
        break;
      default:
        response = await coinApi.trending();
    }

    if (response.success) {
      return response.data.map(transformCoinData);
    }
    throw new Error(`Failed to fetch ${category} coins`);
  } catch (error) {
    console.error(`Error fetching ${category} coins:`, error);
    return [];
  }
};

// Updated function for backwards compatibility
export const getCoinsForWatchlist = async (category: CoinCategory = 'trending'): Promise<CoinPost[]> => {
  return getCoinsByCategory(category);
};

// Enhanced search that can search across all categories
export const searchCoins = async (query: string, categories: CoinCategory[] = ['trending']): Promise<CoinPost[]> => {
  try {
    // Get coins from all specified categories
    const allCoinPromises = categories.map(category => getCoinsByCategory(category));
    const allCoinArrays = await Promise.all(allCoinPromises);
    
    // Flatten and deduplicate based on address
    const allCoins = allCoinArrays.flat();
    const uniqueCoins = allCoins.filter((coin, index, self) => 
      self.findIndex(c => c.address === coin.address) === index
    );
    
    // Filter by query
    return uniqueCoins.filter(coin => 
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
};

// Keep existing functions for backwards compatibility
export const getCoinDetails = async (address: string): Promise<CoinPost | null> => {
  try {
    const response = await coinApi.details(address);
    if (response.success) {
      return transformCoinData(response.data);
    }
    return null;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    return null;
  }
};

export const getCoinSummary = async (address: string): Promise<string | null> => {
  try {
    const response = await coinApi.summary(address);
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching coin summary:', error);
    return null;
  }
};