import { CoinPost, MarketData, PortfolioData, Holdings, PriceAlert, WatchlistData, OrderBookEntry, TradingBalance } from '../types';

// Extended trending posts for TrendingScreen
export const EXTENDED_TRENDING_POSTS: CoinPost[] = [
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
    description: 'Digital gold on Base network with unique tokenomics and community governance.',
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
    description: 'Community-driven meme token spreading joy across the Base ecosystem.',
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
    description: 'Native utility token for the CoinHawk trading platform and ecosystem.',
  },
  {
    id: '4',
    name: 'BasePepe',
    symbol: 'BPEPE',
    price: '$0.0123',
    change24h: '+45.7%',
    marketCap: '$8.2M',
    volume24h: '$3.1M',
    holders: 18902,
    verified: true,
    rank: 4,
    description: 'Rare Pepe derivatives bringing culture to the blockchain.',
  },
  {
    id: '5',
    name: 'FarcasterCoin',
    symbol: 'FCAST',
    price: '$2.1890',
    change24h: '-12.3%',
    marketCap: '$45.2M',
    volume24h: '$4.8M',
    holders: 7845,
    verified: true,
    rank: 5,
    description: 'Decentralized social protocol token enabling permissionless innovation.',
  },
  {
    id: '6',
    name: 'DegeneratePost',
    symbol: 'DEGEN',
    price: '$0.0045',
    change24h: '+67.8%',
    marketCap: '$2.1M',
    volume24h: '$890K',
    holders: 25601,
    verified: false,
    rank: 6,
    description: 'For the degens, by the degens. High-risk, high-reward community token.',
  },
  {
    id: '7',
    name: 'BasedArt',
    symbol: 'BART',
    price: '$0.3456',
    change24h: '+23.1%',
    marketCap: '$12.8M',
    volume24h: '$1.7M',
    holders: 11234,
    verified: true,
    rank: 7,
    description: 'NFT and digital art marketplace token with creator rewards program.',
  },
  {
    id: '8',
    name: 'NocoinerFUD',
    symbol: 'NFUD',
    price: '$0.0012',
    change24h: '-34.5%',
    marketCap: '$890K',
    volume24h: '$245K',
    holders: 4567,
    verified: false,
    rank: 8,
    description: 'Anti-establishment token for skeptics and contrarian investors.',
  },
  {
    id: '9',
    name: 'BaseSwap',
    symbol: 'BSWP',
    price: '$0.7891',
    change24h: '+3.7%',
    marketCap: '$18.4M',
    volume24h: '$2.9M',
    holders: 9876,
    verified: true,
    rank: 9,
    description: 'Decentralized exchange token with liquidity mining rewards.',
  },
  {
    id: '10',
    name: 'ChainLink',
    symbol: 'LINK',
    price: '$14.5678',
    change24h: '-1.8%',
    marketCap: '$234.5M',
    volume24h: '$12.3M',
    holders: 45678,
    verified: true,
    rank: 10,
    description: 'Oracle network providing real-world data to smart contracts.',
  }
];

// Portfolio mock data
export const MOCK_PORTFOLIO_DATA: PortfolioData = {
  totalValue: '$12,450.67',
  totalChange: '+$892.34',
  changePercent: '+7.7%',
  dayChange: '+$156.78',
};

// User holdings mock data
export const MOCK_HOLDINGS: Holdings[] = [
  {
    id: '1',
    coinPostId: '1',
    amount: '10,000',
    value: '$1,234.00',
    allocation: '9.9%',
    change: '+12.4%',
  },
  {
    id: '2',
    coinPostId: '3',
    amount: '5,000',
    value: '$6,283.50',
    allocation: '50.5%',
    change: '+8.9%',
  },
  {
    id: '3',
    coinPostId: '4',
    amount: '25,000',
    value: '$307.50',
    allocation: '2.5%',
    change: '+45.7%',
  },
  {
    id: '4',
    coinPostId: '7',
    amount: '12,500',
    value: '$4,320.00',
    allocation: '34.7%',
    change: '+23.1%',
  },
];

// Watchlist mock data (coin IDs that user is watching)
export const MOCK_WATCHLIST_IDS = ['2', '5', '6', '8', '9'];

// Price alerts mock data
export const MOCK_PRICE_ALERTS: PriceAlert[] = [
  {
    id: '1',
    coinPostId: '2',
    type: 'above',
    targetPrice: '$0.10',
    currentPrice: '$0.0867',
    isActive: true,
    createdAt: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    coinPostId: '5', 
    type: 'below',
    targetPrice: '$2.00',
    currentPrice: '$2.1890',
    isActive: true,
    createdAt: '2025-01-14T15:45:00Z',
  },
  {
    id: '3',
    coinPostId: '6',
    type: 'above',
    targetPrice: '$0.006',
    currentPrice: '$0.0045',
    isActive: false,
    createdAt: '2025-01-13T08:20:00Z',
  },
  {
    id: '4',
    coinPostId: '8',
    type: 'below',
    targetPrice: '$0.001',
    currentPrice: '$0.0012',
    isActive: true,
    createdAt: '2025-01-12T14:10:00Z',
  }
];

// Watchlist summary data
export const MOCK_WATCHLIST_DATA: WatchlistData = {
  totalWatching: MOCK_WATCHLIST_IDS.length,
  activeAlerts: MOCK_PRICE_ALERTS.filter(alert => alert.isActive).length,
  gainers: 2, // Will be calculated dynamically in the component
  losers: 3,  // Will be calculated dynamically in the component
  lastUpdated: '2025-01-27T12:00:00Z',
};

