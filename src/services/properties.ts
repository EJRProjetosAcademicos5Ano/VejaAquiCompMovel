/**
 * Properties Service
 * Queries reais para o Supabase
 * Schema: properties table
 */

import { supabase } from '@/services/supabase';
import { Property, Location, SearchFilters } from '@/types/property';
import { convertPropertyTypeNewToOld, getPropertySearchTypes } from '@/utils/propertyTypeMapper';
import { propertyMapper } from '@/mappers/propertyMapper';
import { isValidUUID } from '@/utils/validation';

/**
 * Obter propriedades em destaque (featured)
 */
export async function getFeaturedProperties(limit: number = 6, userId?: string): Promise<Property[]> {
  try {
    let query = supabase
      .from('properties')
      .select('*, property_images(*)')
    // Simplified visibility logic:
    // 1. If we have a userId, we might want to see private items (owners)
    // 2. But for generic list, we usually just want approved & available items
    // To be safe and simple:
    if (userId && isValidUUID(userId)) {
      query = query.or(`is_approved.eq.true,owner_id.eq.${userId}`).eq('is_available', true);
    } else {
      query = query.eq('is_approved', true).eq('is_available', true);
    }

    const { data, error } = await query;

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('Supabase data (featured):', data);
      console.log('Supabase error (featured):', error);
    }

    const processed = (data || []).map((p: any) => propertyMapper(p));

    if (error) {
      console.error('Error fetching featured properties:', error);
      return [];
    }

    return processed || [];
  } catch (error) {
    console.error('Exception in getFeaturedProperties:', error);
    return [];
  }
}

/**
 * Obter propriedades mais recentes
 */
export async function getLatestProperties(limit: number = 8, userId?: string): Promise<Property[]> {
  try {
    let query = supabase
      .from('properties')
      .select('*, property_images(*)')
    if (userId && isValidUUID(userId)) {
      query = query.or(`is_approved.eq.true,owner_id.eq.${userId}`).eq('is_available', true);
    } else {
      query = query.eq('is_approved', true).eq('is_available', true);
    }

    const { data, error } = await query;

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('Supabase data (latest):', data);
      console.log('Supabase error (latest):', error);
    }

    const processed = (data || []).map((p: any) => propertyMapper(p));

    if (error) {
      console.error('Error fetching latest properties:', error);
      return [];
    }

    return processed || [];
  } catch (error) {
    console.error('Exception in getLatestProperties:', error);
    return [];
  }
}

/**
 * Obter propriedades por tipo
 */
export async function getPropertiesByType(
  type: string,
  limit: number = 10,
  userId?: string
): Promise<Property[]> {
  try {
    let query = supabase
      .from('properties')
      .select('*, property_images(*)')
      .in('property_type', getPropertySearchTypes(type))
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId && isValidUUID(userId)) {
      query = query.or(`is_approved.eq.true,owner_id.eq.${userId}`).eq('is_available', true);
    } else {
      query = query.eq('is_approved', true).eq('is_available', true);
    }

    const { data, error } = await query;

    console.log('Supabase data:', data);
    console.log('Supabase error:', error);

    const processed = (data || []).map((p: any) => propertyMapper(p));

    if (error) {
      console.error(`Error fetching properties by type ${type}:`, error);
      return [];
    }

    return processed || [];
  } catch (error) {
    console.error(`Exception in getPropertiesByType:`, error);
    return [];
  }
}

/**
 * Obter propriedades por cidade
 */
export async function getPropertiesByCity(
  city: string,
  limit: number = 10,
  userId?: string
): Promise<Property[]> {
  try {
    let query = supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('city', city)
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.or(`is_approved.eq.true,owner_id.eq.${userId}`);
    } else {
      query = query.eq('is_approved', true);
    }

    const { data, error } = await query;

    console.log('Supabase data:', data);
    console.log('Supabase error:', error);

    const processed = (data || []).map((p: any) => propertyMapper(p));

    if (error) {
      console.error(`Error fetching properties in city ${city}:`, error);
      return [];
    }

    return processed || [];
  } catch (error) {
    console.error(`Exception in getPropertiesByCity:`, error);
    return [];
  }
}

