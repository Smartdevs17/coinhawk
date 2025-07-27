import "./global.css"
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  return (
    <View className="flex-1 bg-dark-bg">
      <HomeScreen />
    </View>
  );
}