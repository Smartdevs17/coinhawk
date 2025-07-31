// screens/WatchlistScreen.tsx - Improved with better data integration

import React, { useState } from 'react';
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
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Button, Card, PriceChangeIndicator, Icon, LoadingSpinner } from '../components/ui';
import { Toast, useToast } from '../components/ui/Toast';
import { useWatchlist } from '../hooks/useWatchlist';
import { CoinPost, PriceAlert } from '../types/api';

export const WatchlistScreen: React.FC = () => {
  // Toast system
  const { toast, showSuccess, showError, showWarning, showInfo, hideToast } = useToast();

  // API integration with improved data loading
  const {
    watchlistCoins,
    availableCoins,
    alerts,
    loading,
    refreshing,
    searchLoading,
    error,
    searchQuery,
    setSearchQuery,
    addToWatchlist,
    removeFromWatchlist,
    createAlert,
    toggleAlert,
    deleteAlert,
    refreshData,
  } = useWatchlist((message, type) => {
    switch (type) {
      case 'success':
        showSuccess(message);
        break;
      case 'error':
        showError(message);
        break;
      case 'warning':
        showWarning(message);
        break;
      case 'info':
        showInfo(message);
        break;
    }
  });

  // Local UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinPost | null>(null);
  
  // Alert form state
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [alertPrice, setAlertPrice] = useState('');

  const handleAddToWatchlist = async (coin: CoinPost) => {
    const success = await addToWatchlist(coin.id, coin.name);
    if (success) {
      setShowAddModal(false);
      setSearchQuery('');
    }
  };

  const handleRemoveFromWatchlist = (coin: CoinPost) => {
    Alert.alert(
      'Remove from Watchlist',
      `Are you sure you want to remove ${coin.name} from your watchlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeFromWatchlist(coin.id, coin.name)
        },
      ]
    );
  };

  const openAlertModal = (coin: CoinPost) => {
    setSelectedCoin(coin);
    setAlertPrice(coin.price.replace('$', ''));
    setShowAlertModal(true);
  };

  const handleCreateAlert = async () => {
    if (!selectedCoin || !alertPrice) return;

    const success = await createAlert({
      coinPostId: selectedCoin.id,
      type: alertType,
      targetPrice: `$${alertPrice}`,
      currentPrice: selectedCoin.price,
      isActive: true,
    }, selectedCoin.name);

    if (success) {
      setShowAlertModal(false);
      setSelectedCoin(null);
      setAlertPrice('');
    }
  };

  const handleToggleAlert = (alert: PriceAlert) => {
    const coin = watchlistCoins.find(c => c.id === alert.coinPostId);
    const coinName = coin?.name || 'coin';
    const action = alert.isActive ? 'deactivate' : 'activate';
    
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Alert`,
      `Do you want to ${action} the price alert for ${coinName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action.charAt(0).toUpperCase() + action.slice(1), 
          onPress: () => toggleAlert(alert.id, coinName)
        },
      ]
    );
  };

  const handleDeleteAlert = (alert: PriceAlert) => {
    const coin = watchlistCoins.find(c => c.id === alert.coinPostId);
    const coinName = coin?.name || 'coin';
    
    Alert.alert(
      'Delete Alert',
      `Are you sure you want to permanently delete this price alert for ${coinName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteAlert(alert.id, coinName)
        },
      ]
    );
  };

  // Watchlist Item Component
  const WatchlistItemComponent: React.FC<{ 
    item: typeof watchlistCoins[0]; 
    onOpenAlert: (coin: CoinPost) => void;
    onRemoveFromWatchlist: (coin: CoinPost) => void;
  }> = ({ item, onOpenAlert, onRemoveFromWatchlist }) => {
    
    const handleAlertPress = () => {
      onOpenAlert(item);
    };

    const handleRemovePress = () => {
      onRemoveFromWatchlist(item);
    };

    const renderAlertIndicator = () => {
      if (!item.alertsCount || item.alertsCount === 0) {
        return null;
      }
      
      return (
        <View className="flex-row items-center ml-2">
          <Text className="text-dark-text-muted text-xs">•</Text>
          <View className="ml-1">
            <Icon 
              name="🔔" 
              size={12} 
              color={item.isAlertsActive ? "#fbbf24" : "#64748b"} 
            />
          </View>
          <Text className="text-xs text-hawk-accent ml-1">
            {item.alertsCount}
          </Text>
        </View>
      );
    };

    const renderVerificationBadge = () => {
      if (!item.verified) {
        return null;
      }
      
      return (
        <View className="ml-2">
          <Icon name="✓" size={14} color="#10b981" />
        </View>
      );
    };

    return (
      <TouchableOpacity activeOpacity={0.7} className="mb-3">
        <View className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-hawk-accent rounded-full items-center justify-center mr-3">
              <Text className="text-hawk-primary font-bold text-lg">
                {item.symbol.substring(0, 2)}
              </Text>
            </View>
            <View className="flex-1 mr-3">
              <View className="flex-row items-center mb-1">
                <Text className="text-dark-text-primary font-semibold text-base">
                  {item.name}
                </Text>
                {renderVerificationBadge()}
              </View>
              <Text className="text-dark-text-secondary text-sm mb-1">
                {item.symbol}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-dark-text-muted text-xs">
                  {item.holders?.toLocaleString() || '0'} holders
                </Text>
                {renderAlertIndicator()}
              </View>
            </View>
            <View className="items-end mr-3">
              <Text className="text-dark-text-primary font-semibold text-base mb-1">
                {item.price}
              </Text>
              <PriceChangeIndicator 
                change={item.change24h} 
                size="sm"
              />
            </View>
            <View className="items-center">
              <TouchableOpacity
                onPress={handleAlertPress}
                className="bg-hawk-accent bg-opacity-20 rounded-lg p-2 mb-2"
                activeOpacity={0.7}
              >
                <Icon name="🔔" size={16} color="#fbbf24" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRemovePress}
                className="rounded-lg p-2"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  borderWidth: 1,
                  borderColor: '#ef4444',
                }}
                activeOpacity={0.7}
              >
                <Icon name="✕" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderWatchlistItem = ({ item }: { item: typeof watchlistCoins[0] }) => {
    return (
      <WatchlistItemComponent 
        item={item}
        onOpenAlert={openAlertModal}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
      />
    );
  };

  const renderAvailableCoin = ({ item }: { item: CoinPost }) => (
    <TouchableOpacity onPress={() => handleAddToWatchlist(item)}>
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
    const coin = watchlistCoins.find(c => c.id === alert.coinPostId);
    if (!coin) return null;

    return (
      <Card key={alert.id} variant="surface" className="mb-3">
        <View className="p-1">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-dark-text-primary font-medium text-base mb-1">
                {coin.name} {alert.type === 'above' ? '↗' : '↘'} {alert.targetPrice}
              </Text>
              <Text className="text-dark-text-secondary text-sm">
                Current: {alert.currentPrice}
              </Text>
              <View className="flex-row items-center mt-1">
                <View className={`w-2 h-2 rounded-full mr-2 ${
                  alert.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <Text className={`text-xs font-medium ${
                  alert.isActive ? 'text-green-500' : 'text-gray-400'
                }`}>
                  {alert.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
          
            <View className="flex-row justify-between items-center pt-3 border-t border-dark-border">
            <TouchableOpacity
              onPress={() => handleToggleAlert(alert)}
              className={`flex-1 mr-2 py-3 px-4 rounded-xl border ${
              alert.isActive 
                ? 'border-green-500 bg-green-500 bg-opacity-10' 
                : 'border-gray-400 bg-gray-400 bg-opacity-10'
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-center">
              <Icon 
                name={alert.isActive ? "⏸" : "▶"} 
                size={14} 
                color={alert.isActive ? "#10b981" : "#6b7280"} 
              />
              <Text className={`ml-2 text-sm font-semibold ${
                alert.isActive ? 'text-dark-green-500' : 'text-gray-400'
              }`}>
                {alert.isActive ? 'Pause' : 'Resume'}
              </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleDeleteAlert(alert)}
              className="flex-1 py-3 px-4 rounded-xl border border-red-500 bg-red-500 bg-opacity-10"
              activeOpacity={0.7}
              style={{ marginLeft: 8 }}
            >
              <View className="flex-row items-center justify-center">
              <Icon name="🗑" size={14} color="#ef4444" />
              <Text className="ml-2 text-sm font-semibold text-dark-500">
                Delete
              </Text>
              </View>
            </TouchableOpacity>
            </View>
        </View>
      </Card>
    );
  };

  // Loading screen
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-bg">
        <LoadingSpinner variant="overlay" text="Loading watchlist..." />     
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      {/* Header */}
      <View className="px-4 py-8 mt-4 bg-dark-surface border-b border-dark-border">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-bold text-dark-text-primary">👀 Watchlist</Text>
          <View className="flex-row gap-x-3">
            <TouchableOpacity onPress={() => setShowAddModal(true)}>
              <Icon name="+" size={20} color="#fbbf24" />
            </TouchableOpacity>
            <TouchableOpacity onPress={refreshData}>
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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 112 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            tintColor="#fbbf24"
          />
        }
      >
        {/* Watchlist Items */}
        {watchlistCoins.length > 0 ? (
          <View className="py-4 px-4">
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
        {alerts.length > 0 && (
          <View className="py-4 px-4">
            <Text className="text-dark-text-primary font-semibold text-lg mb-3">
              🔔 Price Alerts ({alerts.filter(a => a.isActive).length} active, {alerts.length} total)
            </Text>
            {alerts.map(renderActiveAlert)}
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
              {searchLoading && (
                <ActivityIndicator size="small" color="#fbbf24" />
              )}
            </View>
          </View>

          <ScrollView 
                  className="flex-1 px-4 py-4"
                  contentContainerStyle={{ paddingBottom: 100 }}
            >
            
            <FlatList
              data={availableCoins}
              renderItem={renderAvailableCoin}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                <View className="items-center justify-center py-16">
                  <Icon name="🔍" size={48} color="#64748b" />
                  <Text className="text-dark-text-secondary text-lg font-medium mt-4">
                    {searchQuery ? 'No coins found' : 'Loading coins...'}
                  </Text>
                </View>
              }
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
                  alertType === 'above' ? 'text-dark-hawk-accent' : 'text-dark-text-secondary'
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
                  alertType === 'below' ? 'text-dark-hawk-accent' : 'text-dark-text-secondary'
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
                onPress={handleCreateAlert}
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