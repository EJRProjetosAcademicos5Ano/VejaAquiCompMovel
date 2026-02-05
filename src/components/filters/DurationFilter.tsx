import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Property } from '@/types/property';
import { RENTAL_DURATIONS } from '@/constants/enums';
import { colors, spacing, typography } from '@/utils/theme';

interface DurationFilterProps {
    selectedDuration?: Property['rental_duration'];
    onSelectDuration: (duration?: Property['rental_duration']) => void;
}

export const DurationFilter: React.FC<DurationFilterProps> = ({
    selectedDuration,
    onSelectDuration,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Duração do Arrendamento</Text>

            <View style={styles.optionsContainer}>
                {RENTAL_DURATIONS.map((duration) => (
                    <TouchableOpacity
                        key={duration.id}
                        style={[
                            styles.option,
                            selectedDuration === duration.id && styles.optionSelected,
                        ]}
                        onPress={() =>
                            onSelectDuration(selectedDuration === duration.id ? undefined : duration.id)
                        }
                        activeOpacity={0.7}
                    >
                        <View style={styles.radioOuter}>
                            {selectedDuration === duration.id && (
                                <View style={styles.radioInner} />
                            )}
                        </View>

                        <View style={styles.optionContent}>
                            <Text
                                style={[
                                    styles.optionLabel,
                                    selectedDuration === duration.id && styles.optionLabelSelected,
                                ]}
                            >
                                {duration.label}
                            </Text>
                            <Text style={styles.optionSubLabel}>
                                Pagamento {duration.shortLabel}
                            </Text>
                        </View>

                        {selectedDuration === duration.id && (
                            <MaterialIcons name="check-circle" size={24} color={colors.primary} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {selectedDuration && (
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => onSelectDuration(undefined)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.clearButtonText}>Limpar seleção</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        ...typography.h4,
        color: colors.foreground,
        marginBottom: spacing.lg,
    },
    optionsContainer: {
        gap: spacing.md,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
        padding: spacing.md,
        gap: spacing.md,
    },
    optionSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.secondary,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
    },
    optionContent: {
        flex: 1,
    },
    optionLabel: {
        ...typography.body,
        color: colors.foreground,
        fontWeight: '500',
        marginBottom: spacing.xs,
    },
    optionLabelSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    optionSubLabel: {
        ...typography.label,
        color: colors.mutedForeground,
        fontSize: 12,
    },
    clearButton: {
        marginTop: spacing.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    clearButtonText: {
        ...typography.label,
        color: colors.mutedForeground,
    },
});