/**
 * Obter propriedades por província
 */
export async function getPropertiesByProvince(
  province: string,
  limit: number = 10,
  userId?: string
): Promise<Property[]> {
  try {
    let query = supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('province', province)
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.or(`is_approved.eq.true,owner_id.eq.${userId}`);
    } else {
      query = query.eq('is_approved', true);
    }

    const { data, error } = await query;

    console.log('Supabase data:', data);
    console.log('Supabase error:', error);

    const processed = (data || []).map((p: any) => propertyMapper(p));

    if (error) {
      console.error(`Error fetching properties in province ${province}:`, error);
      return [];
    }

    return processed || [];
  } catch (error) {
    console.error(`Exception in getPropertiesByProvince:`, error);
    return [];
  }
}

/**
 * Obter uma propriedade por ID
 */
export async function getPropertyById(id: string, userId?: string): Promise<Property | null> {
  try {
    let queryBuilder = supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('id', id);

    // If userId is provided (owner accessing their own property), allow any status
    // Otherwise, only show approved and available properties
    if (userId && isValidUUID(userId)) {
      queryBuilder = queryBuilder.or(`is_approved.eq.true,owner_id.eq.${userId}`);
    } else {
      queryBuilder = queryBuilder.eq('is_approved', true).eq('is_available', true);
    }

    const { data, error } = await queryBuilder.single();

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('Supabase data (property):', data);
      console.log('Supabase error (property):', error);
    }

    if (data) {
      // Map to frontend-friendly shape
      const mapped = require('@/mappers/propertyMapper').propertyMapper(data);

      if (error) {
        console.error('Error fetching property:', error);
        return null;
      }

      return mapped;
    }

    if (error) {
      console.error('Error fetching property:', error);
      return null;
    }

    return null;
  } catch (error) {
    console.error('Exception in getPropertyById:', error);
    return null;
  }
}

/**
 * Contar propriedades por tipo
 */
export async function getPropertyTypesCounts(userId?: string): Promise<
  Array<{ property_type: string; count: number }>
> {
  try {
    let query = supabase
      .from('properties')
      .select('property_type')
      .eq('is_available', true);

    if (userId && isValidUUID(userId)) {
      query = query.or(`is_approved.eq.true,owner_id.eq.${userId}`);
    } else {
      query = query.eq('is_approved', true);
    }

    const { data, error } = await query;

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('Supabase data (typeCounts):', data);
      console.log('Supabase error (typeCounts):', error);
    }

    if (error) {
      console.error('Error counting property types:', error);
      return [];
    }

    const counts: Record<string, number> = {};
    const { convertPropertyTypeOldToNew } = require('@/utils/propertyTypeMapper');

    (data || []).forEach((item: any) => {
      const translatedType = convertPropertyTypeOldToNew(item.property_type);
      counts[translatedType] = (counts[translatedType] || 0) + 1;
    });

    return Object.entries(counts).map(([property_type, count]) => ({
      property_type,
      count,
    }));
  } catch (error) {
    console.error('Exception in getPropertyTypesCounts:', error);
    return [];
  }
}

/**
 * Obter províncias e cidades disponíveis
 */
export async function getLocations(userId?: string): Promise<Location[]> {
  try {
    let query = supabase
      .from('properties')
      .select('province, city')
      .eq('is_available', true);

    if (userId && isValidUUID(userId)) {
      query = query.or(`is_approved.eq.true,owner_id.eq.${userId}`);
    } else {
      query = query.eq('is_approved', true);
    }

    const { data, error } = await query;

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('Supabase data (locations):', data);
      console.log('Supabase error (locations):', error);
    }

    if (error) {
      console.error('Error fetching locations:', error);
      return [];
    }

    const locations: Record<string, Set<string>> = {};
    (data || []).forEach((item: any) => {
      if (!locations[item.province]) {
        locations[item.province] = new Set();
      }
      if (item.city) {
        locations[item.province].add(item.city);
      }
    });

    return Object.entries(locations).map(([province, cities]) => ({
      province,
      cities: Array.from(cities),
    }));
  } catch (error) {
    console.error('Exception in getLocations:', error);
    return [];
  }
}


