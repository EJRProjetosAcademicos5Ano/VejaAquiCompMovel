import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/context/AuthContext';

export interface Conversation {
    id: string;
    sender_id: string;
    receiver_id: string;
    last_message: string;
    unread_count: number;
    updated_at: string;
    user_name?: string; // Derived from joining profiles
    avatar_url?: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

export function useMessages() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = useCallback(async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching conversations:', error);
            setLoading(false);
            return;
        }

        const convs = data || [];
        if (convs.length === 0) {
            setConversations([]);
            setLoading(false);
            return;
        }

        // Fetch profiles for all unique participants other than the current user
        const otherUserIds = Array.from(new Set(
            convs.map(c => c.sender_id === user.id ? c.receiver_id : c.sender_id)
        ));

        const { data: profiles, error: pError } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url')
            .in('user_id', otherUserIds);

        if (pError) {
            console.warn('Could not fetch profiles for conversations:', pError);
        }

        // Merge profiles into conversations
        const enriched = convs.map(c => {
            const otherId = c.sender_id === user.id ? c.receiver_id : c.sender_id;
            const profile = profiles?.find(p => p.user_id === otherId);
            return {
                ...c,
                user_name: profile?.full_name || 'Utilizador',
                avatar_url: profile?.avatar_url
            };
        });

        setConversations(enriched);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchConversations();

        // Subscribe to changes
        const subscription = supabase
            .channel('conversations_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
                fetchConversations();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user, fetchConversations]);

    return { conversations, loading, refresh: fetchConversations };
}

export function useChat(conversationId: string) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!conversationId) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data || []);
            }
            setLoading(false);
        };

        fetchMessages();

        // Subscribe to new messages
        const subscription = supabase
            .channel(`chat_${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message]);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [conversationId]);

    const sendMessage = async (content: string) => {
        if (!user || !content.trim()) return;

        const { error } = await supabase
            .from('messages')
            .insert([
                {
                    conversation_id: conversationId,
                    sender_id: user.id,
                    content,
                    is_read: false
                }
            ]);

        if (error) {
            console.error('Error sending message:', error);
            return false;
        }
        return true;
    };

    return { messages, loading, sendMessage };
}
