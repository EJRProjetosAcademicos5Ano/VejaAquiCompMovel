import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SearchFilters } from '@/types/property';
import { colors, spacing, typography } from '@/utils/theme';
import { PROPERTY_TYPES, RENTAL_DURATIONS, AMENITIES } from '@/constants/enums';

interface FilterChipsProps {
    filters: SearchFilters;
    onRemoveFilter: (key: keyof SearchFilters) => void;
    onClearAll: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
    filters,
    onRemoveFilter,
    onClearAll,
}) => {
    const chips: Array<{ key: keyof SearchFilters; label: string }> = [];

    // Property types
    if (filters.property_types && filters.property_types.length > 0) {
        const labels = filters.property_types
            .map(type => PROPERTY_TYPES.find(pt => pt.id === type)?.label)
            .filter(Boolean)
            .join(', ');
        chips.push({ key: 'property_types', label: labels });
    }

    // Location
    if (filters.city) {
        chips.push({ key: 'city', label: filters.city });
    }
    if (filters.province) {
        chips.push({ key: 'province', label: filters.province });
    }

    // Price range
    if (filters.min_price !== undefined || filters.max_price !== undefined) {
        const min = filters.min_price ? `${filters.min_price.toLocaleString('pt-BR')} MT` : '0';
        const max = filters.max_price ? `${filters.max_price.toLocaleString('pt-BR')} MT` : '∞';
        chips.push({ key: 'min_price', label: `${min} - ${max}` });
    }

    // Rental duration
    if (filters.rental_duration) {
        const duration = RENTAL_DURATIONS.find(d => d.id === filters.rental_duration);
        if (duration) {
            chips.push({ key: 'rental_duration', label: duration.label });
        }
    }

    // Bedrooms
    if (filters.bedrooms !== undefined) {
        chips.push({ key: 'bedrooms', label: `${filters.bedrooms}+ Quartos` });
    }

    // Bathrooms
    if (filters.bathrooms !== undefined) {
        chips.push({ key: 'bathrooms', label: `${filters.bathrooms}+ Casas de banho` });
    }

    // Area
    if (filters.min_area !== undefined || filters.max_area !== undefined) {
        const min = filters.min_area || 0;
        const max = filters.max_area || '∞';
        chips.push({ key: 'min_area', label: `${min}-${max} m²` });
    }

    // Amenities
    if (filters.amenities && filters.amenities.length > 0) {
        const labels = filters.amenities
            .map(amenity => AMENITIES.find(a => a.id === amenity)?.label)
            .filter(Boolean)
            .slice(0, 2)
            .join(', ');
        const extra = filters.amenities.length > 2 ? ` +${filters.amenities.length - 2}` : '';
        chips.push({ key: 'amenities', label: labels + extra });
    }

    // Status
    if (filters.status) {
        const statusLabels: Record<string, string> = {
            novo: 'Novo',
            usado: 'Usado',
            em_construcao: 'Em Construção',
        };
        chips.push({ key: 'status', label: statusLabels[filters.status] || filters.status });
    }

    if (chips.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {chips.map((chip, index) => (
                    <TouchableOpacity
                        key={`${chip.key}-${index}`}
                        style={styles.chip}
                        onPress={() => onRemoveFilter(chip.key)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.chipText} numberOfLines={1}>
                            {chip.label}
                        </Text>
                        <MaterialIcons name="close" size={16} color={colors.primary} />
                    </TouchableOpacity>
                ))}

                {chips.length > 1 && (
                    <TouchableOpacity
                        style={styles.clearAllButton}
                        onPress={onClearAll}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.clearAllText}>Limpar tudo</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    scrollContent: {
        paddingRight: spacing.md,
        gap: spacing.sm,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        gap: spacing.xs,
        maxWidth: 200,
    },
    chipText: {
        ...typography.label,
        color: colors.primary,
        fontSize: 12,
    },
    clearAllButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
    },
    clearAllText: {
        ...typography.label,
        color: colors.mutedForeground,
        fontSize: 12,
    },
});
