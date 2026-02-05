import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { useAuth } from '@/context/AuthContext';
import { createProperty, uploadPropertyImage, uploadPropertyDocument } from '@/services/properties';
import { colors, spacing, typography } from '@/utils/theme';
import { Card, Input, Button } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { ImageUploader } from '@/components/owner/ImageUploader';
import { DocumentUploader } from '@/components/owner/DocumentUploader';
import { AMENITIES } from '@/constants/enums';
import {
  convertPropertyTypeNewToOld,
  convertRentalDurationNewToOld,
  convertStatusNewToOld
} from '@/utils/propertyTypeMapper';

// Zod Schema (Matching WebApp)
const propertySchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres").max(100, "O título deve ter no máximo 100 caracteres"),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres").max(2000, "A descrição deve ter no máximo 2000 caracteres"),
  property_type: z.enum(["apartment", "villa", "shop", "land"]),
  province: z.string().min(2, "Selecione uma província"),
  city: z.string().min(2, "Informe a cidade"),
  neighborhood: z.string().optional(),
  address: z.string().optional(), // Used for phone number
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  price: z.number().min(1, "O preço deve ser maior que 0"),
  currency: z.enum(["AOA", "USD", "MT"]), // Added MT for consistency with rest of app
  rental_duration: z.enum(["monthly", "yearly"]).optional(),
  bedrooms: z.number().min(0).max(20),
  bathrooms: z.number().min(0).max(10),
  area_sqm: z.number().min(1, "A área deve ser maior que 0").optional(),
  status: z.enum(["novo", "usado", "em_construcao"]),
  is_furnished: z.boolean(),
  has_parking: z.boolean(),
  has_pool: z.boolean(),
  has_garden: z.boolean(),
  has_security: z.boolean(),
  allows_renovations: z.boolean(),
  special_conditions: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const provinces = [
  "Maputo", "Gaza", "Inhambane", "Sofala", "Manica", "Tete", "Zambézia", "Nampula", "Niassa", "Cabo Delgado",
  "Luanda", "Bengo", "Benguela", "Huíla" // Added Luanda/Angola provinces as in user request, mostly mixing contexts here but following user req.
];

const propertyTypes = [
  { value: "apartment", label: "Apartamento" },
  { value: "villa", label: "Vivenda" },
  { value: "shop", label: "Loja" },
  { value: "land", label: "Terreno" },
];

