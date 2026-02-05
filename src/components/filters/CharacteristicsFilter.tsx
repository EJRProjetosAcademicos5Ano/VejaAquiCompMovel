import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Property } from '@/types/property';
import { AMENITIES, PROPERTY_STATUSES } from '@/constants/enums';
import { colors, spacing, typography } from '@/utils/theme';

interface CharacteristicsFilterProps {
    bedrooms?: number;
    bathrooms?: number;
    minArea?: number;
    maxArea?: number;
    amenities?: string[];
    status?: Property['status'];
    availableFrom?: string;
    isFurnished?: boolean;
    hasParking?: boolean;
    hasPool?: boolean;
    hasGarden?: boolean;
    hasSecurity?: boolean;
    onBedroomsChange: (value?: number) => void;
    onBathroomsChange: (value?: number) => void;
    onAreaChange: (min?: number, max?: number) => void;
    onAmenitiesChange: (amenities: string[]) => void;
    onStatusChange: (status?: Property['status']) => void;
    onBooleanFilterChange: (key: string, value: boolean) => void;
}

export const CharacteristicsFilter: React.FC<CharacteristicsFilterProps> = ({
    bedrooms,
    bathrooms,
    minArea,
    maxArea,
    amenities = [],
    status,
    availableFrom,
    isFurnished,
    hasParking,
    hasPool,
    hasGarden,
    hasSecurity,
    onBedroomsChange,
    onBathroomsChange,
    onAreaChange,
    onAmenitiesChange,
    onStatusChange,
    onBooleanFilterChange,
}) => {
    const bedroomOptions = [1, 2, 3, 4, 5];
    const bathroomOptions = [1, 2, 3, 4];
    const areaRanges = [
        { label: '< 50 m²', min: 0, max: 50 },
        { label: '50-100 m²', min: 50, max: 100 },
        { label: '100-200 m²', min: 100, max: 200 },
        { label: '200-500 m²', min: 200, max: 500 },
        { label: '> 500 m²', min: 500, max: 10000 },
    ];

    const statusLabels: Record<string, string> = {
        novo: 'Novo',
        usado: 'Usado',
        em_construcao: 'Em Construção',
    };

    const toggleAmenity = (amenityId: string) => {
        if (amenities.includes(amenityId)) {
            onAmenitiesChange(amenities.filter(a => a !== amenityId));
        } else {
            onAmenitiesChange([...amenities, amenityId]);
        }
    };

    const isAreaRangeSelected = (min: number, max: number) => {
        return minArea === min && maxArea === max;
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Bedrooms */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quartos</Text>
                <View style={styles.counterContainer}>
                    {bedroomOptions.map((num) => (
                        <TouchableOpacity
                            key={num}
                            style={[
                                styles.counterButton,
                                bedrooms === num && styles.counterButtonSelected,
                            ]}
                            onPress={() => onBedroomsChange(bedrooms === num ? undefined : num)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.counterText,
                                    bedrooms === num && styles.counterTextSelected,
                                ]}
                            >
                                {num}+
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Bathrooms */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Casas de Banho</Text>
                <View style={styles.counterContainer}>
                    {bathroomOptions.map((num) => (
                        <TouchableOpacity
                            key={num}
                            style={[
                                styles.counterButton,
                                bathrooms === num && styles.counterButtonSelected,
                            ]}
                            onPress={() => onBathroomsChange(bathrooms === num ? undefined : num)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.counterText,
                                    bathrooms === num && styles.counterTextSelected,
                                ]}
                            >
                                {num}+
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Area */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Área</Text>
                <View style={styles.areaContainer}>
                    {areaRanges.map((range, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.areaButton,
                                isAreaRangeSelected(range.min, range.max) && styles.areaButtonSelected,
                            ]}
                            onPress={() =>
                                isAreaRangeSelected(range.min, range.max)
                                    ? onAreaChange(undefined, undefined)
                                    : onAreaChange(range.min, range.max)
                            }
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.areaText,
                                    isAreaRangeSelected(range.min, range.max) && styles.areaTextSelected,
                                ]}
                            >
                                {range.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Status */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Estado do Imóvel</Text>
                <View style={styles.statusContainer}>
                    {PROPERTY_STATUSES.map((stat) => (
                        <TouchableOpacity
                            key={stat}
                            style={[
                                styles.statusButton,
                                status === stat && styles.statusButtonSelected,
                            ]}
                            onPress={() => onStatusChange(status === stat ? undefined : stat)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    status === stat && styles.statusTextSelected,
                                ]}
                            >
                                {statusLabels[stat]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Amenities */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Comodidades</Text>
                <View style={styles.amenitiesContainer}>
                    {AMENITIES.map((amenity) => (
                        <TouchableOpacity
                            key={amenity.id}
                            style={[
                                styles.amenityCard,
                                amenities.includes(amenity.id) && styles.amenityCardSelected,
                            ]}
                            onPress={() => toggleAmenity(amenity.id)}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons
                                name={amenity.icon as any}
                                size={24}
                                color={amenities.includes(amenity.id) ? colors.primary : colors.mutedForeground}
                            />
                            <Text
                                style={[
                                    styles.amenityLabel,
                                    amenities.includes(amenity.id) && styles.amenityLabelSelected,
                                ]}
                                numberOfLines={2}
                            >
                                {amenity.label}
                            </Text>
                            {amenities.includes(amenity.id) && (
                                <View style={styles.amenityCheck}>
                                    <MaterialIcons name="check" size={14} color={colors.primaryForeground} />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {/* Premium Features / Granular Toggles */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Comodidades Principais</Text>

                <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                        <MaterialIcons name="weekend" size={24} color={colors.primary} />
                        <Text style={styles.switchLabel}>Mobilado</Text>
                    </View>
                    <Switch
                        value={isFurnished}
                        onValueChange={(val) => onBooleanFilterChange('is_furnished', val)}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                        <MaterialIcons name="local-parking" size={24} color={colors.primary} />
                        <Text style={styles.switchLabel}>Estacionamento</Text>
                    </View>
                    <Switch
                        value={hasParking}
                        onValueChange={(val) => onBooleanFilterChange('has_parking', val)}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                        <MaterialIcons name="pool" size={24} color={colors.primary} />
                        <Text style={styles.switchLabel}>Piscina</Text>
                    </View>
                    <Switch
                        value={hasPool}
                        onValueChange={(val) => onBooleanFilterChange('has_pool', val)}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                        <MaterialIcons name="yard" size={24} color={colors.primary} />
                        <Text style={styles.switchLabel}>Jardim</Text>
                    </View>
                    <Switch
                        value={hasGarden}
                        onValueChange={(val) => onBooleanFilterChange('has_garden', val)}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                        <MaterialIcons name="security" size={24} color={colors.primary} />
                        <Text style={styles.switchLabel}>Segurança</Text>
                    </View>
                    <Switch
                        value={hasSecurity}
                        onValueChange={(val) => onBooleanFilterChange('has_security', val)}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.foreground,
        marginBottom: spacing.md,
    },
    counterContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    counterButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: 8,
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
    },
    counterButtonSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.secondary,
    },
    counterText: {
        ...typography.label,
        color: colors.foreground,
        fontWeight: '500',
    },
    counterTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    areaContainer: {
        gap: spacing.sm,
    },
    areaButton: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
    },
    areaButtonSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.secondary,
    },
    areaText: {
        ...typography.label,
        color: colors.foreground,
    },
    areaTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    statusContainer: {
        gap: spacing.sm,
    },
    statusButton: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
    },
    statusButtonSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.secondary,
    },
    statusText: {
        ...typography.label,
        color: colors.foreground,
    },
    statusTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    amenitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    amenityCard: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
        padding: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    amenityCardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.secondary,
    },
    amenityLabel: {
        ...typography.label,
        color: colors.mutedForeground,
        fontSize: 10,
        textAlign: 'center',
    },
    amenityLabelSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    amenityCheck: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: colors.primary,
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    switchInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    switchLabel: {
        ...typography.body,
        fontSize: 16,
        color: colors.foreground,
    },
});
