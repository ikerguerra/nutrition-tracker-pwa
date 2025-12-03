import React from 'react';
import { Card } from '@components/ui/Card';
import { DailyLog } from '../../types/dailyLog';
import './DailyLogSummary.css';

interface DailyLogSummaryProps {
    dailyLog: DailyLog | null;
    loading?: boolean;
    error?: string | null;
}

const DailyLogSummary: React.FC<DailyLogSummaryProps> = ({ dailyLog, loading, error }) => {
    if (loading) {
        return (
            <Card className="daily-log-summary">Cargando resumen...</Card>
        );
    }

    if (error) {
        return (
            <Card className="daily-log-summary">Error: {error}</Card>
        );
    }

    if (!dailyLog) {
        return (
            <Card className="daily-log-summary">Sin datos para la fecha seleccionada</Card>
        );
    }

    // For now we use simple static goal placeholders (should be made dynamic later)
    const proteinGoal = 150;
    const carbsGoal = 250;
    const fatsGoal = 70;

    const toPercent = (value: number, goal: number) => Math.min(100, Math.round((value / goal) * 100));

    return (
        <Card className="daily-log-summary">
            <div className="summary-row">
                <div className="summary-item">
                    <span className="summary-label">Calorías</span>
                    <span className="summary-value">{dailyLog.totals.calories} kcal</span>
                </div>

                <div className="summary-bars">
                    <div className="summary-bar">
                        <div className="bar-label">Proteínas</div>
                        <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${toPercent(dailyLog.totals.protein, proteinGoal)}%` }} />
                        </div>
                        <div className="bar-value">{dailyLog.totals.protein}g / {proteinGoal}g</div>
                    </div>

                    <div className="summary-bar">
                        <div className="bar-label">Carbohidratos</div>
                        <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${toPercent(dailyLog.totals.carbs, carbsGoal)}%` }} />
                        </div>
                        <div className="bar-value">{dailyLog.totals.carbs}g / {carbsGoal}g</div>
                    </div>

                    <div className="summary-bar">
                        <div className="bar-label">Grasas</div>
                        <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${toPercent(dailyLog.totals.fats, fatsGoal)}%` }} />
                        </div>
                        <div className="bar-value">{dailyLog.totals.fats}g / {fatsGoal}g</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DailyLogSummary;
