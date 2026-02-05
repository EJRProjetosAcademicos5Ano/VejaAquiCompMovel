import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { isValidUUID } from '@/utils/validation';

export type User = {
  id: string;
  email?: string;
  role?: string;
  accountType?: 'proprietario' | 'arrendatario';
} | null;

type AuthContextType = {
  user: User;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, accountType: 'proprietario' | 'arrendatario', name: string) => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  accountType?: 'proprietario' | 'arrendatario';
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        setIsLoading(true);
        console.log('Loading user from session...');
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          console.log('User found:', { userId: data.user.id, metadata: data.user.user_metadata });

          // Fetch role from user_roles
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .maybeSingle();

          if (roleError) console.error('Error fetching role:', roleError);

          // Get account_type from metadata (PRIMARY SOURCE)
          const accountTypeFromMetadata = data.user.user_metadata?.account_type;

          // Fallback: try to fetch from profiles table
          let accountTypeFromProfile = null;
          if (!accountTypeFromMetadata) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('account_type')
              .eq('user_id', data.user.id)
              .maybeSingle();

            if (!profileError) {
              accountTypeFromProfile = profileData?.account_type;
            }
          }

          const finalAccountType = accountTypeFromMetadata || accountTypeFromProfile;
          console.log('Account type resolved:', { accountTypeFromMetadata, accountTypeFromProfile, finalAccountType });

          const u = {
            id: data.user.id,
            email: data.user.email || undefined,
            role: roleData?.role,
            accountType: finalAccountType
          };
          console.log('[AuthContext] User loaded:', { id: u.id, role: u.role, accountType: u.accountType });
          if (mounted) setUser(u);
        } else {
          console.log('No user in session');
          if (mounted) setUser(null);
        }
      } catch (err) {
        console.error('Error fetching auth user:', err);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      loadUser();
    });

    return () => {
      mounted = false;
      if (sub && typeof sub.subscription?.unsubscribe === 'function') {
        sub.subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('SignIn started:', { email });

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Auth signin error:', error);
        throw error;
      }

      const uRaw = data.user;
      if (uRaw) {
        if (!isValidUUID(uRaw.id)) {
          setUser(null);
          throw new Error('Invalid user id');
        }

        console.log('User signed in:', { userId: uRaw.id, metadata: uRaw.user_metadata });

        // Fetch role from user_roles
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', uRaw.id)
          .maybeSingle();

        if (roleError) console.error('Error fetching role:', roleError);

        // Get account_type from metadata (PRIMARY SOURCE)
        const accountTypeFromMetadata = uRaw.user_metadata?.account_type;

        // Fallback: try to fetch from profiles table
        let accountTypeFromProfile = null;
        if (!accountTypeFromMetadata) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('user_id', uRaw.id)
            .maybeSingle();

          if (!profileError) {
            accountTypeFromProfile = profileData?.account_type;
          }
        }

        const finalAccountType = accountTypeFromMetadata || accountTypeFromProfile;
        console.log('Account type resolved:', { accountTypeFromMetadata, accountTypeFromProfile, finalAccountType });

        setUser({
          id: uRaw.id,
          email: uRaw.email || undefined,
          role: roleData?.role,
          accountType: finalAccountType
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, accountType: 'proprietario' | 'arrendatario', name: string) => {
    try {
      setIsLoading(true);
      console.log('SignUp started:', { email, accountType, name });

      // Signup with metadata - MAIS CONFIÁVEL
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            account_type: accountType,
            name: name,
          }
        }
      });

      if (error) {
        console.error('Auth signup error:', error);
        throw error;
      }

      const uRaw = data.user;
      console.log('User created:', { userId: uRaw?.id, metadata: uRaw?.user_metadata });

      if (uRaw) {
        // Also try to save to profiles table as backup (non-critical)
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                user_id: uRaw.id,
                account_type: accountType,
              }
            ]);

          if (profileError) {
            console.warn('Warning creating profile (non-critical):', profileError.message);
            // Try upsert as fallback
            await supabase
              .from('profiles')
              .upsert([
                {
                  user_id: uRaw.id,
                  account_type: accountType,
                }
              ]);
          }
        } catch (profileException) {
          console.warn('Exception creating profile (non-critical):', profileException);
        }

        // Set user from metadata (GARANTIDO que existe)
        setUser({
          id: uRaw.id,
          email: uRaw.email || undefined,
          role: undefined,
          accountType: (uRaw.user_metadata?.account_type as any) || accountType
        });

        console.log('User signed up successfully with accountType:', accountType);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Sign up error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isOwner = (user as any)?.accountType === 'proprietario';
  const currentAccountType = user?.accountType;

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp, isLoading, isAdmin, isOwner, accountType: currentAccountType }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}




