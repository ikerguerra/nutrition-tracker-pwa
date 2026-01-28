import React from 'react';
import { Header } from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
    onAddFood?: () => void;
    onScanBarcode?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onAddFood, onScanBarcode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="layout">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className={`layout-right ${isSidebarOpen ? 'overlay' : ''}`}>
                <Header
                    onAddFood={onAddFood}
                    onScanBarcode={onScanBarcode}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main className="main-content">
                    <div className="container">{children}</div>
                </main>
            </div>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
        </div>
    );
};
