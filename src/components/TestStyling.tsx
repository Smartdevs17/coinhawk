import React from 'react';
import { View, Text } from 'react-native';

export const TestStyling = () => {
  return (
    <View className="bg-red-500 p-4 m-4 rounded-xl">
      <Text className="text-white text-lg font-bold">
        🎨 If you see red background, NativeWind is working!
      </Text>
      <View className="bg-hawk-accent p-2 mt-2 rounded">
        <Text className="text-hawk-primary">
          🦅 If this is golden, custom colors work!
        </Text>
      </View>
    </View>
  );
};