import { useState, useCallback, useMemo } from 'react';
import { SearchFilters } from '@/types/property';

export const useSearchFilters = () => {
    const [filters, setFilters] = useState<SearchFilters>({});

    const updateFilter = useCallback(<K extends keyof SearchFilters>(
        key: K,
        value: SearchFilters[K]
    ) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const clearFilter = useCallback((key: keyof SearchFilters) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    }, []);

    const clearAllFilters = useCallback(() => {
        setFilters({});
    }, []);

    const setMultipleFilters = useCallback((newFilters: Partial<SearchFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
        }));
    }, []);

    const activeFilterCount = useMemo(() => {
        let count = 0;

        if (filters.query) count++;
        if (filters.property_types && filters.property_types.length > 0) count++;
        if (filters.city) count++;
        if (filters.province) count++;
        if (filters.min_price !== undefined || filters.max_price !== undefined) count++;
        if (filters.rental_duration) count++;
        if (filters.bedrooms !== undefined) count++;
        if (filters.bathrooms !== undefined) count++;
        if (filters.min_area !== undefined || filters.max_area !== undefined) count++;
        if (filters.amenities && filters.amenities.length > 0) count++;
        if (filters.status) count++;
        if (filters.latitude !== undefined && filters.longitude !== undefined) count++;

        if (filters.is_furnished) count++;
        if (filters.has_parking) count++;
        if (filters.has_pool) count++;
        if (filters.has_garden) count++;
        if (filters.has_security) count++;
        if (filters.available_from) count++;

        return count;
    }, [filters]);

    const hasActiveFilters = useMemo(() => {
        return activeFilterCount > 0;
    }, [activeFilterCount]);

    return {
        filters,
        updateFilter,
        clearFilter,
        clearAllFilters,
        setMultipleFilters,
        activeFilterCount,
        hasActiveFilters,
    };
};
