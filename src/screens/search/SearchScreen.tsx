/**
 * SearchScreen
 * Busca e filtro de propriedades conectado ao Supabase
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { searchProperties } from '@/services/properties';
import type { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import { colors, spacing } from '@/utils/theme';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/context/AuthContext';
import FiltersModal from '@/components/search/FiltersModal';
import SaveSearchModal from '@/components/search/SaveSearchModal';

interface SearchScreenProps {
  navigation: any;
  route?: any;
}

export default function SearchScreen({ navigation, route }: SearchScreenProps) {
  const [query, setQuery] = React.useState<string>(route?.params?.query || '');
  const [filters, setFilters] = React.useState(route?.params?.filters || {});
  const [results, setResults] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const { user } = useAuth();

  const QUICK_TYPES = [
    { label: 'Todos', value: null },
    { label: 'Apartamento', value: 'apartment' },
    { label: 'Vivenda', value: 'villa' },
    { label: 'Loja', value: 'shop' },
    { label: 'Terreno', value: 'land' },
  ];

  const handleTypePress = (type: string | null) => {
    setFilters((prev: any) => ({
      ...prev,
      property_type: type || undefined,
    }));
  };

  // Sync route params when they change
  useEffect(() => {
    if (route?.params?.filters) {
      setFilters(route.params.filters);
    }
    if (route?.params?.query) {
      setQuery(route.params.query);
    }
  }, [route?.params]);

  useEffect(() => {
    performSearch();
  }, [filters, query, user?.id]);

  async function performSearch() {
    setLoading(true);
    try {
      const searchFilters = {
        query: query || undefined,
        ...filters,
        limit: 20,
      };

      const data = await searchProperties(searchFilters, user?.id);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await performSearch();
    setRefreshing(false);
  }

  const handleSearchSubmit = async () => {
    await performSearch();
  };

  const handlePropertyPress = (propertyId: string) => {
    navigation.navigate('PropertyDetail', { propertyId });
  };

  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoritePress = (propertyId: string) => {
    toggleFavorite(propertyId);
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <PropertyCard
      property={item}
      onPress={handlePropertyPress}
      onFavoritePress={handleFavoritePress}
      isFavorite={isFavorite(item.id)}
      size="medium"
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputWrapper}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.mutedForeground}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar propriedades..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearchSubmit}
          />
          {query && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          )}
        </View>
        {/* 
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <MaterialCommunityIcons name="tune-variant" size={24} color={colors.primary} />
          <Text style={styles.filterButtonText}>Filtros</Text>
        </TouchableOpacity> 
       */}
      </View>

      {/* 
      <FiltersModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        initialFilters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
      /> 
      */}

      {user && (
        <SaveSearchModal
          visible={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          filters={filters}
          userId={user.id}
        />
      )}

      <View style={styles.quickFiltersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickFiltersContent}>
          {QUICK_TYPES.map((type) => {
            const isActive = filters.property_type === type.value || (!filters.property_type && type.value === null);
            return (
              <TouchableOpacity
                key={type.label}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => handleTypePress(type.value)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Pesquisando imóveis...</Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="home-search"
            size={48}
            color={colors.mutedForeground}
          />
          <Text style={styles.emptyTitle}>Nenhum imóvel encontrado nesta categoria</Text>
          <Text style={styles.emptyText}>
            Ainda não existem anúncios para este tipo de imóvel ou localização.
          </Text>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => navigation.navigate('PublishTab')}
          >
            <Text style={styles.clearFiltersText}>Seja o primeiro a publicar!</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 
      {user && Object.keys(filters).length > 0 && (
        <TouchableOpacity
          style={styles.saveSearchFAB}
          onPress={() => setShowSaveModal(true)}
        >
          <MaterialCommunityIcons name="bookmark-outline" size={24} color="#FFF" />
          <Text style={styles.saveSearchText}>Salvar Busca</Text>
        </TouchableOpacity>
      )} 
      */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchBarContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },

  searchInput: {
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.foreground,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingLeft: spacing.md,
  },
  filterButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  saveSearchFAB: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    gap: spacing.sm,
  },
  saveSearchText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  clearFiltersButton: {
    marginTop: spacing.md,
    padding: spacing.md,
  },
  clearFiltersText: {
    color: colors.primary,
    fontWeight: '600',
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

  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },

  emptyText: {
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  quickFiltersContainer: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  quickFiltersContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
});
