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

    // Use goals from API if available, otherwise use defaults
    const calorieGoal = dailyLog.goals?.calorieGoal ?? 2000;
    const proteinGoal = dailyLog.goals?.proteinGoal ?? 150;
    const carbsGoal = dailyLog.goals?.carbsGoal ?? 200;
    const fatsGoal = dailyLog.goals?.fatsGoal ?? 65;

    const toPercent = (value: number, goal: number) => Math.min(100, Math.round((value / goal) * 100));

    return (
        <Card className="daily-log-summary">
            <div className="summary-row">
                <div className="summary-item">
                    <span className="summary-label">Calorías</span>
                    <span className="summary-value">{dailyLog.totals.calories} / {Math.round(calorieGoal)} kcal</span>
                </div>

                <div className="summary-bars">
                    <div className="summary-bar">
                        <div className="bar-label">Proteínas</div>
                        <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${toPercent(dailyLog.totals.protein, proteinGoal)}%` }} />
                        </div>
                        <div className="bar-value">{dailyLog.totals.protein}g / {Math.round(proteinGoal)}g</div>
                    </div>

                    <div className="summary-bar">
                        <div className="bar-label">Carbohidratos</div>
                        <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${toPercent(dailyLog.totals.carbs, carbsGoal)}%` }} />
                        </div>
                        <div className="bar-value">{dailyLog.totals.carbs}g / {Math.round(carbsGoal)}g</div>
                    </div>

                    <div className="summary-bar">
                        <div className="bar-label">Grasas</div>
                        <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${toPercent(dailyLog.totals.fats, fatsGoal)}%` }} />
                        </div>
                        <div className="bar-value">{dailyLog.totals.fats}g / {Math.round(fatsGoal)}g</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DailyLogSummary;
