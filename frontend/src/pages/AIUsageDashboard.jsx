import { useEffect, useState } from 'react';
import { useFilters } from '../hooks/useFilters';
import FilterPanel from '../components/FilterPanel';
import CGPAIndicator from '../components/CGPAIndicator';
import ExportButton from '../components/ExportButton';
import TableauEmbed from '../components/TableauEmbed';
import StatCard from '../components/StatCard';
import { FileDown } from 'lucide-react';
import { api } from '../services/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    ScatterChart, Scatter, ZAxis, LineChart, Line
} from 'recharts';

export default function AIUsageDashboard() {
    const { filters, filterOptions, fetchFilterOptions, updateFilter, applyBulkFilters, resetFilters, hasActiveFilters } = useFilters();
    const [stats, setStats] = useState(null);
    const [cgpaDist, setCgpaDist] = useState([]);
    const [freqPerf, setFreqPerf] = useState([]);
    const [studyVsAI, setStudyVsAI] = useState([]);
    const [aiByStream, setAiByStream] = useState([]);
    const [regional, setRegional] = useState([]);
    const [scatter, setScatter] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(function() { fetchFilterOptions(); }, [fetchFilterOptions]);

    useEffect(function() {
        async function load() {
            setLoading(true);
            try {
                var s = await api.getStats(filters);
                var c = await api.getCGPADistribution(filters);
                var f = await api.getFrequencyVsPerformance(filters);
                var sv = await api.getStudyVsAIHours(filters);
                var ab = await api.getAIUsageByStream(filters);
                var r = await api.getRegionalPatterns(filters);
                var sc = await api.getScatterData(filters);
                // Group stream data to avoid duplicate X-axis labels
                const groupedStream = ab.data.reduce((acc, curr) => {
                    const existing = acc.find(item => item.academic_stream === curr.academic_stream);
                    if (existing) { existing.count += curr.count; } 
                    else { acc.push({ academic_stream: curr.academic_stream, count: curr.count }); }
                    return acc;
                }, []);
                
                // Process regional data: include tier in label and sort descending by AI hours
                const processedRegional = r.data.map(item => ({
                    ...item,
                    state_tier: `${item.state} (${item.city_tier})`
                })).sort((a, b) => b.avg_ai_hours - a.avg_ai_hours);

                setStats(s.stats); setCgpaDist(c.data); setFreqPerf(f.data);
                setStudyVsAI(sv.data); setAiByStream(groupedStream); setRegional(processedRegional); setScatter(sc.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        load();
    }, [filters]);

    if (loading) return <div className="loading-spinner"><div className="spinner"></div><span>Loading AI Usage Dashboard...</span></div>;

    return (
        <div className="page-content">
            <div className="page-title-section">
                <h2>AI Usage & Academic Performance</h2>
                <p>How AI tool usage behavior influences student academic outcomes and study efficiency</p>
            </div>

            <div className="dashboard-filter-section glass-morphism">
                <FilterPanel 
                    filters={filters} 
                    filterOptions={filterOptions} 
                    updateFilter={updateFilter} 
                    applyBulkFilters={applyBulkFilters}
                    resetFilters={resetFilters} 
                    hasActiveFilters={hasActiveFilters} 
                />
            </div>

            {stats && (
                <div className="stats-grid">
                    <StatCard label="Avg CGPA" value={stats.avg_cgpa} color="teal" />
                    <StatCard label="Avg Exam Score" value={stats.avg_exam_score} color="blue" />
                    <StatCard label="Avg AI Hours" value={stats.avg_ai_hours} color="yellow" />
                    <StatCard label="Avg AI Helpfulness" value={stats.avg_ai_helpfulness} color="green" />
                </div>
            )}

            <div className="section-divider">
                <h3>Behavioral Intelligence</h3>
                <span>Detailed analysis of tool interaction and academic patterns</span>
            </div>
            
            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-title">AI Usage Frequency vs Academic Performance</div>
                    <div className="chart-subtitle">How usage frequency relates to CGPA and exam scores</div>
                    <div className="chart-container tall">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart data={freqPerf} margin={{ top: 20, right: 30, bottom: 40, left: 35 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="ai_usage_frequency" tick={{ fontSize: 12 }} label={{ value: 'Usage Frequency', position: 'insideBottom', offset: -25 }} />
                                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => Math.round(val)} label={{ value: 'Score / CGPA', angle: -90, position: 'insideLeft', offset: -15 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="avg_cgpa" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Avg CGPA" />
                                <Bar dataKey="avg_exam_score" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Avg Exam Score" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="chart-card">
                    <div className="chart-title">AI Helpfulness Score vs Exam Performance</div>
                    <div className="chart-subtitle">Does higher AI helpfulness correlate with better exam scores?</div>
                    <div className="chart-container tall">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 35 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="ai_helpfulness_score" type="number" name="Helpfulness" tickFormatter={(val) => Math.round(val)} tick={{ fontSize: 11 }} label={{ value: 'AI Helpfulness Score', position: 'insideBottom', offset: -25 }} />
                                <YAxis dataKey="exam_score" type="number" name="Exam Score" tickFormatter={(val) => Math.round(val)} tick={{ fontSize: 11 }} label={{ value: 'Exam Score', angle: -90, position: 'insideLeft', offset: -15 }} />
                                <ZAxis dataKey="cgpa" range={[50, 300]} name="CGPA" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter data={scatter} fill="#8b5cf6" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="chart-card">
                    <div className="chart-title">Study Hours vs AI Usage Hours</div>
                    <div className="chart-subtitle">Does AI support or replace traditional study time?</div>
                    <div className="chart-container tall">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <LineChart data={studyVsAI} margin={{ top: 20, right: 30, bottom: 40, left: 35 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="ai_usage_frequency" tick={{ fontSize: 12 }} label={{ value: 'AI Usage Frequency', position: 'insideBottom', offset: -25 }} />
                                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => Math.round(val)} label={{ value: 'Weekly Hours', angle: -90, position: 'insideLeft', offset: -15 }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="avg_study_hours" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 6 }} name="Avg Study Hrs" />
                                <Line type="monotone" dataKey="avg_ai_hours" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} name="Avg AI Hrs" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="chart-card">
                    <div className="chart-title">Academic Stream vs AI Tool Usage</div>
                    <div className="chart-subtitle">How AI tool adoption varies across streams</div>
                    <div className="chart-container tall">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart data={aiByStream} margin={{ top: 20, right: 30, bottom: 60, left: 35 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="academic_stream" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={55} label={{ value: 'Academic Stream', position: 'insideBottom', offset: -45 }} />
                                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => Math.round(val)} label={{ value: 'Student Count', angle: -90, position: 'insideLeft', offset: -15 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Students" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="chart-card full-width">
                    <div className="chart-title">Regional AI Usage Patterns</div>
                    <div className="chart-subtitle">AI usage behavior across states and city tiers</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart data={regional} margin={{ top: 20, right: 30, bottom: 80, left: 35 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="state_tier" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={70} label={{ value: 'State & Tier', position: 'insideBottom', offset: -60 }} />
                                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => Math.round(val)} label={{ value: 'Average Values', angle: -90, position: 'insideLeft', offset: -15 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="avg_ai_hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Avg AI Hours" />
                                <Bar dataKey="avg_cgpa" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Avg CGPA" />
                                <Bar dataKey="avg_digital_literacy" fill="#10b981" radius={[4, 4, 0, 0]} name="Avg Digital Literacy" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="chart-card full-width">
                    <div className="chart-title">Digital Literacy vs Academic Performance</div>
                    <div className="chart-subtitle">How digital literacy scores influence CGPA and exam scores</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 35 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="digital_literacy_score" type="number" name="Digital Literacy" tickFormatter={(val) => Math.round(val)} tick={{ fontSize: 11 }} label={{ value: 'Digital Literacy Score', position: 'insideBottom', offset: -25 }} />
                                <YAxis dataKey="cgpa" type="number" name="CGPA" tickFormatter={(val) => Math.round(val)} tick={{ fontSize: 11 }} label={{ value: 'CGPA', angle: -90, position: 'insideLeft', offset: -20 }} />
                                <ZAxis dataKey="exam_score" range={[40, 250]} name="Exam Score" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter data={scatter} fill="#10b981" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <CGPAIndicator distribution={cgpaDist} />

            <div className="export-bar">
                <div className="export-bar-title"><FileDown size={17} />Export Dashboard Data</div>
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