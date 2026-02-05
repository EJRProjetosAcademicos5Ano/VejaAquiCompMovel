import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';

interface CheckboxProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onCheckedChange, label }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onCheckedChange(!checked)}
            activeOpacity={0.7}
        >
            <View style={[styles.box, checked && styles.checkedBox]}>
                {checked && <MaterialIcons name="check" size={16} color={colors.primaryForeground} />}
            </View>
            {label && <Text style={styles.label}>{label}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: 4,
    },
    box: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    checkedBox: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    label: {
        ...typography.body,
        color: colors.foreground,
    },
});
