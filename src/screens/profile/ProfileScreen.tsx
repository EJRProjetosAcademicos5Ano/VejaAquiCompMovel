import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';

interface Profile {
  full_name?: string;
  phone?: string;
  account_type?: 'proprietario' | 'arrendatario';
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleOwnerAccess = () => {
    console.log('🏠 Navigating to DashboardTab');
    navigation.navigate('MainApp', { screen: 'DashboardTab' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile?.full_name || 'Usuário'}</Text>
            <Text style={styles.userId}>{user?.email}</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {profile?.account_type === 'proprietario' ? 'Proprietário' : 'Arrendatário'}
              </Text>
            </View>
          </View>
        </View>

        {/* Owner Dashboard Access */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.ownerButton}
            onPress={handleOwnerAccess}
            activeOpacity={0.8}
          >
            <View style={styles.ownerButtonContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="dashboard" size={24} color={colors.primary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.ownerButtonTitle}>Painel do Proprietário</Text>
                <Text style={styles.ownerButtonSubtitle}>
                  Gerir imóveis e visualizar estatísticas
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.mutedForeground} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações da Conta</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Email</Text>
            <Text style={styles.settingValue}>{user?.email}</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Telefone</Text>
            <Text style={styles.settingValue}>{profile?.phone || 'Não informado'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.destructive }]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Terminar Sessão</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  avatarText: {
    color: colors.primaryForeground,
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  userId: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: spacing.xs,
  },
  badgeContainer: {
    backgroundColor: colors.muted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    color: colors.foreground,
    fontWeight: '500',
  },
  ownerButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ownerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  ownerButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  ownerButtonSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  settingItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: spacing.xs,
  },
  settingValue: {
    fontSize: 16,
    color: colors.foreground,
    fontWeight: '500',
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.primaryForeground,
    fontWeight: '600',
    fontSize: 16,
  },
});