// Market statistics
export const MOCK_MARKET_STATS = {
  totalCoins: 156,
  totalMarketCap: '$127.5M',
  totalVolume24h: '$23.8M',
  avgChange24h: '+5.2%',
  topGainer: {
    name: 'DegeneratePost',
    change: '+67.8%'
  },
  topLoser: {
    name: 'NocoinerFUD', 
    change: '-34.5%'
  }
};

// Trading pairs and recent trades
export const MOCK_TRADING_PAIRS = [
  'BGLD/USDC',
  'HAWK/ETH', 
  'BPEPE/USDC',
  'FCAST/ETH',
  'BART/USDC'
];

export const MOCK_RECENT_TRADES = [
  {
    id: '1',
    pair: 'BGLD/USDC',
    type: 'Buy' as const,
    amount: '1,000',
    price: '$0.1234',
    total: '$123.40',
    timestamp: '2 min ago',
  },
  {
    id: '2', 
    pair: 'HAWK/ETH',
    type: 'Sell' as const,
    amount: '500',
    price: '$1.2567',
    total: '$628.35',
    timestamp: '5 min ago',
  },
  {
    id: '3',
    pair: 'BPEPE/USDC', 
    type: 'Buy' as const,
    amount: '5,000',
    price: '$0.0123',
    total: '$61.50',
    timestamp: '12 min ago',
  }
];

// Mock order book data
export const MOCK_ORDER_BOOK = {
  bids: [
    { price: '$0.1230', amount: '25,000', total: '$3,075.00' },
    { price: '$0.1229', amount: '15,000', total: '$1,843.50' },
    { price: '$0.1228', amount: '30,000', total: '$3,684.00' },
    { price: '$0.1227', amount: '12,500', total: '$1,533.75' },
    { price: '$0.1226', amount: '18,000', total: '$2,206.80' },
    { price: '$0.1225', amount: '22,000', total: '$2,695.00' },
    { price: '$0.1224', amount: '35,000', total: '$4,284.00' },
    { price: '$0.1223', amount: '14,500', total: '$1,773.35' },
  ] as OrderBookEntry[],
  asks: [
    { price: '$0.1235', amount: '22,000', total: '$2,717.00' },
    { price: '$0.1236', amount: '17,500', total: '$2,163.00' },
    { price: '$0.1237', amount: '28,000', total: '$3,463.60' },
    { price: '$0.1238', amount: '11,000', total: '$1,361.80' },
    { price: '$0.1239', amount: '20,000', total: '$2,478.00' },
    { price: '$0.1240', amount: '16,500', total: '$2,046.00' },
    { price: '$0.1241', amount: '24,000', total: '$2,978.40' },
    { price: '$0.1242', amount: '19,000', total: '$2,359.80' },
  ] as OrderBookEntry[],
};

// Mock trading balances
export const MOCK_TRADING_BALANCES: TradingBalance[] = [
  { 
    currency: 'USDC', 
    available: '$5,234.67', 
    locked: '$0.00', 
    total: '$5,234.67' 
  },
  { 
    currency: 'ETH', 
    available: '2.45 ETH', 
    locked: '0.0 ETH', 
    total: '2.45 ETH' 
  },
  { 
    currency: 'BGLD', 
    available: '10,000', 
    locked: '0', 
    total: '10,000' 
  },
  { 
    currency: 'HAWK', 
    available: '5,000', 
    locked: '0', 
    total: '5,000' 
  },
  { 
    currency: 'BPEPE', 
    available: '25,000', 
    locked: '0', 
    total: '25,000' 
  },
  { 
    currency: 'BART', 
    available: '12,500', 
    locked: '0', 
    total: '12,500' 
  },
];

// Extended recent trades with more history
export const EXTENDED_RECENT_TRADES = [
  ...MOCK_RECENT_TRADES,
  {
    id: '4',
    pair: 'BART/USDC',
    type: 'Buy' as const,
    amount: '2,500',
    price: '$0.3456',
    total: '$864.00',
    timestamp: '15 min ago',
  },
  {
    id: '5', 
    pair: 'BPEPE/USDC',
    type: 'Sell' as const,
    amount: '8,000',
    price: '$0.0123',
    total: '$98.40',
    timestamp: '22 min ago',
  },
  {
    id: '6',
    pair: 'HAWK/ETH', 
    type: 'Buy' as const,
    amount: '1,200',
    price: '$1.2567',
    total: '$1,508.04',
    timestamp: '35 min ago',
  },
  {
    id: '7',
    pair: 'BGLD/USDC',
    type: 'Sell' as const,
    amount: '3,500',
    price: '$0.1234',
    total: '$431.90',
    timestamp: '1 hour ago',
  },
];

// Mock trading fees configuration
export const MOCK_TRADING_CONFIG = {
  makerFee: 0.002, // 0.2%
  takerFee: 0.005, // 0.5%
  minimumOrderSize: 10, // Minimum $10 order
  maximumOrderSize: 50000, // Maximum $50,000 order
  supportedOrderTypes: ['Market', 'Limit'],
  supportedTimeInForce: ['GTC', 'IOC', 'FOK'], // Good Till Cancelled, Immediate or Cancel, Fill or Kill
};