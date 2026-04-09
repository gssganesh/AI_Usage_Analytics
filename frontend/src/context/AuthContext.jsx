import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(function() {
        var savedToken = localStorage.getItem('token');
        if (savedToken) {
            fetch('/api/auth/verify', {
                headers: { 'Authorization': 'Bearer ' + savedToken }
            })
            .then(function(res) {
                if (res.ok) return res.json();
                throw new Error('bad');
            })
            .then(function(data) {
                setUser(data.user);
            })
            .catch(function() {
                localStorage.removeItem('token');
            })
            .finally(function() {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    var loginFn = async function(username, password) {
        var res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    var signupFn = async function(username, password, fullName) {
        var res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password, full_name: fullName })
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');
        localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    var logoutFn = function() {
        localStorage.removeItem('token');
        setUser(null);
    };

    if (loading) {
        return (
            <div className="loading-spinner" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
                <span>Verifying...</span>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user: user,
            login: loginFn,
            signup: signupFn,
            logout: logoutFn
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    var ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}