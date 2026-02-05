import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';
import { createBooking } from '@/services/bookings';

const { height } = Dimensions.get('window');

interface BookingModalProps {
    visible: boolean;
    onClose: () => void;
    propertyId: string;
    userId: string;
    propertyName: string;
    price: number;
    currency?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
    visible,
    onClose,
    propertyId,
    userId,
    propertyName,
    price,
    currency = 'MT',
}) => {
    const [loading, setLoading] = useState(false);

    const handleBooking = async () => {
        setLoading(true);
        try {
            const result = await createBooking({
                property_id: propertyId,
                user_id: userId,
                start_date: new Date().toISOString(),
                total_price: price,
            });

            if (result) {
                Alert.alert('Sucesso', 'Reserva confirmada com sucesso! O proprietário entrará em contato para os próximos passos.');
                onClose();
            } else {
                Alert.alert('Erro', 'Não foi possível realizar a reserva. Tente novamente.');
            }
        } catch (error) {
            console.error('Error in handleBooking:', error);
            Alert.alert('Erro', 'Ocorreu um erro inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Reservar Imóvel</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color={colors.foreground} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.infoCard}>
                            <Text style={styles.label}>Imóvel</Text>
                            <Text style={styles.value}>{propertyName}</Text>

                            <View style={styles.divider} />

                            <Text style={styles.label}>Resumo do Pagamento</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Valor da Reserva</Text>
                                <Text style={styles.priceValue}>{price.toLocaleString('pt-BR')} {currency}</Text>
                            </View>

                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Taxa de Serviço</Text>
                                <Text style={styles.priceValue}>0 {currency}</Text>
                            </View>

                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>{price.toLocaleString('pt-BR')} {currency}</Text>
                            </View>
                        </View>

                        <View style={styles.confirmationBox}>
                            <MaterialIcons name="info-outline" size={24} color={colors.primary} />
                            <Text style={styles.confirmationText}>
                                Ao confirmar, este imóvel ficará reservado para você. O proprietário será notificado imediatamente para prosseguir com a documentação.
                            </Text>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleBooking}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.confirmButtonText}>Confirmar Reserva Instantânea</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: height * 0.7,
        paddingTop: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...typography.h3,
        color: colors.foreground,
    },
    closeButton: {
        padding: 4,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    infoCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.label,
        color: colors.mutedForeground,
        marginBottom: 4,
    },
    value: {
        ...typography.h4,
        color: colors.foreground,
        marginBottom: spacing.md,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.md,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    priceLabel: {
        ...typography.body,
        color: colors.mutedForeground,
    },
    priceValue: {
        ...typography.body,
        color: colors.foreground,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    totalLabel: {
        ...typography.h4,
        color: colors.foreground,
        fontWeight: '700',
    },
    totalValue: {
        ...typography.h4,
        color: colors.primary,
        fontWeight: '700',
    },
    confirmationBox: {
        flexDirection: 'row',
        backgroundColor: colors.primary + '10',
        padding: spacing.md,
        borderRadius: 12,
        gap: spacing.sm,
        alignItems: 'flex-start',
    },
    confirmationText: {
        flex: 1,
        ...typography.bodySmall,
        color: colors.primary,
        lineHeight: 18,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    confirmButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        ...typography.h4,
        color: '#FFF',
        fontWeight: '600',
    },
});
