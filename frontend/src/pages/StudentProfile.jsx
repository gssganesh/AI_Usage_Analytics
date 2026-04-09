import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import { 
    User, BookOpen, Brain, ShieldAlert, TrendingUp, 
    Activity, Clock, MapPin, GraduationCap, Search, AlertCircle
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

export default function StudentProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            loadStudent(id);
        }
    }, [id]);

    const loadStudent = async (sid) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.getStudentById(sid);
            if (res.success) {
                setStudent(res.data);
            } else {
                setError(res.message || 'Student not found');
            }
        } catch (e) {
            setError(e.message || 'Failed to fetch student data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchId.trim()) {
            navigate(`/dashboard/profile/${searchId.trim()}`);
        }
    };

    if (loading) return <div className="loading-spinner"><div className="spinner"></div><span>Analyzing Student Profile...</span></div>;

    return (
        <div className="page-content">
            <div className="page-title-section">
                <h2>Student Profile Analyzer</h2>
                <p>Individual-level intelligence and micro-analysis of academic behavior</p>
            </div>

            {!id && !student && (
                <div className="chart-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
                    <Search size={48} color="var(--accent)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                    <h3>Lookup Student intelligence</h3>
                    <p style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}>Enter a Student ID to begin deep-dive analysis</p>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. 26240003" 
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            style={{ flex: 1, padding: '14px 20px', borderRadius: '14px', border: '1px solid var(--border-glass)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                        />
                        <button className="login-btn" style={{ width: 'auto', padding: '0 30px', marginTop: 0 }}>Analyze</button>
                    </form>
                </div>
            )}

            {error && (
                <div className="chart-card" style={{ maxWidth: '600px', margin: '20px auto', borderLeft: '4px solid var(--danger)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <AlertCircle color="var(--danger)" />
                    <div>
                        <strong style={{ display: 'block' }}>Lookup Error</strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{error}</span>
                    </div>
                </div>
            )}

            {student && (
                <div className="profile-layout animate-fade-in">
                    {/* Header Summary */}
                    <div className="chart-card profile-header-card" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                            <div className="navbar-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', borderRadius: '22px' }}>
                                {student.student_id ? student.student_id.toString().slice(-2) : '??'}
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '5px' }}>Student #{student.student_id}</h1>
                                <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {student.state}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><GraduationCap size={14} /> {student.academic_stream}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><TrendingUp size={14} /> {student.education_level}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', 
                                borderRadius: '30px', background: student.risk_level === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: student.risk_level === 'High' ? '#ef4444' : '#10b981', fontWeight: 800, border: '1px solid currentColor'
                            }}>
                                <ShieldAlert size={16} /> {student.risk_level} Risk Level
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <StatCard label="Current CGPA" value={student.cgpa} color="teal" sub="Out of 10.0" />
                        <StatCard label="Exam Score" value={student.exam_score + '%'} color="blue" sub="Recent Assessment" />
                        <StatCard label="AI Usage" value={student.ai_usage_hours_per_week + 'h'} color="purple" sub="Per Week" />
                        <StatCard label="Digital Literacy" value={student.digital_literacy_score} color="green" sub="Skill Index" />
                    </div>

                    <div className="charts-grid">
                        {/* Performance Analysis */}
                        <div className="chart-card">
                            <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div className="chart-title"><Activity size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Performance Analysis</div>
                                    <div className="chart-subtitle">Individual scores relative to department benchmarks</div>
                                </div>
                            </div>
                            <div className="chart-container" style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                    <BarChart data={[
                                        { name: 'CGPA Points', value: student.cgpa, display: `${student.cgpa}/10`, fill: '#14b8a6', scale: 10 },
                                        { name: 'Exam %', value: student.exam_score, display: `${student.exam_score}%`, fill: '#0ea5e9', scale: 1 },
                                        { name: 'Assignments', value: student.assignment_completion_pct, display: `${student.assignment_completion_pct}%`, fill: '#8b5cf6', scale: 1 },
                                        { name: 'Literacy', value: student.digital_literacy_score, display: `${student.digital_literacy_score}%`, fill: '#10b981', scale: 1 }
                                    ]} layout="vertical" margin={{ left: 30, right: 30 }}>
                                        <XAxis type="number" domain={[0, 100]} hide />
                                        <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 700 }} />
                                        <Tooltip 
                                            formatter={(value, name, props) => [props.payload.display, name]}
                                            contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}
                                        />
                                        <Bar dataKey={(d) => d.value * d.scale} radius={[0, 4, 4, 0]} barSize={25}>
                                            {
                                                [
                                                    { name: 'CGPA Points', value: student.cgpa, scale: 10, fill: '#14b8a6' },
                                                    { name: 'Exam %', value: student.exam_score, scale: 1, fill: '#0ea5e9' },
                                                    { name: 'Assignments', value: student.assignment_completion_pct, scale: 1, fill: '#8b5cf6' },
                                                    { name: 'Literacy', value: student.digital_literacy_score, scale: 1, fill: '#10b981' }
                                                ].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* AI Usage Pattern */}
                        <div className="chart-card">
                            <div className="chart-title"><Brain size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> AI Usage Pattern</div>
                            <div className="chart-subtitle">Tooling preference and dependency analysis</div>
                            
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', padding: '20px', background: 'var(--accent-glow)', borderRadius: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Primary Tool</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent)' }}>{student.ai_tool}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Frequency</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{student.ai_usage_frequency}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>AI Dependency Index</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent)' }}>{student.ai_dependency_index}%</span>
                                        </div>
                                        <div className="cgpa-bar-track" style={{ height: '8px' }}>
                                            <div className="cgpa-bar-fill" style={{ width: `${student.ai_dependency_index}%`, background: 'var(--accent)' }}></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Study Efficiency Score</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>{student.study_efficiency_score}/10</span>
                                        </div>
                                        <div className="cgpa-bar-track" style={{ height: '8px' }}>
                                            <div className="cgpa-bar-fill" style={{ width: `${student.study_efficiency_score * 10}%`, background: '#10b981' }}></div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                        <div style={{ flex: 1, padding: '15px', borderRadius: '14px', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                                            <Clock size={16} color="var(--text-muted)" style={{ marginBottom: '5px' }} />
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{student.ai_usage_hours_per_week}h</div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI Hrs/Wk</div>
                                        </div>
                                        <div style={{ flex: 1, padding: '15px', borderRadius: '14px', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                                            <BookOpen size={16} color="var(--text-muted)" style={{ marginBottom: '5px' }} />
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{student.study_hours_per_week}h</div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Study Hrs/Wk</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