/**
 * Buscar propriedades com filtros avançados
 */
export async function searchProperties(filters: SearchFilters, userId?: string): Promise<Property[]> {
  try {
    let query = supabase
      .from('properties')
      .select('*, property_images(*)')
      .order('created_at', { ascending: false });

    console.log(`[searchProperties] Query started for user: ${userId || 'GUEST'}`);
    console.log(`[searchProperties] Filters:`, JSON.stringify(filters));
    if (userId && isValidUUID(userId)) {
      query = query.or(`is_approved.eq.true,owner_id.eq.${userId}`).eq('is_available', true);
    } else {
      query = query.eq('is_approved', true).eq('is_available', true);
    }

    // Property types filter (multiple selection)
    if (filters.property_types && filters.property_types.length > 0) {
      const translatedTypes = filters.property_types.map(t => getPropertySearchTypes(t)).flat();
      query = query.in('property_type', translatedTypes);
    }

    // Property type (single selection) - for compatibility with simple filters
    if (filters.property_type) {
      const types = getPropertySearchTypes(filters.property_type);
      console.log(`[searchProperties] Filtering by type: ${filters.property_type} -> mapped to:`, types);
      query = query.in('property_type', types);
    }

    // Location filters
    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.province) {
      query = query.eq('province', filters.province);
    }

    // Price range filters
    if (filters.min_price !== undefined) {
      query = query.gte('price', filters.min_price);
    }

    if (filters.max_price !== undefined) {
      query = query.lte('price', filters.max_price);
    }

    // Rental duration filter
    if (filters.rental_duration) {
      query = query.eq('rental_duration', filters.rental_duration);
    }

    // Bedrooms filter
    if (filters.bedrooms !== undefined) {
      query = query.gte('bedrooms', filters.bedrooms);
    }

    // Bathrooms filter
    if (filters.bathrooms !== undefined) {
      query = query.gte('bathrooms', filters.bathrooms);
    }

    // Area range filters
    if (filters.min_area !== undefined) {
      query = query.gte('area_sqm', filters.min_area);
    }

    if (filters.max_area !== undefined) {
      query = query.lte('area_sqm', filters.max_area);
    }

    // Filter by status
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Granular filters (from Web model)
    if (filters.is_furnished !== undefined) {
      query = query.eq('is_furnished', filters.is_furnished);
    }
    if (filters.has_parking !== undefined) {
      query = query.eq('has_parking', filters.has_parking);
    }
    if (filters.has_pool !== undefined) {
      query = query.eq('has_pool', filters.has_pool);
    }
    if (filters.has_garden !== undefined) {
      query = query.eq('has_garden', filters.has_garden);
    }
    if (filters.has_security !== undefined) {
      query = query.eq('has_security', filters.has_security);
    }
    if (filters.available_from) {
      query = query.gte('created_at', filters.available_from); // Assuming available_from relates to listing date or we could add a specific column
    }

    // Text search filter
    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }

    const { data, error } = await query
      .limit(filters.limit || 50);

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('Supabase data (search):', data);
      console.log('Supabase error (search):', error);
    }

    const processed = (data || []).map((p: any) => propertyMapper(p));

    console.log(`[searchProperties] Results found: ${processed.length}`);
    if (processed.length > 0) {
      console.log(`[searchProperties] First result type: ${processed[0].property_type}`);
    }

    if (error) {
      console.error('Error searching properties:', error);
      return [];
    }

    return processed || [];
  } catch (error) {
    console.error('Exception in searchProperties:', error);
    return [];
  }
}

/**
 * Criar uma nova propriedade
 */
