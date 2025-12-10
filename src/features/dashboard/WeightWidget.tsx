import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DailyLog } from '../../types/dailyLog';

interface WeightWidgetProps {
    dailyLog: DailyLog | null;
    onUpdateWeight: (weight: number) => Promise<void>;
}

export const WeightWidget = ({ dailyLog, onUpdateWeight }: WeightWidgetProps) => {
    const [weight, setWeight] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (dailyLog?.dailyWeight) {
            setWeight(dailyLog.dailyWeight.toString());
        } else {
            setWeight('');
        }
    }, [dailyLog]);

    const handleSave = async () => {
        if (!weight) return;
        setLoading(true);
        try {
            await onUpdateWeight(parseFloat(weight));
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update weight', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-4">
            <h3 className="font-bold text-lg mb-4">Peso Corporal</h3>
            <div className="flex flex-col gap-4">
                {isEditing ? (
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="kg"
                            step="0.1"
                        />
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={loading || !weight}
                        >
                            Guardar
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancelar
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold">
                            {dailyLog?.dailyWeight ? `${dailyLog.dailyWeight} kg` : '-- kg'}
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                        >
                            {dailyLog?.dailyWeight ? 'Editar' : 'Registrar'}
                        </Button>
                    </div>
                )}

                {dailyLog?.dailyWeight && (
                    <div className="text-xs text-gray-500">
                        {/* Placeholder for trend analysis later */}
                        Registro del día
                    </div>
                )}
            </div>
        </Card>
    );
};
