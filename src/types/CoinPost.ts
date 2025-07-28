
export interface CoinPost {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change24h: string;
  marketCap: string;
  volume24h: string;
  holders: number;
  description?: string;
  verified?: boolean;
  rank?: number;
}

export interface MarketData {
  totalMarketCap: string;
  totalChange24h: string;
  changePercent24h: string;
}

export interface PortfolioData {
  totalValue: string;
  totalChange: string;
  changePercent: string;
  dayChange: string;
}

export interface Holdings {
  id: string;
  coinPostId: string;
  amount: string;
  value: string;
  allocation: string;
  change: string;
}

// Add the missing Timeframe type
export const TIMEFRAMES = ['1h', '24h', '7d', '30d', '1y'] as const;
export type Timeframe = typeof TIMEFRAMES[number];

// Trade related types
export const TRADE_TYPES = ['Buy', 'Sell'] as const;
export type TradeType = typeof TRADE_TYPES[number];

export const ORDER_TYPES = ['Market', 'Limit'] as const;
export type OrderType = typeof ORDER_TYPES[number];

// Trading specific interfaces
export interface OrderBookEntry {
  price: string;
  amount: string;
  total: string;
}

export interface TradingBalance {
  currency: string;
  available: string;
  locked: string;
  total: string;
}

export interface OrderSummary {
  amount: string;
  price: string;
  subtotal: string;
  fees: string;
  total: string;
}

// Trading order interface
export interface TradingOrder {
  id: string;
  coinPostId: string;
  type: TradeType;
  orderType: OrderType;
  amount: string;
  price: string;
  total: string;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  timestamp: string;
  fees: string;
}