import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { getMyProperties } from '@/services/properties';
import { Property } from '@/types/property';
import { MaterialIcons } from '@expo/vector-icons';
import { getOwnerVisits, Visit } from '@/services/visits';
import { getOwnerBookings, Booking } from '@/services/bookings';

export default function OwnerStatsScreen() {
    const { user } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        const [props, vsts, bks] = await Promise.all([
            getMyProperties(user.id),
            getOwnerVisits(user.id),
            getOwnerBookings(user.id)
        ]);
        setProperties(props);
        setVisits(vsts);
        setBookings(bks);
        setLoading(false);
    };

    const totalViews = properties.reduce((acc, curr) => acc + (curr.views_count || 0), 0);
    const avgViews = properties.length ? Math.round(totalViews / properties.length) : 0;

    // Sort by views
    const topProperties = [...properties]
        .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
        .slice(0, 5);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.headerTitle}>Relatórios de Desempenho</Text>

                {/* Key Metrics */}
                <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                        <MaterialIcons name="visibility" size={24} color={colors.primary} />
                        <Text style={styles.metricValue}>{totalViews}</Text>
                        <Text style={styles.metricLabel}>Total de Visualizações</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <MaterialIcons name="trending-up" size={24} color={colors.success} />
                        <Text style={[styles.metricValue, { color: colors.success }]}>{avgViews}</Text>
                        <Text style={styles.metricLabel}>Média por Imóvel</Text>
                    </View>
                </View>

                {/* Additional Metrics */}
                <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                        <MaterialIcons name="event" size={24} color={colors.warning} />
                        <Text style={[styles.metricValue, { color: colors.warning }]}>{visits.length}</Text>
                        <Text style={styles.metricLabel}>Visitas Agendadas</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <MaterialIcons name="book" size={24} color={colors.info} />
                        <Text style={[styles.metricValue, { color: colors.info }]}>{bookings.length}</Text>
                        <Text style={styles.metricLabel}>Reservas Confirmadas</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Imóveis Mais Populares</Text>

                <View style={styles.chartContainer}>
                    {topProperties.map((prop, index) => {
                        const percentage = totalViews > 0 ? ((prop.views_count || 0) / totalViews) * 100 : 0;
                        return (
                            <View key={prop.id} style={styles.chartRow}>
                                <Text style={styles.chartLabel} numberOfLines={1}>
                                    {index + 1}. {prop.title}
                                </Text>
                                <View style={styles.barContainer}>
                                    <View style={[styles.bar, { width: `${percentage}%` }]} />
                                    <Text style={styles.barValue}>{prop.views_count || 0}</Text>
                                </View>
                            </View>
                        );
                    })}
                    {topProperties.length === 0 && (
                        <Text style={styles.emptyText}>Sem dados suficientes para exibir estatísticas.</Text>
                    )}
                </View>

                <View style={styles.tipBox}>
                    <Text style={styles.tipTitle}>Como melhorar suas métricas?</Text>
                    <Text style={styles.tipText}>• Adicione fotos de alta qualidade</Text>
                    <Text style={styles.tipText}>• Escreva descrições detalhadas</Text>
                    <Text style={styles.tipText}>• Mantenha o preço competitivo</Text>
                    <Text style={styles.tipText}>• Renove seus anúncios semanalmente</Text>
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: spacing.lg,
    },
    headerTitle: {
        ...typography.h2,
        marginBottom: spacing.lg,
        color: colors.foreground,
    },
    metricsGrid: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    metricCard: {
        flex: 1,
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.primary,
        marginVertical: 8,
    },
    metricLabel: {
        fontSize: 12,
        color: colors.mutedForeground,
        textAlign: 'center',
    },
    sectionTitle: {
        ...typography.h4,
        marginBottom: spacing.md,
        color: colors.foreground,
    },
    chartContainer: {
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.xl,
    },
    chartRow: {
        marginBottom: spacing.md,
    },
    chartLabel: {
        fontSize: 14,
        color: colors.foreground,
        marginBottom: 4,
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bar: {
        height: 8,
        backgroundColor: colors.primary,
        borderRadius: 4,
        minWidth: 4,
    },
    barValue: {
        fontSize: 12,
        color: colors.mutedForeground,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        color: colors.mutedForeground,
        padding: spacing.lg,
    },
    tipBox: {
        backgroundColor: colors.muted,
        padding: spacing.lg,
        borderRadius: 12,
    },
    tipTitle: {
        fontWeight: 'bold',
        marginBottom: spacing.sm,
        color: colors.foreground,
    },
    tipText: {
        color: colors.mutedForeground,
        marginBottom: 4,
        fontSize: 14,
    },
});
