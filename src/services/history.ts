import { supabase } from './supabase';
import { Property } from '@/types/property';
import { propertyMapper } from '@/mappers/propertyMapper';

/**
 * Add a property to the user's view history
 */
export async function addToHistory(userId: string, propertyId: string) {
    try {
        const { error } = await supabase
            .from('view_history')
            .upsert(
                { user_id: userId, property_id: propertyId, viewed_at: new Date().toISOString() },
                { onConflict: 'user_id,property_id' }
            );

        if (error) {
            console.error('Error adding to history:', error);
        }
    } catch (error) {
        console.error('Exception in addToHistory:', error);
    }
}

/**
 * Get the user's recently viewed properties
 */
export async function getViewHistory(userId: string, limit: number = 10): Promise<Property[]> {
    try {
        const { data, error } = await supabase
            .from('view_history')
            .select('property_id, properties(*, property_images(*))')
            .eq('user_id', userId)
            .order('viewed_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.warn('View history table not available (non-critical):', error.message);
            return [];
        }

        const properties = (data || [])
            .map((item: any) => {
                if (!item.properties) return null;
                return propertyMapper(item.properties);
            })
            .filter(Boolean) as Property[];

        return properties;
    } catch (error) {
        console.warn('Exception in getViewHistory (non-critical):', error);
        return [];
    }
}
