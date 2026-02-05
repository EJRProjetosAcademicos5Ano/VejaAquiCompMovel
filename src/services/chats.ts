import { supabase } from './supabase';

export interface Chat {
    id: string;
    owner_id: string;
    tenant_id: string;
    property_id: string;
    created_at: string;
    property?: {
        title: string;
        cover_image?: string;
    };
    other_user?: {
        full_name: string;
        avatar_url?: string;
    };
}

/**
 * Start or get an existing chat
 */
export async function getOrCreateChat(ownerId: string, tenantId: string, propertyId: string): Promise<string | null> {
    try {
        // Check if chat already exists
        const { data: existingChat, error: fetchError } = await supabase
            .from('chats')
            .select('id')
            .eq('owner_id', ownerId)
            .eq('tenant_id', tenantId)
            .eq('property_id', propertyId)
            .maybeSingle();

        if (existingChat) return existingChat.id;

        // Create new chat
        const { data: newChat, error: createError } = await supabase
            .from('chats')
            .insert([{ owner_id: ownerId, tenant_id: tenantId, property_id: propertyId }])
            .select('id')
            .single();

        if (createError) {
            console.error('Error creating chat:', createError);
            return null;
        }

        return newChat.id;
    } catch (error) {
        console.error('Exception in getOrCreateChat:', error);
        return null;
    }
}

/**
 * Get all chats for the current user (either as owner or tenant)
 */
export async function getUserChats(userId: string): Promise<Chat[]> {
    try {
        const { data, error } = await supabase
            .from('chats')
            .select(`
        *,
        properties(title, cover_image),
        owner:profiles!owner_id(full_name, avatar_url),
        tenant:profiles!tenant_id(full_name, avatar_url)
      `)
            .or(`owner_id.eq.${userId},tenant_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching chats:', error);
            return [];
        }

        return (data || []).map(chat => ({
            ...chat,
            property: chat.properties,
            other_user: chat.owner_id === userId ? chat.tenant : chat.owner
        }));
    } catch (error) {
        console.error('Exception in getUserChats:', error);
        return [];
    }
}
