/**
 * Domain Models para Propriedades
 * Alinhados com o schema Supabase
 */

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  property_type: 'apartment' | 'house' | 'office' | 'shop' | 'land' | 'warehouse' | 'studio' | 'villa' | 'room' | 'commercial_building';
  price: number;
  rental_duration?: 'daily' | 'monthly' | 'yearly';
  city: string;
  province: string;
  neighborhood?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  area_sqm?: number;
  legal_status?: string;
  available_from?: string;
  available_until?: string;
  status?: 'novo' | 'usado' | 'em_construcao';
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  has_parking?: boolean;
  has_pool?: boolean;
  has_garden?: boolean;
  has_security?: boolean;
  allows_renovations?: boolean;
  is_furnished?: boolean;
  has_documents?: boolean;
  is_available: boolean;
  is_approved?: boolean;
  views_count?: number;
  documentation_urls?: string[];
  special_conditions?: string;
  unavailable_dates?: string[];
  created_at: string;
  updated_at: string;

  // Virtual / Joined fields (if any)
  images?: string[];
  cover_image?: string;
  owner_name?: string;
  location?: string;
  amenities?: string[];
}

export interface PropertyType {
  id: string;
  label: string;
  type: Property['property_type'];
  icon: string;
  count?: number;
}

export interface Location {
  province: string;
  cities: string[];
  count?: number;
}

export interface FeaturedBadge {
  label: string;
  color: string;
}

export interface SearchFilters {
  query?: string;
  property_type?: Property['property_type'];
  property_types?: Property['property_type'][];
  city?: string;
  province?: string;
  min_price?: number;
  max_price?: number;
  rental_duration?: Property['rental_duration'];
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  status?: Property['status'];
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  limit?: number;

  // Granular filters (from Web model)
  is_furnished?: boolean;
  has_parking?: boolean;
  has_pool?: boolean;
  has_garden?: boolean;
  has_security?: boolean;
  available_from?: string;
}

export type Amenity =
  | 'wifi'
  | 'parking'
  | 'pool'
  | 'gym'
  | 'security'
  | 'elevator'
  | 'balcony'
  | 'garden'
  | 'air_conditioning'
  | 'heating'
  | 'furnished'
  | 'pet_friendly'
  | 'wheelchair_accessible'
  | 'laundry'
  | 'storage';

export interface LegalDocument {
  id: string;
  type: 'title_deed' | 'building_permit' | 'occupancy_certificate' | 'tax_clearance' | 'land_registry' | 'other';
  name: string;
  status: 'verified' | 'pending' | 'expired';
  issue_date?: string;
  expiry_date?: string;
  verified_by?: string;
}

export interface PropertyHistoryEvent {
  id: string;
  date: string;
  type: 'construction' | 'renovation' | 'ownership_change' | 'repair' | 'inspection';
  title: string;
  description?: string;
  cost?: number;
}

export interface SpecialCondition {
  id: string;
  category: 'permitted_works' | 'restrictions' | 'zoning' | 'hoa_rules' | 'permits_required';
  title: string;
  description: string;
  is_restriction: boolean;
}