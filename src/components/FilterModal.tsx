import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SearchFilters, Property } from '@/types/property';
import { colors, spacing, typography } from '@/utils/theme';
import { PropertyTypeFilter } from './filters/PropertyTypeFilter';
import { PriceRangeFilter } from './filters/PriceRangeFilter';
import { LocationMapFilter } from './filters/LocationMapFilter';
import { DurationFilter } from './filters/DurationFilter';
import { CharacteristicsFilter } from './filters/CharacteristicsFilter';

const { height } = Dimensions.get('window');

interface FilterModalProps {
    visible: boolean;
    filters: SearchFilters;
    onClose: () => void;
    onApplyFilters: (filters: SearchFilters) => void;
    onClearFilters: () => void;
}

type FilterTab = 'type' | 'price' | 'location' | 'duration' | 'characteristics';

export const FilterModal: React.FC<FilterModalProps> = ({
    visible,
    filters,
    onClose,
    onApplyFilters,
    onClearFilters,
}) => {
    const [activeTab, setActiveTab] = useState<FilterTab>('type');
    const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

    const tabs: Array<{ id: FilterTab; label: string; icon: string }> = [
        { id: 'type', label: 'Tipo', icon: 'home' },
        { id: 'price', label: 'Preço', icon: 'attach-money' },
        { id: 'location', label: 'Local', icon: 'location-on' },
        { id: 'duration', label: 'Duração', icon: 'event' },
        { id: 'characteristics', label: 'Detalhes', icon: 'tune' },
    ];

    const handlePropertyTypeToggle = (type: Property['property_type']) => {
        const currentTypes = localFilters.property_types || [];
        const newTypes = currentTypes.includes(type)
            ? currentTypes.filter(t => t !== type)
            : [...currentTypes, type];

        setLocalFilters(prev => ({
            ...prev,
            property_types: newTypes.length > 0 ? newTypes : undefined,
        }));
    };

    const handlePriceChange = (min: number, max: number) => {
        setLocalFilters(prev => ({
            ...prev,
            min_price: min > 0 ? min : undefined,
            max_price: max < 1000000 ? max : undefined,
        }));
    };

    const handleLocationChange = (data: {
        province?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
        radius?: number;
    }) => {
        setLocalFilters(prev => ({
            ...prev,
            ...data,
        }));
    };

    const handleDurationChange = (duration?: Property['rental_duration']) => {
        setLocalFilters(prev => ({
            ...prev,
            rental_duration: duration,
        }));
    };

    const handleApply = () => {
        onApplyFilters(localFilters);
        onClose();
    };

    const handleClear = () => {
        setLocalFilters({});
        onClearFilters();
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'type':
                return (
                    <PropertyTypeFilter
                        selectedTypes={localFilters.property_types || []}
                        onSelectType={handlePropertyTypeToggle}
                    />
                );

            case 'price':
                return (
                    <PriceRangeFilter
                        minPrice={localFilters.min_price}
                        maxPrice={localFilters.max_price}
                        onPriceChange={handlePriceChange}
                    />
                );

            case 'location':
                return (
                    <LocationMapFilter
                        province={localFilters.province}
                        city={localFilters.city}
                        latitude={localFilters.latitude}
                        longitude={localFilters.longitude}
                        radius={localFilters.radius}
                        onLocationChange={handleLocationChange}
                    />
                );

            case 'duration':
                return (
                    <DurationFilter
                        selectedDuration={localFilters.rental_duration}
                        onSelectDuration={handleDurationChange}
                    />
                );

            case 'characteristics':
                return (
                    <CharacteristicsFilter
                        bedrooms={localFilters.bedrooms}
                        bathrooms={localFilters.bathrooms}
                        minArea={localFilters.min_area}
                        maxArea={localFilters.max_area}
                        amenities={localFilters.amenities}
                        status={localFilters.status}
                        isFurnished={localFilters.is_furnished}
                        hasParking={localFilters.has_parking}
                        hasPool={localFilters.has_pool}
                        hasGarden={localFilters.has_garden}
                        hasSecurity={localFilters.has_security}
                        availableFrom={localFilters.available_from}
                        onBedroomsChange={(value) =>
                            setLocalFilters(prev => ({ ...prev, bedrooms: value }))
                        }
                        onBathroomsChange={(value) =>
                            setLocalFilters(prev => ({ ...prev, bathrooms: value }))
                        }
                        onAreaChange={(min, max) =>
                            setLocalFilters(prev => ({
                                ...prev,
                                min_area: min,
                                max_area: max
                            }))
                        }
                        onAmenitiesChange={(amenities) =>
                            setLocalFilters(prev => ({
                                ...prev,
                                amenities: amenities.length > 0 ? amenities : undefined
                            }))
                        }
                        onStatusChange={(status) =>
                            setLocalFilters(prev => ({ ...prev, status }))
                        }
                        onBooleanFilterChange={(key, value) => {
                            setLocalFilters(prev => ({ ...prev, [key]: value }));
                        }}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color={colors.foreground} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Filtros</Text>
                        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                            <Text style={styles.clearButtonText}>Limpar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsContainer}
                    >
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab.id}
                                style={[
                                    styles.tab,
                                    activeTab === tab.id && styles.tabActive,
                                ]}
                                onPress={() => setActiveTab(tab.id)}
                                activeOpacity={0.7}
                            >
                                <MaterialIcons
                                    name={tab.icon as any}
                                    size={20}
                                    color={activeTab === tab.id ? colors.primary : colors.mutedForeground}
                                />
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === tab.id && styles.tabTextActive,
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Content */}
                    <View style={styles.content}>
                        {renderTabContent()}
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={handleApply}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: height * 0.85,
        paddingTop: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...typography.h3,
        color: colors.foreground,
    },
    clearButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    clearButtonText: {
        ...typography.label,
        color: colors.destructive,
        fontWeight: '600',
    },
    tabsContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.sm,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tabActive: {
        backgroundColor: colors.secondary,
        borderColor: colors.primary,
    },
    tabText: {
        ...typography.label,
        color: colors.mutedForeground,
        fontSize: 13,
    },
    tabTextActive: {
        color: colors.primary,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    applyButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    applyButtonText: {
        ...typography.h4,
        color: colors.primaryForeground,
        fontWeight: '600',
    },
});
