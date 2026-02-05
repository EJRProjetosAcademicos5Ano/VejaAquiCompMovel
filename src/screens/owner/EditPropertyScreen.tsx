import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { createProperty, updateProperty, getPropertyById } from '@/services/properties';
import { Property } from '@/types/property';
import { PROPERTY_TYPES, PROVINCES, RENTAL_DURATIONS } from '@/constants/enums';
import {
    convertPropertyTypeOldToNew,
    convertPropertyTypeNewToOld,
    convertRentalDurationOldToNew,
    convertRentalDurationNewToOld,
    convertStatusOldToNew,
    convertStatusNewToOld
} from '@/utils/propertyTypeMapper';

export default function EditPropertyScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { user } = useAuth();
    const propertyId = route.params?.propertyId;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [propertyType, setPropertyType] = useState<Property['property_type']>(PROPERTY_TYPES[0]?.id || 'apartment');
    const [rentalDuration, setRentalDuration] = useState('monthly');
    const [province, setProvince] = useState(PROVINCES[0]);
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [bedrooms, setBedrooms] = useState('1');
    const [bathrooms, setBathrooms] = useState('1');
    const [area, setArea] = useState('');
    const [specialConditions, setSpecialConditions] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]);

    useEffect(() => {
        if (propertyId) {
            loadProperty();
        } else {
            setLoading(false);
        }
    }, [propertyId]);

    const loadProperty = async () => {
        setLoading(true);
        setError(null);
        console.log('🔄 Loading property:', propertyId);
        try {
            const data = await getPropertyById(propertyId, user?.id);
            console.log('✅ Property loaded:', !!data);
            if (data) {
                setTitle(data.title || '');
                setDescription(data.description || '');
                setPrice(data.price?.toString() || '');
                // Converter property_type do banco (antigo) para novo formato
                setPropertyType(convertPropertyTypeOldToNew(data.property_type) as any);

                // Handle rentalDuration - converter do formato antigo
                let rentalDur = 'monthly';
                if (typeof data.rental_duration === 'string') {
                    rentalDur = convertRentalDurationOldToNew(data.rental_duration);
                } else if ((data.rental_duration as any)?.id) {
                    rentalDur = convertRentalDurationOldToNew((data.rental_duration as any).id);
                }
                setRentalDuration(rentalDur);

                // Handle province - could be string or object, ensure it's a valid province string
                let prov = PROVINCES[0];
                if (typeof data.province === 'string') {
                    prov = data.province;
                } else if (data.province && typeof data.province === 'object') {
                    prov = (data.province as any)?.label || (data.province as any)?.name || PROVINCES[0];
                }
                setProvince(prov);

                setCity(data.city || '');
                setAddress(data.address || '');
                setBedrooms(data.bedrooms?.toString() || '1');
                setBathrooms(data.bathrooms?.toString() || '1');
                setArea(data.area_sqm?.toString() || '');
                setSpecialConditions(data.special_conditions || '');

                // Load existing images if any
                const rawData = data as any;
                if (rawData.property_images && Array.isArray(rawData.property_images)) {
                    setExistingImages(rawData.property_images);
                }
            } else {
                setError('Imóvel não encontrado.');
            }
        } catch (err: any) {
            console.error('❌ Error:', err);
            setError(err?.message || 'Erro ao carregar');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão', 'Precisa de permissão para acessar fotos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageId: string) => {
        setExistingImages(existingImages.filter(img => img.id !== imageId));
    };

    const handleSave = async () => {
        if (!title.trim() || !price.trim() || !city.trim()) {
            Alert.alert('Erro', 'Preencha título, preço e cidade');
            return;
        }

        setSaving(true);
        try {
            const data: any = {
                title,
                description,
                price: parseFloat(price),
                // Converter property_type de novo (EN) para antigo (PT) para enviar ao banco
                property_type: convertPropertyTypeNewToOld(propertyType),
                // Converter rental_duration para o formato antigo
                rental_duration: convertRentalDurationNewToOld(rentalDuration),
                province,
                city,
                address,
                bedrooms: parseInt(bedrooms) || 0,
                bathrooms: parseInt(bathrooms) || 0,
                area_sqm: parseFloat(area) || 0,
                special_conditions: specialConditions,
                is_available: true,
                currency: 'MT',
            };

            if (!propertyId) {
                data.owner_id = user?.id; // Only set owner for new ones
            }

            if (propertyId) {
                const result = await updateProperty(propertyId, data);
                if (result) {
                    // Recarregar os dados para atualizar a UI
                    await loadProperty();
                    Alert.alert('Sucesso', 'Anúncio atualizado!', [
                        { text: 'OK', onPress: () => navigation.goBack() }
                    ]);
                } else {
                    Alert.alert('Erro', 'Falha ao atualizar. Verifique os dados.');
                }
            } else {
                const result = await createProperty(data);
                if (result) {
                    Alert.alert('Sucesso', 'Anúncio criado!', [
                        { text: 'OK', onPress: () => navigation.goBack() }
                    ]);
                } else {
                    Alert.alert('Erro', 'Falha ao criar anúncio.');
                }
            }
        } catch (err: any) {
            console.error('Save error:', err);
            Alert.alert('Erro', err?.message || 'Falha ao salvar');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Carregando...</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Erro</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonText}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {propertyId ? 'Editar' : 'Novo Anúncio'}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Imagens */}
                    <View style={styles.group}>
                        <Text style={styles.label}>Imagens</Text>

                        {/* Imagens Existentes */}
                        {existingImages.length > 0 && (
                            <View>
                                <Text style={[styles.label, { fontSize: 12, marginBottom: spacing.sm }]}>Imagens Atuais</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
                                    {existingImages.map((img, idx) => (
                                        <View key={img.id || idx} style={styles.imageContainer}>
                                            <Image
                                                source={{ uri: img.url || img.image_url }}
                                                style={styles.image}
                                            />
                                            <TouchableOpacity
                                                style={styles.imageRemoveBtn}
                                                onPress={() => removeExistingImage(img.id)}
                                            >
                                                <MaterialIcons name="close" size={20} color={colors.card} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Novas Imagens */}
                        {images.length > 0 && (
                            <View>
                                <Text style={[styles.label, { fontSize: 12, marginBottom: spacing.sm }]}>Novas Imagens</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
                                    {images.map((uri, idx) => (
                                        <View key={idx} style={styles.imageContainer}>
                                            <Image source={{ uri }} style={styles.image} />
                                            <TouchableOpacity
                                                style={styles.imageRemoveBtn}
                                                onPress={() => removeImage(idx)}
                                            >
                                                <MaterialIcons name="close" size={20} color={colors.card} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Botão Adicionar Imagem */}
                        <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                            <MaterialIcons name="add-a-photo" size={24} color={colors.primary} />
                            <Text style={styles.imagePickerText}>Adicionar Imagem</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Título */}
                    <View style={styles.group}>
                        <Text style={styles.label}>Título *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ex: Apartamento T3 moderno"
                            placeholderTextColor={colors.mutedForeground}
                        />
                    </View>

                    {/* Descrição */}
                    <View style={styles.group}>
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput
                            style={[styles.input, styles.textarea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Descreva o imóvel..."
                            placeholderTextColor={colors.mutedForeground}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    {/* Preço */}
                    <View style={styles.row}>
                        <View style={[styles.group, { flex: 1 }]}>
                            <Text style={styles.label}>Preço (MT) *</Text>
                            <TextInput
                                style={styles.input}
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                placeholder="0.00"
                                placeholderTextColor={colors.mutedForeground}
                            />
                        </View>
                        <View style={[styles.group, { flex: 1, marginLeft: spacing.md }]}>
                            <Text style={styles.label}>Duração</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {RENTAL_DURATIONS.map((duration: any) => (
                                    <TouchableOpacity
                                        key={duration.id}
                                        style={[
                                            styles.chip,
                                            rentalDuration === duration.id && styles.chipActive
                                        ]}
                                        onPress={() => setRentalDuration(duration.id)}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            rentalDuration === duration.id && styles.chipTextActive
                                        ]}>
                                            {duration.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    {/* Tipo de Imóvel */}
                    <View style={styles.group}>
                        <Text style={styles.label}>Tipo de Imóvel</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {PROPERTY_TYPES.map((type: any) => (
                                <TouchableOpacity
                                    key={type.id}
                                    style={[
                                        styles.chip,
                                        propertyType === type.id && styles.chipActive
                                    ]}
                                    onPress={() => setPropertyType(type.id)}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        propertyType === type.id && styles.chipTextActive
                                    ]}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Localização */}
                    <View style={styles.group}>
                        <Text style={styles.label}>Província</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {PROVINCES.map((prov: string) => (
                                <TouchableOpacity
                                    key={prov}
                                    style={[
                                        styles.chip,
                                        province === prov && styles.chipActive
                                    ]}
                                    onPress={() => setProvince(prov)}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        province === prov && styles.chipTextActive
                                    ]}>
                                        {prov}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Cidade */}
                    <View style={styles.group}>
                        <Text style={styles.label}>Cidade *</Text>
                        <TextInput
                            style={styles.input}
                            value={city}
                            onChangeText={setCity}
                            placeholder="Ex: Maputo"
                            placeholderTextColor={colors.mutedForeground}
                        />
                    </View>

                    {/* Endereço */}
                    <View style={styles.group}>
                        <Text style={styles.label}>Endereço</Text>
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Ex: Av. Julius Nyerere, 123"
                            placeholderTextColor={colors.mutedForeground}
                        />
                    </View>

                    {/* Características */}
                    <View style={styles.row}>
                        <View style={[styles.group, { flex: 1 }]}>
                            <Text style={styles.label}>Quartos</Text>
                            <TextInput
                                style={styles.input}
                                value={bedrooms}
                                onChangeText={setBedrooms}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                        <View style={[styles.group, { flex: 1, marginLeft: spacing.md }]}>
                            <Text style={styles.label}>Banheiros</Text>
                            <TextInput
                                style={styles.input}
                                value={bathrooms}
                                onChangeText={setBathrooms}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                        <View style={[styles.group, { flex: 1, marginLeft: spacing.md }]}>
                            <Text style={styles.label}>Área (m²)</Text>
                            <TextInput
                                style={styles.input}
                                value={area}
                                onChangeText={setArea}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                    </View>

                    {/* Condições Especiais */}
                    <View style={styles.group}>
                        <Text style={styles.label}>Condições Especiais</Text>
                        <TextInput
                            style={[styles.input, styles.textarea]}
                            value={specialConditions}
                            onChangeText={setSpecialConditions}
                            placeholder="Ex: Não aceita animais..."
                            placeholderTextColor={colors.mutedForeground}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Botão Salvar */}
                    <TouchableOpacity
                        style={[styles.button, saving && styles.buttonDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>
                                {propertyId ? 'Atualizar' : 'Criar'} Anúncio
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.card,
    },
    headerTitle: {
        ...typography.h3,
        color: colors.foreground,
        fontWeight: '600',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.md,
    },
    content: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    group: {
        marginBottom: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.label,
        color: colors.foreground,
        marginBottom: spacing.sm,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        color: colors.foreground,
        fontSize: 14,
    },
    textarea: {
        height: 100,
        textAlignVertical: 'top',
        paddingVertical: spacing.md,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        marginRight: spacing.sm,
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
        fontSize: 12,
        color: colors.mutedForeground,
        fontWeight: '500',
    },
    chipTextActive: {
        color: colors.primaryForeground,
        fontWeight: '600',
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: colors.primaryForeground,
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: colors.destructive,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    imageContainer: {
        position: 'relative',
        marginRight: spacing.md,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 8,
        backgroundColor: colors.muted,
    },
    imageRemoveBtn: {
        position: 'absolute',
        top: spacing.xs,
        right: spacing.xs,
        backgroundColor: colors.destructive,
        borderRadius: 12,
        padding: 4,
    },
    imagePickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        borderRadius: 8,
        paddingVertical: spacing.lg,
        gap: spacing.md,
    },
    imagePickerText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});
