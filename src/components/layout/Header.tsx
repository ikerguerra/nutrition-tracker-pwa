import React from 'react';
import { Button } from '@components/ui/Button';
import './Header.css';

interface HeaderProps {
    onAddFood?: () => void;
    onScanBarcode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddFood, onScanBarcode }) => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-brand">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="brand-icon"
                    >
                        <path d="M3 3h18v18H3z" />
                        <path d="M12 3v18" />
                        <path d="M3 12h18" />
                    </svg>
                    <h1 className="brand-name gradient-text">NutriTracker</h1>
                </div>

                <div className="header-actions">
                    {onScanBarcode && (
                        <Button variant="secondary" size="sm" onClick={onScanBarcode}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <line x1="7" y1="9" x2="7" y2="15" />
                                <line x1="11" y1="9" x2="11" y2="15" />
                                <line x1="15" y1="9" x2="15" y2="15" />
                            </svg>
                            <span className="button-text">Escanear</span>
                        </Button>
                    )}
                    {onAddFood && (
                        <Button variant="primary" size="sm" onClick={onAddFood}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span className="button-text">Agregar</span>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};
