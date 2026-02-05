/**
 * useHome Hook
 * Gerencia estado e queries para a HomeScreen
 */

import { useEffect, useState, useCallback } from 'react';
import {
  getFeaturedProperties,
  getLatestProperties,
  getPropertiesByType,
  getPropertyTypesCounts,
  getLocations,
} from '../services/properties';
import { Property, Location, PropertyType } from '../types/property';
import { useAuth } from '../context/AuthContext';

const PROPERTY_TYPES: PropertyType[] = [
  {
    id: 'apartamento',
    label: 'Apartamento',
    type: 'apartment',
    icon: 'home',
  },
  { id: 'vivenda', label: 'Vivenda', type: 'villa', icon: 'home-modern' },
  { id: 'loja', label: 'Loja', type: 'shop', icon: 'store' },
  { id: 'terreno', label: 'Terreno', type: 'land', icon: 'tree-outline' },
];

export interface HomeState {
  featuredProperties: Property[];
  latestProperties: Property[];
  propertyTypes: PropertyType[];
  locations: Location[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

export function useHome() {
  const [state, setState] = useState<HomeState>({
    featuredProperties: [],
    latestProperties: [],
    propertyTypes: PROPERTY_TYPES,
    locations: [],
    loading: true,
    error: null,
    refreshing: false,
  });

  const { user } = useAuth();

  const loadData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const userId = require('@/utils/validation').isValidUUID(user?.id) ? user?.id : undefined;

      const [featured, latest, typeCounts, locations] = await Promise.all([
        getFeaturedProperties(6, userId),
        getLatestProperties(8, userId),
        getPropertyTypesCounts(userId),
        getLocations(userId),
      ]);

      // Enriquecer tipos com contagens
      const enrichedTypes = PROPERTY_TYPES.map((type) => {
        const count = typeCounts.find(
          (tc) => tc.property_type === type.type
        )?.count;
        return { ...type, count };
      });

      console.log('Home data loaded:', {
        featured: featured.length,
        latest: latest.length,
        types: enrichedTypes.length,
        locations: locations.length,
      });

      setState((prev) => ({
        ...prev,
        featuredProperties: featured,
        latestProperties: latest,
        propertyTypes: enrichedTypes,
        locations: locations,
        loading: false,
      }));
    } catch (error) {
      console.error('Error loading home data:', error);
      setState((prev) => ({
        ...prev,
        error: 'Erro ao carregar dados. Tente novamente.',
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, refreshing: true }));
    await loadData();
    setState((prev) => ({ ...prev, refreshing: false }));
  }, [loadData]);

  return { ...state, loadData, refresh };
}
