import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    SafeAreaView,
    Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { colors, spacing, typography } from '@/utils/theme';

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose }) => {
    const { user, isLoading, signOut, isAdmin, isOwner } = useAuth();
    const { unreadCount } = useUnreadMessages();
    const navigation = useNavigation<any>();

    const handleSignOut = async () => {
        await signOut();
        onClose();
        navigation.navigate('Auth');
    };

    const handleNavigate = (screen: string, params?: any) => {
        onClose();
        navigation.navigate(screen, params);
    };

    const getInitials = (email: string) => {
        if (!email) return 'U';
        return email.slice(0, 2).toUpperCase();
    };

    const mainNavItems = [
        { icon: 'home-outline', label: 'Início', screen: 'HomeTab' },
        { icon: 'search-outline', label: 'Imóveis', screen: 'SearchTab' },
        { icon: 'add-circle-outline', label: 'Novo Anúncio', screen: 'PublishTab' },
        { icon: 'star-outline', label: 'Premium', screen: 'PublishTab' }, // Keep Premium but maybe it leads to same place or a separate one later
        { icon: 'information-circle-outline', label: 'Sobre', screen: 'HomeTab' },
    ];

    const userNavItems = [
        { icon: 'person-outline', label: 'Meu Perfil', screen: 'ProfileTab', params: { screen: 'ProfileMain' } },
        { icon: 'chatbubble-ellipses-outline', label: 'Mensagens', screen: 'ProfileTab', params: { screen: 'Messages' }, badge: unreadCount },
        { icon: 'bookmark-outline', label: 'Buscas Salvas', screen: 'ProfileTab', params: { screen: 'ProfileMain' } }, // Buscas is a tab inside ProfileMain
        { icon: 'settings-outline', label: 'Definições', screen: 'ProfileTab', params: { screen: 'Settings' } },
    ];

    return (
        <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />

                <View style={styles.menuContainer}>
                    <SafeAreaView style={{ flex: 1 }}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.logoRow}>
                                <View style={styles.logoBox}>
                                    <MaterialCommunityIcons name="office-building" size={24} color="#FFF" />
                                </View>
                                <Text style={styles.logoText}>VejaAquí</Text>
                            </View>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={26} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1 }}>
                            {/* User Section */}
                            {user && (
                                <View style={styles.userSection}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{getInitials(user.email || 'U')}</Text>
                                    </View>
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName} numberOfLines={1}>
                                            {user.email?.split('@')[0] || 'Utilizador'}
                                        </Text>
                                        <Text style={styles.userEmail} numberOfLines={1}>
                                            {user.email}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            <ScrollView bounces={false}>
                                {/* Navigation Section */}
                                <View style={styles.navGroup}>
                                    <Text style={styles.groupTitle}>NAVEGAÇÃO</Text>
                                    {mainNavItems.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.navItem}
                                            onPress={() => handleNavigate(item.screen)}
                                        >
                                            <Ionicons name={item.icon as any} size={22} color={colors.mutedForeground} />
                                            <Text style={styles.navLabel}>{item.label}</Text>
                                            <Ionicons name="chevron-forward" size={16} color={colors.border} style={{ marginLeft: 'auto' }} />
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* User Account Section */}
                                {user && (
                                    <>
                                        <View style={styles.separator} />
                                        <View style={styles.navGroup}>
                                            <Text style={styles.groupTitle}>MINHA CONTA</Text>
                                            {userNavItems.map((item, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.navItem}
                                                    onPress={() => handleNavigate(item.screen, item.params)}
                                                >
                                                    <Ionicons name={item.icon as any} size={22} color={colors.mutedForeground} />
                                                    <Text style={styles.navLabel}>{item.label}</Text>
                                                    {item.badge && item.badge > 0 ? (
                                                        <View style={styles.badge}>
                                                            <Text style={styles.badgeText}>{item.badge > 99 ? '99+' : item.badge}</Text>
                                                        </View>
                                                    ) : (
                                                        <Ionicons name="chevron-forward" size={16} color={colors.border} style={{ marginLeft: 'auto' }} />
                                                    )}
                                                </TouchableOpacity>
                                            ))}

                                            {(isAdmin || isOwner) && (
                                                <TouchableOpacity
                                                    style={styles.navItem}
                                                    onPress={() => {
                                                        if (isAdmin) {
                                                            handleNavigate('AdminMode');
                                                        } else {
                                                            console.log('🏠 Navigating to Dashboard from menu');
                                                            onClose();
                                                            navigation.navigate('MainApp', { screen: 'DashboardTab' });
                                                        }
                                                    }}
                                                >
                                                    <MaterialCommunityIcons name="view-dashboard-outline" size={22} color={colors.mutedForeground} />
                                                    <Text style={styles.navLabel}>Dashboard</Text>
                                                    <Ionicons name="chevron-forward" size={16} color={colors.border} style={{ marginLeft: 'auto' }} />
                                                </TouchableOpacity>
                                            )}

                                            {isAdmin && (
                                                <TouchableOpacity
                                                    style={styles.navItem}
                                                    onPress={() => handleNavigate('AdminMode')}
                                                >
                                                    <Ionicons name="shield-checkmark-outline" size={22} color={colors.mutedForeground} />
                                                    <Text style={styles.navLabel}>Administração</Text>
                                                    <Ionicons name="chevron-forward" size={16} color={colors.border} style={{ marginLeft: 'auto' }} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </>
                                )}
                            </ScrollView>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <View style={styles.preferencesRow}>
                                <Text style={styles.footerLabel}>Preferências</Text>
                                <View style={styles.footerActions}>
                                    <TouchableOpacity style={styles.footerIconBtn}>
                                        <Ionicons name="language-outline" size={18} color={colors.mutedForeground} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.footerIconBtn}>
                                        <Ionicons name="moon-outline" size={18} color={colors.mutedForeground} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {!isLoading && (
                                user ? (
                                    <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                                        <Ionicons name="log-out-outline" size={18} color={colors.mutedForeground} />
                                        <Text style={styles.signOutText}>Sair</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.authButtons}>
                                        <TouchableOpacity
                                            style={styles.loginBtn}
                                            onPress={() => handleNavigate('Auth')}
                                        >
                                            <Text style={styles.loginBtnText}>Entrar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.loginBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border }]}
                                            onPress={() => handleNavigate('Auth')}
                                        >
                                            <Text style={[styles.loginBtnText, { color: colors.foreground }]}>Criar Conta</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            )}
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    menuContainer: {
        width: 280,
        height: '100%',
        backgroundColor: colors.background,
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    header: {
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        ...typography.h3,
        fontSize: 20,
        color: colors.foreground,
    },
    userSection: {
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        ...typography.h4,
        color: '#FFF',
        fontSize: 16,
    },
    userInfo: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        ...typography.label,
        fontSize: 15,
        color: colors.foreground,
    },
    userEmail: {
        ...typography.caption,
        color: colors.mutedForeground,
    },
    navGroup: {
        padding: spacing.md,
    },
    groupTitle: {
        ...typography.caption,
        color: colors.mutedForeground,
        fontWeight: '700',
        marginBottom: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 8,
        gap: 12,
    },
    navLabel: {
        ...typography.bodySmall,
        color: colors.foreground,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: spacing.md,
    },
    badge: {
        marginLeft: 'auto',
        backgroundColor: colors.destructive,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.card,
    },
    preferencesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    footerLabel: {
        ...typography.caption,
        color: colors.mutedForeground,
    },
    footerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    footerIconBtn: {
        padding: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
    },
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 8,
        backgroundColor: colors.background,
    },
    signOutText: {
        ...typography.label,
        color: colors.mutedForeground,
    },
    authButtons: {
        gap: 8,
    },
    loginBtn: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    loginBtnText: {
        ...typography.label,
        color: '#FFF',
    },
});
