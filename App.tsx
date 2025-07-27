import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

// Import test component
import { TestStyling } from './src/components/TestStyling';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  return (
    <View className="flex-1 bg-dark-bg">
      <StatusBar style="light" backgroundColor="#0f172a" />
      
      {/* Test styling first */}
      <TestStyling />
      
      {/* Your home screen */}
      {/* <HomeScreen /> */}
    </View>
  );
}