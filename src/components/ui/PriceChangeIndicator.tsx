import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { Icon } from './Icon';

export interface PriceChangeIndicatorProps extends ViewProps {
  change: string;
  showIcon?: boolean;
  showBackground?: boolean;
  size?: 'sm' | 'md' | 'lg';
  format?: 'percentage' | 'currency' | 'raw';
}

export const PriceChangeIndicator: React.FC<PriceChangeIndicatorProps> = ({
  change,
  showIcon = true,
  showBackground = false,
  size = 'md',
  format = 'percentage',
  className,
  ...props
}) => {
  // Helper function to determine if change is positive
  const isPositive = (changeValue: string): boolean => {
    if (changeValue.startsWith('+')) return true;
    if (changeValue.startsWith('-')) return false;
    
    // Handle numeric values
    const numericValue = parseFloat(changeValue.replace(/[^-0-9.]/g, ''));
    return numericValue > 0;
  };

  // Helper function to format the change value
  const formatChange = (changeValue: string): string => {
    if (format === 'raw') return changeValue;
    
    const numericValue = parseFloat(changeValue.replace(/[^-0-9.]/g, ''));
    const sign = numericValue >= 0 ? '+' : '';
    
    switch (format) {
      case 'percentage':
        return `${sign}${Math.abs(numericValue).toFixed(2)}%`;
      case 'currency':
        return `${sign}$${Math.abs(numericValue).toFixed(2)}`;
      default:
        return changeValue;
    }
  };

  const positive = isPositive(change);
  const formattedChange = formatChange(change);

  const getTextColorClass = () => {
    return positive ? 'text-success-500' : 'text-danger-500';
  };

  const getBackgroundClass = () => {
    if (!showBackground) return '';
    return positive ? 'bg-success-50' : 'bg-danger-50';
  };

  const getIconName = () => {
    return positive ? '▲' : '▼';
  };

  const getIconColor = () => {
    return positive ? '#10b981' : '#ef4444';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-sm';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 10;
      case 'md':
        return 12;
      case 'lg':
        return 14;
      default:
        return 12;
    }
  };

  return (
    <View
      className={`
        flex-row
        items-center
        ${showBackground ? `${getBackgroundClass()} px-2 py-1 rounded-md` : ''}
        ${className || ''}
      `.trim()}
      {...props}
    >
      {showIcon && (
        <Icon 
          name={getIconName()} 
          size={getIconSize()} 
          color={getIconColor()} 
        />
      )}
      <Text className={`
        ${getTextColorClass()}
        ${getSizeClasses()}
        font-medium
        ${showIcon ? 'ml-1' : ''}
      `.trim()}>
        {formattedChange}
      </Text>
    </View>
  );
};