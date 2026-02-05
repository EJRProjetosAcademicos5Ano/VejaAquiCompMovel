import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Property, PropertyHistoryEvent } from '@/types/property';
import { ExpandableSection } from './ExpandableSection';
import { colors, spacing, typography } from '@/utils/theme';

interface PropertyHistorySectionProps {
    property: Property;
}

export const PropertyHistorySection: React.FC<PropertyHistorySectionProps> = ({
    property,
}) => {
    if (!property.property_history || property.property_history.length === 0) {
        if (!property.year_built && !property.last_renovation) return null;
    }

    const events = property.property_history?.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    ) || [];

    const getEventIcon = (type: PropertyHistoryEvent['type']) => {
        switch (type) {
            case 'construction':
                return 'foundation';
            case 'renovation':
                return 'handyman';
            case 'ownership_change':
                return 'person-outline';
            case 'repair':
                return 'build';
            case 'inspection':
                return 'fact-check';
            default:
                return 'event';
        }
    };

    const getEventColor = (type: PropertyHistoryEvent['type']) => {
        switch (type) {
            case 'construction':
                return colors.primary;
            case 'renovation':
                return colors.secondary;
            case 'ownership_change':
                return colors.info;
            case 'repair':
                return colors.warning;
            case 'inspection':
                return colors.success;
            default:
                return colors.mutedForeground;
        }
    };

    return (
        <ExpandableSection title="Histórico do Imóvel" icon="history">
            {/* Key Dates Summary */}
            <View style={styles.summaryContainer}>
                {property.year_built && (
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Construção</Text>
                        <Text style={styles.summaryValue}>{property.year_built}</Text>
                    </View>
                )}
                {property.last_renovation && (
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Última Renovação</Text>
                        <Text style={styles.summaryValue}>{property.last_renovation}</Text>
                    </View>
                )}
            </View>

            {/* Timeline */}
            <View style={styles.timeline}>
                {events.map((event, index) => {
                    const isLast = index === events.length - 1;
                    const color = getEventColor(event.type);

                    return (
                        <View key={event.id} style={styles.timelineItem}>
                            <View style={styles.timelineLeft}>
                                <View style={[styles.timelineDot, { backgroundColor: color }]} />
                                {!isLast && <View style={styles.timelineLine} />}
                            </View>

                            <View style={[styles.timelineContent, isLast && styles.contentLast]}>
                                <View style={styles.eventHeader}>
                                    <Text style={styles.eventDate}>{event.date}</Text>
                                    {event.cost && (
                                        <Text style={styles.eventCost}>
                                            {event.cost.toLocaleString('pt-MZ')} MT
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.eventBody}>
                                    <MaterialIcons
                                        name={getEventIcon(event.type) as any}
                                        size={16}
                                        color={color}
                                        style={styles.eventIcon}
                                    />
                                    <Text style={styles.eventTitle}>{event.title}</Text>
                                </View>

                                {event.description && (
                                    <Text style={styles.eventDescription}>{event.description}</Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </ExpandableSection>
    );
};

const styles = StyleSheet.create({
    summaryContainer: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
        gap: spacing.md,
    },
    summaryItem: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    summaryLabel: {
        ...typography.caption,
        color: colors.mutedForeground,
        marginBottom: 4,
    },
    summaryValue: {
        ...typography.h4,
        color: colors.foreground,
    },
    timeline: {
        paddingLeft: spacing.sm,
    },
    timelineItem: {
        flexDirection: 'row',
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: spacing.md,
        width: 16,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        zIndex: 1,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: colors.border,
        marginVertical: 4,
    },
    timelineContent: {
        flex: 1,
        paddingBottom: spacing.lg,
    },
    contentLast: {
        paddingBottom: 0,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    eventDate: {
        ...typography.caption,
        color: colors.mutedForeground,
        fontWeight: '600',
    },
    eventCost: {
        ...typography.caption,
        color: colors.foreground,
        fontWeight: '600',
    },
    eventBody: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    eventIcon: {
        marginRight: 6,
    },
    eventTitle: {
        ...typography.label,
        color: colors.foreground,
    },
    eventDescription: {
        ...typography.bodySmall,
        color: colors.mutedForeground,
        lineHeight: 20,
    },
});
