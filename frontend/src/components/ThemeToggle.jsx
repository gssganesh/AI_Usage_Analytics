import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'var(--blur)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--accent)',
                transition: 'var(--tr)',
                boxShadow: 'var(--shadow-glass)'
            }}
        >
            {theme === 'light' ? (
                <Moon size={20} fill="currentColor" opacity={0.2} />
            ) : (
                <Sun size={20} fill="currentColor" opacity={0.2} />
            )}
        </button>
    );
}
