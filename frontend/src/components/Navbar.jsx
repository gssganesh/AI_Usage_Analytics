import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Bell, Info, AlertTriangle, CheckCircle, Search, LogOut } from 'lucide-react';

export default function Navbar({ title, badge }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { highRiskCount, notifications } = useNotification();
    const [showNotifs, setShowNotifs] = useState(false);

    const initials = user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'SA';

    return (
        <header className="top-navbar">
            <div className="navbar-left">
                <span className="navbar-title">{title || 'Dashboard'}</span>
                {badge && <span className="navbar-badge">{badge}</span>}
                
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const val = e.target.search.value.trim();
                    if(val) navigate(`/dashboard/profile/${val}`);
                }} style={{ marginLeft: '30px', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        name="search"
                        type="text" 
                        placeholder="Search Student ID..." 
                        style={{ 
                            padding: '8px 15px 8px 35px', borderRadius: '12px', border: '1px solid var(--border-glass)', 
                            background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem', width: '220px',
                            transition: 'all 0.3s'
                        }}
                        onFocus={(e) => e.target.style.width = '300px'}
                        onBlur={(e) => e.target.style.width = '220px'}
                    />
                </form>
            </div>
            
            <div className="navbar-right">
                
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={() => setShowNotifs(!showNotifs)}
                        style={{ background:'transparent', color:'var(--text-muted)', cursor:'pointer', border:'none', padding:'10px', position:'relative', transition:'0.3s' }}
                    >
                        <Bell size={21} className={showNotifs ? 'active-icon' : ''} />
                        {highRiskCount > 0 && (
                            <span style={{ 
                                position:'absolute', top:'5px', right:'5px', width:'8px', height:'8px', 
                                background:'#ff4d4d', borderRadius:'50%', border:'1.5px solid #fff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}></span>
                        )}
                    </button>

                    {showNotifs && (
                        <div className="notif-dropdown">
                            <div style={{ padding: '0 20px 10px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Notifications</h4>
                                <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' }}>Mark all read</span>
                            </div>
                            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                {notifications.map(n => (
                                    <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <div style={{ color: n.type === 'warning' ? 'var(--warning)' : n.type === 'success' ? 'var(--success)' : 'var(--accent)' }}>
                                                {n.type === 'warning' ? <AlertTriangle size={14} /> : n.type === 'success' ? <CheckCircle size={14} /> : <Info size={14} />}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <strong>{n.title}</strong>
                                                <span>{n.msg}</span>
                                                <small style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>{n.time}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link to="/dashboard/insights" onClick={() => setShowNotifs(false)} style={{ display: 'block', textAlign: 'center', padding: '12px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', borderTop: '1px solid var(--border-glass)' }}>
                                View All Insights
                            </Link>
                        </div>
                    )}
                </div>

                <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '15px', borderRight: '1px solid var(--border-glass)' }}>
                        <div className="navbar-avatar">{initials}</div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="navbar-user-info">{user?.full_name || 'System Admin'}</div>
                            <div className="navbar-user-role">{user?.role || 'Administrator'}</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            if(window.confirm('Are you sure you want to sign out?')) {
                                logout();
                                navigate('/login');
                            }
                        }}
                        style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)',
                            padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                            fontSize: '0.8rem', fontWeight: 700, transition: '0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </div>
        </header>
    );
}