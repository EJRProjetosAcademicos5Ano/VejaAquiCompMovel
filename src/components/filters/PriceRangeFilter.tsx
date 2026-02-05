import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, spacing, typography } from '@/utils/theme';

interface PriceRangeFilterProps {
    minPrice?: number;
    maxPrice?: number;
    onPriceChange: (min: number, max: number) => void;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
    minPrice = 0,
    maxPrice = 1000000,
    onPriceChange,
}) => {
    const [localMin, setLocalMin] = useState(minPrice);
    const [localMax, setLocalMax] = useState(maxPrice);

    const handleMinChange = (value: number) => {
        const newMin = Math.min(value, localMax - 10000);
        setLocalMin(newMin);
        onPriceChange(newMin, localMax);
    };

    const handleMaxChange = (value: number) => {
        const newMax = Math.max(value, localMin + 10000);
        setLocalMax(newMax);
        onPriceChange(localMin, newMax);
    };

    const formatPrice = (price: number) => {
        return `${(price / 1000).toFixed(0)}k MT`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Faixa de Preço</Text>

            <View style={styles.priceDisplay}>
                <View style={styles.priceBox}>
                    <Text style={styles.priceLabel}>Mínimo</Text>
                    <Text style={styles.priceValue}>
                        {localMin.toLocaleString('pt-BR')} MT
                    </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.priceBox}>
                    <Text style={styles.priceLabel}>Máximo</Text>
                    <Text style={styles.priceValue}>
                        {localMax.toLocaleString('pt-BR')} MT
                    </Text>
                </View>
            </View>

            <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Preço Mínimo</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1000000}
                    step={10000}
                    value={localMin}
                    onValueChange={handleMinChange}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.border}
                    thumbTintColor={colors.primary}
                />
                <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabelText}>0 MT</Text>
                    <Text style={styles.sliderLabelText}>1M MT</Text>
                </View>
            </View>

            <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Preço Máximo</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1000000}
                    step={10000}
                    value={localMax}
                    onValueChange={handleMaxChange}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.border}
                    thumbTintColor={colors.primary}
                />
                <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabelText}>0 MT</Text>
                    <Text style={styles.sliderLabelText}>1M MT</Text>
                </View>
            </View>
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
    priceDisplay: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.lg,
        gap: spacing.md,
    },
    priceBox: {
        flex: 1,
        alignItems: 'center',
    },
    priceLabel: {
        ...typography.label,
        color: colors.mutedForeground,
        fontSize: 12,
        marginBottom: spacing.xs,
    },
    priceValue: {
        ...typography.h4,
        color: colors.primary,
        fontSize: 16,
    },
    separator: {
        width: 1,
        backgroundColor: colors.border,
    },
    sliderContainer: {
        marginBottom: spacing.lg,
    },
    sliderLabel: {
        ...typography.label,
        color: colors.foreground,
        marginBottom: spacing.sm,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xs,
    },
    sliderLabelText: {
        ...typography.label,
        color: colors.mutedForeground,
        fontSize: 11,
    },
});
