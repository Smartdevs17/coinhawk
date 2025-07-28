import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { CoinPost } from '../types';
import { Button, Card, PriceChangeIndicator, Icon, LoadingSpinner } from '../components/ui';
import { EXTENDED_TRENDING_POSTS, MOCK_WATCHLIST_IDS, MOCK_PRICE_ALERTS } from '../utils/mockData';

// Watchlist specific types
interface PriceAlert {
  id: string;
  coinPostId: string;
  type: 'above' | 'below';
  targetPrice: string;
  currentPrice: string;
  isActive: boolean;
}

interface WatchlistItem extends CoinPost {
  alertsCount?: number;
  isAlertsActive?: boolean;
}

export const WatchlistScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinPost | null>(null);
  const [watchlistIds, setWatchlistIds] = useState<string[]>(MOCK_WATCHLIST_IDS);
  const [alerts, setAlerts] = useState<PriceAlert[]>(MOCK_PRICE_ALERTS);
  
  // Alert form state
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [alertPrice, setAlertPrice] = useState('');

  // Get watchlisted coins
  const watchlistCoins: WatchlistItem[] = useMemo(() => {
    return EXTENDED_TRENDING_POSTS
      .filter(coin => watchlistIds.includes(coin.id))
      .map(coin => {
        const coinAlerts = alerts.filter(alert => alert.coinPostId === coin.id);
        return {
          ...coin,
          alertsCount: coinAlerts.length,
          isAlertsActive: coinAlerts.some(alert => alert.isActive),
        };
      });
  }, [watchlistIds, alerts]);

  // Available coins to add (not in watchlist)
  const availableCoins = useMemo(() => {
    return EXTENDED_TRENDING_POSTS
      .filter(coin => !watchlistIds.includes(coin.id))
      .filter(coin => 
        searchQuery === '' || 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [watchlistIds, searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1500);
  };

  const addToWatchlist = (coinId: string) => {
    setWatchlistIds(prev => [...prev, coinId]);
    setShowAddModal(false);
    setSearchQuery('');
  };

  const removeFromWatchlist = (coinId: string) => {
    Alert.alert(
      'Remove from Watchlist',
      'Are you sure you want to remove this coin from your watchlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setWatchlistIds(prev => prev.filter(id => id !== coinId));
            // Also remove any alerts for this coin
            setAlerts(prev => prev.filter(alert => alert.coinPostId !== coinId));
          }
        },
      ]
    );
  };

  const openAlertModal = (coin: CoinPost) => {
    setSelectedCoin(coin);
    setAlertPrice(coin.price.replace('$', ''));
    setShowAlertModal(true);
  };

  const createPriceAlert = () => {
    if (!selectedCoin || !alertPrice) return;

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      coinPostId: selectedCoin.id,
      type: alertType,
      targetPrice: `$${alertPrice}`,
      currentPrice: selectedCoin.price,
      isActive: true,
    };

    setAlerts(prev => [...prev, newAlert]);
    setShowAlertModal(false);
    setSelectedCoin(null);
    setAlertPrice('');
  };

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, isActive: !alert.isActive }
          : alert
      )
    );
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const renderWatchlistItem = ({ item }: { item: WatchlistItem }) => (
    <TouchableOpacity>
      <Card variant="surface" className="mb-3">
        <View className="flex-row items-center">
          {/* Coin Icon and Info */}
          <View className="w-12 h-12 bg-hawk-accent rounded-full items-center justify-center mr-3">
            <Text className="text-hawk-primary font-bold text-lg">
              {item.symbol.slice(0, 2)}
            </Text>
          </View>
          
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-dark-text-primary font-semibold text-base">
                {item.name}
              </Text>
              {item.verified && (
                <Icon name="✓" size={14} color="#10b981" className="ml-1" />
              )}
            </View>
            <Text className="text-dark-text-secondary text-sm">{item.symbol}</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-dark-text-muted text-xs">
                {item.holders.toLocaleString()} holders
              </Text>
              {item.alertsCount && item.alertsCount > 0 && (
                <>
                  <Text className="text-dark-text-muted text-xs"> • </Text>
                  <Icon 
                    name="🔔" 
                    size={12} 
                    color={item.isAlertsActive ? "#fbbf24" : "#64748b"} 
                  />
                  <Text className="text-xs text-hawk-accent ml-1">
                    {item.alertsCount}
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Price and Change */}
          <View className="items-end mr-3">
            <Text className="text-dark-text-primary font-semibold text-base">
              {item.price}
            </Text>
            <PriceChangeIndicator 
              change={item.change24h} 
              size="sm" 
              className="mt-1"
            />
          </View>

          {/* Action Buttons */}
          <View>
            <TouchableOpacity
              onPress={() => openAlertModal(item)}
              className="bg-hawk-accent bg-opacity-20 rounded-lg p-2 mb-2"
            >
              <Icon name="🔔" size={16} color="#fbbf24" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => removeFromWatchlist(item.id)}
              className="bg-danger-500 bg-opacity-20 rounded-lg p-2"
            >
              <Icon name="✕" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderAvailableCoin = ({ item }: { item: CoinPost }) => (
    <TouchableOpacity onPress={() => addToWatchlist(item.id)}>
      <Card variant="surface" className="mb-2">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-hawk-accent rounded-full items-center justify-center mr-3">
            <Text className="text-hawk-primary font-bold">
              {item.symbol.slice(0, 2)}
            </Text>
          </View>
          
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-dark-text-primary font-medium">
                {item.name}
              </Text>
              {item.verified && (
                <Icon name="✓" size={12} color="#10b981" className="ml-1" />
              )}
            </View>
            <Text className="text-dark-text-secondary text-sm">{item.symbol}</Text>
          </View>

          <View className="items-end mr-3">
            <Text className="text-dark-text-primary font-medium">
              {item.price}
            </Text>
            <PriceChangeIndicator change={item.change24h} size="sm" />
          </View>

          <Icon name="+" size={20} color="#fbbf24" />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderActiveAlert = (alert: PriceAlert) => {
    const coin = EXTENDED_TRENDING_POSTS.find(c => c.id === alert.coinPostId);
    if (!coin) return null;

    return (
      <Card key={alert.id} variant="surface" className="mb-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-dark-text-primary font-medium">
              {coin.name} {alert.type === 'above' ? '↗' : '↘'} {alert.targetPrice}
            </Text>
            <Text className="text-dark-text-secondary text-sm">
              Current: {alert.currentPrice}
            </Text>
          </View>
          
          <View className="flex-row items-center gap-x-2">
            <TouchableOpacity
              onPress={() => toggleAlert(alert.id)}
              className={`px-3 py-1 rounded-lg ${
                alert.isActive 
                  ? 'bg-hawk-accent bg-opacity-20' 
                  : 'bg-dark-border'
              }`}
            >
              <Text className={`text-xs font-medium ${
                alert.isActive ? 'text-hawk-accent' : 'text-dark-text-muted'
              }`}>
                {alert.isActive ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => deleteAlert(alert.id)}
              className="p-1"
            >
              <Icon name="🗑" size={14} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      {/* Header */}
      <View className="px-4 py-6 bg-dark-surface border-b border-dark-border">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-bold text-dark-text-primary">👀 Watchlist</Text>
          <View className="flex-row gap-x-3">
            <TouchableOpacity onPress={() => setShowAddModal(true)}>
              <Icon name="+" size={20} color="#fbbf24" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRefresh}>
              <Icon name="🔄" size={20} color="#fbbf24" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-hawk-accent text-lg font-bold">
              {watchlistCoins.length}
            </Text>
            <Text className="text-dark-text-secondary text-xs">Watching</Text>
          </View>
          <View className="items-center">
            <Text className="text-hawk-accent text-lg font-bold">
              {alerts.filter(a => a.isActive).length}
            </Text>
            <Text className="text-dark-text-secondary text-xs">Active Alerts</Text>
          </View>
          <View className="items-center">
            <Text className="text-success-500 text-lg font-bold">
              {watchlistCoins.filter(c => c.change24h.startsWith('+')).length}
            </Text>
            <Text className="text-dark-text-secondary text-xs">Gainers</Text>
          </View>
          <View className="items-center">
            <Text className="text-danger-500 text-lg font-bold">
              {watchlistCoins.filter(c => c.change24h.startsWith('-')).length}
            </Text>
            <Text className="text-dark-text-secondary text-xs">Losers</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Watchlist Items */}
        {watchlistCoins.length > 0 ? (
          <View className="py-4">
            <FlatList
              data={watchlistCoins}
              renderItem={renderWatchlistItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View className="items-center justify-center py-16">
            <Icon name="👀" size={48} color="#64748b" />
            <Text className="text-dark-text-secondary text-lg font-medium mt-4">
              No coins in watchlist
            </Text>
            <Text className="text-dark-text-muted text-center mt-2 px-8">
              Add coins to track their prices and set alerts
            </Text>
            <Button
              title="Add Coins"
              variant="primary"
              onPress={() => setShowAddModal(true)}
              className="mt-4"
            />
          </View>
        )}

        {/* Active Alerts Section */}
        {alerts.filter(a => a.isActive).length > 0 && (
          <View className="py-4">
            <Text className="text-dark-text-primary font-semibold text-lg mb-3">
              🔔 Active Alerts
            </Text>
            {alerts.filter(a => a.isActive).map(renderActiveAlert)}
          </View>
        )}
      </ScrollView>

      {/* Add Coin Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-dark-bg">
          <View className="px-4 py-6 bg-dark-surface border-b border-dark-border">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-dark-text-primary">Add to Watchlist</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="✕" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="bg-dark-bg rounded-xl px-4 py-3 flex-row items-center border border-dark-border mt-4">
              <Icon name="🔍" size={16} color="#94a3b8" />
              <TextInput
                placeholder="Search coins..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 text-dark-text-primary"
              />
            </View>
          </View>

          <ScrollView className="flex-1 px-4 py-4">
            <FlatList
              data={availableCoins}
              renderItem={renderAvailableCoin}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Price Alert Modal */}
      <Modal
        visible={showAlertModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-dark-bg">
          <View className="px-4 py-6 bg-dark-surface border-b border-dark-border">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-dark-text-primary">Set Price Alert</Text>
              <TouchableOpacity onPress={() => setShowAlertModal(false)}>
                <Icon name="✕" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            {selectedCoin && (
              <Text className="text-dark-text-secondary mt-2">
                {selectedCoin.name} ({selectedCoin.symbol})
              </Text>
            )}
          </View>

          <View className="px-4 py-6">
            {/* Alert Type Selection */}
            <Text className="text-dark-text-primary font-medium mb-3">Alert Type</Text>
            <View className="flex-row gap-x-3 mb-6">
              <TouchableOpacity
                onPress={() => setAlertType('above')}
                className={`flex-1 py-3 px-4 rounded-xl border ${
                  alertType === 'above' 
                    ? 'border-hawk-accent bg-hawk-accent bg-opacity-20' 
                    : 'border-dark-border'
                }`}
              >
                <Text className={`text-center font-medium ${
                  alertType === 'above' ? 'text-hawk-accent' : 'text-dark-text-secondary'
                }`}>
                  Price Above
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAlertType('below')}
                className={`flex-1 py-3 px-4 rounded-xl border ${
                  alertType === 'below' 
                    ? 'border-hawk-accent bg-hawk-accent bg-opacity-20' 
                    : 'border-dark-border'
                }`}
              >
                <Text className={`text-center font-medium ${
                  alertType === 'below' ? 'text-hawk-accent' : 'text-dark-text-secondary'
                }`}>
                  Price Below
                </Text>
              </TouchableOpacity>
            </View>

            {/* Price Input */}
            <Text className="text-dark-text-primary font-medium mb-3">Target Price</Text>
            <View className="bg-dark-surface rounded-xl px-4 py-3 border border-dark-border mb-6">
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#94a3b8"
                value={alertPrice}
                onChangeText={setAlertPrice}
                keyboardType="numeric"
                className="text-dark-text-primary text-lg"
              />
            </View>

            {/* Current Price Info */}
            {selectedCoin && (
              <View className="bg-dark-surface rounded-xl p-4 mb-6">
                <Text className="text-dark-text-secondary text-sm mb-1">Current Price</Text>
                <Text className="text-dark-text-primary text-xl font-semibold">
                  {selectedCoin.price}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row gap-x-3">
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => setShowAlertModal(false)}
                className="flex-1"
              />
              <Button
                title="Create Alert"
                variant="primary"
                onPress={createPriceAlert}
                className="flex-1"
                disabled={!alertPrice}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Loading Overlay */}
      {refreshing && (
        <LoadingSpinner 
          variant="overlay" 
          text="Refreshing watchlist..."
        />
      )}
    </SafeAreaView>
  );
};