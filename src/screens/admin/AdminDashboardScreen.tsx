import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';

const AdminDashboardScreen = () => {
    const navigation = useNavigation<any>();

    const menuItems = [
        {
            title: 'Verificar Anúncios',
            icon: 'verified-user',
            color: '#F59E0B',
            route: 'AdVerification',
            description: 'Aprovar ou rejeitar novos imóveis'
        },
        {
            title: 'Gestão de Usuários',
            icon: 'people',
            color: '#3B82F6',
            route: 'UserManagement',
            description: 'Gerenciar agentes e permissões'
        },
        {
            title: 'Financeiro',
            icon: 'attach-money',
            color: '#10B981',
            route: 'Financials',
            description: 'Comissões e pagamentos'
        },
        {
            title: 'Moderação',
            icon: 'report-problem',
            color: '#EF4444',
            route: 'Moderation',
            description: 'Conteúdo reportado'
        },
        {
            title: 'Relatórios',
            icon: 'bar-chart',
            color: '#8B5CF6',
            route: 'Reports',
            description: 'Métricas e crescimento'
        },
        {
            title: 'Planos',
            icon: 'star',
            color: '#F97316',
            route: 'SubscriptionPlans',
            description: 'Configurar subscrições'
        },
        {
            title: 'Publicidade',
            icon: 'ads-click',
            color: '#EC4899',
            route: 'AdManagement',
            description: 'Banners e anúncios'
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.primaryForeground} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Painel Administrativo</Text>
            </View>

            <ScrollView contentContainerStyle={styles.grid}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => navigation.navigate(item.route)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                            <MaterialIcons name={item.icon as any} size={32} color={item.color} />
                        </View>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardDescription}>{item.description}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: 50,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: spacing.md,
    },
    headerTitle: {
        ...typography.h3,
        color: colors.primaryForeground,
    },
    grid: {
        padding: spacing.md,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        textAlign: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    cardTitle: {
        ...typography.h4,
        fontSize: 16,
        color: colors.foreground,
        marginBottom: 4,
        textAlign: 'center',
    },
    cardDescription: {
        ...typography.caption,
        color: colors.mutedForeground,
        textAlign: 'center',
    },
});

export default AdminDashboardScreen;
