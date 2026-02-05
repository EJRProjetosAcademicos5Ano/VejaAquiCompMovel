import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getPendingProperties, approveProperty, rejectProperty } from '@/services/properties';
import { Property } from '@/types/property';
import { colors, spacing, typography } from '@/utils/theme';
import { Card, Button } from '@/components/ui/Card';

export default function AdVerificationScreen() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadProperties = async () => {
        setLoading(true);
        const data = await getPendingProperties();
        setProperties(data);
        setLoading(false);
    };

    useEffect(() => {
        loadProperties();
    }, []);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        const success = await approveProperty(id);
        if (success) {
            setProperties(prev => prev.filter(p => p.id !== id));
            Alert.alert('Sucesso', 'Anúncio aprovado com sucesso!');
        } else {
            Alert.alert('Erro', 'Falha ao aprovar anúncio.');
        }
        setProcessingId(null);
    };

    const handleReject = (id: string) => {
        Alert.alert(
            'Rejeitar Anúncio',
            'Tem certeza que deseja rejeitar este anúncio? Ele será removido.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Rejeitar',
                    style: 'destructive',
                    onPress: async () => {
                        setProcessingId(id);
                        const success = await rejectProperty(id);
                        if (success) {
                            setProperties(prev => prev.filter(p => p.id !== id));
                            Alert.alert('Sucesso', 'Anúncio rejeitado.');
                        } else {
                            Alert.alert('Erro', 'Falha ao rejeitar anúncio.');
                        }
                        setProcessingId(null);
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Property }) => (
        <Card style={styles.card}>
            <View style={styles.propertyHeader}>
                <Image
                    source={{ uri: item.cover_image || 'https://via.placeholder.com/150' }}
                    style={styles.thumbnail}
                />
                <View style={styles.headerInfo}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.price}>{item.currency} {item.price.toLocaleString()}</Text>
                    <Text style={styles.location}>{item.city}, {item.province}</Text>
                </View>
            </View>

            <Text style={styles.description} numberOfLines={3}>{item.description}</Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleApprove(item.id)}
                    disabled={processingId === item.id}
                >
                    {processingId === item.id ? (
                        <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                        <>
                            <MaterialIcons name="check" size={20} color="#FFF" />
                            <Text style={styles.buttonText}>Aprovar</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(item.id)}
                    disabled={processingId === item.id}
                >
                    <MaterialIcons name="close" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Rejeitar</Text>
                </TouchableOpacity>
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
                data={properties}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <MaterialIcons name="done-all" size={64} color={colors.muted} />
                        <Text style={styles.emptyText}>Nenhum anúncio pendente</Text>
                    </View>
                }
                onRefresh={loadProperties}
                refreshing={loading}
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
    card: {
        marginBottom: spacing.md,
    },
    propertyHeader: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: spacing.md,
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        ...typography.h4,
        color: colors.foreground,
    },
    price: {
        ...typography.h4,
        color: colors.primary,
        fontSize: 16,
    },
    location: {
        ...typography.caption,
        color: colors.mutedForeground,
    },
    description: {
        ...typography.body,
        fontSize: 14,
        color: colors.foreground,
        marginVertical: spacing.sm,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 4,
    },
    approveButton: {
        backgroundColor: '#10B981',
    },
    rejectButton: {
        backgroundColor: '#EF4444',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        ...typography.h4,
        color: colors.mutedForeground,
        marginTop: spacing.md,
    },
});
