import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getGlobalStats, getGrowthData, GlobalStats, GrowthPoint } from '@/services/adminReports';
import { colors, spacing, typography } from '@/utils/theme';
import { Card } from '@/components/ui/Card';

const { width } = Dimensions.get('window');

export default function AdminReportsScreen() {
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [growth, setGrowth] = useState<GrowthPoint[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const [s, g] = await Promise.all([getGlobalStats(), getGrowthData()]);
        setStats(s);
        setGrowth(g);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading || !stats) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Métricas Gerais</Text>

            <View style={styles.grid}>
                <Card style={styles.statCard}>
                    <MaterialIcons name="people" size={24} color={colors.primary} />
                    <Text style={styles.statValue}>{stats.totalUsers}</Text>
                    <Text style={styles.statLabel}>Usuários Totais</Text>
                </Card>

                <Card style={styles.statCard}>
                    <MaterialIcons name="home" size={24} color="#10B981" />
                    <Text style={styles.statValue}>{stats.totalProperties}</Text>
                    <Text style={styles.statLabel}>Imóveis Totais</Text>
                </Card>

                <Card style={styles.statCard}>
                    <MaterialIcons name="verified" size={24} color="#3B82F6" />
                    <Text style={styles.statValue}>{stats.activeListings}</Text>
                    <Text style={styles.statLabel}>Anúncios Ativos</Text>
                </Card>

                <Card style={styles.statCard}>
                    <MaterialIcons name="pending-actions" size={24} color="#F59E0B" />
                    <Text style={styles.statValue}>{stats.pendingApprovals}</Text>
                    <Text style={styles.statLabel}>Aguardando Visto</Text>
                </Card>
            </View>

            <Text style={styles.sectionTitle}>Crescimento de Usuários (Últimos 5 Meses)</Text>
            <Card style={styles.chartCard}>
                <View style={styles.chartContainer}>
                    {growth.map((point, index) => {
                        const maxVal = Math.max(...growth.map(p => p.value));
                        const barHeight = (point.value / maxVal) * 150;
                        return (
                            <View key={index} style={styles.barGroup}>
                                <View style={[styles.bar, { height: barHeight }]} />
                                <Text style={styles.barLabel}>{point.label}</Text>
                                <Text style={styles.barValue}>{point.value}</Text>
                            </View>
                        );
                    })}
                </View>
            </Card>

            <Card style={styles.revenueCard}>
                <View style={styles.revenueHeader}>
                    <MaterialIcons name="monetization-on" size={32} color="#10B981" />
                    <View>
                        <Text style={styles.revenueLabel}>Receita Gerada (Total)</Text>
                        <Text style={styles.revenueValue}>{stats.totalRevenue.toLocaleString()} AOA</Text>
                    </View>
                </View>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.md,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        ...typography.h4,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    statCard: {
        width: (width - spacing.md * 3) / 2,
        alignItems: 'center',
        padding: spacing.md,
    },
    statValue: {
        ...typography.h2,
        fontSize: 24,
        marginVertical: 4,
    },
    statLabel: {
        ...typography.caption,
        color: colors.mutedForeground,
    },
    chartCard: {
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: 200,
        paddingTop: 20,
    },
    barGroup: {
        alignItems: 'center',
        width: 40,
    },
    bar: {
        width: 25,
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    barLabel: {
        ...typography.caption,
        marginTop: 8,
        fontWeight: 'bold',
    },
    barValue: {
        fontSize: 10,
        color: colors.primary,
        fontWeight: '700',
        position: 'absolute',
        top: -18,
    },
    revenueCard: {
        marginBottom: spacing.xl,
        padding: spacing.lg,
        backgroundColor: '#ECFDF5',
        borderColor: '#10B981',
    },
    revenueHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    revenueLabel: {
        ...typography.caption,
        color: '#047857',
        fontWeight: '700',
    },
    revenueValue: {
        ...typography.h2,
        color: '#065F46',
    },
});
