import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScanBarcode, Plus } from 'lucide-react';

interface HeaderProps {
    onAddFood?: () => void;
    onScanBarcode?: () => void;
    onToggleSidebar?: () => void; // Deprecated but kept for type compat if needed
    minimal?: boolean; // New prop to render only actions
}

export const Header: React.FC<HeaderProps> = ({ onAddFood, onScanBarcode, minimal }) => {
    const navigate = useNavigate();

    // If minimal, only render actions (for new Layout)
    if (minimal) {
        return (
            <div className="flex items-center gap-2">
                {onScanBarcode && (
                    <Button variant="secondary" size="sm" onClick={onScanBarcode} className="h-8 gap-1">
                        <ScanBarcode className="size-4" />
                        <span className="hidden sm:inline">Escanear</span>
                    </Button>
                )}
                {onAddFood && (
                    <Button size="sm" onClick={onAddFood} className="h-8 gap-1">
                        <Plus className="size-4" />
                        <span className="hidden sm:inline">Agregar</span>
                    </Button>
                )}
            </div>
        )
    }

    // Fallback legacy header (should not be used with new Layout ideally)
    return (
        <header className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    NutriTracker
                </h1>
            </div>
            <div className="flex items-center gap-2">
                {onScanBarcode && (
                    <Button variant="secondary" size="sm" onClick={onScanBarcode}>
                        <ScanBarcode className="mr-2 size-4" />
                        Escanear
                    </Button>
                )}
                {onAddFood && (
                    <Button size="sm" onClick={onAddFood}>
                        <Plus className="mr-2 size-4" />
                        Agregar
                    </Button>
                )}
            </div>
        </header>
    );
};
