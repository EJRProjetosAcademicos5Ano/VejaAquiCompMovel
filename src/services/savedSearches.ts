import { supabase } from '@/services/supabase';
import { SearchFilters } from '@/types/property';

export interface SavedSearch {
    id: string;
    user_id: string;
    name: string;
    filters: SearchFilters;
    created_at: string;
}

/**
 * Obter buscas salvas do usuário
 */
export async function getSavedSearches(userId: string): Promise<SavedSearch[]> {
    try {
        const { data, error } = await supabase
            .from('saved_searches')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Saved searches table might be missing.');
            return [];
        }
        return data || [];
    } catch (error) {
        console.error('Error in getSavedSearches:', error);
        return [];
    }
}

/**
 * Salvar uma nova busca
 */
export async function saveSearch(userId: string, name: string, filters: SearchFilters): Promise<{ success: boolean; data?: SavedSearch }> {
    try {
        const { data, error } = await supabase
            .from('saved_searches')
            .insert([{ user_id: userId, name, filters }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error in saveSearch:', error);
        return { success: false };
    }
}

/**
 * Eliminar busca salva
 */
export async function deleteSavedSearch(id: string): Promise<{ success: boolean }> {
    try {
        const { error } = await supabase
            .from('saved_searches')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error in deleteSavedSearch:', error);
        return { success: false };
    }
}
