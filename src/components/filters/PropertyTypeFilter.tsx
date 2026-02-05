import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Property } from '@/types/property';
import { PROPERTY_TYPES } from '@/constants/enums';
import { colors, spacing, typography } from '@/utils/theme';

interface PropertyTypeFilterProps {
    selectedTypes: Property['property_type'][];
    onSelectType: (type: Property['property_type']) => void;
}

export const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({
    selectedTypes,
    onSelectType,
}) => {
    const isSelected = (type: Property['property_type']) => {
        return selectedTypes.includes(type);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tipo de Imóvel</Text>
            <ScrollView
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
            >
                {PROPERTY_TYPES.map((type) => (
                    <TouchableOpacity
                        key={type.id}
                        style={[
                            styles.typeCard,
                            isSelected(type.id) && styles.typeCardSelected,
                        ]}
                        onPress={() => onSelectType(type.id)}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons
                            name={type.icon as any}
                            size={32}
                            color={isSelected(type.id) ? colors.primary : colors.mutedForeground}
                        />
                        <Text
                            style={[
                                styles.typeLabel,
                                isSelected(type.id) && styles.typeLabelSelected,
                            ]}
                            numberOfLines={2}
                        >
                            {type.label}
                        </Text>
                        {isSelected(type.id) && (
                            <View style={styles.checkmark}>
                                <MaterialIcons name="check" size={16} color={colors.primaryForeground} />
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
        marginBottom: spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        paddingBottom: spacing.lg,
    },
    typeCard: {
        width: '47%',
        aspectRatio: 1.2,
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    typeCardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.secondary,
    },
    typeLabel: {
        ...typography.label,
        color: colors.mutedForeground,
        textAlign: 'center',
        fontSize: 12,
    },
    typeLabelSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    checkmark: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: colors.primary,
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
