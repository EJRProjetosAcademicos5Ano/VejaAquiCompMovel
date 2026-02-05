import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/context/AuthContext';

export function useUnreadMessages() {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('conversations')
            .select('unread_count')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (!error && data) {
            const total = data.reduce((acc, curr) => acc + (curr.unread_count || 0), 0);
            setUnreadCount(total);
        }
    };

    useEffect(() => {
        fetchUnreadCount();

        const subscription = supabase
            .channel('unread_messages_count')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
                fetchUnreadCount();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    return { unreadCount };
}
