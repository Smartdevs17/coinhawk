import React from 'react';
import { View, ActivityIndicator, Text, ViewProps } from 'react-native';

export interface LoadingSpinnerProps extends ViewProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  variant?: 'default' | 'overlay' | 'card';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#fbbf24', // hawk-accent color
  text,
  variant = 'default',
  className,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'overlay':
        return 'absolute inset-0 bg-dark-bg bg-opacity-80 z-50';
      case 'card':
        return 'bg-dark-surface rounded-xl p-6 border border-dark-border';
      case 'default':
      default:
        return '';
    }
  };

  const SpinnerContent = () => (
    <>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text className="text-dark-text-secondary text-sm mt-3 text-center">
          {text}
        </Text>
      )}
    </>
  );

  return (
    <View
      className={`
        items-center
        justify-center
        ${getVariantStyles()}
        ${className || ''}
      `.trim()}
      {...props}
    >
      <SpinnerContent />
    </View>
  );
};