import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { DailyLog } from '../../types/dailyLog';
import './WeightWidget.css';

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
        <Card className="weight-widget">
            <div className="weight-widget-header">
                <h3>Peso Corporal</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)' }}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>
            </div>
            <div className="weight-widget-content">
                {isEditing ? (
                    <div className="weight-edit-form">
                        <Input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="kg"
                            step="0.1"
                            autoFocus
                        />
                        <div className="weight-edit-actions">
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={loading || !weight}
                                variant="primary"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setIsEditing(false)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="weight-display">
                        <div className="weight-value">
                            {dailyLog?.dailyWeight ? (
                                <>
                                    <span className="number">{dailyLog.dailyWeight}</span>
                                    <span className="unit">kg</span>
                                </>
                            ) : (
                                <span className="empty">-- kg</span>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            title={dailyLog?.dailyWeight ? 'Editar' : 'Registrar'}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </Button>
                    </div>
                )}

                {dailyLog?.dailyWeight && (
                    <div className="weight-trend">
                        <span className="trend-label">Registro de hoy</span>
                    </div>
                )}
            </div>
        </Card>
    );
};
