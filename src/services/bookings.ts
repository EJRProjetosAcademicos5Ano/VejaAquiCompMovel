import { supabase } from './supabase';

export interface Booking {
    id: string;
    property_id: string;
    user_id: string;
    start_date: string;
    end_date?: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
    property?: any;
}

/**
 * Create a booking
 */
export async function createBooking(bookingData: {
    property_id: string;
    user_id: string;
    start_date: string;
    end_date?: string;
    total_price: number;
}) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert([
                {
                    ...bookingData,
                    status: 'confirmed', // Instant confirmation for this MVP
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating booking:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Exception in createBooking:', error);
        return null;
    }
}

/**
 * Get user's bookings
 */
export async function getUserBookings(userId: string): Promise<Booking[]> {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*, properties(title, city, province)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Bookings table not available (non-critical):', error.message);
            return [];
        }

        return data || [];
    } catch (error) {
        console.warn('Exception in getUserBookings (non-critical):', error);
        return [];
    }
}

/**
 * Get bookings for properties owned by target user
 */
export async function getOwnerBookings(ownerId: string): Promise<Booking[]> {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*, properties!inner(owner_id, title, city, province)')
            .eq('properties.owner_id', ownerId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching owner bookings:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Exception in getOwnerBookings:', error);
        return [];
    }
}
