import { supabase } from './supabase';

export interface Visit {
    id: string;
    property_id: string;
    user_id: string;
    visit_date: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
    property?: any;
}

/**
 * Schedule a visit
 */
export async function scheduleVisit(visitData: {
    property_id: string;
    user_id: string;
    visit_date: string;
}) {
    try {
        const { data, error } = await supabase
            .from('visits')
            .insert([
                {
                    ...visitData,
                    status: 'pending',
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error scheduling visit:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Exception in scheduleVisit:', error);
        return null;
    }
}

/**
 * Get user's scheduled visits
 */
export async function getUserVisits(userId: string): Promise<Visit[]> {
    try {
        const { data, error } = await supabase
            .from('visits')
            .select('*, properties(title, city, province)')
            .eq('user_id', userId)
            .order('visit_date', { ascending: true });

        if (error) {
            console.error('Error fetching user visits:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Exception in getUserVisits:', error);
        return [];
    }
}

/**
 * Get visits for properties owned by target user
 */
export async function getOwnerVisits(ownerId: string): Promise<Visit[]> {
    try {
        const { data, error } = await supabase
            .from('visits')
            .select('*, properties!inner(owner_id, title, city, province)')
            .eq('properties.owner_id', ownerId)
            .order('visit_date', { ascending: true });

        if (error) {
            console.error('Error fetching owner visits:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Exception in getOwnerVisits:', error);
        return [];
    }
}

/**
 * Cancel a visit
 */
export async function cancelVisit(visitId: string) {
    try {
        const { error } = await supabase
            .from('visits')
            .update({ status: 'cancelled' })
            .eq('id', visitId);

        if (error) {
            console.error('Error cancelling visit:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Exception in cancelVisit:', error);
        return false;
    }
}
