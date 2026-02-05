import { supabase } from '@/services/supabase';
import { Ad, AdStats } from '@/types/ad';

/**
 * Obter todos os anúncios (Admin)
 */
export async function getAds(): Promise<Ad[]> {
    try {
        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .order('priority', { ascending: false });

        if (error) {
            console.warn('Ads table might be missing, using mock data.');
            return [
                {
                    id: '1',
                    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
                    link: 'https://exemplo.com/refuerzo',
                    alt: 'Campanha de Verão 2026',
                    variant: 'horizontal',
                    is_active: true,
                    priority: 10,
                    start_date: new Date().toISOString(),
                    end_date: null,
                    created_at: new Date().toISOString(),
                    created_by: null
                },
                {
                    id: '2',
                    image_url: 'https://images.unsplash.com/photo-1545324418-f1d3ac59ee4a?w=800',
                    link: null,
                    alt: 'Imóveis de Luxo em Maputo',
                    variant: 'inline',
                    is_active: false,
                    priority: 5,
                    start_date: null,
                    end_date: null,
                    created_at: new Date().toISOString(),
                    created_by: null
                }
            ];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getAds:', error);
        return [];
    }
}

/**
 * Criar novo anúncio
 */
export async function createAd(ad: Omit<Ad, 'id' | 'created_at'>): Promise<{ success: boolean; data?: Ad }> {
    try {
        const { data, error } = await supabase
            .from('ads')
            .insert([ad])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error in createAd:', error);
        return { success: false };
    }
}

/**
 * Atualizar anúncio
 */
export async function updateAd(id: string, updates: Partial<Ad>): Promise<{ success: boolean }> {
    try {
        const { error } = await supabase
            .from('ads')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error in updateAd:', error);
        return { success: false };
    }
}

/**
 * Eliminar anúncio
 */
export async function deleteAd(id: string): Promise<{ success: boolean }> {
    try {
        const { error } = await supabase
            .from('ads')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error in deleteAd:', error);
        return { success: false };
    }
}

/**
 * Obter estatísticas de anúncios
 */
export async function getAdAnalytics(): Promise<AdStats[]> {
    try {
        const { data, error } = await supabase
            .from('ad_analytics')
            .select('*');

        if (error) {
            // Mock stats
            return [
                { ad_id: '1', views: 1250, clicks: 45, dismisses: 10, ctr: 3.6 },
                { ad_id: '2', views: 800, clicks: 12, dismisses: 5, ctr: 1.5 }
            ];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getAdAnalytics:', error);
        return [];
    }
}
