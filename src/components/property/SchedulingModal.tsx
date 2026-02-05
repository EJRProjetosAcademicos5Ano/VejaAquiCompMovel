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
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';
import { scheduleVisit } from '@/services/visits';

const { height } = Dimensions.get('window');

// Configure Portuguese locale for the calendar
LocaleConfig.locales['pt'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt';

interface SchedulingModalProps {
    visible: boolean;
    onClose: () => void;
    propertyId: string;
    userId: string;
    propertyName: string;
}

export const SchedulingModal: React.FC<SchedulingModalProps> = ({
    visible,
    onClose,
    propertyId,
    userId,
    propertyName,
}) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);

    const timeSlots = [
        '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
    ];

    const handleSchedule = async () => {
        if (!selectedDate || !selectedTime) {
            Alert.alert('Aviso', 'Por favor, selecione uma data e um horário.');
            return;
        }

        setLoading(true);
        try {
            const visitDate = `${selectedDate}T${selectedTime}:00`;
            const result = await scheduleVisit({
                property_id: propertyId,
                user_id: userId,
                visit_date: visitDate,
            });

            if (result) {
                Alert.alert('Sucesso', 'Visita agendada com sucesso! Você receberá uma notificação em breve.');
                onClose();
            } else {
                Alert.alert('Erro', 'Não foi possível agendar a visita. Tente novamente.');
            }
        } catch (error) {
            console.error('Error in handleSchedule:', error);
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
                        <Text style={styles.headerTitle}>Agendar Visita</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color={colors.foreground} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.propertyInfo}>
                            <MaterialIcons name="home" size={20} color={colors.primary} />
                            <Text style={styles.propertyText}>{propertyName}</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Escolha a data</Text>
                        <Calendar
                            onDayPress={(day) => setSelectedDate(day.dateString)}
                            markedDates={{
                                [selectedDate]: { selected: true, selectedColor: colors.primary }
                            }}
                            theme={{
                                selectedDayBackgroundColor: colors.primary,
                                todayTextColor: colors.primary,
                                arrowColor: colors.primary,
                            }}
                            minDate={new Date().toISOString().split('T')[0]}
                        />

                        <Text style={styles.sectionTitle}>Escolha o horário</Text>
                        <View style={styles.timeGrid}>
                            {timeSlots.map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={[
                                        styles.timeSlot,
                                        selectedTime === time && styles.timeSlotSelected
                                    ]}
                                    onPress={() => setSelectedTime(time)}
                                >
                                    <Text style={[
                                        styles.timeText,
                                        selectedTime === time && styles.timeTextSelected
                                    ]}>
                                        {time}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleSchedule}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
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
        height: height * 0.85,
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
    propertyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.lg,
        backgroundColor: colors.card,
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        borderRadius: 12,
    },
    propertyText: {
        ...typography.body,
        color: colors.foreground,
        fontWeight: '600',
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.foreground,
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    timeSlot: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        minWidth: '22%',
        alignItems: 'center',
    },
    timeSlotSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    timeText: {
        ...typography.label,
        color: colors.foreground,
    },
    timeTextSelected: {
        color: '#FFF',
        fontWeight: 'bold',
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
