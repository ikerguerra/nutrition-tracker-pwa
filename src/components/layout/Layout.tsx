import React from 'react';
import { Header } from './Header';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
    onAddFood?: () => void;
    onScanBarcode?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onAddFood, onScanBarcode }) => {
    return (
        <div className="layout">
            <Header onAddFood={onAddFood} onScanBarcode={onScanBarcode} />
            <main className="main-content">
                <div className="container">{children}</div>
            </main>
        </div>
    );
};
