import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ExpandableSectionProps {
    title: string;
    icon?: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    badge?: string | number;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
    title,
    icon,
    children,
    defaultExpanded = false,
    badge,
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const toggleExpanded = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={toggleExpanded}
                activeOpacity={0.7}
            >
                <View style={styles.headerLeft}>
                    {icon && (
                        <MaterialIcons
                            name={icon as any}
                            size={24}
                            color={colors.primary}
                            style={styles.icon}
                        />
                    )}
                    <Text style={styles.title}>{title}</Text>
                    {badge !== undefined && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                    )}
                </View>
                <MaterialIcons
                    name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color={colors.mutedForeground}
                />
            </TouchableOpacity>

            {expanded && <View style={styles.content}>{children}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderRadius: 12,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: spacing.sm,
    },
    title: {
        ...typography.h4,
        color: colors.foreground,
        flex: 1,
    },
    badge: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        marginLeft: spacing.sm,
    },
    badgeText: {
        ...typography.label,
        color: colors.primaryForeground,
        fontSize: 12,
    },
    content: {
        padding: spacing.md,
        paddingTop: 0,
    },
});
