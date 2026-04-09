import { useState, useCallback } from 'react';
import { api } from '../services/api';

const defaults = { state:'All', stream:'All', education_level:'All', ai_usage_frequency:'All', city_tier:'All', ai_tool:'All', gender:'All', internet_quality:'All', scholarship_support:'All' };

export function useFilters() {
    const [filters, setFilters] = useState(defaults);
    const [filterOptions, setFilterOptions] = useState(null);

    const fetchFilterOptions = useCallback(async () => {
        try {
            const res = await api.getFilterOptions();
            setFilterOptions(res.options);
        } catch (e) { console.error('Filter options error:', e); }
    }, []);

    const updateFilter = useCallback((k, v) => setFilters(p => ({ ...p, [k]: v })), []);
    const applyBulkFilters = useCallback((newFilters) => setFilters(newFilters), []);
    const resetFilters = useCallback(() => setFilters(defaults), []);
    const hasActiveFilters = Object.values(filters).some(v => v !== 'All');

    return { filters, filterOptions, fetchFilterOptions, updateFilter, applyBulkFilters, resetFilters, hasActiveFilters };
}