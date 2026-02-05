import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui';
import { colors, spacing, typography } from '../utils/theme';
import { propertyMapper } from '@/mappers/propertyMapper';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  image_url?: string;
  bedrooms: number;
  bathrooms: number;
}

const FavoritesScreen = ({ navigation }: any) => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchFavorites();
      }
    }, [user])
  );

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id, properties(*, property_images(*))')
        .eq('user_id', user.id);

      console.log('Supabase data (favorites):', data);
      console.log('Supabase error (favorites):', error);

      if (error) throw error;

      const propertyList = data
        ?.map((fav: any) => {
          const p = fav.properties as any;
          if (!p) return null;
          const mapped = propertyMapper(p);
          return mapped;
        })
        .filter(Boolean)
        .filter((p: any) => p.is_available && p.is_approved) as Property[];

      setFavorites(propertyList || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      setFavorites(favorites.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card style={{ marginBottom: spacing.md }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('PropertyDetail', { id: property.id })}
        activeOpacity={0.7}
      >
        {property.image_url && (
          <Image
            source={{ uri: property.image_url }}
            style={{
              width: '100%',
              height: 180,
              borderRadius: 8,
              marginBottom: spacing.md,
            }}
          />
        )}
        <Text style={{ ...typography.h4, color: colors.foreground }}>
          {property.title}
        </Text>
        <Text
          style={{
            ...typography.bodySmall,
            color: colors.mutedForeground,
            marginTop: spacing.sm,
          }}
        >
          {property.location}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: spacing.md,
        }}
      >
        <Text style={{ ...typography.h4, color: colors.primary }}>
          R$ {property.price.toLocaleString('pt-BR')}
        </Text>
        <TouchableOpacity onPress={() => removeFavorite(property.id)}>
          <MaterialIcons name="delete" size={24} color={colors.destructive} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
        }}
      >
        <Text
          style={{
            ...typography.h2,
            color: colors.foreground,
            marginBottom: spacing.lg,
          }}
        >
          Favoritos
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} size="large" />
        ) : favorites.length > 0 ? (
          favorites.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <Text style={{ ...typography.body, color: colors.mutedForeground }}>
            Você ainda não tem imóveis favoritos
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;
