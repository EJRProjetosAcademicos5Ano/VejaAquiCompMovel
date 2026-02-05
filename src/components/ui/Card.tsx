import React from 'react';
import { View, ViewProps, TouchableOpacity, TouchableOpacityProps, TextInput, TextInputProps, Text } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
          padding: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
}

export const Button: React.FC<ButtonProps> = ({ children, style, variant = 'primary', ...props }) => {
  const variantStyles = {
    primary: {
      backgroundColor: '#3B82F6',
    },
    secondary: {
      backgroundColor: '#10B981',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#3B82F6',
    },
    destructive: {
      backgroundColor: '#EF4444',
    },
  };

  return (
    <TouchableOpacity
      style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        },
        variantStyles[variant],
        style,
      ]}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

interface InputProps extends TextInputProps {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, style, ...props }) => {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#1F2937' }}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          {
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 12,
            fontSize: 16,
            color: '#1F2937',
          },
          style,
        ]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
};
