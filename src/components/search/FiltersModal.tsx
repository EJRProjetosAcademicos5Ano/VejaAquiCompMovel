import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch,
    Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/utils/theme';
import { Button } from '@/components/ui/Card';
import { SearchFilters } from '@/types/property';

interface FiltersModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: SearchFilters) => void;
    initialFilters: SearchFilters;
}

const PROPERTY_TYPES = [
    { label: 'Apartamento', value: 'apartment' },
    { label: 'Vivenda', value: 'villa' },
    { label: 'Loja', value: 'shop' },
    { label: 'Terreno', value: 'land' },
];

const RENTAL_DURATIONS = [
    { label: 'Mensal', value: 'monthly' },
    { label: 'Anual', value: 'yearly' },
];

const PRICE_PRESETS = [
    { label: 'Até 50k', min: 0, max: 50000 },
    { label: '50k - 100k', min: 50000, max: 100000 },
    { label: '100k - 250k', min: 100000, max: 250000 },
    { label: '250k - 500k', min: 250000, max: 500000 },
    { label: '500k+', min: 500000, max: undefined },
];

export default function FiltersModal({ visible, onClose, onApply, initialFilters }: FiltersModalProps) {
    const [filters, setFilters] = useState<SearchFilters>(initialFilters);

    const updateFilter = (key: keyof SearchFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value === prev[key] ? undefined : value }));
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleClear = () => {
        const cleared = {};
        setFilters(cleared);
        onApply(cleared);
        onClose();
    };

    const renderSection = (title: string, children: React.ReactNode) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );

    const renderChip = (label: string, value: any, current: any, onPress: () => void) => {
        const isActive = current === value;
        return (
            <TouchableOpacity
                key={label}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={onPress}
            >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={24} color={colors.foreground} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Filtros</Text>
                    <TouchableOpacity onPress={handleClear}>
                        <Text style={styles.clearText}>Limpar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {renderSection('Tipo de Imóvel', (
                        <View style={styles.chipGrid}>
                            {PROPERTY_TYPES.map(type =>
                                renderChip(type.label, type.value, filters.property_type, () => updateFilter('property_type', type.value))
                            )}
                        </View>
                    ))}

                    {renderSection('Duração do Aluguer', (
                        <View style={styles.chipGrid}>
                            {RENTAL_DURATIONS.map(dur =>
                                renderChip(dur.label, dur.value, filters.rental_duration, () => updateFilter('rental_duration', dur.value))
                            )}
                        </View>
                    ))}

                    {renderSection('Preço', (
                        <View>
                            <View style={[styles.chipGrid, { marginBottom: spacing.md }]}>
                                {PRICE_PRESETS.map(preset =>
                                    renderChip(
                                        preset.label,
                                        preset.min,
                                        filters.min_price,
                                        () => {
                                            setFilters(prev => ({
                                                ...prev,
                                                min_price: preset.min,
                                                max_price: preset.max
                                            }));
                                        }
                                    )
                                )}
                            </View>
                            <View style={styles.row}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Mínimo (Kz)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0"
                                        keyboardType="numeric"
                                        value={filters.min_price?.toString()}
                                        onChangeText={(t) => updateFilter('min_price', t ? Number(t) : undefined)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Máximo (Kz)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Qualquer"
                                        keyboardType="numeric"
                                        value={filters.max_price?.toString()}
                                        onChangeText={(t) => updateFilter('max_price', t ? Number(t) : undefined)}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}

                    {renderSection('Quartos e Banhos', (
                        <View style={styles.row}>
                            <View style={styles.counterContainer}>
                                <Text style={styles.inputLabel}>Quartos</Text>
                                <View style={styles.stepper}>
                                    {[1, 2, 3, 4, '5+'].map(val => (
                                        <TouchableOpacity
                                            key={val}
                                            style={[styles.stepButton, filters.bedrooms === (typeof val === 'number' ? val : 5) && styles.stepButtonActive]}
                                            onPress={() => updateFilter('bedrooms', typeof val === 'number' ? val : 5)}
                                        >
                                            <Text style={[styles.stepText, filters.bedrooms === (typeof val === 'number' ? val : 5) && styles.stepTextActive]}>{val}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ))}

                    {renderSection('Características', (
                        <View style={styles.switchGrid}>
                            <View style={styles.switchItem}>
                                <Text style={styles.switchLabel}>Mobilado</Text>
                                <Switch
                                    value={filters.is_furnished || false}
                                    onValueChange={(v) => updateFilter('is_furnished', v)}
                                    trackColor={{ true: colors.primary }}
                                />
                            </View>
                            <View style={styles.switchItem}>
                                <Text style={styles.switchLabel}>Estacionamento</Text>
                                <Switch
                                    value={filters.has_parking || false}
                                    onValueChange={(v) => updateFilter('has_parking', v)}
                                    trackColor={{ true: colors.primary }}
                                />
                            </View>
                            <View style={styles.switchItem}>
                                <Text style={styles.switchLabel}>Piscina</Text>
                                <Switch
                                    value={filters.has_pool || false}
                                    onValueChange={(v) => updateFilter('has_pool', v)}
                                    trackColor={{ true: colors.primary }}
                                />
                            </View>
                            <View style={styles.switchItem}>
                                <Text style={styles.switchLabel}>Segurança 24h</Text>
                                <Switch
                                    value={filters.has_security || false}
                                    onValueChange={(v) => updateFilter('has_security', v)}
                                    trackColor={{ true: colors.primary }}
                                />
                            </View>
                        </View>
                    ))}

                    <View style={{ height: 100 }} />
                </ScrollView>

                <View style={styles.footer}>
                    <Button onPress={handleApply}>
                        <Text style={styles.stepTextActive}>Aplicar Filtros</Text>
                    </Button>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.foreground,
    },
    closeButton: {
        padding: spacing.xs,
    },
    clearText: {
        color: colors.primary,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: spacing.md,
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        backgroundColor: colors.muted,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    chipTextActive: {
        color: '#FFF',
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    inputContainer: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        color: colors.mutedForeground,
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.muted,
        borderRadius: 8,
        padding: spacing.md,
        fontSize: 16,
        color: colors.foreground,
        borderWidth: 1,
        borderColor: colors.border,
    },
    counterContainer: {
        flex: 1,
    },
    stepper: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    stepButton: {
        flex: 1,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.muted,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    stepButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    stepText: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    stepTextActive: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    switchGrid: {
        gap: spacing.sm,
    },
    switchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    switchLabel: {
        fontSize: 15,
        color: colors.foreground,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
});
