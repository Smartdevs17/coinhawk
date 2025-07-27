import React from 'react';
import { Text, TextProps } from 'react-native';

export interface IconProps extends Omit<TextProps, 'children'> {
  name: string;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  color = "#fbbf24",
  style,
  ...props 
}) => {
  return (
    <Text 
      style={[
        { 
          fontSize: size, 
          color,
          lineHeight: size * 1.2,
        }, 
        style
      ]}
      {...props}
    >
      {name}
    </Text>
  );
};