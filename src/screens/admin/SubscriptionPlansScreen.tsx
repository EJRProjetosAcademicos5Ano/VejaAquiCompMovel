import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getSubscriptionPlans, SubscriptionPlan } from '@/services/subscriptions';
import { colors, spacing, typography } from '@/utils/theme';
import { Card } from '@/components/ui/Card';

export default function SubscriptionPlansScreen() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPlans = async () => {
        setLoading(true);
        const data = await getSubscriptionPlans();
        setPlans(data);
        setLoading(false);
    };

    useEffect(() => {
        loadPlans();
    }, []);

    const handleEditPlan = (plan: SubscriptionPlan) => {
        Alert.alert('Editar Plano', `Funcionalidade para editar o plano ${plan.name} em breve.`);
    };

    const renderItem = ({ item }: { item: SubscriptionPlan }) => (
        <Card style={styles.card}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.planName}>{item.name}</Text>
                    <Text style={styles.planPrice}>
                        {item.price === 0 ? 'Grátis' : `${item.price.toLocaleString()} ${item.currency}/${item.interval === 'month' ? 'mês' : 'ano'}`}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => handleEditPlan(item)}>
                    <MaterialIcons name="edit" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.featuresContainer}>
                {item.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                        <MaterialIcons name="check" size={16} color="#10B981" />
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.limitInfo}>
                <MaterialIcons name="info-outline" size={14} color={colors.mutedForeground} />
                <Text style={styles.limitText}>
                    Limite de {item.max_listings === 9999 ? 'Ilimitados' : item.max_listings} anúncios
                </Text>
            </View>
        </Card>
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
            <FlatList
                data={plans}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Planos de Subscrição</Text>
                        <Text style={styles.headerSubtitle}>Gerencie as ofertas e limites da plataforma</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    list: {
        padding: spacing.md,
    },
    headerTitleContainer: {
        marginBottom: spacing.lg,
    },
    headerTitle: {
        ...typography.h3,
        color: colors.foreground,
    },
    headerSubtitle: {
        ...typography.body,
        color: colors.mutedForeground,
    },
    card: {
        marginBottom: spacing.md,
        padding: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    planName: {
        ...typography.h4,
        fontSize: 18,
        color: colors.foreground,
    },
    planPrice: {
        ...typography.h3,
        color: colors.primary,
        fontSize: 20,
        marginTop: 2,
    },
    description: {
        ...typography.body,
        color: colors.mutedForeground,
        marginBottom: spacing.md,
    },
    featuresContainer: {
        gap: 8,
        marginBottom: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    featureText: {
        ...typography.body,
        fontSize: 14,
    },
    limitInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    limitText: {
        ...typography.caption,
        fontSize: 12,
        color: colors.mutedForeground,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
