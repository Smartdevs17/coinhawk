export const APP_NAME = 'CoinHawk';
export const APP_VERSION = '1.0.0';

// Move TIMEFRAMES here since we moved the type to types file
import { CoinPost, MarketData } from '../types';

// Mock data for development
export const MOCK_TRENDING_POSTS: CoinPost[] = [
  {
    id: '1',
    name: 'BaseGold',
    symbol: 'BGLD',
    price: '$0.1234',
    change24h: '+12.4%',
    marketCap: '$15.0M',
    volume24h: '$1.3M',
    holders: 8934,
    verified: true,
    rank: 1,
  },
  {
    id: '2',
    name: 'BaseMeme',
    symbol: 'BMEME',
    price: '$0.0867',
    change24h: '-5.2%',
    marketCap: '$6.7M',
    volume24h: '$0.9M',
    holders: 12045,
    verified: false,
    rank: 2,
  },
  {
    id: '3',
    name: 'CoinHawk Token',
    symbol: 'HAWK',
    price: '$1.2567',
    change24h: '+8.9%',
    marketCap: '$25.0M',
    volume24h: '$2.1M',
    holders: 15234,
    verified: true,
    rank: 3,
  },
];

export const MOCK_MARKET_DATA: MarketData = {
  totalMarketCap: '$0.00 Trillion',
  totalChange24h: '+$1.2B',
  changePercent24h: '+4.1%',
};