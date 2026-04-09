import { useEffect, useState } from 'react';
import { useFilters } from '../hooks/useFilters';
import StatCard from '../components/StatCard';
import FilterPanel from '../components/FilterPanel';
import CGPAIndicator from '../components/CGPAIndicator';
import ExportButton from '../components/ExportButton';
import { FileDown } from 'lucide-react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#14b8a6','#0ea5e9','#8b5cf6','#f97316','#22c55e','#ef4444','#eab308','#ec4899'];

export default function MainDashboard() {
    const { filters, filterOptions, fetchFilterOptions, updateFilter, applyBulkFilters, resetFilters, hasActiveFilters } = useFilters();
    const [stats, setStats] = useState(null);
    const [cgpaDist, setCgpaDist] = useState([]);
    const [aiByStream, setAiByStream] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchFilterOptions(); }, [fetchFilterOptions]);
    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const [s, c, st] = await Promise.all([api.getStats(filters), api.getCGPADistribution(filters), api.getAIUsageByStream(filters)]);
                setStats(s.stats); setCgpaDist(c.data); setAiByStream(st.data);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        }
        load();
    }, [filters]);

    const toolPie = aiByStream.reduce((a, i) => { const e = a.find(d => d.name === i.ai_tool); if (e) e.value += i.count; else a.push({ name: i.ai_tool, value: i.count }); return a; }, []);

    if (loading) return <div className="loading-spinner"><div className="spinner"></div><span>Loading...</span></div>;

    return (
        <div className="page-content">
            <div className="page-title-section"><h2>Overview Dashboard</h2><p>High-level summary of student AI usage and academic performance from your MySQL database</p></div>
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
                    <StatCard label="Total Students" value={stats.total_students} color="teal" />
                    <StatCard label="Average CGPA" value={stats.avg_cgpa} sub="Out of 10.0" color="blue" />
                    <StatCard label="Avg Exam Score" value={stats.avg_exam_score} sub="Out of 100" color="green" />
                    <StatCard label="Avg AI Hours/Week" value={stats.avg_ai_hours} color="yellow" />
                    <StatCard label="Avg Study Hours/Week" value={stats.avg_study_hours} color="teal" />
                    <StatCard label="AI Adoption Rate" value={`${stats.ai_adoption_rate}%`} sub="Daily users" color="blue" />
                    <StatCard label="Avg Digital Literacy" value={stats.avg_digital_literacy} sub="Score out of 100" color="green" />
                    <StatCard label="Plagiarism Rate" value={`${stats.plagiarism_rate}%`} sub={`${stats.plagiarism_count} flagged`} color="red" />
                </div>
            )}
            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-title">AI Tool Usage Distribution</div>
                    <div className="chart-subtitle">Number of students using each AI tool (from your database)</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}><PieChart><Pie data={toolPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{toolPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
                    </div>
                </div>
                <div className="chart-card">
                    <div className="chart-title">AI Tool Usage by Academic Stream</div>
                    <div className="chart-subtitle">Stacked distribution of tools across academic disciplines</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart 
                                data={aiByStream.reduce((acc, curr) => {
                                    let stream = acc.find(s => s.name === curr.academic_stream);
                                    if (!stream) {
                                        stream = { name: curr.academic_stream, total: 0 };
                                        acc.push(stream);
                                    }
                                    stream[curr.ai_tool] = curr.count;
                                    stream.total += curr.count;
                                    return acc;
                                }, [])} 
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{ fontSize: 11, fontWeight: 700 }} 
                                    label={{ value: 'Academic Streams', position: 'bottom', offset: 40, fontSize: 13, fontWeight: 800 }}
                                />
                                <YAxis 
                                    tick={{ fontSize: 11 }} 
                                    label={{ value: 'Total Number of Students', angle: -90, position: 'insideLeft', offset: -10, fontSize: 13, fontWeight: 800 }}
                                />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '12px', fontWeight: 700, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ padding: '2px 0' }}
                                    labelFormatter={(label, payload) => {
                                        if (payload && payload.length > 0) {
                                            const total = payload[0].payload.total;
                                            return (
                                                <div style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)', marginBottom: '8px' }}>
                                                    <div style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{label}</div>
                                                    <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 900 }}>TOTAL STUDENTS: {total}</div>
                                                </div>
                                            );
                                        }
                                        return label;
                                    }}
                                />
                                {Array.from(new Set(aiByStream.map(i => i.ai_tool))).map((tool, idx) => (
                                    <Bar key={tool} dataKey={tool} stackId="a" fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <CGPAIndicator distribution={cgpaDist} />
            <div className="export-bar">
                <div className="export-bar-title"><FileDown size={17} />Export Your Data</div>
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