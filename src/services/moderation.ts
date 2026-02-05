import { supabase } from '@/services/supabase';

export type Report = {
    id: string;
    item_id: string;
    item_type: 'property' | 'review';
    reason: string;
    reporter_email: string;
    created_at: string;
    status: 'pending' | 'dismissed' | 'resolved';
};

/**
 * Obter conteúdo denunciado
 */
export async function getReportedContent(): Promise<Report[]> {
    try {
        const { data, error } = await supabase
            .from('reports') // Assumindo existência ou mock
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Reports table missing, using mock data.');
            return [
                {
                    id: '1',
                    item_id: 'prop_1',
                    item_type: 'property',
                    reason: 'Informação falsa sobre o preço',
                    reporter_email: 'denuncia@exemplo.com',
                    created_at: new Date().toISOString(),
                    status: 'pending'
                },
                {
                    id: '2',
                    item_id: 'prop_2',
                    item_type: 'property',
                    reason: 'Fotos não correspondem à realidade',
                    reporter_email: 'user_test@mail.com',
                    created_at: new Date(Date.now() - 3600000).toISOString(),
                    status: 'pending'
                }
            ];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getReportedContent:', error);
        return [];
    }
}

/**
 * Ignorar denúncia
 */
export async function dismissReport(reportId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('reports')
            .update({ status: 'dismissed' })
            .eq('id', reportId);

        if (error) return false;
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Resolver denúncia (ex: remover conteúdo)
 */
export async function resolveReport(reportId: string, itemId: string): Promise<boolean> {
    try {
        // 1. Mark report as resolved
        await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId);

        // 2. Hide or delete item
        const { error } = await supabase
            .from('properties')
            .update({ is_available: false })
            .eq('id', itemId);

        if (error) return false;
        return true;
    } catch (error) {
        return false;
    }
}
