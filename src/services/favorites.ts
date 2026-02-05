import { supabase } from '@/services/supabase';

export async function getUserFavoriteIds(userId?: string): Promise<string[]> {
  try {
    if (!userId || !require('@/utils/validation').isValidUUID(userId)) return [];

    const { data, error } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', userId);

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('Supabase data (getUserFavoriteIds):', data);
      console.log('Supabase error (getUserFavoriteIds):', error);
    }

    if (error) throw error;

    return (data || []).map((row: any) => row.property_id);
  } catch (err) {
    console.error('Error fetching user favorites:', err);
    return [];
  }
}

export async function addFavorite(userId: string, propertyId: string) {
  try {
    if (!userId || !require('@/utils/validation').isValidUUID(userId)) throw new Error('Invalid user id');

    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, property_id: propertyId }])
      .select()
      .single();

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('Supabase data (addFavorite):', data);
      console.log('Supabase error (addFavorite):', error);
    }

    if (error) throw error;

    return data;
  } catch (err) {
    console.error('Error adding favorite:', err);
    throw err;
  }
}

export async function removeFavorite(userId: string, propertyId: string) {
  try {
    if (!userId || !require('@/utils/validation').isValidUUID(userId)) throw new Error('Invalid user id');

    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('Supabase data (removeFavorite):', data);
      console.log('Supabase error (removeFavorite):', error);
    }

    if (error) throw error;

    return data;
  } catch (err) {
    console.error('Error removing favorite:', err);
    throw err;
  }
}