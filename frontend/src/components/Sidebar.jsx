import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Brain, User, Lightbulb, LogOut, BarChart3, Presentation, ShieldAlert, Zap } from 'lucide-react';

export default function Sidebar() {
    const { logout } = useAuth();
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo"><BarChart3 size={18} /></div>
                <div className="sidebar-brand">Student AI Analytics<span>Performance System</span></div>
            </div>
            <nav className="sidebar-nav">
                <div className="nav-section-label">Main</div>
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><LayoutDashboard size={19} />Overview Dashboard</NavLink>
                <div className="nav-section-label">Analytics</div>
                <NavLink to="/dashboard/risk" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} style={{ borderLeft: '3px solid #ef4444' }}><ShieldAlert size={19} color="#ef4444" />Risk Warning</NavLink>
                <NavLink to="/dashboard/efficiency" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} style={{ borderLeft: '3px solid var(--accent)' }}><Zap size={19} color="var(--accent)" />AI Efficiency Score</NavLink>
                <NavLink to="/dashboard/ai-usage" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><Brain size={19} />AI Usage & Performance</NavLink>
                <NavLink to="/dashboard/profile" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><User size={19} />Student Profile Analyzer</NavLink>
                <div className="nav-section-label">Reports</div>
                <NavLink to="/dashboard/tableau" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><Presentation size={19} />Tableau Dashboards</NavLink>
                <NavLink to="/dashboard/insights" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><Lightbulb size={19} />Actionable Insights</NavLink>
            </nav>
            <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid var(--border-glass)', opacity: 0.5, fontSize: '0.7rem', textAlign: 'center' }}>
                © MY Student Analytics System
            </div>
        </aside>
    );
}