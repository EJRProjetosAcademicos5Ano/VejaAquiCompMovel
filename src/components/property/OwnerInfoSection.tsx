import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Property } from '@/types/property';
import { colors, spacing, typography } from '@/utils/theme';

interface OwnerInfoSectionProps {
    property: Property;
}

export const OwnerInfoSection: React.FC<OwnerInfoSectionProps> = ({
    property,
}) => {
    const handleCall = () => {
        if (property.phone) {
            Linking.openURL(`tel:${property.phone}`);
        } else {
            Alert.alert('Aviso', 'Número de telefone não disponível');
        }
    };

    const handleEmail = () => {
        if (property.email) {
            Linking.openURL(`mailto:${property.email}`);
        } else {
            Alert.alert('Aviso', 'Email não disponível');
        }
    };

    const handleWhatsApp = () => {
        if (property.phone) {
            const phoneNumber = property.phone.replace(/\D/g, '');
            Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
        } else {
            Alert.alert('Aviso', 'Número de WhatsApp não disponível');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <MaterialIcons name="person" size={32} color={colors.primary} />
                </View>
                <View style={styles.ownerInfo}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.ownerName}>
                            {property.owner_name || 'Proprietário'}
                        </Text>
                        {property.owner_verified && (
                            <MaterialIcons name="verified" size={18} color={colors.success} />
                        )}
                    </View>
                    {property.owner_response_time && (
                        <Text style={styles.responseTime}>
                            Responde {property.owner_response_time}
                        </Text>
                    )}
                    {property.owner_properties_count !== undefined && (
                        <Text style={styles.propertiesCount}>
                            {property.owner_properties_count} {property.owner_properties_count === 1 ? 'imóvel' : 'imóveis'} anunciados
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Informações de Contato</Text>

            <View style={styles.contactButtons}>
                <TouchableOpacity
                    style={styles.contactButton}
                    onPress={handleCall}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="phone" size={20} color={colors.primary} />
                    <Text style={styles.contactButtonText}>Ligar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.contactButton}
                    onPress={handleWhatsApp}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="chat" size={20} color={colors.success} />
                    <Text style={styles.contactButtonText}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.contactButton}
                    onPress={handleEmail}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="email" size={20} color={colors.info} />
                    <Text style={styles.contactButtonText}>Email</Text>
                </TouchableOpacity>
            </View>

            {(property.phone || property.email) && (
                <View style={styles.contactDetails}>
                    {property.phone && (
                        <View style={styles.contactDetail}>
                            <MaterialIcons name="phone" size={16} color={colors.mutedForeground} />
                            <Text style={styles.contactDetailText}>{property.phone}</Text>
                        </View>
                    )}
                    {property.email && (
                        <View style={styles.contactDetail}>
                            <MaterialIcons name="email" size={16} color={colors.mutedForeground} />
                            <Text style={styles.contactDetailText}>{property.email}</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    ownerInfo: {
        flex: 1,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    ownerName: {
        ...typography.h4,
        color: colors.foreground,
    },
    responseTime: {
        ...typography.bodySmall,
        color: colors.success,
        marginBottom: 2,
    },
    propertiesCount: {
        ...typography.bodySmall,
        color: colors.mutedForeground,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.label,
        color: colors.foreground,
        marginBottom: spacing.md,
    },
    contactButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    contactButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.md,
        borderRadius: 8,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    contactButtonText: {
        ...typography.label,
        color: colors.foreground,
        fontSize: 12,
    },
    contactDetails: {
        gap: spacing.sm,
    },
    contactDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    contactDetailText: {
        ...typography.bodySmall,
        color: colors.mutedForeground,
    },
});
