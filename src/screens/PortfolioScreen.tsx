import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { PortfolioData, Holdings, CoinPost } from '../types';
import { Button, Card, PriceChangeIndicator, Icon, LoadingSpinner } from '../components/ui';

// Mock portfolio data
const MOCK_PORTFOLIO_DATA: PortfolioData = {
  totalValue: '$12,450.67',
  totalChange: '+$892.34',
  changePercent: '+7.7%',
  dayChange: '+$156.78',
};

// Mock holdings data
const MOCK_HOLDINGS: Holdings[] = [
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

// Mock coin data for holdings display
const HOLDINGS_COINS: Record<string, CoinPost> = {
  '1': { id: '1', name: 'BaseGold', symbol: 'BGLD', price: '$0.1234', change24h: '+12.4%', marketCap: '$15.0M', volume24h: '$1.3M', holders: 8934, verified: true },
  '3': { id: '3', name: 'CoinHawk Token', symbol: 'HAWK', price: '$1.2567', change24h: '+8.9%', marketCap: '$25.0M', volume24h: '$2.1M', holders: 15234, verified: true },
  '4': { id: '4', name: 'BasePepe', symbol: 'BPEPE', price: '$0.0123', change24h: '+45.7%', marketCap: '$8.2M', volume24h: '$3.1M', holders: 18902, verified: true },
  '7': { id: '7', name: 'BasedArt', symbol: 'BART', price: '$0.3456', change24h: '+23.1%', marketCap: '$12.8M', volume24h: '$1.7M', holders: 11234, verified: true },
};

// Mock recent transactions
const MOCK_RECENT_TRANSACTIONS = [
  {
    id: '1',
    type: 'Buy' as const,
    coinName: 'BaseGold',
    symbol: 'BGLD',
    amount: '1,000',
    price: '$0.1200',
    value: '$120.00',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'Sell' as const,
    coinName: 'BasePepe',
    symbol: 'BPEPE',
    amount: '5,000',
    price: '$0.0089',
    value: '$44.50',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    type: 'Buy' as const,
    coinName: 'CoinHawk Token',
    symbol: 'HAWK',
    amount: '500',
    price: '$1.1850',
    value: '$592.50',
    timestamp: '3 days ago',
  },
];

export const PortfolioScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d' | '1y'>('24h');

  const periods = ['24h', '7d', '30d', '1y'] as const;

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1500);
  };

  const renderHolding = ({ item }: { item: Holdings }) => {
    const coin = HOLDINGS_COINS[item.coinPostId];
    if (!coin) return null;

    // Parse allocation for chart visualization (simple bar)
    const allocationPercent = parseFloat(item.allocation.replace('%', ''));

    return (
      <TouchableOpacity>
        <Card variant="surface" className="mb-3">
          <View className="flex-row items-center">
            {/* Coin Icon and Info */}
            <View className="w-10 h-10 bg-hawk-accent rounded-full items-center justify-center mr-3">
              <Text className="text-hawk-primary font-bold text-lg">
                {coin.symbol.slice(0, 1)}
              </Text>
            </View>
            
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-dark-text-primary font-semibold mr-2">
                  {coin.name}
                </Text>
                {coin.verified && (
                  <Icon name="✓" size={14} color="#10b981" />
                )}
              </View>
              <Text className="text-dark-text-secondary text-sm">{coin.symbol}</Text>
              <Text className="text-dark-text-muted text-xs">
                {item.amount} tokens
              </Text>
            </View>

            {/* Value and Performance */}
            <View className="items-end">
              <Text className="text-dark-text-primary font-semibold">
                {item.value}
              </Text>
              <PriceChangeIndicator 
                change={item.change} 
                size="sm" 
                className="mt-1"
              />
              <Text className="text-dark-text-muted text-xs mt-1">
                {item.allocation}
              </Text>
            </View>
          </View>

          {/* Allocation Bar */}
          <View className="mt-3">
            <View className="h-1 bg-dark-border rounded-full">
              <View 
                className="h-1 bg-hawk-accent rounded-full"
                style={{ width: `${Math.min(allocationPercent, 100)}%` }}
              />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderTransaction = ({ item }: { item: typeof MOCK_RECENT_TRANSACTIONS[0] }) => (
    <View className="flex-row items-center justify-between py-3 border-b border-dark-border last:border-b-0">
      <View className="flex-row items-center flex-1">
        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
          item.type === 'Buy' ? 'bg-success-500' : 'bg-danger-500'
        }`}>
          <Icon 
            name={item.type === 'Buy' ? '↗' : '↙'} 
            size={14} 
            color="white" 
          />
        </View>
        
        <View className="flex-1">
          <Text className="text-dark-text-primary font-medium">
            {item.type} {item.coinName}
          </Text>
          <Text className="text-dark-text-muted text-sm">
            {item.amount} {item.symbol} • {item.timestamp}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text className={`font-semibold ${
          item.type === 'Buy' ? 'text-danger-500' : 'text-success-500'
        }`}>
          {item.type === 'Buy' ? '-' : '+'}{item.value}
        </Text>
        <Text className="text-dark-text-muted text-sm">
          @ {item.price}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      {/* Header */}
      <View className="px-4 py-8 bg-dark-surface border-b border-dark-border">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-dark-text-primary">💼 Portfolio</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Icon name="🔄" size={20} color="#fbbf24" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }} // 64 (tab height) + 48 (extra space)
      >
        {/* Portfolio Overview */}
        <View className="p-4">
          <Card variant="surface" padding="lg">
            <View className="items-center mb-4">
              <Text className="text-dark-text-secondary text-sm mb-2">Total Portfolio Value</Text>
              <Text className="text-3xl font-bold text-dark-text-primary">
                {MOCK_PORTFOLIO_DATA.totalValue}
              </Text>
              <View className="flex-row items-center mt-2">
                <PriceChangeIndicator 
                  change={MOCK_PORTFOLIO_DATA.changePercent} 
                  size="lg"
                  showBackground={true}
                />
                <Text className="text-dark-text-muted ml-2">
                  ({MOCK_PORTFOLIO_DATA.totalChange})
                </Text>
              </View>
            </View>

            <View className="border-t border-dark-border pt-4">
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-dark-text-muted text-sm">Today's Change</Text>
                  <Text className="text-success-500 font-semibold">
                    {MOCK_PORTFOLIO_DATA.dayChange}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-dark-text-muted text-sm">Holdings</Text>
                  <Text className="text-dark-text-primary font-semibold">
                    {MOCK_HOLDINGS.length} positions
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Performance Period Selector */}
        <View className="px-4 mb-4">
          <Text className="text-dark-text-primary font-semibold mb-3">Performance</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-x-2">
              {periods.map((period) => (
                <Button
                  key={period}
                  title={period}
                  variant={selectedPeriod === period ? 'primary' : 'secondary'}
                  size="sm"
                  onPress={() => setSelectedPeriod(period)}
                />
              ))}
            </View>
          </ScrollView>
          
          {/* Chart Placeholder */}
          <Card className="mt-3 h-32">
            <View className="flex-1 items-center justify-center">
              <Icon name="📈" size={32} color="#fbbf24" />
              <Text className="text-dark-text-muted text-sm mt-2">Chart coming soon</Text>
            </View>
          </Card>
        </View>

        {/* Holdings Section */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-dark-text-primary font-semibold">Holdings</Text>
            <TouchableOpacity>
              <Text className="text-hawk-accent text-sm">Manage →</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={MOCK_HOLDINGS}
            renderItem={renderHolding}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Recent Activity */}
        <View className="px-4 mb-4">
          <Text className="text-dark-text-primary font-semibold mb-3">Recent Activity</Text>
          <Card>
            <FlatList
              data={MOCK_RECENT_TRANSACTIONS}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </Card>
        </View>

        {/* Quick Actions */}
        <View className="px-4 pb-6">
          <Text className="text-dark-text-primary font-semibold mb-3">Quick Actions</Text>
          <View className="flex-row gap-x-3">
            <Button
              title="Buy More"
              variant="primary"
              icon={<Icon name="💰" size={16} color="#1a1f36" />}
              className="flex-1"
            />
            <Button
              title="Sell All"
              variant="danger"
              icon={<Icon name="📤" size={16} color="white" />}
              className="flex-1"
            />
          </View>
          
          <View className="flex-row gap-x-3 mt-3">
            <Button
              title="Add to Watchlist"
              variant="secondary"
              icon={<Icon name="👀" size={16} color="#fbbf24" />}
              className="flex-1"
            />
            <Button
              title="Export Data"
              variant="secondary"
              icon={<Icon name="📊" size={16} color="#fbbf24" />}
              className="flex-1"
            />
          </View>
        </View>

        {/* Loading Overlay */}
        {refreshing && (
          <LoadingSpinner 
            variant="overlay" 
            text="Refreshing portfolio..."
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};