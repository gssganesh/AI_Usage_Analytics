import { useEffect, useState } from 'react';
import { useFilters } from '../hooks/useFilters';
import FilterPanel from '../components/FilterPanel';
import StatCard from '../components/StatCard';
import { ShieldAlert, Users, Target, Activity, Send, Info, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis
} from 'recharts';

export default function RiskAssessment() {
    const { filters, filterOptions, fetchFilterOptions, updateFilter, applyBulkFilters, resetFilters, hasActiveFilters } = useFilters();
    const [riskData, setRiskData] = useState(null);
    const [alertingId, setAlertingId] = useState(null);
    const [model] = useState('logistic'); // Logic hardcoded to Logistic Regression as requested
    const [loading, setLoading] = useState(true);
    const [isBatchAlerting, setIsBatchAlerting] = useState(false);
    const { setHighRiskCount, addNotification } = useNotification();

    useEffect(function() { fetchFilterOptions(); }, [fetchFilterOptions]);

    useEffect(function() {
        async function load() {
            setLoading(true);
            try {
                var res = await api.getRiskAssessment(filters, model);
                setRiskData(res);
                setHighRiskCount(res.summary.high);
                if (res.summary.high > 0) {
                    addNotification({
                        type: 'warning',
                        title: 'Risk Level Update',
                        msg: `${res.summary.high} students identified as High Risk under current filters.`,
                        time: 'Just now'
                    });
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        load();
    }, [filters, model, setHighRiskCount]);

    const handleSendAlert = async (studentId) => {
        setAlertingId(studentId);
        try {
            await api.sendAlert({
                title: 'High Risk Dual-Alert',
                text: `URGENT: Student #${studentId} identified as HIGH RISK. Academic intervention required.\n\n` + 
                      `This automated alert has been dispatched to both the <b>Student</b> and the <b>Administration</b> via Telegram.`
            });
            alert(`Dual-Alert dispatched for Student #${studentId}`);
        } catch (e) { alert('Failed to dispatch dual-alerts'); }
        finally { setAlertingId(null); }
    };

    const handleSendAllAlerts = async () => {
        if (!riskData || !riskData.high_risk_list.length) return;
        if (!window.confirm(`Are you sure you want to send alerts to all ${riskData.high_risk_list.length} high-risk students and administrators?`)) return;

        setIsBatchAlerting(true);
        let successCount = 0;
        
        // 1. Send individual alerts to each student (target: student)
        for (const student of riskData.high_risk_list) {
            try {
                await api.sendAlert({
                    target: 'student',
                    title: 'Academic Risk Alert',
                    text: `Dear Student #${student.student_id}, our predictive system has identified you as being in a 'High Risk' academic zone. \n\n` + 
                          `Current CGPA: ${student.cgpa}\nAI Dependency: ${student.ai_usage_hours_per_week}h/week\n\n` +
                          `Please schedule a meeting with your academic advisor immediately for intervention.`
                });
                successCount++;
            } catch (e) {
                console.error(`Failed to alert student ${student.student_id}`);
            }
        }

        // 2. Send one consolidated report to the administrator (target: admin)
        try {
            const adminReport = `
                <b>BATCH INTERVENTION REPORT</b><br/>
                Total Students Flagged: ${riskData.high_risk_list.length}<br/><br/>
                <table border="1" style="width:100%; border-collapse: collapse;">
                    <tr style="background: #f0f0f0;">
                        <th>ID</th><th>Stream</th><th>CGPA</th><th>AI Hrs</th><th>Risk</th>
                    </tr>
                    ${riskData.high_risk_list.map(s => `
                        <tr>
                            <td>#${s.student_id}</td>
                            <td>${s.academic_stream}</td>
                            <td>${s.cgpa}</td>
                            <td>${s.ai_usage_hours_per_week}h</td>
                            <td>${s.risk_score}%</td>
                        </tr>
                    `).join('')}
                </table>
                <br/><i>This report is generated using the ${model.replace('_',' ')} model.</i>
            `;

            await api.sendAlert({
                target: 'admin',
                title: 'Consolidated High-Risk Report',
                text: adminReport
            });
            console.log('Admin summary sent successfully.');
        } catch (e) {
            console.error('Failed to send admin summary report');
        }

        alert(`Batch Processing Complete: ${successCount} students notified. One consolidated report sent to Admin.`);
        setIsBatchAlerting(false);
    };

    return (
        <div className="page-content">
            <div className="page-title-section">
                <h2>Student Risk Warning System</h2>
                <p>Real-time predictive analysis of student academic vulnerability zones</p>
            </div>

            <div className="filter-panel" style={{ borderLeft: '4px solid var(--accent)' }}>
                <div className="filter-header">
                    <div className="filter-title"><Target size={18} /> Global Filter Controls</div>
                </div>
                <div className="filter-grid">
                    <FilterPanel 
                        filters={filters} 
                        filterOptions={filterOptions} 
                        updateFilter={updateFilter} 
                        applyBulkFilters={applyBulkFilters}
                        resetFilters={resetFilters} 
                        hasActiveFilters={hasActiveFilters} 
                    />
                </div>
            </div>

            {loading && !riskData ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Initializing {model.replace('_',' ')} Model...</span>
                </div>
            ) : riskData ? (
                <>
                    <div className="stats-grid">
                        <StatCard label="High Risk Students" value={riskData.summary.high} color="red" icon={<ShieldAlert size={20} />} />
                        <StatCard label="Medium Risk" value={riskData.summary.medium} color="yellow" icon={<Activity size={20} />} />
                        <StatCard label="Low Risk / Healthy" value={riskData.summary.low} color="green" icon={<Users size={20} />} />
                        <StatCard label="Total Population" value={riskData.summary.total} color="blue" icon={<Info size={20} />} />
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <div className="chart-title">Risk Level Distribution</div>
                            <div className="chart-subtitle">Current breakdown of student population based on {model.replace('_',' ')} model</div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                    <PieChart>
                                        <Pie data={riskData.risk_distribution} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                                            {riskData.risk_distribution.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-title">Academic Risk Zones</div>
                            <div className="chart-subtitle">Mapping CGPA vs AI Usage Dependency per Student</div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" dataKey="ai_usage_hours_per_week" name="AI Hours" unit="h" />
                                        <YAxis type="number" dataKey="cgpa" name="CGPA" />
                                        <ZAxis type="number" dataKey="risk_score" range={[50, 400]} name="Risk Score" />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                        <Scatter name="Students" data={riskData.high_risk_list} fill="#ef4444" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="chart-card full-width">
                        <div className="chart-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>High-Risk Student Identification Queue</span>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <button 
                                    className="export-btn" 
                                    style={{ background: '#ef4444', color: 'white', border: 'none', padding:'8px 18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
                                    onClick={handleSendAllAlerts}
                                    disabled={isBatchAlerting || !riskData.high_risk_list.length}
                                >
                                    <Send size={15} /> {isBatchAlerting ? 'Sending...' : 'Send All Alerts'}
                                </button>
                                <span className="badge red" style={{ background:'var(--danger)', color:'white', padding:'4px 10px', borderRadius:'8px', fontSize:'0.7rem' }}>Action Required</span>
                            </div>
                        </div>
                        <div className="table-responsive" style={{ marginTop: '20px', overflowX:'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '12px' }}>ID</th>
                                        <th>Name</th>
                                        <th>Stream</th>
                                        <th>CGPA</th>
                                        <th>AI Hours</th>
                                        <th>Risk</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riskData.high_risk_list.map(s => (
                                        <tr key={s.student_id} className="risk-row" style={{ background: 'var(--bg-input)', borderRadius: '12px' }}>
                                            <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', fontWeight: 800 }}>#{s.student_id}</td>
                                            <td style={{ fontWeight: 600 }}>Student {s.student_id}</td>
                                            <td>{s.academic_stream}</td>
                                            <td><span className="navbar-badge" style={{ background:'transparent', border:'1px solid var(--border-glass-bright)' }}>{s.cgpa}</span></td>
                                            <td>{s.ai_usage_hours_per_week}h</td>
                                            <td><strong style={{ color: '#ef4444' }}>{s.risk_score}%</strong></td>
                                            <td style={{ borderRadius: '0 12px 12px 0' }}>
                                                <button 
                                                    className="export-btn" 
                                                    style={{ background: 'var(--accent)', color: 'white', border: 'none', padding:'8px 15px' }}
                                                    onClick={() => handleSendAlert(s.student_id)}
                                                    disabled={alertingId === s.student_id || isBatchAlerting}
                                                >
                                                    <Send size={14} /> {alertingId === s.student_id ? 'Wait...' : 'Alert'}
                                                </button>
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
                    <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '20px' }} />
                    <h3>Simulation Failure</h3>
                    <p>Unable to connect to the predictive engine. Please check your database connection.</p>
                </div>
            )}
        </div>
    );
}
