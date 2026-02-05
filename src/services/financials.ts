import { supabase } from '@/services/supabase';

export type Transaction = {
    id: string;
    created_at: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'cancelled';
    type: 'subscription' | 'boost' | 'commission';
    description: string;
    user_id: string;
};

/**
 * Obter histórico financeiro (Admin)
 */
export async function getFinancialTransactions(): Promise<Transaction[]> {
    try {
        const { data, error } = await supabase
            .from('transactions') // Assumindo que esta tabela exista ou será criada
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Transactions table might not exist yet:', error);
            // Return mock data for demonstration if table is missing
            return [
                {
                    id: '1',
                    created_at: new Date().toISOString(),
                    amount: 2500,
                    currency: 'AOA',
                    status: 'completed',
                    type: 'subscription',
                    description: 'Plano Pro - Imobiliária X',
                    user_id: 'user_1'
                },
                {
                    id: '2',
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    amount: 500,
                    currency: 'AOA',
                    status: 'completed',
                    type: 'boost',
                    description: 'Destaque de Imóvel #123',
                    user_id: 'user_2'
                }
            ];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getFinancialTransactions:', error);
        return [];
    }
}

/**
 * Obter estatísticas financeiras rápidas
 */
export async function getFinancialStats() {
    // Simulação de somatórios
    return {
        totalRevenue: 3000,
        pendingWithdrawals: 150,
        commissionRate: 0.1, // 10%
    };
}
