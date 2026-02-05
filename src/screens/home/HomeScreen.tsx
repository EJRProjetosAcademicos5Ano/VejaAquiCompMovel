/**
 * HomeScreen Mobile
 * Adaptação fiel da webapp VejaAqui para React Native
 * 
 * Seções:
 * 1. SearchHeader (HeroSection)
 * 2. PropertyTypes (scroll horizontal)
 * 3. FeaturedProperties (vertical)
 * 4. LatestProperties (horizontal)
 * 5. LocationsSection (horizontal)
 * 6. PremiumCTA (call-to-action)
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import PropertyCard from '../../components/PropertyCard';
import Header from '../../components/Header';
import { useHome } from '../../hooks/useHome';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { colors, spacing, typography } from '../../utils/theme';
import { Property, PropertyType, Location } from '../../types/property';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const {
    featuredProperties,
    latestProperties,
    propertyTypes,
    locations,
    loading,
    error,
    refreshing,
    refresh,
  } = useHome();

  const { user } = useAuth();
  const { favorites, loading: favoritesLoading, isFavorite, toggleFavorite, refresh: refreshFavorites } = useFavorites();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Refresh ao focar na screen
  useFocusEffect(
    useCallback(() => {
      refresh();
      try { refreshFavorites(); } catch (e) { /* ignore */ }
    }, [refresh, refreshFavorites])
  );

  // Dev-only debug logs to confirm data flow
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.log('HomeScreen data:', {
      featured: featuredProperties.length,
      latest: latestProperties.length,
      loading,
      error,
    });
  }

  const handlePropertyPress = (propertyId: string) => {
    navigation.navigate('PropertyDetail', { propertyId });
  };

  const handlePropertyTypePress = (type: PropertyType) => {
    navigation.navigate('SearchTab', {
      screen: 'SearchMain',
      params: { filters: { property_type: type.type } }
    });
  };

  const handleLocationPress = (location: Location) => {
    navigation.navigate('SearchTab', {
      screen: 'SearchMain',
      params: { filters: { province: location.province } }
    });
  };

  const handleFavoritePress = (propertyId: string) => {
    toggleFavorite(propertyId);
  };

  const handlePremiumPress = () => {
    navigation.navigate('PublishTab');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando propriedades...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {/* 1. SEARCH HEADER / HERO SECTION */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Encontre o seu imóvel</Text>
          <Text style={styles.heroSubtitle}>
            A maior plataforma de imóveis em Angola
          </Text>

          <View style={styles.searchContainer}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={colors.mutedForeground}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar apartamentos, casas..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Pressable
              style={styles.searchButton}
              onPress={() => {
                if (searchQuery.trim()) {
                  navigation.navigate('Search', { query: searchQuery });
                }
              }}
            >
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={colors.primaryForeground}
              />
            </Pressable>
          </View>
        </View>

        {/* 2. PROPERTY TYPES SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos de Propriedades</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={propertyTypes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.propertyTypesContainer}
            scrollEnabled={true}
            renderItem={({ item }) => (
              <Pressable
                style={styles.propertyTypeCard}
                onPress={() => handlePropertyTypePress(item)}
              >
                <View style={styles.propertyTypeIconContainer}>
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={28}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.propertyTypeLabel}>{item.label}</Text>
                {item.count !== undefined && (
                  <Text style={styles.propertyTypeCount}>
                    {item.count} anúncios
                  </Text>
                )}
              </Pressable>
            )}
          />
        </View>

        {/* 3. FEATURED PROPERTIES SECTION */}
        {featuredProperties.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Em Destaque</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Search', {})}
              >
                <Text style={styles.seeAllLink}>Ver tudo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.featuredPropertiesContainer}>
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onPress={handlePropertyPress}
                  onFavoritePress={handleFavoritePress}
                  isFavorite={isFavorite(property.id)}
                  featured={true}
                  size="large"
                />
              ))}
            </View>
          </View>
        )}

        {/* 4. LATEST PROPERTIES SECTION */}
        {latestProperties.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mais Recentes</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Search', {})}
              >
                <Text style={styles.seeAllLink}>Ver tudo</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={latestProperties}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.latestPropertiesContainer}
              scrollEnabled={true}
              renderItem={({ item }) => (
                <View style={styles.latestPropertyWrapper}>
                  <PropertyCard
                    property={item}
                    onPress={handlePropertyPress}
                    onFavoritePress={handleFavoritePress}
                    isFavorite={isFavorite(item.id)}
                    size="small"
                    horizontal={true}
                  />
                </View>
              )}
            />
          </View>
        )}

        {/* 5. LOCATIONS SECTION */}
        {locations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Explora por Região</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={locations.slice(0, 6)}
              keyExtractor={(item) => item.province}
              contentContainerStyle={styles.locationsContainer}
              scrollEnabled={true}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.locationCard}
                  onPress={() => handleLocationPress(item)}
                >
                  <View style={styles.locationIconContainer}>
                    <MaterialCommunityIcons
                      name="map-marker-multiple"
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.locationName}>{item.province}</Text>
                  <Text style={styles.locationCitiesCount}>
                    {item.cities.length} cidades
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* 6. PREMIUM CTA SECTION */}
        <View style={styles.section}>
          <Pressable
            style={styles.premiumCTACard}
            onPress={handlePremiumPress}
          >
            <View style={styles.premiumContent}>
              <MaterialCommunityIcons
                name="crown"
                size={32}
                color={colors.primary}
              />
              <View style={styles.premiumTextContainer}>
                <Text style={styles.premiumTitle}>VejaAqui Premium</Text>
                <Text style={styles.premiumDescription}>
                  Destaque seu anúncio e alcance mais clientes
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color={colors.primary}
            />
          </Pressable>
        </View>

        {/* ERROR MESSAGE */}
        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color={colors.destructive}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* EMPTY STATE */}
        {!loading &&
          featuredProperties.length === 0 &&
          latestProperties.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <MaterialCommunityIcons
                name="home-search"
                size={48}
                color={colors.mutedForeground}
              />
              <Text style={styles.emptyStateTitle}>
                Nenhuma propriedade disponível
              </Text>
              <Text style={styles.emptyStateDescription}>
                Tente ajustar seus filtros ou procure depois
              </Text>
            </View>
          )}

        {/* FOOTER SPACING */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },

  loadingText: {
    fontSize: 16,
    color: colors.mutedForeground,
  },

  // HERO SECTION
  heroSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.primary,
    gap: spacing.md,
  },

  heroTitle: {
    ...typography.h2,
    color: colors.primaryForeground,
  },

  heroSubtitle: {
    fontSize: 16,
    color: `rgba(255, 255, 255, 0.8)`,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },

  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.foreground,
  },

  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // SECTIONS
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    ...typography.h3,
    color: colors.foreground,
  },

  seeAllLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },

  // PROPERTY TYPES
  propertyTypesContainer: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },

  propertyTypeCard: {
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 100,
  },

  propertyTypeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  propertyTypeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },

  propertyTypeCount: {
    fontSize: 11,
    color: colors.mutedForeground,
  },

  // FEATURED PROPERTIES
  featuredPropertiesContainer: {
    gap: spacing.md,
  },

  // LATEST PROPERTIES
  latestPropertiesContainer: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },

  latestPropertyWrapper: {
    width: 220,
  },

  // LOCATIONS
  locationsContainer: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },

  locationCard: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.muted,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 120,
  },

  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  locationName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },

  locationCitiesCount: {
    fontSize: 12,
    color: colors.mutedForeground,
  },

  // PREMIUM CTA
  premiumCTACard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },

  premiumTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },

  premiumTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryForeground,
  },

  premiumDescription: {
    fontSize: 13,
    color: `rgba(255, 255, 255, 0.8)`,
  },

  // ERROR STATE
  errorContainer: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: `rgba(239, 68, 68, 0.1)`,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.destructive,
  },

  errorText: {
    fontSize: 14,
    color: colors.destructive,
    fontWeight: '500',
  },

  // EMPTY STATE
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },

  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },

  emptyStateDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
  },

  // FOOTER
  footerSpacing: {
    height: spacing.xl,
  },
});
