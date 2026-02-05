import { Property } from '@/types/property';
import { convertPropertyTypeOldToNew } from '../utils/propertyTypeMapper';

export function propertyMapper(raw: any): Property {
  // 1. Extract images from property_images (joined table)
  const imgs = (raw.property_images || []) as any[];
  let images = imgs.map(img => img.url || img.image_url || img.path || img.src).filter(Boolean);

  // 2. Fallback to 'images' array column if joined table is empty
  if (images.length === 0 && raw.images && Array.isArray(raw.images)) {
    images = raw.images;
  }

  // 3. Determine cover image
  const cover_image = raw.cover_image || images[0] || null;

  // 4. Robust Location handling (handle objects or missing strings)
  const getSafeStr = (val: any) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return val.label || val.name || val.title || '';
    return String(val);
  };

  const province = getSafeStr(raw.province);
  const city = getSafeStr(raw.city);
  const neighborhood = getSafeStr(raw.neighborhood);

  const location = [province, city, neighborhood].filter(Boolean).join(', ');

  // 5. Robust Price handling (ensure it's a number for formatting functions)
  const price = typeof raw.price === 'number' ? raw.price : (parseFloat(raw.price) || 0);

  const mapped: Property = {
    ...raw,
    id: raw.id,
    price: price,
    property_type: convertPropertyTypeOldToNew(raw.property_type) as any,
    province: province,
    city: city,
    neighborhood: neighborhood,
    cover_image: cover_image,
    images: images,
    location: location,
  } as Property;

  return mapped;
}
