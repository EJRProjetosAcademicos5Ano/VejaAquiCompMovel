import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Property, SpecialCondition } from '@/types/property';
import { ExpandableSection } from './ExpandableSection';
import { colors, spacing, typography } from '@/utils/theme';

interface SpecialConditionsSectionProps {
    property: Property;
}

export const SpecialConditionsSection: React.FC<SpecialConditionsSectionProps> = ({
    property,
}) => {
    const hasConditions =
        (property.special_conditions && property.special_conditions.length > 0) ||
        (property.permitted_works && property.permitted_works.length > 0);

    if (!hasConditions) return null;

    return (
        <ExpandableSection title="Condições Especiais" icon="info-outline">
            {/* Permitted Works */}
            {property.permitted_works && property.permitted_works.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Obras Permitidas</Text>
                    <View style={styles.chipsContainer}>
                        {property.permitted_works.map((work, index) => (
                            <View key={index} style={styles.permittedChip}>
                                <MaterialIcons name="check" size={16} color={colors.success} />
                                <Text style={styles.permittedText}>{work}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Special Conditions List */}
            {property.special_conditions?.map((condition: SpecialCondition) => (
                <View
                    key={condition.id}
                    style={[
                        styles.conditionItem,
                        condition.is_restriction && styles.restrictionItem
                    ]}
                >
                    <MaterialIcons
                        name={condition.is_restriction ? "block" : "info"}
                        size={24}
                        color={condition.is_restriction ? colors.destructive : colors.info}
                        style={styles.icon}
                    />
                    <View style={styles.conditionContent}>
                        <Text
                            style={[
                                styles.conditionTitle,
                                condition.is_restriction && styles.restrictionText
                            ]}
                        >
                            {condition.title}
                        </Text>
                        <Text style={styles.conditionDescription}>
                            {condition.description}
                        </Text>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>
                                {condition.category === 'zoning' ? 'Zoneamento' :
                                    condition.category === 'hoa_rules' ? 'Regras do Condomínio' :
                                        condition.category === 'restrictions' ? 'Restrição' :
                                            condition.category === 'permits_required' ? 'Requer Licença' : 'Outro'}
                            </Text>
                        </View>
                    </View>
                </View>
            ))}
        </ExpandableSection>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.label,
        color: colors.mutedForeground,
        marginBottom: spacing.sm,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    permittedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.success + '15',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 16,
        gap: 4,
    },
    permittedText: {
        ...typography.caption,
        color: colors.success,
        fontWeight: '500',
    },
    conditionItem: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: colors.info + '10',
        borderRadius: 8,
        marginBottom: spacing.sm,
        gap: spacing.md,
    },
    restrictionItem: {
        backgroundColor: colors.destructive + '10',
    },
    icon: {
        marginTop: 2,
    },
    conditionContent: {
        flex: 1,
    },
    conditionTitle: {
        ...typography.label,
        color: colors.info,
        marginBottom: 4,
    },
    restrictionText: {
        color: colors.destructive,
    },
    conditionDescription: {
        ...typography.bodySmall,
        color: colors.foreground,
        marginBottom: spacing.sm,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: colors.background,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    categoryText: {
        ...typography.caption,
        fontSize: 10,
        color: colors.mutedForeground,
    },
});
