import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { dailyLogService } from '@services/dailyLogService';
import { toast } from 'react-hot-toast';
import { MealType } from '../../types/dailyLog';

interface CopyMealSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    source: { date: string; mealType: MealType; title: string } | null;
    onSuccess: () => void;
}

export const CopyMealSectionModal: React.FC<CopyMealSectionModalProps> = ({
    isOpen,
    onClose,
    source,
    onSuccess
}) => {
    // Default target date is today
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
    const [targetMealType, setTargetMealType] = useState<MealType | ''>('');
    const [replace, setReplace] = useState(false);
    const [loading, setLoading] = useState(false);

    // Reset state when opening
    React.useEffect(() => {
        if (source) {
            setTargetMealType(source.mealType);
            setTargetDate(new Date().toISOString().split('T')[0]);
            setReplace(false);
        }
    }, [source]);

    if (!source) return null;

    const handleCopy = async () => {
        if (!targetDate) {
            toast.error('Selecciona una fecha destino');
            return;
        }
        if (!targetMealType) {
            toast.error('Selecciona una comida destino');
            return;
        }

        setLoading(true);
        try {
            await dailyLogService.copyMealSection(
                source.date,
                source.mealType,
                targetDate,
                targetMealType,
                replace
            );
            toast.success('Comida copiada exitosamente');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error copying meal section:', error);
            toast.error('Error al copiar la comida');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    const mealTypeOptions = [
        { value: 'BREAKFAST', label: 'Desayuno' },
        { value: 'MORNING_SNACK', label: 'Media Mañana' },
        { value: 'LUNCH', label: 'Almuerzo' },
        { value: 'AFTERNOON_SNACK', label: 'Merienda' },
        { value: 'DINNER', label: 'Cena' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Copiar {source.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        Copiando todo el <strong className="text-foreground">{source.title}</strong> del <strong className="text-foreground">{source.date}</strong>.
                    </p>

                    <div className="grid gap-2">
                        <Label htmlFor="targetDate">
                            Fecha destino:
                        </Label>
                        <Input
                            id="targetDate"
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="targetMealType">
                            Tipo de comida destino:
                        </Label>
                        <select
                            id="targetMealType"
                            value={targetMealType}
                            onChange={(e) => setTargetMealType(e.target.value as MealType)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        >
                            {mealTypeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="replace-chk"
                            checked={replace}
                            onChange={(e) => setReplace(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="replace-chk" className="font-normal cursor-pointer text-muted-foreground">
                            Reemplazar si existen entradas
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleCopy} loading={loading}>
                        {loading ? 'Copiando...' : 'Copiar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
