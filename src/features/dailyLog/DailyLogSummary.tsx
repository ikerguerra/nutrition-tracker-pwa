import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DailyLog } from '../../types/dailyLog';


// If Progress doesn't exist, I'll use simple divs with Tailwind classes.
// I'll assume standard Shadcn Progress might be available or I can create it quickly. 
// For now, let's use divs with Tailwind to avoid more dependencies/files if not strictly needed, 
// matching the Shadcn aesthetic.

interface DailyLogSummaryProps {
    dailyLog: DailyLog | null;
    loading?: boolean;
    error?: string | null;
}

const DailyLogSummary: React.FC<DailyLogSummaryProps> = ({ dailyLog, loading, error }) => {
    if (loading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">Cargando resumen...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-destructive">Error: {error}</p>
                </CardContent>
            </Card>
        );
    }

    if (!dailyLog) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">Sin datos para la fecha seleccionada</p>
                </CardContent>
            </Card>
        );
    }

    const calorieGoal = dailyLog.goals?.calorieGoal ?? 2000;
    const proteinGoal = dailyLog.goals?.proteinGoal ?? 150;
    const carbsGoal = dailyLog.goals?.carbsGoal ?? 200;
    const fatsGoal = dailyLog.goals?.fatsGoal ?? 65;

    const toPercent = (value: number, goal: number) => Math.min(100, Math.round((value / goal) * 100));

    // Custom Progress Bar Component for this view
    const ProgressBar = ({ label, value, max, colorClass }: { label: string, value: number, max: number, colorClass: string }) => (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="font-medium text-muted-foreground">{label}</span>
                <span className="text-muted-foreground">{value} / {Math.round(max)}g</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className={`h-full ${colorClass} transition-all duration-300`} style={{ width: `${toPercent(value, max)}%` }} />
            </div>
        </div>
    );

    return (
        <Card className="shadow-none border-border/60">
            <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
                <div className="flex flex-col justify-center space-y-2 text-center sm:text-left">
                    <span className="text-sm font-medium text-muted-foreground">Calorías Totales</span>
                    <div className="flex items-baseline justify-center sm:justify-start gap-1">
                        <span className="text-4xl font-bold tracking-tight">{dailyLog.totals.calories}</span>
                        <span className="text-sm text-muted-foreground">/ {Math.round(calorieGoal)} kcal</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <ProgressBar
                        label="Proteínas"
                        value={dailyLog.totals.protein}
                        max={proteinGoal}
                        colorClass="bg-blue-500"
                    />
                    <ProgressBar
                        label="Carbohidratos"
                        value={dailyLog.totals.carbs}
                        max={carbsGoal}
                        colorClass="bg-green-500"
                    />
                    <ProgressBar
                        label="Grasas"
                        value={dailyLog.totals.fats}
                        max={fatsGoal}
                        colorClass="bg-yellow-500"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default DailyLogSummary;