export async function createProperty(propertyData: Partial<Property>): Promise<Property | null> {
  try {
    // 1. Extract fields that shouldn't go to the properties table
    // These are either handled separately or don't exist in the schema
    const { id, images, amenities, documentation_urls, cover_image, has_documents, special_conditions, ...data } = propertyData as any;

    // Only include fields that exist in the properties table
    const validFields = {
      title: data.title,
      description: data.description,
      property_type: data.property_type,
      price: data.price,
      currency: data.currency,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      area_sqm: data.area_sqm,
      address: data.address,
      neighborhood: data.neighborhood,
      city: data.city,
      province: data.province,
      latitude: data.latitude,
      longitude: data.longitude,
      rental_duration: data.rental_duration,
      is_furnished: data.is_furnished,
      has_garden: data.has_garden,
      has_parking: data.has_parking,
      has_pool: data.has_pool,
      has_security: data.has_security,
      allows_renovations: data.allows_renovations,
      status: data.status,
      owner_id: data.owner_id,
      is_available: data.is_available,
      is_approved: data.is_approved,
    };

    console.log('Creating property with fields:', Object.keys(validFields).filter(k => validFields[k as keyof typeof validFields] !== undefined));

    // 2. Insert into properties table (only valid fields)
    const { data: newProperty, error } = await supabase
      .from('properties')
      .insert([validFields])
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      return null;
    }

    console.log('Property created successfully:', newProperty.id);

    // 3. Save images to property_images table for canonical display
    if (images && Array.isArray(images) && images.length > 0) {
      const imageRecords = images.map((url, index) => ({
        property_id: newProperty.id,
        image_url: url,
        is_primary: index === 0,
        display_order: index
      }));

      const { error: imgError } = await supabase
        .from('property_images')
        .insert(imageRecords);

      if (imgError) {
        console.error('Error saving property images:', imgError);
      }
    }

    return newProperty;
  } catch (error) {
    console.error('Exception in createProperty:', error);
    return null;
  }
}

/**
 * Atualizar uma propriedade existente
 */
export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  try {
    // 1. Extract fields that shouldn't go to the properties table
    const { images, amenities, documentation_urls, cover_image, has_documents, special_conditions, property_images, ...data } = updates as any;

    // 2. Only include valid fields that exist in the properties table schema
    const validFields: any = {};
    const validFieldNames = [
      'title', 'description', 'property_type', 'price', 'currency',
      'bedrooms', 'bathrooms', 'area_sqm', 'address', 'neighborhood',
      'city', 'province', 'latitude', 'longitude', 'rental_duration',
      'is_furnished', 'has_garden', 'has_parking', 'has_pool', 'has_security',
      'allows_renovations', 'status', 'owner_id', 'is_available', 'is_approved'
    ];

    validFieldNames.forEach(field => {
      if (field in data && data[field as keyof typeof data] !== undefined) {
        validFields[field] = data[field as keyof typeof data];
      }
    });

    console.log('Updating property with fields:', Object.keys(validFields));

    // 3. Update properties table
    const { data: { user: authUser } } = await supabase.auth.getUser();
    console.log(`[updateProperty] === DIAGNOSTIC START ===`);
    console.log(`[updateProperty] Target ID: ${id}`);
    console.log(`[updateProperty] Current Auth User: ${authUser?.id}`);

    // Check ownership in DB
    const { data: dbCheck } = await supabase.from('properties').select('owner_id').eq('id', id).maybeSingle();
    console.log(`[updateProperty] Owner in DB: ${dbCheck?.owner_id || 'NOT FOUND'}`);

    // Check role in DB
    const { data: rCheck } = await supabase.from('user_roles').select('role').eq('user_id', authUser?.id).maybeSingle();
    console.log(`[updateProperty] Role in DB: ${rCheck?.role || 'NONE'}`);
    console.log(`[updateProperty] === DIAGNOSTIC END ===`);

    const { data: updatedData, error } = await supabase
      .from('properties')
      .update(validFields)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[updateProperty] Supabase error:', error);
      return null;
    }

    if (!updatedData || updatedData.length === 0) {
      console.error('[updateProperty] Update failed: No rows returned. RLS is likely blocking the update for user:', authUser?.id);
      return null;
    }

    const updatedProperty = updatedData[0];

    // 4. Handle image updates if provided
    if (images && Array.isArray(images) && images.length > 0) {
      // Delete old images first
      await supabase
        .from('property_images')
        .delete()
        .eq('property_id', id);

      // Insert new images
      const imageRecords = images.map((url, index) => ({
        property_id: id,
        image_url: url,
        is_primary: index === 0,
        display_order: index
      }));

      const { error: imgError } = await supabase
        .from('property_images')
        .insert(imageRecords);

      if (imgError) {
        console.error('Error updating property images:', imgError);
      }
    }

    console.log('Property updated successfully:', updatedProperty.id);
    return updatedProperty;
  } catch (error) {
    console.error('Exception in updateProperty:', error);
    return null;
  }
}