export default function PublishScreen() {
  const { user, isAdmin } = useAuth();
  const navigation = useNavigation<any>();
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [transactionType, setTransactionType] = useState<'venda' | 'arrendamento'>('arrendamento');

  const { control, handleSubmit, setValue, reset, formState: { errors }, watch } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      property_type: "apartment",
      province: "",
      city: "",
      neighborhood: "",
      address: "",
      latitude: null,
      longitude: null,
      price: 0,
      currency: "AOA",
      rental_duration: "monthly",
      bedrooms: 1,
      bathrooms: 1,
      area_sqm: undefined,
      status: "usado",
      is_furnished: false,
      has_parking: false,
      has_pool: false,
      has_garden: false,
      has_security: false,
      allows_renovations: false,
      special_conditions: "",
      amenities: [],
    },
  });

  // const [docImages, setDocImages] = useState<string[]>([]);

  const handleGetCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à localização.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setValue("latitude", location.coords.latitude);
      setValue("longitude", location.coords.longitude);
      Alert.alert("Sucesso", "Localização obtida!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao obter localização.");
    } finally {
      setGettingLocation(false);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (images.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos uma imagem.");
      return;
    }

    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    setSubmitting(true);
    try {
      // Upload Images
      const uploadedUrls: string[] = [];
      for (const imgUri of images) {
        if (imgUri.startsWith('file:') || imgUri.startsWith('content:')) {
          const url = await uploadPropertyImage(imgUri, user.id);
          if (url) uploadedUrls.push(url);
        } else {
          uploadedUrls.push(imgUri); // Already remote
        }
      }

      // Upload Documents - Comentado por ora
      // const uploadedDocUrls: string[] = [];
      // for (const docUri of docImages) {
      //   if (docUri.startsWith('file:') || docUri.startsWith('content:')) {
      //     const url = await uploadPropertyDocument(docUri, user.id);
      //     if (url) uploadedDocUrls.push(url);
      //   } else {
      //     uploadedDocUrls.push(docUri);
      //   }
      // }

      // Prepare payload
      const payload: any = {
        ...data,
        // Converter valores do novo formato (EN) para antigo (PT) que o banco espera
        property_type: convertPropertyTypeNewToOld(data.property_type),
        rental_duration: convertRentalDurationNewToOld(data.rental_duration),
        status: convertStatusNewToOld(data.status),
        owner_id: user.id,
        is_approved: true, // Universal auto-approval as per user request
        is_available: true,
        images: uploadedUrls,
        cover_image: uploadedUrls[0] || null,
        // documentation_urls: uploadedDocUrls,
        // has_documents: uploadedDocUrls.length > 0,
      };

      // Map Enum values if necessary (DB expects specific strings)
      // Assuming DB accepts 'casa', 'apartamento' etc directly.

      const result = await createProperty(payload);

      if (result) {
        // Limpar dados do formulário
        reset();
        setImages([]);

        Alert.alert(
          "Cadastro Finalizado com sucesso!",
          "Seu imóvel foi publicado com sucesso e já está visível para todos os usuários.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate('Home');
              }
            }
          ]
        );
      } else {
        throw new Error("Falha ao criar imóvel no banco de dados.");
      }

    } catch (error: any) {
      console.error('Publish error:', error);
      Alert.alert("Erro", error.message || "Ocorreu um erro ao publicar.");
    } finally {
      setSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.log('Validation Errors:', errors);
    Alert.alert(
      'Dados Inválidos',
      'Por favor verifique os campos em vermelho. Certifique-se de preencher todos os campos obrigatórios.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Publicar Imóvel</Text>
        </View>

        {/* Images */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Imagens do Imóvel</Text>
          <ImageUploader
            images={images}
            onImagesChange={setImages}
            maxImages={10}
          />
        </Card>

        {/* Documents - Comentado por ora */}
        {/* <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Documentação Legais</Text>
          <DocumentUploader
            documents={docImages}
            onDocumentsChange={setDocImages}
            maxDocs={5}
          />
        </Card> */}

        {/* Basic Info */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Título do Anúncio"
                placeholder="Ex: Apartamento T3 no Kilamba"
                value={value}
                onChangeText={onChange}
                style={errors.title && styles.inputError}
              />
            )}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Descrição"
                placeholder="Descreva o imóvel..."
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
                style={[styles.textArea, errors.description && styles.inputError]}
              />
            )}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

          <Text style={styles.label}>Tipo de Imóvel</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {propertyTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.chip,
                  watch('property_type') === type.value && styles.chipSelected
                ]}
                onPress={() => setValue('property_type', type.value as any)}
              >
                <Text style={[
                  styles.chipText,
                  watch('property_type') === type.value && styles.chipTextSelected
                ]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Estado</Text>
          <View style={styles.row}>
            {["novo", "usado", "em_construcao"].map((st) => (
              <TouchableOpacity
                key={st}
                style={[
                  styles.chip,
                  watch('status') === st && styles.chipSelected
                ]}
                onPress={() => setValue('status', st as any)}
              >
                <Text style={[
                  styles.chipText,
                  watch('status') === st && styles.chipTextSelected
                ]}>{st.toUpperCase().replace('_', ' ')}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Location */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Localização</Text>
            <TouchableOpacity onPress={handleGetCurrentLocation} disabled={gettingLocation}>
              {gettingLocation ? <ActivityIndicator size="small" /> : <MaterialIcons name="my-location" size={24} color={colors.primary} />}
            </TouchableOpacity>
          </View>

          <Controller
            control={control}
            name="province"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Província"
                placeholder="Ex: Luanda"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.province && <Text style={styles.errorText}>{errors.province.message}</Text>}

          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Cidade"
                placeholder="Ex: Belas"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}

          <Controller
            control={control}
            name="neighborhood"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Bairro"
                placeholder="Ex: Talatona"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Nº Telefone"
                placeholder="Ex: +244 923 456 789"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
              />
            )}
          />
        </Card>

        {/* Price & Duration */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Preço e Duração</Text>
          <View style={styles.row}>
            <View style={{ flex: 2 }}>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Preço"
                    keyboardType="numeric"
                    value={value > 0 ? value.toString() : ''}
                    onChangeText={(t) => onChange(Number(t))}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Moeda</Text>
              <ScrollView horizontal style={styles.chipScroll}>
                {["AOA", "USD", "MT"].map(curr => (
                  <TouchableOpacity
                    key={curr}
                    style={[styles.chipSmall, watch('currency') === curr && styles.chipSelected]}
                    onPress={() => setValue('currency', curr as any)}
                  >
                    <Text style={watch('currency') === curr && styles.chipTextSelected}>{curr}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}

          <Text style={styles.label}>Tipo de Transação</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.chip,
                transactionType === 'venda' && styles.chipSelected
              ]}
              onPress={() => {
                setTransactionType('venda');
                setValue('rental_duration', undefined);
              }}
            >
              <Text style={[
                styles.chipText,
                transactionType === 'venda' && styles.chipTextSelected
              ]}>Venda</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                transactionType === 'arrendamento' && styles.chipSelected
              ]}
              onPress={() => {
                setTransactionType('arrendamento');
                setValue('rental_duration', 'monthly');
              }}
            >
              <Text style={[
                styles.chipText,
                transactionType === 'arrendamento' && styles.chipTextSelected
              ]}>Arrendamento</Text>
            </TouchableOpacity>
          </View>

          {transactionType === 'arrendamento' && (
            <>
              <Text style={styles.label}>Duração do Arrendamento</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[
                    styles.chip,
                    watch('rental_duration') === 'monthly' && styles.chipSelected
                  ]}
                  onPress={() => setValue('rental_duration', 'monthly')}
                >
                  <Text style={[
                    styles.chipText,
                    watch('rental_duration') === 'monthly' && styles.chipTextSelected
                  ]}>Mensal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.chip,
                    watch('rental_duration') === 'yearly' && styles.chipSelected
                  ]}
                  onPress={() => setValue('rental_duration', 'yearly')}
                >
                  <Text style={[
                    styles.chipText,
                    watch('rental_duration') === 'yearly' && styles.chipTextSelected
                  ]}>Anual</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Card>

        {/* Characteristics */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="bedrooms"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Quartos"
                    keyboardType="numeric"
                    value={value.toString()}
                    onChangeText={(t) => onChange(Number(t))}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1, marginHorizontal: 8 }}>
              <Controller
                control={control}
                name="bathrooms"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Banhos"
                    keyboardType="numeric"
                    value={value.toString()}
                    onChangeText={(t) => onChange(Number(t))}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="area_sqm"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Área (m²)"
                    keyboardType="numeric"
                    value={value ? value.toString() : ''}
                    onChangeText={(t) => onChange(t ? Number(t) : undefined)}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.checkboxGrid}>
            <Controller
              control={control}
              name="is_furnished"
              render={({ field: { onChange, value } }) => (
                <Checkbox label="Mobilado" checked={value} onCheckedChange={onChange} />
              )}
            />
            <Controller
              control={control}
              name="has_parking"
              render={({ field: { onChange, value } }) => (
                <Checkbox label="Estacionamento" checked={value} onCheckedChange={onChange} />
              )}
            />
            <Controller
              control={control}
              name="has_pool"
              render={({ field: { onChange, value } }) => (
                <Checkbox label="Piscina" checked={value} onCheckedChange={onChange} />
              )}
            />
            <Controller
              control={control}
              name="has_garden"
              render={({ field: { onChange, value } }) => (
                <Checkbox label="Jardim" checked={value} onCheckedChange={onChange} />
              )}
            />
            <Controller
              control={control}
              name="has_security"
              render={({ field: { onChange, value } }) => (
                <Checkbox label="Segurança" checked={value} onCheckedChange={onChange} />
              )}
            />
            <Controller
              control={control}
              name="allows_renovations"
              render={({ field: { onChange, value } }) => (
                <Checkbox label="Permite Renovações" checked={value} onCheckedChange={onChange} />
              )}
            />
          </View>


          <Text style={[styles.label, { marginTop: spacing.md }]}>Outras Comodidades</Text>
          <View style={styles.checkboxGrid}>
            {AMENITIES.map((amenity) => (
              <TouchableOpacity
                key={amenity.id}
                style={[
                  styles.amenityChip,
                  (watch('amenities') || []).includes(amenity.id) && styles.amenityChipSelected
                ]}
                onPress={() => {
                  const current = watch('amenities') || [];
                  if (current.includes(amenity.id)) {
                    setValue('amenities', current.filter(id => id !== amenity.id));
                  } else {
                    setValue('amenities', [...current, amenity.id]);
                  }
                }}
              >
                <MaterialIcons
                  name={(watch('amenities') || []).includes(amenity.id) ? "check-box" : "check-box-outline-blank"}
                  size={20}
                  color={(watch('amenities') || []).includes(amenity.id) ? colors.primary : colors.mutedForeground}
                />
                <Text style={[
                  styles.amenityText,
                  (watch('amenities') || []).includes(amenity.id) && styles.amenityTextSelected
                ]}>{amenity.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ marginTop: spacing.md }}>
            <Controller
              control={control}
              name="special_conditions"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Condições Especiais / Regras"
                  placeholder="Ex: Não aceita animais, limpeza semanal incluída..."
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                  style={styles.textAreaSmall}
                />
              )}
            />
          </View>
        </Card>

        <Button
          onPress={handleSubmit(onSubmit, onError)}
          disabled={submitting}
          style={styles.submitButton}
        >
          {submitting ? (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <ActivityIndicator color="#FFF" />
              <Text style={styles.buttonText}>Publicando...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Publicar Imóvel</Text>
          )}
        </Button>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.foreground,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  inputError: {
    borderColor: colors.destructive,
  },
  errorText: {
    color: colors.destructive,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  textAreaSmall: {
    height: 70,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.foreground,
  },
  chipScroll: {
    marginBottom: spacing.md,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.muted,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.muted,
    marginRight: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.mutedForeground,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    padding: 8,
    gap: 8,
  },
  amenityChipSelected: {
    backgroundColor: colors.primary + '05',
    borderRadius: 8,
  },
  amenityText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  amenityTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  submitButton: {
    marginVertical: spacing.lg,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
