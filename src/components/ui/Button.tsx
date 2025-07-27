import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-hawk-accent';
      case 'secondary':
        return 'bg-dark-surface border border-dark-border';
      case 'success':
        return 'bg-success-500';
      case 'danger':
        return 'bg-danger-500';
      case 'ghost':
        return 'bg-transparent';
      default:
        return 'bg-hawk-accent';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-hawk-primary';
      case 'secondary':
        return 'text-dark-text-primary';
      case 'success':
      case 'danger':
        return 'text-white';
      case 'ghost':
        return 'text-hawk-accent';
      default:
        return 'text-hawk-primary';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2';
      case 'md':
        return 'px-4 py-3';
      case 'lg':
        return 'px-6 py-4';
      default:
        return 'px-4 py-3';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        rounded-xl
        items-center
        justify-center
        flex-row
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        ${className || ''}
      `.trim()}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#1a1f36' : '#fbbf24'} 
        />
      ) : (
        <>
          {icon && (
            <>{icon}</>
          )}
          <Text className={`
            ${getTextStyles()}
            ${getTextSizeStyles()}
            font-semibold
            ${icon ? 'ml-2' : ''}
          `.trim()}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};