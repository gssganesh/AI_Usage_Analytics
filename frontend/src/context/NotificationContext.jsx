import { createContext, useContext, useState, useEffect } from 'react';
import { Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [highRiskCount, setHighRiskCount] = useState(0);
    const [notifications, setNotifications] = useState([
        { id: 'welcome', type: 'info', title: 'System Connected', msg: 'Real-time risk monitoring active.', time: 'Just now', unread: true }
    ]);
    const [toast, setToast] = useState(null);

    const addNotification = (notif) => {
        const id = Date.now();
        setNotifications(prev => [
            { id, time: 'Just now', unread: true, ...notif },
            ...prev
        ].slice(0, 10)); // Keep last 10
        
        // Also show as temporary toast popup
        setToast({ id, ...notif });
        setTimeout(() => setToast(current => current?.id === id ? null : current), 3000);
    };

    const clearToast = () => setToast(null);

    const getToastIcon = (type) => {
        switch(type) {
            case 'warning': return <AlertTriangle size={18} />;
            case 'success': return <CheckCircle size={18} />;
            case 'info': return <Info size={18} />;
            default: return <Bell size={18} />;
        }
    };

    const getToastColor = (type) => {
        switch(type) {
            case 'warning': return '#ef4444';
            case 'success': return '#10b981';
            default: return 'var(--accent)';
        }
    };

    return (
        <NotificationContext.Provider value={{ highRiskCount, setHighRiskCount, notifications, addNotification, toast, clearToast }}>
            {children}
            {/* Global Toast UI */}
            {toast && (
                <div className="global-toast" onClick={clearToast}>
                    <div className="toast-content">
                        <div className="toast-icon" style={{ backgroundColor: getToastColor(toast.type) }}>
                            {getToastIcon(toast.type)}
                        </div>
                        <div className="toast-text">
                            <strong>{toast.title}</strong>
                            <span>{toast.msg}</span>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);
