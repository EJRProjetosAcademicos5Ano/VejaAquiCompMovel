import { Property, Amenity } from '@/types/property';

export const PROPERTY_STATUSES = ['novo', 'usado', 'em_construcao'] as const;
export type PropertyStatus = typeof PROPERTY_STATUSES[number];

export const PROPERTY_TYPES: Array<{
    id: Property['property_type'];
    label: string;
    icon: string;
}> = [
        { id: 'apartment', label: 'Apartamento', icon: 'apartment' },
        { id: 'house', label: 'Casa', icon: 'home' },
        { id: 'office', label: 'Escritório', icon: 'business' },
        { id: 'shop', label: 'Loja', icon: 'store' },
        { id: 'land', label: 'Terreno', icon: 'landscape' },
        { id: 'warehouse', label: 'Armazém', icon: 'warehouse' },
        { id: 'studio', label: 'Estúdio', icon: 'meeting-room' },
        { id: 'villa', label: 'Villa', icon: 'villa' },
        { id: 'room', label: 'Quarto', icon: 'bed' },
        { id: 'commercial_building', label: 'Edifício Comercial', icon: 'domain' },
    ];

export const RENTAL_DURATIONS: Array<{
    id: Property['rental_duration'];
    label: string;
    shortLabel: string;
}> = [
        { id: 'daily', label: 'Diário', shortLabel: '/dia' },
        { id: 'monthly', label: 'Mensal', shortLabel: '/mês' },
        { id: 'yearly', label: 'Anual', shortLabel: '/ano' },
    ];

export const AMENITIES: Array<{
    id: Amenity;
    label: string;
    icon: string;
}> = [
        { id: 'wifi', label: 'Wi-Fi', icon: 'wifi' },
        { id: 'parking', label: 'Estacionamento', icon: 'local-parking' },
        { id: 'pool', label: 'Piscina', icon: 'pool' },
        { id: 'gym', label: 'Ginásio', icon: 'fitness-center' },
        { id: 'security', label: 'Segurança 24h', icon: 'security' },
        { id: 'elevator', label: 'Elevador', icon: 'elevator' },
        { id: 'balcony', label: 'Varanda', icon: 'balcony' },
        { id: 'garden', label: 'Jardim', icon: 'yard' },
        { id: 'air_conditioning', label: 'Ar Condicionado', icon: 'ac-unit' },
        { id: 'heating', label: 'Aquecimento', icon: 'whatshot' },
        { id: 'furnished', label: 'Mobilado', icon: 'weekend' },
        { id: 'pet_friendly', label: 'Aceita Animais', icon: 'pets' },
        { id: 'wheelchair_accessible', label: 'Acessível', icon: 'accessible' },
        { id: 'laundry', label: 'Lavanderia', icon: 'local-laundry-service' },
        { id: 'storage', label: 'Armazenamento', icon: 'inventory-2' },
    ];

export const PRICE_RANGES = [
    { label: 'Até 50.000 MT', min: 0, max: 50000 },
    { label: '50.000 - 100.000 MT', min: 50000, max: 100000 },
    { label: '100.000 - 200.000 MT', min: 100000, max: 200000 },
    { label: '200.000 - 500.000 MT', min: 200000, max: 500000 },
    { label: 'Acima de 500.000 MT', min: 500000, max: 10000000 },
];

export const PROVINCES = [
    'Maputo',
    'Gaza',
    'Inhambane',
    'Sofala',
    'Manica',
    'Tete',
    'Zambézia',
    'Nampula',
    'Cabo Delgado',
    'Niassa',
];

