/**
 * Mapper para converter entre valores antigos (português) e novos (inglês) de property_type
 * O banco de dados Supabase ainda usa os valores antigos
 */

// Mapeamento antigo (PT) -> novo (EN)
const OLD_TO_NEW_PROPERTY_TYPE: Record<string, string> = {
  'apartamento': 'apartment',
  'apartamentos': 'apartment',
  'hause': 'house',
  'hauses': 'house',
  'vivenda': 'villa',
  'vivendas': 'villa',
  'moradia': 'house',
  'moradias': 'house',
  'casa': 'house',
  'casas': 'house',
  'terreno': 'land',
  'terrenos': 'land',
  'escritorio': 'office',
  'escritorios': 'office',
  'loja': 'shop',
  'lojas': 'shop',
  'armazem': 'warehouse',
  'armazens': 'warehouse',
  'quintal': 'land',
  'quarto': 'room',
  'quartos': 'room',
  'guesthouse': 'studio',
  'comercial': 'commercial_building',
  // Novos valores (sem conversão)
  'apartment': 'apartment',
  'house': 'house',
  'office': 'office',
  'shop': 'shop',
  'land': 'land',
  'warehouse': 'warehouse',
  'studio': 'studio',
  'villa': 'villa',
  'room': 'room',
  'commercial_building': 'commercial_building',
};

// Mapeamento novo (EN) -> antigo (PT)
// Agora mapeia para um array para busca abrangente
const NEW_TO_OLD_PROPERTY_TYPE: Record<string, string[]> = {
  'apartment': ['apartamento', 'apartamentos', 'apartment'],
  'house': ['casa', 'casas', 'moradia', 'moradias', 'house'],
  'office': ['escritorio', 'escritorios', 'office'],
  'shop': ['loja', 'lojas', 'shop'],
  'land': ['terreno', 'terrenos', 'quintal', 'land'],
  'warehouse': ['armazem', 'armazens', 'warehouse'],
  'studio': ['guesthouse', 'studio'],
  'villa': ['vivenda', 'vivendas', 'villa'],
  'room': ['quarto', 'quartos', 'room'],
  'commercial_building': ['comercial', 'commercial_building'],
};

// Mapeamento rental_duration antigo -> novo
const OLD_TO_NEW_RENTAL_DURATION: Record<string, string> = {
  'curta': 'daily',
  'media': 'monthly',
  'longa': 'yearly',
  'daily': 'daily',
  'monthly': 'monthly',
  'yearly': 'yearly',
};

// Mapeamento rental_duration novo -> antigo
const NEW_TO_OLD_RENTAL_DURATION: Record<string, string> = {
  'daily': 'curta',
  'monthly': 'media',
  'yearly': 'longa',
  'curta': 'curta',
  'media': 'media',
  'longa': 'longa',
};

// Mapeamento status
const OLD_TO_NEW_STATUS: Record<string, string> = {
  'novo': 'novo',
  'usado': 'usado',
  'em_construcao': 'em_construcao',
  'em_obras': 'em_construcao',  // Converter antigo para novo
};

const NEW_TO_OLD_STATUS: Record<string, string> = {
  'novo': 'novo',
  'usado': 'usado',
  'em_construcao': 'em_construcao',
};

/**
 * Converte property_type do formato antigo (banco) para novo (frontend)
 */
export function convertPropertyTypeOldToNew(oldType?: string): string {
  if (!oldType) return 'apartment';
  return OLD_TO_NEW_PROPERTY_TYPE[oldType.toLowerCase()] || 'apartment';
}

/**
 * Converte property_type do formato novo (frontend) para antigo (banco) para SALVAMENTO
 * Retorna uma única string (o primeiro valor do mapeamento)
 */
export function convertPropertyTypeNewToOld(newType?: string): string {
  if (!newType) return 'apartamento';
  const mapped = NEW_TO_OLD_PROPERTY_TYPE[newType.toLowerCase()];
  return mapped ? mapped[0] : newType.toLowerCase();
}

/**
 * Retorna uma lista de possíveis valores para busca abrangente no banco de dados
 */
export function getPropertySearchTypes(newType?: string): string[] {
  if (!newType) return ['apartamento', 'apartamentos', 'apartment'];
  return NEW_TO_OLD_PROPERTY_TYPE[newType.toLowerCase()] || [newType.toLowerCase()];
}

/**
 * Converte rental_duration do formato antigo (banco) para novo (frontend)
 */
export function convertRentalDurationOldToNew(oldDuration?: string): string {
  if (!oldDuration) return 'monthly';
  return OLD_TO_NEW_RENTAL_DURATION[oldDuration.toLowerCase()] || 'monthly';
}

/**
 * Converte rental_duration do formato novo (frontend) para antigo (banco)
 */
export function convertRentalDurationNewToOld(newDuration?: string): string {
  if (!newDuration) return 'media';
  return NEW_TO_OLD_RENTAL_DURATION[newDuration.toLowerCase()] || 'media';
}

/**
 * Converte status do formato antigo (banco) para novo (frontend)
 */
export function convertStatusOldToNew(oldStatus?: string): string {
  if (!oldStatus) return 'novo';
  return OLD_TO_NEW_STATUS[oldStatus.toLowerCase()] || 'novo';
}

/**
 * Converte status do formato novo (frontend) para antigo (banco)
 */
export function convertStatusNewToOld(newStatus?: string): string {
  if (!newStatus) return 'novo';
  return NEW_TO_OLD_STATUS[newStatus.toLowerCase()] || 'novo';
}
