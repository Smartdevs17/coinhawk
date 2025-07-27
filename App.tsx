import React from 'react';
import { StatusBar } from 'expo-status-bar';

// Import your first screen (we'll create this next)
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0f172a" />
      <HomeScreen />
    </>
  );
}