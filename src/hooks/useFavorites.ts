import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import * as favoritesService from '@/services/favorites';
import { Alert } from 'react-native';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const ids = await favoritesService.getUserFavoriteIds(user.id);
      setFavorites(new Set(ids));
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorite = useCallback(
    (propertyId: string) => {
      return favorites.has(propertyId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      if (!user) {
        Alert.alert('Atenção', 'Você precisa entrar para favoritar um imóvel');
        return;
      }

      const currentlyFav = favorites.has(propertyId);

      // Optimistic update
      setFavorites(prev => {
        const next = new Set(prev);
        if (currentlyFav) next.delete(propertyId);
        else next.add(propertyId);
        return next;
      });

      try {
        if (currentlyFav) {
          await favoritesService.removeFavorite(user.id, propertyId);
        } else {
          await favoritesService.addFavorite(user.id, propertyId);
        }
      } catch (err) {
        // Revert on error
        setFavorites(prev => {
          const next = new Set(prev);
          if (currentlyFav) next.add(propertyId);
          else next.delete(propertyId);
          return next;
        });
        Alert.alert('Erro', 'Não foi possível atualizar favoritos. Tente novamente.');
      }
    },
    [user, favorites]
  );

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refresh: loadFavorites,
  };
}
