import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Circle } from 'react-native-maps';
import { colors, spacing, typography } from '@/utils/theme';
import { PROVINCES } from '@/constants/enums';

interface LocationMapFilterProps {
    province?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    onLocationChange: (data: {
        province?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
        radius?: number;
    }) => void;
}

const CITIES_BY_PROVINCE: Record<string, string[]> = {
    'Maputo': ['Maputo', 'Matola', 'Boane'],
    'Gaza': ['Xai-Xai', 'Chókwè', 'Chibuto'],
    'Inhambane': ['Inhambane', 'Maxixe', 'Vilankulo'],
    'Sofala': ['Beira', 'Dondo', 'Gorongosa'],
    'Manica': ['Chimoio', 'Gondola', 'Manica'],
    'Tete': ['Tete', 'Moatize', 'Cahora Bassa'],
    'Zambézia': ['Quelimane', 'Mocuba', 'Gurué'],
    'Nampula': ['Nampula', 'Nacala', 'Angoche'],
    'Cabo Delgado': ['Pemba', 'Montepuez', 'Mocímboa da Praia'],
    'Niassa': ['Lichinga', 'Cuamba', 'Mandimba'],
};

// Approximate coordinates for major cities in Mozambique
const CITY_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
    'Maputo': { latitude: -25.9655, longitude: 32.5832 },
    'Matola': { latitude: -25.9622, longitude: 32.4589 },
    'Beira': { latitude: -19.8436, longitude: 34.8389 },
    'Nampula': { latitude: -15.1165, longitude: 39.2666 },
    'Chimoio': { latitude: -19.1164, longitude: 33.4833 },
    'Quelimane': { latitude: -17.8786, longitude: 36.8883 },
    'Tete': { latitude: -16.1564, longitude: 33.5867 },
    'Xai-Xai': { latitude: -25.0519, longitude: 33.6442 },
    'Pemba': { latitude: -12.9740, longitude: 40.5178 },
    'Inhambane': { latitude: -23.8650, longitude: 35.3833 },
    'Lichinga': { latitude: -13.3125, longitude: 35.2406 },
};

export const LocationMapFilter: React.FC<LocationMapFilterProps> = ({
    province,
    city,
    latitude,
    longitude,
    radius = 10,
    onLocationChange,
}) => {
    const [selectedProvince, setSelectedProvince] = useState(province);
    const [selectedCity, setSelectedCity] = useState(city);
    const [mapRegion, setMapRegion] = useState({
        latitude: latitude || -18.665695,
        longitude: longitude || 35.529562,
        latitudeDelta: 10,
        longitudeDelta: 10,
    });
    const [selectedRadius, setSelectedRadius] = useState(radius);

    useEffect(() => {
        if (selectedCity && CITY_COORDINATES[selectedCity]) {
            const coords = CITY_COORDINATES[selectedCity];
            setMapRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            });
            onLocationChange({
                province: selectedProvince,
                city: selectedCity,
                latitude: coords.latitude,
                longitude: coords.longitude,
                radius: selectedRadius,
            });
        }
    }, [selectedCity]);

    const handleProvinceSelect = (prov: string) => {
        setSelectedProvince(prov);
        setSelectedCity(undefined);
        onLocationChange({
            province: prov,
            city: undefined,
            latitude: undefined,
            longitude: undefined,
            radius: selectedRadius,
        });
    };

    const handleCitySelect = (cty: string) => {
        setSelectedCity(cty);
    };

    const radiusOptions = [5, 10, 20, 50];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Localização</Text>

            {/* Province Selector */}
            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Província</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipContainer}
                >
                    {PROVINCES.map((prov) => (
                        <TouchableOpacity
                            key={prov}
                            style={[
                                styles.chip,
                                selectedProvince === prov && styles.chipSelected,
                            ]}
                            onPress={() => handleProvinceSelect(prov)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    selectedProvince === prov && styles.chipTextSelected,
                                ]}
                            >
                                {prov}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* City Selector */}
            {selectedProvince && (
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Cidade</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chipContainer}
                    >
                        {CITIES_BY_PROVINCE[selectedProvince]?.map((cty) => (
                            <TouchableOpacity
                                key={cty}
                                style={[
                                    styles.chip,
                                    selectedCity === cty && styles.chipSelected,
                                ]}
                                onPress={() => handleCitySelect(cty)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        selectedCity === cty && styles.chipTextSelected,
                                    ]}
                                >
                                    {cty}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Map View */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    region={mapRegion}
                    onRegionChangeComplete={setMapRegion}
                >
                    {mapRegion.latitude && mapRegion.longitude && (
                        <>
                            <Marker
                                coordinate={{
                                    latitude: mapRegion.latitude,
                                    longitude: mapRegion.longitude,
                                }}
                                title={selectedCity || 'Localização'}
                            />
                            <Circle
                                center={{
                                    latitude: mapRegion.latitude,
                                    longitude: mapRegion.longitude,
                                }}
                                radius={selectedRadius * 1000}
                                fillColor="rgba(59, 130, 246, 0.2)"
                                strokeColor="rgba(59, 130, 246, 0.5)"
                                strokeWidth={2}
                            />
                        </>
                    )}
                </MapView>
            </View>

            {/* Radius Selector */}
            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Raio de Busca</Text>
                <View style={styles.radiusContainer}>
                    {radiusOptions.map((r) => (
                        <TouchableOpacity
                            key={r}
                            style={[
                                styles.radiusButton,
                                selectedRadius === r && styles.radiusButtonSelected,
                            ]}
                            onPress={() => {
                                setSelectedRadius(r);
                                onLocationChange({
                                    province: selectedProvince,
                                    city: selectedCity,
                                    latitude: mapRegion.latitude,
                                    longitude: mapRegion.longitude,
                                    radius: r,
                                });
                            }}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.radiusText,
                                    selectedRadius === r && styles.radiusTextSelected,
                                ]}
                            >
                                {r} km
                            </Text>
                        </TouchableOpacity>
                    ))}
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
        marginBottom: spacing.md,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionLabel: {
        ...typography.label,
        color: colors.foreground,
        marginBottom: spacing.sm,
    },
    chipContainer: {
        gap: spacing.sm,
        paddingRight: spacing.md,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        ...typography.label,
        color: colors.foreground,
        fontSize: 13,
    },
    chipTextSelected: {
        color: colors.primaryForeground,
        fontWeight: '600',
    },
    mapContainer: {
        height: 250,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    map: {
        flex: 1,
    },
    radiusContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    radiusButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: 8,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    radiusButtonSelected: {
        backgroundColor: colors.secondary,
        borderColor: colors.primary,
    },
    radiusText: {
        ...typography.label,
        color: colors.mutedForeground,
    },
    radiusTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
});
