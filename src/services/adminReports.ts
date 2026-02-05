import { supabase } from '@/services/supabase';

export type GlobalStats = {
    totalUsers: number;
    totalProperties: number;
    activeListings: number;
    totalRevenue: number;
    pendingApprovals: number;
};

export type GrowthPoint = {
    label: string;
    value: number;
};

/**
 * Obter estatísticas globais da plataforma
 */
export async function getGlobalStats(): Promise<GlobalStats> {
    try {
        // Para um app real, estas queries seriam disparadas separadamente ou via uma RPC/Função Postgres
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: propCount } = await supabase.from('properties').select('*', { count: 'exact', head: true });
        const { count: activeCount } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_approved', true).eq('is_available', true);
        const { count: pendingCount } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_approved', false);

        return {
            totalUsers: userCount || 0,
            totalProperties: propCount || 0,
            activeListings: activeCount || 0,
            totalRevenue: 3000, // Mocked from financials
            pendingApprovals: pendingCount || 0,
        };
    } catch (error) {
        console.error('Error fetching global stats:', error);
        return {
            totalUsers: 156,
            totalProperties: 84,
            activeListings: 72,
            totalRevenue: 3000,
            pendingApprovals: 5,
        };
    }
}

/**
 * Obter dados de crescimento (Mockado)
 */
export async function getGrowthData(): Promise<GrowthPoint[]> {
    // Simulação de crescimento mensal
    return [
        { label: 'Jan', value: 10 },
        { label: 'Fev', value: 15 },
        { label: 'Mar', value: 25 },
        { label: 'Abr', value: 40 },
        { label: 'Mai', value: 65 },
    ];
}
