import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            className={`theme-toggle ${theme}`} 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="toggle-track">
                <div className="toggle-thumb">
                    {theme === 'light' ? (
                        <Sun className="icon sun-icon" size={16} />
                    ) : (
                        <Moon className="icon moon-icon" size={16} />
                    )}
                </div>
            </div>
        </button>
    );
};

export default ThemeToggle;
