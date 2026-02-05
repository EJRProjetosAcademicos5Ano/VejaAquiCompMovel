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
import { getReportedContent, dismissReport, resolveReport, Report } from '@/services/moderation';
import { colors, spacing, typography } from '@/utils/theme';
import { Card } from '@/components/ui/Card';

export default function ModerationScreen() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadReports = async () => {
        setLoading(true);
        const data = await getReportedContent();
        setReports(data.filter(r => r.status === 'pending'));
        setLoading(false);
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleDismiss = async (reportId: string) => {
        setProcessingId(reportId);
        const success = await dismissReport(reportId);
        if (success) {
            setReports(prev => prev.filter(r => r.id !== reportId));
        } else {
            Alert.alert('Erro', 'Não foi possível ignorar a denúncia.');
        }
        setProcessingId(null);
    };

    const handleExecuteAction = (report: Report) => {
        Alert.alert(
            'Ação de Moderação',
            'O que deseja fazer com este conteúdo?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover Conteúdo',
                    style: 'destructive',
                    onPress: async () => {
                        setProcessingId(report.id);
                        const success = await resolveReport(report.id, report.item_id);
                        if (success) {
                            setReports(prev => prev.filter(r => r.id !== report.id));
                            Alert.alert('Sucesso', 'Conteúdo removido e denúncia resolvida.');
                        } else {
                            Alert.alert('Erro', 'Falha ao processar ação.');
                        }
                        setProcessingId(null);
                    }
                },
                {
                    text: 'Ignorar Denúncia',
                    onPress: () => handleDismiss(report.id)
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Report }) => (
        <Card style={styles.card}>
            <View style={styles.header}>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.item_type.toUpperCase()}</Text>
                </View>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>

            <Text style={styles.reasonTitle}>Motivo da Denúncia:</Text>
            <Text style={styles.reasonText}>{item.reason}</Text>

            <View style={styles.reporterInfo}>
                <MaterialIcons name="person-outline" size={14} color={colors.mutedForeground} />
                <Text style={styles.reporterText}>Denunciado por: {item.reporter_email}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => Alert.alert('Preview', 'Funcionalidade de visualizar conteúdo denunciado.')}
                >
                    <Text style={styles.viewButtonText}>Ver Conteúdo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleExecuteAction(item)}
                    disabled={processingId === item.id}
                >
                    {processingId === item.id ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <MaterialIcons name="more-vert" size={24} color={colors.primary} />
                    )}
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
                data={reports}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <MaterialIcons name="shield" size={64} color={colors.muted} />
                        <Text style={styles.emptyText}>Nenhuma denúncia pendente</Text>
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
    card: {
        marginBottom: spacing.md,
        padding: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    typeBadge: {
        backgroundColor: colors.primary + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    typeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primary,
    },
    date: {
        ...typography.caption,
        color: colors.mutedForeground,
    },
    reasonTitle: {
        fontWeight: 'bold',
        color: colors.foreground,
        marginBottom: 4,
    },
    reasonText: {
        ...typography.body,
        color: colors.foreground,
        marginBottom: spacing.md,
    },
    reporterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: spacing.md,
    },
    reporterText: {
        ...typography.caption,
        color: colors.mutedForeground,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.md,
    },
    viewButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    viewButtonText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 12,
    },
    actionButton: {
        padding: 4,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        ...typography.h4,
        color: colors.mutedForeground,
        marginTop: spacing.md,
    },
});
