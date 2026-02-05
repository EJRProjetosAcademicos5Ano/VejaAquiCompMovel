import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getFinancialTransactions, getFinancialStats, Transaction } from '@/services/financials';
import { colors, spacing, typography } from '@/utils/theme';
import { Card } from '@/components/ui/Card';

export default function FinancialScreen() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState({ totalRevenue: 0, pendingWithdrawals: 0, commissionRate: 0.1 });
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const [txData, statsData] = await Promise.all([
            getFinancialTransactions(),
            getFinancialStats()
        ]);
        setTransactions(txData);
        setStats(statsData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <View style={styles.txItem}>
            <View style={styles.txIcon}>
                <MaterialIcons
                    name={item.type === 'subscription' ? 'card-membership' : 'trending-up'}
                    size={24}
                    color={colors.primary}
                />
            </View>
            <View style={styles.txContent}>
                <Text style={styles.txTitle}>{item.description}</Text>
                <Text style={styles.txDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <View style={styles.txAmount}>
                <Text style={styles.amountText}>+{item.amount.toLocaleString()} {item.currency}</Text>
                <Text style={[styles.statusText, { color: item.status === 'completed' ? '#10B981' : '#F59E0B' }]}>
                    {item.status.toUpperCase()}
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.statsContainer}>
                <Card style={styles.statsCard}>
                    <Text style={styles.statsLabel}>Receita Total</Text>
                    <Text style={styles.statsValue}>{stats.totalRevenue.toLocaleString()} AOA</Text>
                </Card>
                <Card style={styles.statsCard}>
                    <Text style={styles.statsLabel}>Taxa de Comissão</Text>
                    <Text style={styles.statsValue}>{(stats.commissionRate * 100).toFixed(0)}%</Text>
                </Card>
            </View>

            <Text style={styles.sectionTitle}>Histórico de Transações</Text>
            <FlatList
                data={transactions}
                renderItem={renderTransaction}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação registrada.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.md,
    },
    statsCard: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.md,
    },
    statsLabel: {
        ...typography.caption,
        color: colors.mutedForeground,
        marginBottom: 4,
    },
    statsValue: {
        ...typography.h3,
        color: colors.primary,
    },
    sectionTitle: {
        ...typography.h4,
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    list: {
        paddingHorizontal: spacing.md,
    },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    txIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    txContent: {
        flex: 1,
    },
    txTitle: {
        ...typography.h4,
        fontSize: 14,
    },
    txDate: {
        ...typography.caption,
        color: colors.mutedForeground,
    },
    txAmount: {
        alignItems: 'flex-end',
    },
    amountText: {
        ...typography.h4,
        fontSize: 14,
        color: '#10B981',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: colors.mutedForeground,
    },
});