/**
 * Excluir uma propriedade (Soft delete ou Hard delete dependendo da regra de negócio)
 * Aqui faremos hard delete por simplicidade, ou setar is_available = false
 */
export async function deleteProperty(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting property:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in deleteProperty:', error);
    return false;
  }
}

/**
 * Obter propriedades de um proprietário específico (Meus Anúncios)
 */
export async function getMyProperties(userId: string, isAdmin: boolean = false): Promise<Property[]> {
  try {
    let query = supabase
      .from('properties')
      .select('*, property_images(*)');

    // Temporarily showing all properties for debugging as requested by user
    // if (!isAdmin) {
    //   query = query.eq('owner_id', userId);
    // }
    console.log(`[getMyProperties] DEBUG: Showing ALL properties (User: ${userId}, Admin: ${isAdmin})`);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching my properties:', error);
      return [];
    }

    console.log(`[getMyProperties] Fetched ${(data || []).length} properties for user ${userId}`);

    const { convertPropertyTypeOldToNew, convertRentalDurationOldToNew } = require('@/utils/propertyTypeMapper');
    const { propertyMapper } = require('@/mappers/propertyMapper');

    const processed = (data || []).map((p: any) => {
      try {
        return propertyMapper(p);
      } catch (mapError) {
        console.error(`[getMyProperties] Error mapping property ${p.id}:`, mapError);
        return null; // Skip corrupted items but don't break the whole list
      }
    }).filter(Boolean);

    console.log(`[getMyProperties] Successfully processed ${processed.length} properties`);
    return processed || [];
  } catch (error) {
    console.error('Exception in getMyProperties:', error);
    return [];
  }
}

/**
 * Renovar anúncio (atualizar created_at para topo da lista)
 */
export async function renewProperty(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('properties')
      .update({ created_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error renewing property:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in renewProperty:', error);
    return false;
  }
}



/**
 * Upload de imagem de propriedade
 * Nota: Isso requer configuração de Storage no Supabase
 * bucket: 'property-images'
 */
export async function uploadPropertyImage(fileUri: string, userId: string): Promise<string | null> {
  try {
    // 1. Prepare file info
    const fileName = `property-images/${userId}/${Date.now()}.jpg`;
    const formData = new FormData();

    // React Native specific file handling
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'image/jpeg',
    } as any);

    // 2. Upload to Supabase Storage (try property-images first, fallback to public)
    let uploadPath = 'property-images';
    let uploadResult = await supabase.storage
      .from(uploadPath)
      .upload(fileName, formData, {
        contentType: 'image/jpeg',
      });

    // Fallback to 'public' bucket if property-images doesn't exist
    if (uploadResult.error && uploadResult.error.message.includes('Bucket not found')) {
      console.log('🔄 property-images bucket not found, using public bucket');
      uploadPath = 'public';
      uploadResult = await supabase.storage
        .from(uploadPath)
        .upload(fileName, formData, {
          contentType: 'image/jpeg',
        });
    }

    const { data, error } = uploadResult;
    if (error) {
      console.error('❌ Error uploading image:', error);
      return null;
    }

    // 3. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(uploadPath)
      .getPublicUrl(fileName);

    console.log('✅ Image uploaded to', uploadPath);
    return publicUrl;
  } catch (error) {
    console.error('❌ Exception in uploadPropertyImage:', error);
    return null;
  }
}



/**
 * [AUTO-FIX] Função de Auto-Reparo para dados do usuário
 * Garante que todos os imóveis do usuário:
 * 1. Estejam aprovados (is_approved = true)
 * 2. Estejam disponíveis (is_available = true)
 * 3. Tenham property_type mapeado em Português
 */
