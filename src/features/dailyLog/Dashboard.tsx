import React, { useMemo } from 'react';
import { MealType, DailyLog, MealEntry } from '../../types/dailyLog';
// Import Food type only when needed
// Card not used here; keeping layout minimal
import { Button } from '@components/ui/Button';
import MealSection from './MealSection.tsx';
import DailyLogSummary from './DailyLogSummary.tsx';
import './Dashboard.css';

interface DashboardProps {
    date?: string;
    dailyLog: DailyLog | null;
    loading?: boolean;
    error?: string | null;
    updateEntry: (id: number, payload: { quantity: number; unit: string }) => Promise<void>;
    deleteEntry: (id: number) => Promise<void>;
    onOpenFoods?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ date, dailyLog, loading, error, updateEntry, deleteEntry, onOpenFoods }) => {
    console.log('Dashboard render:', { dailyLog, loading, error });

    const groupedMeals = useMemo(() => {
        if (!dailyLog || !dailyLog.meals) {
            return {
                BREAKFAST: [],
                LUNCH: [],
                DINNER: [],
                SNACK: [],
            };
        }
        return dailyLog.meals;
    }, [dailyLog]);

    // Loading and error states are handled in children

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Dashboard — {date || (dailyLog ? dailyLog.date : new Date().toISOString().split('T')[0])}</h2>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    {onOpenFoods && (
                        <Button size="sm" variant="secondary" onClick={() => onOpenFoods()}>Ver alimentos</Button>
                    )}
                </div>
            </div>

            <DailyLogSummary dailyLog={dailyLog} loading={loading} error={error} />

            <div className="meals-grid">
                <MealSection
                    title="Desayuno"
                    mealType="BREAKFAST"
                    entries={groupedMeals.BREAKFAST}
                    onUpdate={updateEntry}
                    onDelete={deleteEntry}
                />

                <MealSection
                    title="Almuerzo"
                    mealType="LUNCH"
                    entries={groupedMeals.LUNCH}
                    onUpdate={updateEntry}
                    onDelete={deleteEntry}
                />

                <MealSection
                    title="Cena"
                    mealType="DINNER"
                    entries={groupedMeals.DINNER}
                    onUpdate={updateEntry}
                    onDelete={deleteEntry}
                />

                <MealSection
                    title="Snacks"
                    mealType="SNACK"
                    entries={groupedMeals.SNACK}
                    onUpdate={updateEntry}
                    onDelete={deleteEntry}
                />
            </div>
        </div>
    );
};

export default Dashboard;
