import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { getPropertyById, updateProperty } from '@/services/properties';

// Configure Locale for Portuguese
LocaleConfig.locales['pt'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt';

export default function PropertyCalendarScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { user } = useAuth();
    const propertyId = route.params?.propertyId;

    const [loading, setLoading] = useState(false);
    const [markedDates, setMarkedDates] = useState<any>({});
    const [propertyName, setPropertyName] = useState('');

    useEffect(() => {
        if (propertyId) {
            loadAvailability();
        }
    }, [propertyId]);

    const loadAvailability = async () => {
        setLoading(true);
        const data = await getPropertyById(propertyId);
        if (data) {
            setPropertyName(data.title);
            const unavailable = data.unavailable_dates || [];
            const marked = unavailable.reduce((acc: any, date: string) => {
                acc[date] = { selected: true, selectedColor: colors.destructive, type: 'busy' };
                return acc;
            }, {});
            setMarkedDates(marked);
        }
        setLoading(false);
    };

    const onDayPress = (day: { dateString: string }) => {
        const date = day.dateString;
        const newMarked = { ...markedDates };

        if (newMarked[date]) {
            // Unmark (make available)
            delete newMarked[date];
        } else {
            // Mark as busy
            newMarked[date] = { selected: true, selectedColor: colors.destructive, type: 'busy' };
        }
        setMarkedDates(newMarked);
    };

    const saveAvailability = async () => {
        if (!propertyId) return;

        setLoading(true);
        try {
            const unavailableDates = Object.keys(markedDates);
            await updateProperty(propertyId, { unavailable_dates: unavailableDates });
            Alert.alert('Sucesso', 'Disponibilidade atualizada!');
        } catch (error) {
            console.error('Error saving availability:', error);
            Alert.alert('Erro', 'Não foi possível salvar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Gerir Disponibilidade</Text>
                <Text style={styles.subtitle}>{propertyName || 'Carregando...'}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: colors.destructive }]} />
                        <Text style={styles.legendText}>Ocupado / Indisponível</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }]} />
                        <Text style={styles.legendText}>Disponível</Text>
                    </View>
                </View>

                <View style={styles.calendarContainer}>
                    <Calendar
                        current={new Date().toISOString()}
                        onDayPress={onDayPress}
                        markedDates={markedDates}
                        theme={{
                            todayTextColor: colors.primary,
                            arrowColor: colors.primary,
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '600',
                        }}
                    />
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveAvailability}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.card,
    },
    title: {
        ...typography.h3,
        color: colors.foreground,
    },
    subtitle: {
        ...typography.body,
        color: colors.mutedForeground,
    },
    content: {
        padding: spacing.md,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.lg,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    calendarContainer: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: spacing.sm,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    saveButton: {
        backgroundColor: colors.primary,
        padding: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        ...typography.h4,
        color: colors.primaryForeground,
        fontWeight: 'bold',
    },
});