export async function fixPropertyValues(userId: string): Promise<string> {
  try {
    console.log('[fixPropertyValues] Starting auto-fix for user:', userId);

    // 1. Fetch user properties
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, property_type')
      .eq('owner_id', userId);

    if (error || !properties) {
      console.error('[fixPropertyValues] Failed to fetch properties:', error);
      return 'Erro ao buscar dados.';
    }

    let updatedCount = 0;

    // 2. Iterate and update each
    for (const prop of properties) {
      const updates: any = {
        is_approved: true,
        is_available: true,
      };

      // Fix Types: EN -> PT
      let needsTypeFix = false;
      if (prop.property_type === 'shop') { updates.property_type = 'loja'; needsTypeFix = true; }
      else if (prop.property_type === 'land') { updates.property_type = 'terreno'; needsTypeFix = true; }
      else if (prop.property_type === 'apartment') { updates.property_type = 'apartamento'; needsTypeFix = true; }
      else if (prop.property_type === 'villa' || prop.property_type === 'house') { updates.property_type = 'vivenda'; needsTypeFix = true; }

      // Also fix if it's already generic English

      const { error: updateError } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', prop.id);

      if (!updateError) updatedCount++;
    }

    console.log(`[fixPropertyValues] Automatically fixed ${updatedCount} properties.`);
    return `Corrigidos ${updatedCount} imóveis com sucesso.`;

  } catch (e) {
    console.error('[fixPropertyValues] Exception:', e);
    return 'Erro na correção automática.';
  }
}

/**
 * Upload de documento de propriedade
 * bucket: 'property-documents' or 'public' as fallback
 */
export async function uploadPropertyDocument(fileUri: string, userId: string): Promise<string | null> {
  try {
    const fileName = `property-documents/${userId}/${Date.now()}_doc`;
    const formData = new FormData();

    // Determine extension from URI if possible, or default to pdf/jpg
    const extension = fileUri.split('.').pop() || 'pdf';
    const name = `${fileName}.${extension}`;

    formData.append('file', {
      uri: fileUri,
      name: name,
      type: extension === 'pdf' ? 'application/pdf' : 'image/jpeg',
    } as any);

    // Try property-documents bucket first, fallback to public
    let uploadPath = 'property-documents';
    let uploadResult = await supabase.storage
      .from(uploadPath)
      .upload(name, formData, {
        contentType: extension === 'pdf' ? 'application/pdf' : 'image/jpeg',
      });

    // Fallback to 'public' bucket if property-documents doesn't exist
    if (uploadResult.error && uploadResult.error.message.includes('Bucket not found')) {
      console.log('🔄 property-documents bucket not found, using public bucket');
      uploadPath = 'public';
      uploadResult = await supabase.storage
        .from(uploadPath)
        .upload(name, formData, {
          contentType: extension === 'pdf' ? 'application/pdf' : 'image/jpeg',
        });
    }

    const { data, error } = uploadResult;
    if (error) {
      console.error('❌ Error uploading document:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(uploadPath)
      .getPublicUrl(name);

    console.log('✅ Document uploaded to', uploadPath);
    return publicUrl;
  } catch (error) {
    console.error('❌ Exception in uploadPropertyDocument:', error);
    return null;
  }
}

/**
 * Obter propriedades pendentes de aprovação (Admin)
 */
export async function getPendingProperties(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending properties:', error);
      return [];
    }

    const processed = (data || []).map((p: any) => propertyMapper(p));
    return processed || [];
  } catch (error) {
    console.error('Exception in getPendingProperties:', error);
    return [];
  }
}

/**
 * Aprovar uma propriedade
 */
export async function approveProperty(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('properties')
      .update({ is_approved: true })
      .eq('id', id);

    if (error) {
      console.error('Error approving property:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in approveProperty:', error);
    return false;
  }
}

/**
 * Rejeitar uma propriedade (pode ser exclusão ou setar um status específico)
 */
export async function rejectProperty(id: string, reason?: string): Promise<boolean> {
  try {
    // Por enquanto vamos apenas deletar ou você pode adicionar uma coluna 'rejection_reason'
    // Para este MVP vamos marcar is_available = false ou deletar
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error rejecting property:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in rejectProperty:', error);
    return false;
  }
}
