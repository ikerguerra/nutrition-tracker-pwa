import React, { useState } from 'react';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
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

    const mealTypeOptions = [
        { value: 'BREAKFAST', label: 'Desayuno' },
        { value: 'MORNING_SNACK', label: 'Media Mañana' },
        { value: 'LUNCH', label: 'Almuerzo' },
        { value: 'AFTERNOON_SNACK', label: 'Merienda' },
        { value: 'DINNER', label: 'Cena' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Copiar ${source.title}`}
            size="sm"
        >
            <div className="space-y-4 pt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Copiando todo el <strong>{source.title}</strong> del <strong>{source.date}</strong>.
                </p>

                <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                        Fecha destino:
                    </label>
                    <Input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                        Tipo de comida destino:
                    </label>
                    <select
                        value={targetMealType}
                        onChange={(e) => setTargetMealType(e.target.value as MealType)}
                        className="input w-full"
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
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="replace-chk" className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                        Reemplazar si existen entradas
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleCopy} disabled={loading}>
                        {loading ? 'Copiando...' : 'Copiar'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
