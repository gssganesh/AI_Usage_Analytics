import { useState } from 'react';
import TableauEmbed from '../components/TableauEmbed';
import { LayoutDashboard, Presentation } from 'lucide-react';

export default function TableauReports() {
    const [activeTab, setActiveTab] = useState(null);

    return (
        <div className="page-content animate-fade-in">
            <div className="page-title-section" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2>Interactive Tableau Reports</h2>
                <p>Advanced cross-functional analytics and data exploration</p>
                
                <div style={{
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '20px', 
                    marginTop: '30px'
                }}>
                    <button 
                        onClick={() => setActiveTab('dashboards')}
                        className="export-btn"
                        style={{ 
                            padding: '16px 32px', 
                            fontSize: '1.1rem',
                            background: activeTab === 'dashboards' ? 'var(--accent)' : 'var(--bg-glass)',
                            color: activeTab === 'dashboards' ? '#fff' : 'var(--text-primary)',
                            borderColor: activeTab === 'dashboards' ? 'var(--accent)' : 'var(--border-glass)'
                        }}
                    >
                        <LayoutDashboard size={20} />
                        Tableau Dashboards
                    </button>
                    <button 
                        onClick={() => setActiveTab('story')}
                        className="export-btn"
                        style={{ 
                            padding: '16px 32px', 
                            fontSize: '1.1rem',
                            background: activeTab === 'story' ? 'var(--accent)' : 'var(--bg-glass)',
                            color: activeTab === 'story' ? '#fff' : 'var(--text-primary)',
                            borderColor: activeTab === 'story' ? 'var(--accent)' : 'var(--border-glass)'
                        }}
                    >
                        <Presentation size={20} />
                        Tableau Story
                    </button>
                </div>
            </div>

            {activeTab === 'dashboards' && (
                <div className="charts-grid tableau-stack animate-fade-in">
                    <div className="chart-card full-width">
                        <div className="chart-title">AI Usage & Academic Performance</div>
                        <div className="chart-subtitle">Comprehensive analysis of AI tool integration and student outcomes</div>
                        <div className="tableau-viz-container">
                            <TableauEmbed dashboard="ai-usage" height={700} />
                        </div>
                    </div>

                    <div className="chart-card full-width">
                        <div className="chart-title">Learning Behavior & Student Well-being</div>
                        <div className="chart-subtitle">Environmental and behavioral factors impacting student efficiency</div>
                        <div className="tableau-viz-container">
                            <TableauEmbed dashboard="learning" height={700} />
                        </div>
                    </div>

                    <div className="chart-card full-width">
                        <div className="chart-title">AI Adoption & Accessibility</div>
                        <div className="chart-subtitle">Insights into AI tool adoption rates and accessibility metrics</div>
                        <div className="tableau-viz-container">
                            <TableauEmbed dashboard="adoption" height={700} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'story' && (
                <div className="charts-grid tableau-stack animate-fade-in">
                    <div className="chart-card full-width">
                        <div className="chart-title">Student AI Analytics Story 1</div>
                        <div className="chart-subtitle">Initial interactive narrative presentation of our findings</div>
                        <div className="tableau-viz-container">
                            <TableauEmbed dashboard="story" height={850} />
                        </div>
                    </div>
                    
                    <div className="chart-card full-width" style={{ marginTop: '30px' }}>
                        <div className="chart-title">Student AI Analytics Story 2</div>
                        <div className="chart-subtitle">Advanced interactive narrative and deep dive</div>
                        <div className="tableau-viz-container">
                            <TableauEmbed dashboard="story2" height={850} />
                        </div>
                    </div>
                </div>
            )}
            
            {!activeTab && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    <p>Please select a report type above to view the interactive visualizations.</p>
                </div>
            )}
        </div>
    );
}

