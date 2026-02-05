import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Property, LegalDocument } from '@/types/property';
import { ExpandableSection } from './ExpandableSection';
import { colors, spacing, typography } from '@/utils/theme';

interface LegalStatusSectionProps {
    property: Property;
}

export const LegalStatusSection: React.FC<LegalStatusSectionProps> = ({
    property,
}) => {
    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'verified':
                return colors.success;
            case 'pending':
                return colors.warning;
            case 'incomplete':
                return colors.destructive;
            default:
                return colors.mutedForeground;
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case 'verified':
                return 'Verificado';
            case 'pending':
                return 'Pendente';
            case 'incomplete':
                return 'Incompleto';
            default:
                return 'Não Informado';
        }
    };

    const statusColor = getStatusColor(property.legal_status);
    const statusLabel = getStatusLabel(property.legal_status);

    return (
        <ExpandableSection
            title="Estado Legal"
            icon="gavel"
            defaultExpanded={true}
            badge={statusLabel}
        >
            <View style={styles.statusOverview}>
                <View style={[styles.statusIndicator, { backgroundColor: statusColor + '20' }]}>
                    <MaterialIcons name="verified-user" size={24} color={statusColor} />
                    <View style={styles.statusTextContainer}>
                        <Text style={[styles.statusTitle, { color: statusColor }]}>
                            Documentação {statusLabel}
                        </Text>
                        <Text style={styles.statusDescription}>
                            {property.legal_status === 'verified'
                                ? 'Este imóvel possui toda a documentação legal verificada.'
                                : property.legal_status === 'pending'
                                    ? 'A documentação está em processo de verificação.'
                                    : 'A documentação deste imóvel precisa ser regularizada.'}
                        </Text>
                    </View>
                </View>
            </View>

            {property.legal_documents && property.legal_documents.length > 0 && (
                <View style={styles.documentsList}>
                    <Text style={styles.subsectionTitle}>Documentos Disponíveis</Text>
                    {property.legal_documents.map((doc: LegalDocument) => (
                        <View key={doc.id} style={styles.documentItem}>
                            <MaterialIcons
                                name="description"
                                size={24}
                                color={doc.status === 'verified' ? colors.success : colors.mutedForeground}
                            />
                            <View style={styles.documentInfo}>
                                <Text style={styles.documentName}>{doc.name}</Text>
                                <View style={styles.documentMeta}>
                                    <Text style={styles.documentType}>
                                        {doc.type === 'title_deed' ? 'Título de Propriedade' :
                                            doc.type === 'building_permit' ? 'Licença de Construção' :
                                                doc.type === 'occupancy_certificate' ? 'Certificado de Habitabilidade' :
                                                    doc.type === 'tax_clearance' ? 'Certidão de Finanças' :
                                                        doc.type === 'land_registry' ? 'Registo Predial' : 'Outro'}

                                    </Text>
                                    {doc.issue_date && (
                                        <Text style={styles.documentDate}>• Emitido em {doc.issue_date}</Text>
                                    )}
                                </View>
                            </View>
                            {doc.status === 'verified' && (
                                <MaterialIcons name="check-circle" size={20} color={colors.success} />
                            )}
                        </View>
                    ))}
                </View>
            )}

            {property.legal_status !== 'verified' && (
                <View style={styles.warningContainer}>
                    <MaterialIcons name="warning" size={20} color={colors.warning} />
                    <Text style={styles.warningText}>
                        Recomendamos verificar toda a documentação legal antes de realizar qualquer pagamento.
                    </Text>
                </View>
            )}
        </ExpandableSection>
    );
};

const styles = StyleSheet.create({
    statusOverview: {
        marginBottom: spacing.md,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 8,
        gap: spacing.md,
    },
    statusTextContainer: {
        flex: 1,
    },
    statusTitle: {
        ...typography.h4,
        marginBottom: 2,
    },
    statusDescription: {
        ...typography.bodySmall,
        color: colors.foreground,
    },
    documentsList: {
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    subsectionTitle: {
        ...typography.label,
        color: colors.mutedForeground,
        marginBottom: spacing.xs,
    },
    documentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.md,
    },
    documentInfo: {
        flex: 1,
    },
    documentName: {
        ...typography.label,
        color: colors.foreground,
        marginBottom: 2,
    },
    documentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    documentType: {
        ...typography.caption,
        color: colors.mutedForeground,
    },
    documentDate: {
        ...typography.caption,
        color: colors.mutedForeground,
        marginLeft: 4,
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.warning + '20',
        borderRadius: 8,
        gap: spacing.sm,
    },
    warningText: {
        ...typography.caption,
        color: colors.warning,
        flex: 1,
    },
});
