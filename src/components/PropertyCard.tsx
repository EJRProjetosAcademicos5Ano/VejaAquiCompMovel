/**
 * PropertyCard - Componente Reutilizável para Propriedades
 * Adaptação fiel da webapp para mobile
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Property } from '../types/property';
import { colors, spacing } from '../utils/theme';

interface PropertyCardProps {
  property: Property;
  onPress: (propertyId: string) => void;
  onFavoritePress?: (propertyId: string) => void;
  isFavorite?: boolean;
  featured?: boolean;
  size?: 'small' | 'medium' | 'large';
  horizontal?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  onFavoritePress,
  isFavorite = false,
  featured = false,
  size = 'medium',
  horizontal = false,
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  const getPropertyTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      apartment: 'Apartamento',
      house: 'Casa',
      office: 'Escritório',
      shop: 'Loja',
      land: 'Terreno',
      other: 'Outro',
    };
    return types[type] || type;
  };

  const formatPrice = (price: number, currency?: string): string => {
    const locale = 'pt-AO';
    const curr = (currency || 'AOA').toUpperCase();
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    } catch (e) {
      // Fallback
      return `R$ ${price.toLocaleString('pt-BR')}`;
    }
  };

  const styles = getStyles(size, horizontal);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={() => onPress(property.id)}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              property.cover_image ||
              'https://via.placeholder.com/300x200?text=Property',
          }}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />

        {/* Featured Badge */}
        {featured && (
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <MaterialCommunityIcons
                name="star"
                size={12}
                color={colors.primaryForeground}
              />
              <Text style={styles.badgeText}>Destaque</Text>
            </View>
          </View>
        )}

        {/* Status Badge */}
        {property.status && (
          <View style={styles.statusBadgeContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{property.status}</Text>
            </View>
          </View>
        )}

        {/* Favorite Button */}
        {onFavoritePress && (
          <Pressable
            style={styles.favoriteButton}
            onPress={() => onFavoritePress(property.id)}
          >
            <MaterialCommunityIcons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.destructive : colors.primaryForeground}
            />
          </Pressable>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Type Badge */}
        <Text style={styles.typeLabel}>
          {getPropertyTypeLabel(property.property_type)}
        </Text>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {property.title}
        </Text>

        {/* Location */}
        <View style={styles.locationContainer}>
          <MaterialCommunityIcons
            name="map-marker"
            size={14}
            color={colors.mutedForeground}
          />
          <Text style={styles.location} numberOfLines={1}>
            {property.location || `${property.city}, ${property.province}`}
          </Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>{formatPrice(property.price, property.currency)}</Text>

        {/* Features Row */}
        {(property.bedrooms || property.bathrooms || property.area_sqm) && (
          <View style={styles.featuresRow}>
            {property.bedrooms !== undefined && (
              <View style={styles.feature}>
                <MaterialCommunityIcons
                  name="bed"
                  size={16}
                  color={colors.mutedForeground}
                />
                <Text style={styles.featureText}>{property.bedrooms}</Text>
              </View>
            )}

            {property.bathrooms !== undefined && (
              <View style={styles.feature}>
                <MaterialCommunityIcons
                  name="shower"
                  size={16}
                  color={colors.mutedForeground}
                />
                <Text style={styles.featureText}>{property.bathrooms}</Text>
              </View>
            )}

            {property.area_sqm !== undefined && (
              <View style={styles.feature}>
                <MaterialCommunityIcons
                  name="ruler"
                  size={16}
                  color={colors.mutedForeground}
                />
                <Text style={styles.featureText}>{property.area_sqm}m²</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

function getStyles(size: string, horizontal: boolean) {
  const baseStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    containerPressed: {
      opacity: 0.8,
    },
    imageContainer: {
      position: 'relative',
      backgroundColor: colors.muted,
      width: '100%',
      height: 200,
    },
    image: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.muted,
    },
    badgeContainer: {
      position: 'absolute',
      top: spacing.md,
      left: spacing.md,
    },
    badge: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    badgeText: {
      color: colors.primaryForeground,
      fontSize: 11,
      fontWeight: '600',
    },
    favoriteButton: {
      position: 'absolute',
      bottom: spacing.md,
      right: spacing.md,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusBadgeContainer: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
    },
    statusBadge: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusText: {
      color: colors.foreground,
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    content: {
      padding: spacing.md,
      gap: spacing.sm,
    },
    typeLabel: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.foreground,
      lineHeight: 22,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    location: {
      fontSize: 13,
      color: colors.mutedForeground,
      flex: 1,
    },
    price: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
      marginTop: spacing.xs,
    },
    featuresRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    feature: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    featureText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontWeight: '500',
    },
  });

  // Ajustes dinâmicos por tamanho
  if (size === 'small') {
    return {
      ...baseStyles,
      imageContainer: {
        ...baseStyles.imageContainer,
        height: 150,
      },
      container: {
        ...baseStyles.container,
        marginBottom: spacing.sm,
      },
      title: { ...baseStyles.title, fontSize: 14 },
      price: { ...baseStyles.price, fontSize: 16 },
      content: { ...baseStyles.content, padding: spacing.sm, gap: spacing.xs },
    };
  }

  if (size === 'large') {
    return {
      ...baseStyles,
      imageContainer: {
        ...baseStyles.imageContainer,
        height: 250,
      },
      title: { ...baseStyles.title, fontSize: 18, lineHeight: 24 },
      price: { ...baseStyles.price, fontSize: 20 },
      content: { ...baseStyles.content, padding: spacing.lg, gap: spacing.md },
    };
  }

  // Default: medium
  return baseStyles;
}

export default PropertyCard;
