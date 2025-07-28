import React from 'react';
import { View, ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'surface' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'xl',
  className,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return 'bg-dark-surface';
      case 'surface':
        return 'bg-dark-surface border border-dark-border';
      case 'elevated':
        return 'bg-dark-surface shadow-lg';
      case 'bordered':
        return 'bg-dark-surface border-2 border-hawk-accent';
      default:
        return 'bg-dark-surface';
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-2';
      case 'md':
        return 'p-4';
      case 'lg':
        return 'p-6';
      case 'xl':
        return 'p-8';
      default:
        return 'p-4';
    }
  };

  const getRoundedStyles = () => {
    switch (rounded) {
      case 'sm':
        return 'rounded-sm';
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      case 'xl':
        return 'rounded-xl';
      case '2xl':
        return 'rounded-2xl';
      default:
        return 'rounded-xl';
    }
  };

  const classNames = [
    getVariantStyles(),
    getPaddingStyles(),
    getRoundedStyles(),
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <View
      className={classNames}
      {...props}
    >
      {children}
    </View>
  );
};