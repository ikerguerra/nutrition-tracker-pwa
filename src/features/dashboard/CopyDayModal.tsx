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

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Copiar Día Completo</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        Estás copiando todas las comidas del día <strong className="text-foreground">{sourceDate}</strong>.
                    </p>

                    <div className="grid gap-2">
                        <Label htmlFor="targetDate">
                            Copiar a fecha:
                        </Label>
                        <Input
                            id="targetDate"
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
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="replace-checkbox" className="font-normal cursor-pointer text-muted-foreground">
                            Sobrescribir destino (borrar comidas existentes)
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleCopy} loading={loading}>
                        {loading ? 'Copiando...' : 'Confirmar Copia'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
