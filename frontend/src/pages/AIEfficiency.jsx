import { useEffect, useState } from 'react';
import { useFilters } from '../hooks/useFilters';
import FilterPanel from '../components/FilterPanel';
import StatCard from '../components/StatCard';
import { Zap, Gauge, BarChart3, TrendingUp, Info, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export default function AIEfficiency() {
    const { filters, filterOptions, fetchFilterOptions, updateFilter, applyBulkFilters, resetFilters, hasActiveFilters } = useFilters();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(function() { fetchFilterOptions(); }, [fetchFilterOptions]);
    useEffect(function() {
        async function load() {
            setLoading(true);
            try {
                const res = await api.getAIEfficiency(filters);
                setData(res);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        load();
    }, [filters]);

    if (loading && !data) return <div className="loading-spinner"><div className="spinner"></div><span>Calculating Usage Efficiency...</span></div>;

    return (
        <div className="page-content">
            <div className="page-title-section">
                <h2>AI Usage Efficiency Analysis</h2>
                <p>Quantifying academic return vs tool dependency using derived ML scoring</p>
            </div>

            <FilterPanel 
                filters={filters} 
                filterOptions={filterOptions} 
                updateFilter={updateFilter} 
                applyBulkFilters={applyBulkFilters}
                resetFilters={resetFilters} 
                hasActiveFilters={hasActiveFilters} 
            />

            {data ? (
                <>
                    <div className="stats-grid">
                        <StatCard label="Global Efficiency Avg" value={data?.statistics ? `${data.statistics.avg_efficiency}%` : '0%'} color="teal" icon={<Gauge size={20} />} />
                        <StatCard label="Strategic Masters" value={data?.statistics?.distribution[0]?.value || 0} color="green" icon={<Zap size={20} />} />
                        <StatCard label="Inefficient Users" value={data?.statistics?.distribution[2]?.value || 0} color="red" icon={<AlertTriangle size={20} />} />
                        <StatCard label="Analyzed Sample" value={data?.ranking?.length || 0} color="blue" icon={<BarChart3 size={20} />} />
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <div className="chart-title">Efficiency Distribution</div>
                            <div className="chart-subtitle">Breakdown of population into Strategic vs Dependent categories</div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                    <BarChart data={data.statistics.distribution}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" name="Students">
                                            {data.statistics.distribution.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-title">Strategic Profile Benchmarking</div>
                            <div className="chart-subtitle">Efficiency metrics relative to optimal performing zone</div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                        { subject: 'Speed', A: 85, fullMark: 100 },
                                        { subject: 'Accuracy', A: 90, fullMark: 100 },
                                        { subject: 'Retention', A: 65, fullMark: 100 },
                                        { subject: 'Originality', A: 75, fullMark: 100 },
                                        { subject: 'Effort', A: 50, fullMark: 100 }
                                    ]}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" />
                                        <PolarRadiusAxis />
                                        <Radar name="Student Avg" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.5} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="chart-card full-width">
                        <div className="chart-title">Top 50 Efficiency Ranking (Masters Pool)</div>
                        <div className="table-responsive" style={{ marginTop: '20px', overflowX:'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '12px' }}>ID</th>
                                        <th>Name</th>
                                        <th>Stream</th>
                                        <th>Perf Score</th>
                                        <th>AI Hours</th>
                                        <th>Efficiency</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.ranking.map(s => (
                                        <tr key={s.student_id} className="risk-row" style={{ background: 'var(--bg-input)', borderRadius: '12px' }}>
                                            <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', fontWeight: 800 }}>#{s.student_id}</td>
                                            <td style={{ fontWeight: 600 }}>Student {s.student_id}</td>
                                            <td>{s.academic_stream}</td>
                                            <td>{s.cgpa}</td>
                                            <td>{s.ai_usage_hours_per_week}h</td>
                                            <td><strong style={{ color: s.color }}>{s.efficiency_score}%</strong></td>
                                            <td style={{ borderRadius: '0 12px 12px 0' }}>
                                                <span className="navbar-badge" style={{ background: s.color + '22', color: s.color, border: '1px solid ' + s.color }}>{s.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="chart-card" style={{ textAlign: 'center', padding: '100px' }}>
                    <TrendingUp size={48} color="var(--text-muted)" style={{ marginBottom: '20px' }} />
                    <h3>No Data Analysis Available</h3>
                    <p>Insufficient dataset size to calculate intelligent efficiency scores.</p>
                </div>
            )}
        </div>
    );
}
