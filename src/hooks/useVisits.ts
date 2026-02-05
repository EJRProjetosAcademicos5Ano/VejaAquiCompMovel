import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface Visit {
    id: string;
    property_id: string;
    visitor_id: string;
    owner_id: string;
    scheduled_date: string;
    scheduled_time: string;
    status: 'pendente' | 'confirmada' | 'cancelada' | 'concluida';
    notes?: string;
    property?: {
        title: string;
        city: string;
    };
}

export function useVisits({ userId, viewType }: { userId: string, viewType: 'visitor' | 'owner' }) {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVisits = async () => {
            const field = viewType === 'visitor' ? 'visitor_id' : 'owner_id';

            const { data, error } = await supabase
                .from('visits')
                .select('*, property:properties(title, city)')
                .eq(field, userId)
                .order('scheduled_date', { ascending: false });

            if (!error && data) {
                setVisits(data as any);
            }
            setLoading(false);
        };

        if (userId) fetchVisits();
    }, [userId, viewType]);

    return { visits, loading };
}
