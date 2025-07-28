import "./global.css"
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-dark-bg">
        <AppNavigator />
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}