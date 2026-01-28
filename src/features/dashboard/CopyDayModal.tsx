import React, { useState } from 'react';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { dailyLogService } from '@services/dailyLogService';
import { toast } from 'react-hot-toast';

interface CopyDayModalProps {
    isOpen: boolean;
    onClose: () => void;
    sourceDate: string;
    onSuccess: () => void;
}

export const CopyDayModal: React.FC<CopyDayModalProps> = ({
    isOpen,
    onClose,
    sourceDate,
    onSuccess
}) => {
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
    const [replace, setReplace] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCopy = async () => {
        if (!targetDate) {
            toast.error('Selecciona una fecha destino');
            return;
        }

        if (targetDate === sourceDate) {
            toast.error('La fecha destino no puede ser la misma que la origen');
            return;
        }

        setLoading(true);
        try {
            await dailyLogService.copyDay(sourceDate, targetDate, replace);
            toast.success('Día copiado exitosamente');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error copying day:', error);
            toast.error('Error al copiar el día');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Copiar Día Completo"
            size="sm"
        >
            <div className="space-y-4 pt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estás copiando todas las comidas del día <strong>{sourceDate}</strong>.
                </p>

                <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                        Copiar a fecha:
                    </label>
                    <Input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="replace-checkbox"
                        checked={replace}
                        onChange={(e) => setReplace(e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="replace-checkbox" className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                        Sobrescribir destino (borrar comidas existentes)
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleCopy} disabled={loading}>
                        {loading ? 'Copiando...' : 'Confirmar Copia'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
