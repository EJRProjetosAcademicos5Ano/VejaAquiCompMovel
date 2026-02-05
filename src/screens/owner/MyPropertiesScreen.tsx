import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { getMyProperties, deleteProperty, renewProperty } from '@/services/properties';
import { Property } from '@/types/property';

export default function MyPropertiesScreen() {
    const navigation = useNavigation<any>();
    const { user, isAdmin } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getMyProperties(user.id, isAdmin);
            setProperties(data);
        } catch (error) {
            console.error('Error fetching properties:', error);
            Alert.alert('Erro', 'Não foi possível carregar seus imóveis.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (user?.id) {
                fetchData();
            }
        }, [user?.id])
    );

    const handleDelete = (id: string, title: string) => {
        Alert.alert(
            'Confirmar Exclusão',
            `Tem certeza que deseja excluir o anúncio "${title}"? esta ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        setActionLoading(id);
                        const success = await deleteProperty(id);
                        setActionLoading(null);
                        if (success) {
                            setProperties(prev => prev.filter(p => p.id !== id));
                            Alert.alert('Sucesso', 'Anúncio excluído com sucesso.');
                        } else {
                            Alert.alert('Erro', 'Falha ao excluir anúncio.');
                        }
                    },
                },
            ]
        );
    };

    const handleRenew = async (id: string) => {
        setActionLoading(id);
        const success = await renewProperty(id);
        setActionLoading(null);
        if (success) {
            Alert.alert('Sucesso', 'Anúncio renovado! Agora ele aparecerá no topo das buscas.');
            fetchData(); // Refresh to update order or indicators
        } else {
            Alert.alert('Erro', 'Falha ao renovar anúncio.');
        }
    };

    const renderItem = ({ item }: { item: Property }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Image
                    source={{ uri: item.cover_image || item.images?.[0] || 'https://via.placeholder.com/100' }}
                    style={styles.image}
                />
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.price}>
                        {item.price.toLocaleString('pt-MZ')} MT
                        {item.rental_duration && <Text style={styles.duration}>/{item.rental_duration}</Text>}
                    </Text>
                    <View style={styles.statusRow}>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: item.is_available ? colors.success + '20' : colors.muted }
                        ]}>
                            <Text style={[
                                styles.statusText,
                                { color: item.is_available ? colors.success : colors.mutedForeground }
                            ]}>
                                {item.is_available ? 'Ativo' : 'Indisponível'}
                            </Text>
                        </View>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: item.is_approved ? colors.info + '20' : colors.warning + '20' }
                        ]}>
                            <Text style={[
                                styles.statusText,
                                { color: item.is_approved ? colors.info : colors.warning }
                            ]}>
                                {item.is_approved ? 'Aprovado' : 'Em Análise'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('EditProperty', { propertyId: item.id })}
                >
                    <MaterialIcons name="edit" size={20} color={colors.primary} />
                    <Text style={[styles.actionText, { color: colors.primary }]}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.calendarButton]}
                    onPress={() => navigation.navigate('PropertyCalendar', { propertyId: item.id })}
                >
                    <MaterialIcons name="event" size={20} color={colors.warning} />
                    <Text style={[styles.actionText, { color: colors.warning }]}>Agenda</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.renewButton]}
                    onPress={() => handleRenew(item.id)}
                    disabled={actionLoading === item.id}
                >
                    {actionLoading === item.id ? (
                        <ActivityIndicator size="small" color={colors.success} />
                    ) : (
                        <>
                            <MaterialIcons name="autorenew" size={20} color={colors.success} />
                            <Text style={[styles.actionText, { color: colors.success }]}>Renovar</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item.id, item.title)}
                    disabled={actionLoading === item.id}
                >
                    {actionLoading === item.id ? (
                        <ActivityIndicator size="small" color={colors.destructive} />
                    ) : (
                        <>
                            <MaterialIcons name="delete" size={20} color={colors.destructive} />
                            <Text style={[styles.actionText, { color: colors.destructive }]}>Excluir</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {properties.length === 0 && !loading ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="home-work" size={64} color={colors.muted} />
                    <Text style={styles.emptyTitle}>Você ainda não tem anúncios</Text>
                    <Text style={styles.emptySubtitle}>Comece a anunciar seus imóveis agora mesmo.</Text>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => navigation.navigate('EditProperty')}
                    >
                        <Text style={styles.createButtonText}>Criar Anúncio</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={properties}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
                />
            )}

            {/* Floating Action Button */}
            {properties.length > 0 && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('EditProperty')}
                >
                    <MaterialIcons name="add" size={28} color="#FFF" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: 80, // Space for FAB
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 12,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        padding: spacing.md,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: colors.muted,
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
        justifyContent: 'center',
    },
    title: {
        ...typography.h4,
        fontSize: 16,
        color: colors.foreground,
        marginBottom: 4,
    },
    price: {
        ...typography.label,
        color: colors.primary,
        marginBottom: 8,
    },
    duration: {
        fontSize: 12,
        fontWeight: 'normal',
        color: colors.mutedForeground,
    },
    statusRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 4,
    },
    editButton: {
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    calendarButton: {
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    renewButton: {
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    deleteButton: {
        // No border
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    emptyTitle: {
        ...typography.h3,
        color: colors.foreground,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    emptySubtitle: {
        ...typography.body,
        color: colors.mutedForeground,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    createButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: 8,
    },
    createButtonText: {
        ...typography.label,
        color: colors.primaryForeground,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
