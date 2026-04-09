import { useEffect, useState } from 'react';
import { useFilters } from '../hooks/useFilters';
import FilterPanel from '../components/FilterPanel';
import { api } from '../services/api';

export default function InsightsPage() {
    var filtersObj = useFilters();
    var filters = filtersObj.filters;
    var filterOptions = filtersObj.filterOptions;
    var fetchFilterOptions = filtersObj.fetchFilterOptions;
    var updateFilter = filtersObj.updateFilter;
    var resetFilters = filtersObj.resetFilters;
    var hasActiveFilters = filtersObj.hasActiveFilters;
    var applyBulkFilters = filtersObj.applyBulkFilters;

    var loadingState = useState(true);
    var loading = loadingState[0];
    var setLoading = loadingState[1];

    var statsState = useState(null);
    var stats = statsState[0];
    var setStats = statsState[1];

    var scatterState = useState([]);
    var scatterData = scatterState[0];
    var setScatterData = scatterState[1];

    var insightsState = useState([]);
    var insights = insightsState[0];
    var setInsights = insightsState[1];

    var alertState = useState(null);
    var sendingAlert = alertState[0];
    var setSendingAlert = alertState[1];

    var errorState = useState(null);
    var pageError = errorState[0];
    var setError = errorState[1];

    useEffect(function() { fetchFilterOptions(); }, [fetchFilterOptions]);

    useEffect(function() {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                var s = await api.getStats(filters);
                var sc = await api.getScatterData(filters);
                setStats(s.stats);
                setScatterData(sc.data);
                setInsights(buildInsights(s.stats, sc.data));
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [filters]);

    function handleSendAlert(insight) {
        setSendingAlert(insight.title);
        api.sendAlert({ title: insight.title, text: insight.text })
            .then(function(data) {
                alert(data.message || data.success ? 'Alert sent successfully!' : 'Alert sent!');
            })
            .catch(function(err) {
                alert('Alert failed: ' + err.message);
            })
            .finally(function() { setSendingAlert(null); });
    }

    function buildInsights(s, data) {
        if (!s || !data || data.length === 0) return [];
        var list = [];
        var total = data.length;

        var aiReliant = data.filter(function(d) { return parseFloat(d.ai_usage_hours_per_week || 0) > parseFloat(d.study_hours_per_week || 0); });
        var trad = data.filter(function(d) { return parseFloat(d.study_hours_per_week || 0) >= parseFloat(d.ai_usage_hours_per_week || 0); });
        if (aiReliant.length > 0 && trad.length > 0) {
            var a1 = aiReliant.reduce(function(sm, d) { return sm + parseFloat(d.cgpa || 0); }, 0) / aiReliant.length;
            var t1 = trad.reduce(function(sm, d) { return sm + parseFloat(d.cgpa || 0); }, 0) / trad.length;
            var diff = (t1 - a1).toFixed(2);
            list.push({ impact: Math.abs(diff) > 0.5 ? 'high' : 'medium', icon: 'alert', title: 'AI Over-reliance Detected in ' + aiReliant.length + ' Students', text: 'AI-heavy studiers avg CGPA ' + a1.toFixed(2) + ' vs ' + t1.toFixed(2) + ' for traditional studiers (Gap: ' + diff + ').', action: 'Enforce mandatory AI-Free foundational assignments to ensure core concept retention.' });
        }

        var srt = data.slice().sort(function(a, b) { return parseFloat(b.ai_usage_hours_per_week || 0) - parseFloat(a.ai_usage_hours_per_week || 0); });
        var hlf = Math.floor(total / 2);
        var hiAi = srt.slice(0, hlf);
        var loAi = srt.slice(hlf);
        if (hiAi.length > 0 && loAi.length > 0) {
            var hs = hiAi.reduce(function(sm, d) { return sm + parseFloat(d.mental_stress_score || 0); }, 0) / hiAi.length;
            var ls = loAi.reduce(function(sm, d) { return sm + parseFloat(d.mental_stress_score || 0); }, 0) / loAi.length;
            if (ls > 0 && ((hs - ls) / ls * 100) > 5) {
                list.push({ impact: 'high', icon: 'brain', title: 'High AI Usage Correlates with Increased Stress', text: 'Top 50% AI users report stress score ' + hs.toFixed(1) + ' vs ' + ls.toFixed(1) + ' for low users.', action: 'Integrate counseling resources and promote healthy AI usage guidelines in orientations.' });
            }
        }

        var avgH = data.reduce(function(sm, d) { return sm + parseFloat(d.ai_helpfulness_score || 0); }, 0) / total;
        var hGrp = data.filter(function(d) { return parseFloat(d.ai_helpfulness_score || 0) > avgH; });
        var uGrp = data.filter(function(d) { return parseFloat(d.ai_helpfulness_score || 0) <= avgH; });
        if (hGrp.length > 0 && uGrp.length > 0) {
            var he = hGrp.reduce(function(sm, d) { return sm + parseFloat(d.exam_score || 0); }, 0) / hGrp.length;
            var ue = uGrp.reduce(function(sm, d) { return sm + parseFloat(d.exam_score || 0); }, 0) / uGrp.length;
            if (he <= ue + 2) {
                list.push({ impact: 'medium', icon: 'lightbulb', title: 'The Helpfulness Illusion', text: 'Students rating AI highly helpful score ' + he.toFixed(1) + '% on exams vs ' + ue.toFixed(1) + '% for those who do not.', action: 'Shift focus from how to use AI to how to verify AI outputs in curriculum design.' });
            }
        }

        var lL = data.filter(function(d) { return parseFloat(d.digital_literacy_score || 0) < 50; });
        var hL = data.filter(function(d) { return parseFloat(d.digital_literacy_score || 0) >= 50; });
        if (lL.length > 0 && hL.length > 0) {
            var le = lL.reduce(function(sm, d) { return sm + parseFloat(d.exam_score || 0); }, 0) / lL.length;
            var he2 = hL.reduce(function(sm, d) { return sm + parseFloat(d.exam_score || 0); }, 0) / hL.length;
            list.push({ impact: Math.abs(he2 - le) > 10 ? 'high' : 'medium', icon: 'trending', title: 'Digital Literacy Gap Costs ' + (he2 - le).toFixed(1) + '% Points', text: 'Low literacy students avg ' + le.toFixed(1) + '% vs high literacy ' + he2.toFixed(1) + '% on exams.', action: 'Implement mandatory digital literacy bootcamps in Semester 1 for at-risk students.' });
        }

        if (s.avg_ai_hours) {
            var hAssign = data.filter(function(d) { return parseFloat(d.ai_usage_hours_per_week || 0) > parseFloat(s.avg_ai_hours); });
            if (hAssign.length > 0) {
                var avgC = hAssign.reduce(function(sm, d) { return sm + parseFloat(d.assignment_completion_pct || 0); }, 0) / hAssign.length;
                list.push({ impact: avgC > 85 ? 'low' : 'medium', icon: 'check', title: 'AI Impact on Assignment Completion', text: 'Students above avg AI usage complete ' + avgC.toFixed(1) + '% of assignments. Speeds up tasks but not guarantee deeper understanding.', action: 'Replace standard assignments with in-class practical evaluations or viva voce.' });
            }
        }

        if (s.plagiarism_count > 0) {
            list.push({ impact: s.plagiarism_rate > 10 ? 'high' : 'medium', icon: 'shield', title: 'Plagiarism Alert: ' + s.plagiarism_count + ' Flagged Students (' + s.plagiarism_rate + '%)', text: 'Out of ' + s.total_students + ' students, ' + s.plagiarism_count + ' are flagged for plagiarism.', action: 'Deploy strict AI-detection software for all submissions and conduct academic integrity workshops.' });
        }

        return list;
    }

    if (loading) {
        return <div className="loading-spinner"><div className="spinner"></div><span>Analyzing data...</span></div>;
    }

    if (pageError) {
        return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--danger)' }}><h3>Error</h3><p>{pageError}</p></div>;
    }

    function getIcon(icon) {
        switch(icon) {
            case 'alert': return <div className="ins-icon bg-red"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>;
            case 'brain': return <div className="ins-icon bg-purple"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-1.96-2.43V6.5a2.5 2.5 0 0 1 4.42-1.62Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 1.96-2.43V6.5a2.5 2.5 0 0 0-4.42-1.62Z"/></svg></div>;
            case 'lightbulb': return <div className="ins-icon bg-blue"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></div>;
            case 'trending': return <div className="ins-icon bg-teal"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>;
            case 'check': return <div className="ins-icon bg-green"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg></div>;
            case 'shield': return <div className="ins-icon bg-red"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>;
            default: return <div className="ins-icon bg-gray"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div>;
        }
    }

    return (
        <div className="page-content">
            <div className="page-title-section">
                <h2>Actionable Insights and Alerts</h2>
                <p>Dynamic recommendations based on your filtered data. Send instant Telegram alerts for critical issues.</p>
            </div>

            <FilterPanel 
                filters={filters} 
                filterOptions={filterOptions} 
                updateFilter={updateFilter} 
                applyBulkFilters={applyBulkFilters}
                resetFilters={resetFilters} 
                hasActiveFilters={hasActiveFilters} 
            />

            {insights.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '6px' }}>No insights available</h4>
                    <p style={{ fontSize: '.83rem' }}>Change filters to generate insights.</p>
                </div>
            ) : (
                <div className="insights-vertical-stack">
                    {insights.map(function(ins, i) {
                        var isSending = sendingAlert === ins.title;
                        var impactColor = ins.impact === 'high' ? '#ef4444' : ins.impact === 'medium' ? '#3b82f6' : '#10b981';

                        return (
                            <div className="insight-tile-card animate-fade-in" key={i} style={{ animationDelay: (i * 0.1) + 's' }}>
                                <div className="insight-tile-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        {getIcon(ins.icon)}
                                        <div className="insight-title-group">
                                            <h4>{ins.title}</h4>
                                            <p>{ins.text}</p>
                                        </div>
                                    </div>
                                    <div className="insight-impact-badge" style={{ backgroundColor: impactColor + '15', color: impactColor, borderColor: impactColor + '30' }}>
                                        {ins.impact} Impact
                                    </div>
                                </div>

                                <div className="insight-tile-body">
                                    <div className="insight-recommendation">
                                        <div className="rec-label">Strategic Recommendation</div>
                                        <div className="rec-text">{ins.action}</div>
                                    </div>

                                    <button
                                        onClick={function() { handleSendAlert(ins); }}
                                        disabled={isSending}
                                        className="insight-action-btn"
                                        style={{
                                            background: isSending ? 'var(--bg-input)' : 'var(--accent)',
                                            color: isSending ? 'var(--text-muted)' : '#fff'
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                                        {isSending ? 'Transmitting Alert...' : 'Send Telegram Alert'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}