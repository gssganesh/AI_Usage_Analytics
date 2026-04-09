import { useEffect, useState } from 'react';
import { useFilters } from '../hooks/useFilters';
import FilterPanel from '../components/FilterPanel';
import ExportButton from '../components/ExportButton';
import StatCard from '../components/StatCard';
import { FileDown } from 'lucide-react';
import { api } from '../services/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    ScatterChart, Scatter, ZAxis
} from 'recharts';

export default function LearningDashboard() {
    const { filters, filterOptions, fetchFilterOptions, updateFilter, applyBulkFilters, resetFilters, hasActiveFilters } = useFilters();
    const [stats, setStats] = useState(null);
    const [conditions, setConditions] = useState([]);
    const [stressData, setStressData] = useState([]);
    const [assignData, setAssignData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(function() { fetchFilterOptions(); }, [fetchFilterOptions]);

    useEffect(function() {
        async function load() {
            setLoading(true);
            try {
                var s = await api.getStats(filters);
                var c = await api.getLearningConditions(filters);
                var st = await api.getMentalStressData(filters);
                var as = await api.getAssignmentVsAI(filters);
                setStats(s.stats); setConditions(c.data); setStressData(st.data); setAssignData(as.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        load();
    }, [filters]);

    if (loading) return <div className="loading-spinner"><div className="spinner"></div><span>Loading Learning Dashboard...</span></div>;

    return (
        <div className="page-content">
            <div className="page-title-section">
                <h2>Learning Conditions & Student Productivity</h2>
                <p>How environmental, behavioral, and socio-economic factors influence learning behavior</p>
            </div>

            <FilterPanel 
                filters={filters} 
                filterOptions={filterOptions} 
                updateFilter={updateFilter} 
                applyBulkFilters={applyBulkFilters}
                resetFilters={resetFilters} 
                hasActiveFilters={hasActiveFilters} 
            />

            {stats && (
                <div className="stats-grid">
                    <StatCard label="Avg Digital Literacy" value={stats.avg_digital_literacy} color="teal" />
                    <StatCard label="Avg Mental Stress" value={stats.avg_mental_stress} color="red" />
                    <StatCard label="Avg Assignment Completion" value={stats.avg_assignment_completion + '%'} color="green" />
                    <StatCard label="Avg Study Hours" value={stats.avg_study_hours} color="blue" />
                </div>
            )}

            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-title">Digital Literacy vs Academic Performance</div>
                    <div className="chart-subtitle">How digital skills influence CGPA and exam scores</div>
                    <div className="chart-container tall">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="digital_literacy_score" name="Digital Literacy" tick={{ fontSize: 11 }} label={{ value: 'Digital Literacy Score', position: 'insideBottom', offset: -25 }} />
                                <YAxis dataKey="cgpa" name="CGPA" tick={{ fontSize: 11 }} label={{ value: 'CGPA', angle: -90, position: 'insideLeft', offset: 0 }} />
                                <ZAxis dataKey="exam_score" range={[40, 250]} name="Exam" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter data={stressData} fill="#0ea5e9" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Mental Stress vs Study Hours</div>
                    <div className="chart-subtitle">How stress levels affect study habits</div>
                    <div className="chart-container tall">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mental_stress_score" name="Stress" tick={{ fontSize: 11 }} label={{ value: 'Mental Stress Score', position: 'insideBottom', offset: -25 }} />
                                <YAxis dataKey="study_hours_per_week" name="Study Hours" tick={{ fontSize: 11 }} label={{ value: 'Weekly Study Hours', angle: -90, position: 'insideLeft', offset: 0 }} />
                                <ZAxis dataKey="cgpa" range={[40, 250]} name="CGPA" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter data={stressData} fill="#ef4444" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Internet Quality vs AI Usage</div>
                    <div className="chart-subtitle">How connectivity affects AI adoption and CGPA</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart data={conditions} margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="internet_quality" tick={{ fontSize: 12 }} label={{ value: 'Internet Quality', position: 'insideBottom', offset: -25 }} />
                                <YAxis tick={{ fontSize: 11 }} label={{ value: 'Avg Hours / CGPA', angle: -90, position: 'insideLeft', offset: 0 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="avg_ai_hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Avg AI Hours" />
                                <Bar dataKey="avg_cgpa" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Avg CGPA" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">City Tier vs AI Adoption</div>
                    <div className="chart-subtitle">AI adoption patterns across city tiers</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart data={conditions} margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="city_tier" tick={{ fontSize: 12 }} label={{ value: 'City Tier', position: 'insideBottom', offset: -25 }} />
                                <YAxis tick={{ fontSize: 11 }} label={{ value: 'Average Value', angle: -90, position: 'insideLeft', offset: 0 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="avg_digital_literacy" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Avg Digital Literacy" />
                                <Bar dataKey="avg_ai_hours" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Avg AI Hours" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Scholarship vs Performance</div>
                    <div className="chart-subtitle">Does financial support influence outcomes?</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart data={conditions} margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="scholarship_support" tick={{ fontSize: 12 }} label={{ value: 'Scholarship Support', position: 'insideBottom', offset: -25 }} />
                                <YAxis tick={{ fontSize: 11 }} label={{ value: 'Avg CGPA / Score', angle: -90, position: 'insideLeft', offset: 0 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="avg_cgpa" fill="#10b981" radius={[4, 4, 0, 0]} name="Avg CGPA" />
                                <Bar dataKey="avg_exam_score" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Avg Exam Score" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Assignment Completion vs AI Usage</div>
                    <div className="chart-subtitle">Does AI help complete assignments more efficiently?</div>
                    <div className="chart-container tall">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="ai_usage_hours_per_week" name="AI Hours" tick={{ fontSize: 11 }} label={{ value: 'AI Hours / Week', position: 'insideBottom', offset: -25 }} />
                                <YAxis dataKey="assignment_completion_pct" name="Completion %" tick={{ fontSize: 11 }} label={{ value: 'Completion %', angle: -90, position: 'insideLeft', offset: 0 }} />
                                <ZAxis dataKey="cgpa" range={[40, 250]} name="CGPA" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter data={assignData} fill="#f59e0b" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="export-bar">
                <div className="export-bar-title"><FileDown size={17} />Export Learning Data</div>
                <div className="export-buttons">
                    <ExportButton format="csv" filters={filters} />
                    <ExportButton format="json" filters={filters} />
                    <ExportButton format="pdf" filters={filters} />
                    <ExportButton format="docx" filters={filters} />
                </div>
            </div>
        </div>
    );
}