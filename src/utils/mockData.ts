import { CoinPost, MarketData, PortfolioData, Holdings } from '../types';

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
export const MOCK_WATCHLIST_IDS = ['2', '5', '6', '8'];

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

// Price alerts mock data
export const MOCK_PRICE_ALERTS = [
  {
    id: '1',
    coinPostId: '2',
    type: 'above' as const,
    targetPrice: '$0.10',
    currentPrice: '$0.0867',
    isActive: true,
  },
  {
    id: '2',
    coinPostId: '5', 
    type: 'below' as const,
    targetPrice: '$2.00',
    currentPrice: '$2.1890',
    isActive: true,
  }
];