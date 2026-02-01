import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { DailyLog } from '../../types/dailyLog';
import { Scale, Edit2, Check, X, TrendingUp } from 'lucide-react';

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
        <Card className="h-full border-none shadow-md bg-gradient-to-br from-card to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    Peso Corporal
                </CardTitle>
                {!isEditing && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => setIsEditing(true)}
                        title={dailyLog?.dailyWeight ? 'Editar' : 'Registrar'}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                        <div className="relative flex-1">
                            <Input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="0.0"
                                step="0.1"
                                className="pr-8 text-lg font-bold"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSave();
                                    if (e.key === 'Escape') setIsEditing(false);
                                }}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                kg
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                size="icon"
                                onClick={handleSave}
                                disabled={loading || !weight}
                                className="h-10 w-10 bg-green-500 hover:bg-green-600 text-white"
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => setIsEditing(false)}
                                className="h-10 w-10"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                            {dailyLog?.dailyWeight ? (
                                <>
                                    <span className="text-3xl font-bold tracking-tight text-foreground">
                                        {dailyLog.dailyWeight}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground">kg</span>
                                </>
                            ) : (
                                <span className="text-xl text-muted-foreground italic">
                                    -- kg
                                </span>
                            )}
                        </div>

                        {dailyLog?.dailyWeight ? (
                            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5 bg-secondary/30 w-fit px-2 py-1 rounded-md">
                                <TrendingUp className="h-3 w-3 text-primary" />
                                <span>Registrado hoy</span>
                            </p>
                        ) : (
                            <p className="text-xs text-muted-foreground mt-3 cursor-pointer hover:text-primary transition-colors" role="button" onClick={() => setIsEditing(true)}>
                                Pulsa para registrar
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
