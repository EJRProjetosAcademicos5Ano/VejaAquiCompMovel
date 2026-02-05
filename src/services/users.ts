import { supabase } from '@/services/supabase';

export type UserProfile = {
    id: string;
    user_id: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    account_type: 'proprietario' | 'arrendatario' | null;
    email?: string;
    role?: string;
};

/**
 * Obter todos os perfis de usuários com suas roles
 */
export async function getAllUsers(): Promise<UserProfile[]> {
    try {
        // 1. Fetch profiles
        const { data: profiles, error: pError } = await supabase
            .from('profiles')
            .select('*');

        if (pError) throw pError;

        // 2. Fetch roles
        const { data: roles, error: rError } = await supabase
            .from('user_roles')
            .select('user_id, role');

        if (rError) {
            console.warn('Could not fetch roles (might be RLS):', rError);
        }

        // 3. Merge data
        const merged = (profiles || []).map(profile => {
            const roleObj = (roles || []).find(r => r.user_id === profile.user_id);
            return {
                ...profile,
                role: roleObj?.role || 'user'
            };
        });

        return merged;
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return [];
    }
}

/**
 * Atualizar a role de um usuário
 */
export async function updateUserRole(userId: string, role: string): Promise<boolean> {
    try {
        // Upsert role
        const { error } = await supabase
            .from('user_roles')
            .upsert({ user_id: userId, role }, { onConflict: 'user_id' });

        if (error) {
            console.error('Error updating user role:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Exception in updateUserRole:', error);
        return false;
    }
}

/**
 * Buscar usuários por nome ou email
 */
export async function searchUsers(query: string): Promise<UserProfile[]> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('full_name', `%${query}%`);

        if (error) throw error;

        // Fetch roles for these users
        const userIds = (data || []).map(u => u.user_id);
        const { data: roles } = await supabase
            .from('user_roles')
            .select('user_id, role')
            .in('user_id', userIds);

        return (data || []).map(profile => ({
            ...profile,
            role: roles?.find(r => r.user_id === profile.user_id)?.role || 'user'
        }));
    } catch (error) {
        console.error('Error searching users:', error);
        return [];
    }
}
