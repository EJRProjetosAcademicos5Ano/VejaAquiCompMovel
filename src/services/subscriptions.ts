import { supabase } from '@/services/supabase';

export type SubscriptionPlan = {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    description: string;
    features: string[];
    max_listings: number;
    highlight_listings: number;
};

/**
 * Obter planos de subscrição
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
        const { data, error } = await supabase
            .from('subscription_plans') // Assumindo existência ou mock
            .select('*')
            .order('price', { ascending: true });

        if (error) {
            console.warn('Subscription plans table missing, using mock data.');
            return [
                {
                    id: 'basic',
                    name: 'Básico',
                    price: 0,
                    currency: 'AOA',
                    interval: 'month',
                    description: 'Para quem está a começar.',
                    features: ['Até 2 anúncios', 'Fotos ilimitadas', 'Suporte standard'],
                    max_listings: 2,
                    highlight_listings: 0,
                },
                {
                    id: 'pro',
                    name: 'Pro',
                    price: 5000,
                    currency: 'AOA',
                    interval: 'month',
                    description: 'Melhor para corretores individuais.',
                    features: ['Até 10 anúncios', '2 Destaques incluídos', 'Suporte prioritário'],
                    max_listings: 10,
                    highlight_listings: 2,
                },
                {
                    id: 'agency',
                    name: 'Agência',
                    price: 15000,
                    currency: 'AOA',
                    interval: 'month',
                    description: 'Para imobiliárias com grandes inventários.',
                    features: ['Anúncios ilimitados', '10 Destaques incluídos', 'Gestor de conta'],
                    max_listings: 9999,
                    highlight_listings: 10,
                }
            ];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getSubscriptionPlans:', error);
        return [];
    }
}

/**
 * Atualizar um plano de subscrição
 */
export async function updateSubscriptionPlan(id: string, updates: Partial<SubscriptionPlan>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('subscription_plans')
            .update(updates)
            .eq('id', id);

        if (error) return false;
        return true;
    } catch (error) {
        return false;
    }
}
