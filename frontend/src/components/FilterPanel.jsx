import { useState, useEffect } from 'react';
import { Filter, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function FilterPanel({ filters, filterOptions, updateFilter, resetFilters, hasActiveFilters, excludeFields = [], includeFields = null, applyBulkFilters }) {
    const { addNotification } = useNotification();
    const [stagedFilters, setStagedFilters] = useState(filters);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setStagedFilters(filters);
        setIsDirty(false);
    }, [filters]);

    const handleStageChange = (k, v) => {
        setStagedFilters(p => ({ ...p, [k]: v }));
        setIsDirty(true);
    };

    const handleApply = () => {
        const activeCount = Object.values(stagedFilters).filter(v => v !== 'All').length;
        
        if (applyBulkFilters) {
            applyBulkFilters(stagedFilters);
        } else {
            // Fallback for components not yet updated to use bulk updates
            Object.entries(stagedFilters).forEach(([k, v]) => {
                if (filters[k] !== v) updateFilter(k, v);
            });
        }
        
        addNotification({
            type: 'info',
            title: 'Filters Applied',
            msg: `Dataset updated with ${activeCount} active criteria.`
        });
        
        setIsDirty(false);
    };

    if (!filterOptions) return null;
    
    const fields = [
        { key: 'state', label: 'Region / State', opts: filterOptions.states },
        { key: 'stream', label: 'Academic Stream', opts: filterOptions.streams },
        { key: 'education_level', label: 'Education Level', opts: filterOptions.education_levels },
        { key: 'ai_usage_frequency', label: 'Usage Frequency', opts: filterOptions.ai_usage_frequencies },
        { key: 'city_tier', label: 'City Classification', opts: filterOptions.city_tiers },
        { key: 'ai_tool', label: 'Primary AI Tool', opts: filterOptions.ai_tools },
        { key: 'gender', label: 'Gender', opts: filterOptions.genders },
        { key: 'internet_quality', label: 'Connectivity', opts: filterOptions.internet_qualities },
        { key: 'scholarship_support', label: 'Financial Aid', opts: filterOptions.scholarship_supports }
    ];

    let fieldsToRender = fields;
    if (includeFields) {
        fieldsToRender = fields.filter(f => includeFields.includes(f.key));
    } else if (excludeFields && excludeFields.length > 0) {
        fieldsToRender = fields.filter(f => !excludeFields.includes(f.key));
    }

    return (
        <div className={`filter-panel ${isDirty ? 'is-dirty' : ''}`}>
            <div className="filter-header">
                <div className="filter-title">
                    <Filter size={18} />
                    <span>Dataset Control Center</span>
                    {hasActiveFilters && <span className="active-badge">Active</span>}
                </div>
                <div className="filter-actions" style={{ display: 'flex', gap: '12px' }}>
                    {isDirty && (
                        <button className="apply-btn" onClick={handleApply}>
                            <CheckCircle2 size={16} /> Apply Filters
                        </button>
                    )}
                    {hasActiveFilters && (
                        <button className="export-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={resetFilters}>
                            <RotateCcw size={14} /> Reset All
                        </button>
                    )}
                </div>
            </div>
            <div className="filter-grid">
                {fieldsToRender.map(f => (
                    <div className="filter-group" key={f.key}>
                        <label>{f.label}</label>
                        <select value={stagedFilters[f.key] || 'All'} onChange={e => handleStageChange(f.key, e.target.value)}>
                            <option value="All">All {f.label}s</option>
                            {f.opts?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}