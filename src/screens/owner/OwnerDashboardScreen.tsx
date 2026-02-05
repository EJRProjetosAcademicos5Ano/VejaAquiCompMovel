import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { Property } from '@/types/property';
import { getMyProperties } from '@/services/properties';

export default function OwnerDashboardScreen() {
    const navigation = useNavigation<any>();
    const { user, isAdmin } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalViews: 0,
        activeListings: 0,
        totalListings: 0,
    });

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            if (user?.id) {
                fetchData();
            }
        }, [user?.id])
    );

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // [AUTO-FIX] Try to fix user properties automatically on load
            const { fixPropertyValues } = require('@/services/properties');
            await fixPropertyValues(user.id);

            const data = await getMyProperties(user.id, isAdmin);
            setProperties(data || []);

            // Calculate stats
            const totalViews = (data || []).reduce((acc, curr) => acc + (curr.views_count || 0), 0);
            const activeListings = (data || []).filter(p => p.is_available).length;

            setStats({
                totalViews,
                activeListings,
                totalListings: (data || []).length,
            });
        } catch (error) {
            console.warn('Warning fetching dashboard data (non-critical):', error);
            // Dashboard still renders with empty data
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        {
            title: 'Novo Anúncio',
            icon: 'add-circle',
            color: colors.primary,
            onPress: () => navigation.navigate('EditProperty'),
        },
        {
            title: 'Meus Anúncios',
            icon: 'list',
            color: colors.info,
            onPress: () => navigation.navigate('MyProperties'),
        },
        {
            title: 'Disponibilidade',
            icon: 'event',
            color: colors.warning,
            onPress: () => navigation.navigate('PropertyCalendar', { propertyId: properties[0]?.id }), // Link to first or picker
        },
        {
            title: 'Estatísticas',
            icon: 'bar-chart',
            color: colors.success,
            onPress: () => navigation.navigate('OwnerStats'),
        },
        {
            title: 'Conversas',
            icon: 'chat',
            color: colors.secondary,
            onPress: () => navigation.navigate('ContactList'),
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
            >
                <Text style={styles.greeting}>Olá, Proprietário</Text>
                <Text style={styles.subtitle}>Gerencie seus imóveis de forma simples</Text>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{stats.activeListings}</Text>
                        <Text style={styles.statLabel}>Anúncios Ativos</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{stats.totalViews}</Text>
                        <Text style={styles.statLabel}>Visualizações Totais</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{stats.totalListings}</Text>
                        <Text style={styles.statLabel}>Total Imóveis</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Acesso Rápido</Text>

                <View style={styles.menuGrid}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, { backgroundColor: item.color + '10' }]}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                                <MaterialIcons name={item.icon as any} size={32} color={item.color} />
                            </View>
                            <Text style={[styles.menuTitle, { color: item.color }]}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Properties - Quick Edit Section */}
                {properties.length > 0 && (
                    <View>
                        <View style={styles.sectionHeaderWithAction}>
                            <Text style={styles.sectionTitle}>Imóveis Recentes</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('MyProperties')}>
                                <Text style={styles.viewAllLink}>Ver todos</Text>
                            </TouchableOpacity>
                        </View>
                        {properties.slice(0, 2).map((property) => (
                            <View key={property.id} style={styles.recentPropertyCard}>
                                <View style={styles.recentPropertyContent}>
                                    <Text style={styles.recentPropertyTitle} numberOfLines={1}>{property.title}</Text>
                                    <Text style={styles.recentPropertyPrice}>
                                        {property.price.toLocaleString('pt-MZ')} MT
                                    </Text>
                                    <View style={styles.recentPropertyActions}>
                                        <TouchableOpacity
                                            style={styles.recentActionButton}
                                            onPress={() => {
                                                console.log('📝 Navigating to edit property:', property.id);
                                                navigation.navigate('EditProperty', { propertyId: property.id });
                                            }}
                                        >
                                            <MaterialIcons name="edit" size={16} color={colors.primary} />
                                            <Text style={[styles.recentActionText, { color: colors.primary }]}>Editar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Recent Activity or Tips could go here */}
                <View style={styles.tipsContainer}>
                    <View style={styles.tipHeader}>
                        <MaterialIcons name="lightbulb" size={20} color={colors.warning} />
                        <Text style={styles.tipTitle}>Dica de Sucesso</Text>
                    </View>
                    <Text style={styles.tipText}>
                        Imóveis com mais de 5 fotos e descrição detalhada recebem 3x mais visualizações.
                        Atualize seus anúncios hoje!
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
    },
    greeting: {
        ...typography.h2,
        color: colors.foreground,
        marginBottom: 4,
    },
    subtitle: {
        ...typography.body,
        color: colors.mutedForeground,
        marginBottom: spacing.xl,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
        gap: spacing.sm,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        ...typography.caption,
        color: colors.mutedForeground,
        textAlign: 'center',
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.foreground,
        marginBottom: spacing.md,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    menuItem: {
        width: '47%',
        padding: spacing.lg,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuTitle: {
        ...typography.label,
        fontSize: 14,
        fontWeight: '600',
    },
    sectionHeaderWithAction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        marginTop: spacing.lg,
    },
    viewAllLink: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    recentPropertyCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    recentPropertyContent: {
        gap: spacing.sm,
    },
    recentPropertyTitle: {
        ...typography.label,
        color: colors.foreground,
        fontWeight: '600',
    },
    recentPropertyPrice: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    recentPropertyActions: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    recentActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: colors.primary + '10',
    },
    recentActionText: {
        fontSize: 12,
        fontWeight: '600',
    },
    tipsContainer: {
        backgroundColor: colors.warning + '10',
        padding: spacing.lg,
        borderRadius: 12,
        marginTop: spacing.xl,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    tipTitle: {
        ...typography.label,
        color: colors.warning,
    },
    tipText: {
        ...typography.bodySmall,
        color: colors.foreground,
        lineHeight: 20,
    },
});
