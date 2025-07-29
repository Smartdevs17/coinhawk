// services/api.ts - API service layer

import { 
  ApiResponse, 
  CoinData, 
  CoinPost, 
  PriceAlert,
  CoinApiEndpoints,
  WatchlistApiEndpoints 
} from '../types/api';

// Configuration
// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://coinhawk-api.blockfuselabs.com/api'; // Production API URL

// Generic HTTP client
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

// Utility functions to transform API data to component format
export const transformCoinData = (coinData: CoinData): CoinPost => {
  // Calculate percentage change for display
  const formatChange = (marketCapDelta: string, marketCap: string): string => {
    const delta = parseFloat(marketCapDelta);
    const cap = parseFloat(marketCap);
    
    if (cap === 0) return '+0.0%';
    
    const percentChange = (delta / (cap - delta)) * 100;
    const sign = percentChange >= 0 ? '+' : '';
    return `${sign}${percentChange.toFixed(1)}%`;
  };

  // Format price with appropriate decimal places
  const formatPrice = (priceInUsdc: string | null): string => {
    if (!priceInUsdc) return '$0.00';
    
    const price = parseFloat(priceInUsdc);
    if (price < 0.01) {
      return `$${price.toExponential(2)}`;
    }
    return `$${price.toFixed(4)}`;
  };

  // Format large numbers
  const formatNumber = (value: string): string => {
    const num = parseFloat(value);
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  return {
    id: coinData.address, // Use address as ID for uniqueness
    name: coinData.name,
    symbol: coinData.symbol,
    price: formatPrice(coinData.tokenPrice.priceInUsdc),
    change24h: formatChange(coinData.marketCapDelta24h, coinData.marketCap),
    marketCap: formatNumber(coinData.marketCap),
    volume24h: formatNumber(coinData.volume24h),
    holders: coinData.uniqueHolders,
    verified: coinData.creatorProfile?.avatar !== null, // Simple verification logic
    description: coinData.description,
    image: coinData.mediaContent?.previewImage?.small,
    address: coinData.address,
    createdAt: coinData.createdAt,
  };
};

// Coin API implementation
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

// Mock Watchlist API (since these endpoints don't exist yet)
// These will need to be implemented on the backend
export const watchlistApi: WatchlistApiEndpoints = {
  getWatchlist: async () => {
    // For now, return mock data from localStorage or in-memory storage
    // In production, this would be: return httpClient.get<string[]>('/watchlist');
    const mockWatchlist = ['0x1f6e1d08368fd4d8b2250ab0600dd2cb7f643287']; // TBD token as example
    return { success: true, data: mockWatchlist };
  },

  addToWatchlist: async (coinId: string) => {
    // Mock implementation - would be: return httpClient.post<void>(`/watchlist/${coinId}`);
    console.log('Added to watchlist:', coinId);
    return { success: true, data: undefined };
  },

  removeFromWatchlist: async (coinId: string) => {
    // Mock implementation - would be: return httpClient.delete<void>(`/watchlist/${coinId}`);
    console.log('Removed from watchlist:', coinId);
    return { success: true, data: undefined };
  },

  getAlerts: async () => {
    // Mock implementation - would be: return httpClient.get<PriceAlert[]>('/alerts');
    const mockAlerts: PriceAlert[] = [];
    return { success: true, data: mockAlerts };
  },

  createAlert: async (alert) => {
    // Mock implementation - would be: return httpClient.post<PriceAlert>('/alerts', alert);
    const newAlert: PriceAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    console.log('Created alert:', newAlert);
    return { success: true, data: newAlert };
  },

  updateAlert: async (alertId: string, updates) => {
    // Mock implementation - would be: return httpClient.put<PriceAlert>(`/alerts/${alertId}`, updates);
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
    // Mock implementation - would be: return httpClient.delete<void>(`/alerts/${alertId}`);
    console.log('Deleted alert:', alertId);
    return { success: true, data: undefined };
  },
};

// High-level API functions for components
export const getCoinsForWatchlist = async (): Promise<CoinPost[]> => {
  try {
    const response = await coinApi.trending();
    if (response.success) {
      return response.data.map(transformCoinData);
    }
    throw new Error('Failed to fetch coins');
  } catch (error) {
    console.error('Error fetching coins for watchlist:', error);
    return [];
  }
};

export const searchCoins = async (query: string): Promise<CoinPost[]> => {
  try {
    // For now, get trending coins and filter locally
    // In production, you might want a dedicated search endpoint
    const response = await coinApi.trending();
    if (response.success) {
      const allCoins = response.data.map(transformCoinData);
      return allCoins.filter(coin => 
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
    }
    throw new Error('Failed to search coins');
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
};

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