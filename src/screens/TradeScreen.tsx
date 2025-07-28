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
import { TradeType, OrderType, CoinPost, OrderBookEntry } from '../types';
import { Button, Card, PriceChangeIndicator, Icon, LoadingSpinner } from '../components/ui';
import { MOCK_RECENT_TRADES, EXTENDED_TRENDING_POSTS, MOCK_PORTFOLIO_DATA, MOCK_TRADING_BALANCES, MOCK_ORDER_BOOK } from '../utils/mockData';

// Trading specific interfaces

export const TradeScreen: React.FC = () => {
  // Trading state
  const [selectedCoin, setSelectedCoin] = useState<CoinPost>(EXTENDED_TRENDING_POSTS[0]); // Default to first coin
  const [tradeType, setTradeType] = useState<TradeType>('Buy');
  const [orderType, setOrderType] = useState<OrderType>('Market');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCoinSelector, setShowCoinSelector] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

  // Calculate order summary
  const orderSummary = useMemo(() => {
    const amountNum = parseFloat(amount) || 0;
    const priceNum = orderType === 'Market' 
      ? parseFloat(selectedCoin.price.replace('$', '')) 
      : parseFloat(limitPrice) || 0;
    
    const total = amountNum * priceNum;
    const fees = total * 0.005; // 0.5% trading fee
    const finalTotal = tradeType === 'Buy' ? total + fees : total - fees;

    return {
      amount: amountNum.toLocaleString(),
      price: `$${priceNum.toFixed(4)}`,
      subtotal: `$${total.toFixed(2)}`,
      fees: `$${fees.toFixed(2)}`,
      total: `$${finalTotal.toFixed(2)}`,
    };
  }, [amount, limitPrice, orderType, selectedCoin.price, tradeType]);

  // Get available balance for selected currency
  const availableBalance = useMemo(() => {
    if (tradeType === 'Buy') {
      const usdcBalance = MOCK_TRADING_BALANCES.find(b => b.currency === 'USDC');
      return usdcBalance?.available || '$0.00';
    } else {
      // For sell orders, find the coin balance
      const coinBalance = MOCK_TRADING_BALANCES.find(b => b.currency === selectedCoin.symbol);
      return coinBalance?.available || '0';
    }
  }, [tradeType, selectedCoin.symbol]);

  const handlePercentageAmount = (percentage: number) => {
    const balance = parseFloat(availableBalance.replace(/[$,]/g, ''));
    const price = parseFloat(selectedCoin.price.replace('$', ''));
    
    if (tradeType === 'Buy') {
      // Calculate how many tokens we can buy with the percentage of balance
      const amountToBuy = (balance * percentage / 100) / price;
      setAmount(amountToBuy.toFixed(0));
    } else {
      // For sell, use percentage of held tokens
      const tokensToSell = balance * percentage / 100;
      setAmount(tokensToSell.toFixed(0));
    }
  };

  const handlePlaceOrder = () => {
    if (!amount || (orderType === 'Limit' && !limitPrice)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setShowOrderConfirmation(true);
  };

  const confirmOrder = () => {
    setLoading(true);
    setShowOrderConfirmation(false);
    
    // Simulate order placement
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Order Placed!',
        `Your ${tradeType.toLowerCase()} order for ${amount} ${selectedCoin.symbol} has been placed successfully.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setAmount('');
              setLimitPrice('');
            }
          }
        ]
      );
    }, 2000);
  };

  const renderRecentTrade = ({ item }: { item: typeof MOCK_RECENT_TRADES[0] }) => (
    <View className="flex-row items-center justify-between py-3 border-b border-dark-border border-opacity-30">
      <View className="flex-1">
        <View className="flex-row items-center">
          <View className={`w-2 h-2 rounded-full mr-2 ${
            item.type === 'Buy' ? 'bg-success-500' : 'bg-danger-500'
          }`} />
          <Text className="text-dark-text-primary font-medium">{item.pair}</Text>
        </View>
        <Text className="text-dark-text-muted text-sm">{item.timestamp}</Text>
      </View>
      <View className="items-center">
        <Text className={`font-semibold ${
          item.type === 'Buy' ? 'text-success-500' : 'text-danger-500'
        }`}>
          {item.type}
        </Text>
        <Text className="text-dark-text-secondary text-sm">{item.amount}</Text>
      </View>
      <View className="items-end">
        <Text className="text-dark-text-primary font-medium">{item.price}</Text>
        <Text className="text-dark-text-secondary text-sm">{item.total}</Text>
      </View>
    </View>
  );

  const renderOrderBookEntry = ({ item, type }: { item: OrderBookEntry; type: 'bid' | 'ask' }) => (
    <TouchableOpacity 
      className="flex-row justify-between py-1"
      onPress={() => {
        if (orderType === 'Limit') {
          setLimitPrice(item.price.replace('$', ''));
        }
      }}
    >
      <Text className={`text-sm ${type === 'bid' ? 'text-success-500' : 'text-danger-500'}`}>
        {item.price}
      </Text>
      <Text className="text-dark-text-secondary text-sm">{item.amount}</Text>
      <Text className="text-dark-text-muted text-xs">{item.total}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      {/* Header */}
      <View className="px-4 py-8 bg-dark-surface border-b border-dark-border">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-dark-text-primary">📈 Trade</Text>
          <TouchableOpacity onPress={() => setShowCoinSelector(true)}>
            <View className="flex-row items-center bg-dark-bg rounded-lg px-3 py-2">
              <View className="w-6 h-6 bg-hawk-accent rounded-full items-center justify-center mr-2">
                <Text className="text-hawk-primary font-bold text-xs">
                  {selectedCoin.symbol.slice(0, 1)}
                </Text>
              </View>
              <Text className="text-dark-text-primary font-medium mr-1">
                {selectedCoin.symbol}
              </Text>
              <Icon name="▼" size={12} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }} // 64 (tab height) + extra space
      >
        {/* Current Price & Stats */}
        <View className="p-4">
          <Card variant="surface">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-dark-text-secondary text-sm">{selectedCoin.name}</Text>
                <Text className="text-2xl font-bold text-dark-text-primary">
                  {selectedCoin.price}
                </Text>
              </View>
              <View className="items-end">
                <PriceChangeIndicator 
                  change={selectedCoin.change24h} 
                  size="lg"
                  showBackground={true}
                />
                <Text className="text-dark-text-muted text-sm mt-1">24h Change</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Trading Interface */}
        <View className="px-4">
          <Card variant="surface">
            {/* Buy/Sell Toggle */}
            <View className="flex-row mb-6">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-l-xl items-center ${
                  tradeType === 'Buy' 
                    ? 'bg-success-500' 
                    : 'bg-dark-bg border border-dark-border border-r-0'
                }`}
                onPress={() => setTradeType('Buy')}
              >
                <Text className={`font-semibold ${
                  tradeType === 'Buy' ? 'text-white' : 'text-dark-text-secondary'
                }`}>
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-r-xl items-center ${
                  tradeType === 'Sell' 
                    ? 'bg-danger-500' 
                    : 'bg-dark-bg border border-dark-border border-l-0'
                }`}
                onPress={() => setTradeType('Sell')}
              >
                <Text className={`font-semibold ${
                  tradeType === 'Sell' ? 'text-white' : 'text-dark-text-secondary'
                }`}>
                  Sell
                </Text>
              </TouchableOpacity>
            </View>

            {/* Order Type Toggle */}
            <View className="flex-row mb-4">
              <TouchableOpacity
                className={`flex-1 py-2 rounded-l-lg items-center ${
                  orderType === 'Market' 
                    ? 'bg-hawk-accent' 
                    : 'bg-dark-bg border border-dark-border border-r-0'
                }`}
                onPress={() => setOrderType('Market')}
              >
                <Text className={`font-medium ${
                  orderType === 'Market' ? 'text-hawk-primary' : 'text-dark-text-secondary'
                }`}>
                  Market
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-2 rounded-r-lg items-center ${
                  orderType === 'Limit' 
                    ? 'bg-hawk-accent' 
                    : 'bg-dark-bg border border-dark-border border-l-0'
                }`}
                onPress={() => setOrderType('Limit')}
              >
                <Text className={`font-medium ${
                  orderType === 'Limit' ? 'text-hawk-primary' : 'text-dark-text-secondary'
                }`}>
                  Limit
                </Text>
              </TouchableOpacity>
            </View>

            {/* Available Balance */}
            <View className="mb-4">
              <Text className="text-dark-text-muted text-sm">
                Available: {availableBalance} {tradeType === 'Buy' ? 'USDC' : selectedCoin.symbol}
              </Text>
            </View>

            {/* Amount Input */}
            <View className="mb-4">
              <Text className="text-dark-text-primary font-medium mb-2">Amount</Text>
              <View className="bg-dark-bg rounded-xl px-4 py-3 border border-dark-border">
                <TextInput
                  placeholder={`0 ${selectedCoin.symbol}`}
                  placeholderTextColor="#94a3b8"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  className="text-dark-text-primary text-lg"
                />
              </View>
              
              {/* Percentage Buttons */}
              <View className="flex-row gap-x-2 mt-3">
                {[25, 50, 75, 100].map((percentage) => (
                  <TouchableOpacity
                    key={percentage}
                    className="flex-1 bg-dark-bg border border-dark-border rounded-lg py-2"
                    onPress={() => handlePercentageAmount(percentage)}
                  >
                    <Text className="text-dark-text-secondary text-center font-medium">
                      {percentage}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Limit Price Input (only for limit orders) */}
            {orderType === 'Limit' && (
              <View className="mb-4">
                <Text className="text-dark-text-primary font-medium mb-2">Limit Price</Text>
                <View className="bg-dark-bg rounded-xl px-4 py-3 border border-dark-border">
                  <TextInput
                    placeholder="0.0000"
                    placeholderTextColor="#94a3b8"
                    value={limitPrice}
                    onChangeText={setLimitPrice}
                    keyboardType="numeric"
                    className="text-dark-text-primary text-lg"
                  />
                </View>
              </View>
            )}

            {/* Order Summary */}
            {amount && (orderType === 'Market' || limitPrice) && (
              <View className="bg-dark-bg rounded-xl p-4 mb-4">
                <Text className="text-dark-text-primary font-medium mb-3">Order Summary</Text>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-dark-text-muted">Amount</Text>
                    <Text className="text-dark-text-primary">{orderSummary.amount} {selectedCoin.symbol}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-dark-text-muted">Price</Text>
                    <Text className="text-dark-text-primary">{orderSummary.price}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-dark-text-muted">Subtotal</Text>
                    <Text className="text-dark-text-primary">{orderSummary.subtotal}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-dark-text-muted">Trading Fee (0.5%)</Text>
                    <Text className="text-dark-text-primary">{orderSummary.fees}</Text>
                  </View>
                  <View className="border-t border-dark-border pt-2">
                    <View className="flex-row justify-between">
                      <Text className="text-dark-text-primary font-semibold">Total</Text>
                      <Text className="text-dark-text-primary font-semibold">{orderSummary.total}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Place Order Button */}
            <Button
              title={`${tradeType} ${selectedCoin.symbol}`}
              variant={tradeType === 'Buy' ? 'primary' : 'danger'}
              onPress={handlePlaceOrder}
              disabled={!amount || (orderType === 'Limit' && !limitPrice)}
              className="w-full"
            />
          </Card>
        </View>

        {/* Order Book */}
        <View className="px-4 mt-6">
          <Card variant="surface">
            <Text className="text-dark-text-primary font-semibold mb-4">Order Book</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-dark-text-muted text-xs">Price</Text>
              <Text className="text-dark-text-muted text-xs">Amount</Text>
              <Text className="text-dark-text-muted text-xs">Total</Text>
            </View>
            
            {/* Asks (Sell orders) */}
            <View className="mb-3">
              {MOCK_ORDER_BOOK.asks.slice(0, 3).reverse().map((ask, index) => (
                <View key={`ask-${index}`}>
                  {renderOrderBookEntry({ item: ask, type: 'ask' })}
                </View>
              ))}
            </View>
            
            {/* Current Price */}
            <View className="py-2 border-y border-dark-border my-2">
              <Text className="text-center text-hawk-accent font-semibold">
                {selectedCoin.price} ↑
              </Text>
            </View>
            
            {/* Bids (Buy orders) */}
            <View>
              {MOCK_ORDER_BOOK.bids.slice(0, 3).map((bid, index) => (
                <View key={`bid-${index}`}>
                  {renderOrderBookEntry({ item: bid, type: 'bid' })}
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Recent Trades */}
        <View className="px-4 mt-6 mb-6">
          <Card variant="surface">
            <Text className="text-dark-text-primary font-semibold mb-4">Recent Trades</Text>
            <FlatList
              data={MOCK_RECENT_TRADES}
              renderItem={renderRecentTrade}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </Card>
        </View>
      </ScrollView>

      {/* Coin Selector Modal */}
      <Modal
        visible={showCoinSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-dark-bg">
          <View className="px-4 py-6 bg-dark-surface border-b border-dark-border">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-dark-text-primary">Select Coin</Text>
              <TouchableOpacity onPress={() => setShowCoinSelector(false)}>
                <Icon name="✕" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={EXTENDED_TRENDING_POSTS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="px-4 py-4 border-b border-dark-border border-opacity-30"
                onPress={() => {
                  setSelectedCoin(item);
                  setShowCoinSelector(false);
                  setAmount('');
                  setLimitPrice('');
                }}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-hawk-accent rounded-full items-center justify-center mr-3">
                    <Text className="text-hawk-primary font-bold">
                      {item.symbol.slice(0, 1)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-dark-text-primary font-semibold mr-2">
                        {item.name}
                      </Text>
                      {item.verified && (
                        <Icon name="✓" size={16} color="#10b981" />
                      )}
                    </View>
                    <Text className="text-dark-text-secondary">{item.symbol}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-dark-text-primary font-semibold">
                      {item.price}
                    </Text>
                    <PriceChangeIndicator change={item.change24h} size="sm" />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Order Confirmation Modal */}
      <Modal
        visible={showOrderConfirmation}
        animationType="fade"
        transparent={true}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
          <Card variant="surface" className="w-full max-w-sm">
            <Text className="text-xl font-bold text-dark-text-primary mb-4">
              Confirm Order
            </Text>
            
            <View className="space-y-3 mb-6">
              <View className="flex-row justify-between">
                <Text className="text-dark-text-muted">Type</Text>
                <Text className={`font-semibold ${
                  tradeType === 'Buy' ? 'text-success-500' : 'text-danger-500'
                }`}>
                  {tradeType} {orderType}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-dark-text-muted">Amount</Text>
                <Text className="text-dark-text-primary">{orderSummary.amount} {selectedCoin.symbol}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-dark-text-muted">Price</Text>
                <Text className="text-dark-text-primary">{orderSummary.price}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-dark-text-muted">Total</Text>
                <Text className="text-dark-text-primary font-semibold">{orderSummary.total}</Text>
              </View>
            </View>

            <View className="flex-row gap-x-3">
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => setShowOrderConfirmation(false)}
                className="flex-1"
              />
              <Button
                title="Confirm"
                variant={tradeType === 'Buy' ? 'primary' : 'danger'}
                onPress={confirmOrder}
                className="flex-1"
              />
            </View>
          </Card>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <LoadingSpinner 
          variant="overlay" 
          text="Placing order..."
        />
      )}
    </SafeAreaView>
  );
};