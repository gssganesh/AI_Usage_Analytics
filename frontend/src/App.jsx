import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import MainDashboard from './pages/MainDashboard';
import AIUsageDashboard from './pages/AIUsageDashboard';
import StudentProfile from './pages/StudentProfile';
import TableauReports from './pages/TableauReports';
import InsightsPage from './pages/InsightsPage';
import RiskAssessment from './pages/RiskAssessment';
import AIEfficiency from './pages/AIEfficiency';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { NotificationProvider } from './context/NotificationContext';
import MouseFollower from './components/MouseFollower';
import useScrollReveal from './hooks/useScrollReveal';

function Wrap({ children, title, badge }) {
    return (
        <>
            <Navbar title={title} badge={badge} />
            <div className="page-content">{children}</div>
        </>
    );
}

export default function App() {
    var auth = useAuth();
    useScrollReveal();

    if (auth.loading) {
        return (
            <div className="loading-spinner" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
                <span>Loading...</span>
            </div>
        );
    }

    if (!auth.user) {
        return (
            <>
                <MouseFollower />
                <Login />
            </>
        );
    }

    return (
        <NotificationProvider>
            <MouseFollower />
            <div className="app-global-bg" style={{ background: 'linear-gradient(to bottom right, var(--bg-primary), var(--bg-secondary))' }}>
                <div className="global-bg-overlay"></div>
            </div>
            <div className="app-layout">
                <Sidebar />
                <div className="main-content">
                    <Routes>
                        <Route path="/dashboard" element={<Wrap title="Overview Dashboard" badge="Live Data"><MainDashboard /></Wrap>} />
                        <Route path="/dashboard/ai-usage" element={<Wrap title="AI Usage" badge="Dashboard 1"><AIUsageDashboard /></Wrap>} />
                        <Route path="/dashboard/profile/:id?" element={<Wrap title="Student Profile Analyzer" badge="Personalized"><StudentProfile /></Wrap>} />
                        <Route path="/dashboard/tableau" element={<Wrap title="Tableau Reports" badge="Interactive"><TableauReports /></Wrap>} />
                        <Route path="/dashboard/insights" element={<Wrap title="Actionable Insights" badge="Dynamic"><InsightsPage /></Wrap>} />
                        <Route path="/dashboard/risk" element={<Wrap title="Risk Warning"><RiskAssessment /></Wrap>} />
                        <Route path="/dashboard/efficiency" element={<Wrap title="AI Efficiency"><AIEfficiency /></Wrap>} />
                        <Route path="*" element={<Wrap title="Overview Dashboard" badge="Live Data"><MainDashboard /></Wrap>} />
                    </Routes>
                </div>
            </div>
        </NotificationProvider>
    );
}