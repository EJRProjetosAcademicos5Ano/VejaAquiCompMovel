import { supabase } from './supabase';

export interface Message {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    created_at: string;
}

/**
 * Send a message
 */
export async function sendMessage(chatId: string, senderId: string, content: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('messages')
            .insert([{ chat_id: chatId, sender_id: senderId, content }]);

        if (error) {
            console.error('Error sending message:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Exception in sendMessage:', error);
        return false;
    }
}

/**
 * Get messages for a chat
 */
export async function getMessages(chatId: string): Promise<Message[]> {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Exception in getMessages:', error);
        return [];
    }
}

/**
 * Subscribe to new messages in a chat
 */
export function subscribeToMessages(chatId: string, callback: (message: Message) => void) {
    return supabase
        .channel(`chat:${chatId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `chat_id=eq.${chatId}`,
            },
            (payload) => callback(payload.new as Message)
        )
        .subscribe();
}
