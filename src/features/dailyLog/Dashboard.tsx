import React, { useMemo } from 'react';
import { DailyLog, MealEntry } from '../../types/dailyLog';
import { DietPlan, RecommendationItem } from '../../types/recommendation';
// Import Food type only when needed
// Card not used here; keeping layout minimal
import { Button } from '@components/ui/Button';
import MealSection from './MealSection.tsx';
import DailyLogSummary from './DailyLogSummary.tsx';
import './Dashboard.css';

interface DashboardProps {
    date?: string;
    dailyLog: DailyLog | null;
    recommendations?: DietPlan | null;
    loading?: boolean;
    error?: string | null;
    updateEntry: (id: number, payload: { quantity: number; unit: string }) => Promise<void>;
    deleteEntry: (id: number) => Promise<void>;
    onOpenFoods?: () => void;
    onCopySection?: (mealType: string) => void;
    onAcceptAll?: () => void;
    onAcceptMeal?: (mealType: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    date,
    dailyLog,
    recommendations,
    loading,
    error,
    updateEntry,
    deleteEntry,
    onOpenFoods,
    onCopySection,
    onAcceptRecommendation,
    onRejectRecommendation,
    onGeneratePlan,
    isGeneratingPlan,
    onAcceptAll,
    onAcceptMeal
}) => {
    console.log('Dashboard render:', { dailyLog, recommendations, loading, error });

    const groupedMeals = useMemo(() => {
        const defaults: Record<string, MealEntry[]> = {
            BREAKFAST: [],
            LUNCH: [],
            DINNER: [],
            SNACK: [],
            MORNING_SNACK: [],
            AFTERNOON_SNACK: []
        };

        if (!dailyLog || !dailyLog.meals) {
            return defaults;
        }
        return { ...defaults, ...dailyLog.meals };
    }, [dailyLog]);

    const groupedRecommendations = useMemo(() => {
        if (!recommendations || !recommendations.meals) {
            return {
                BREAKFAST: [],
                LUNCH: [],
                DINNER: [],
                SNACK: [],
            };
        }
        // Transform the backend structure to match MealTypes if needed
        // Backend types: BREAKFAST, LUNCH, DINNER, SNACK
        const grouped: Record<string, RecommendationItem[]> = {
            BREAKFAST: [],
            LUNCH: [],
            DINNER: [],
            SNACK: [], // Mapping SNACK to generic SNACK bucket or specific ones
            MORNING_SNACK: [],
            AFTERNOON_SNACK: []
        };

        recommendations.meals.forEach(meal => {
            const pendingItems = meal.items.filter(i => !i.status || i.status === 'PENDING');

            if (meal.mealType === 'SNACK') {
                // Determine if it's morning or afternoon based on usage or just put in one
                // For now, let's distribute generic SNACK to MORNING_SNACK purely for display if that's the logic,
                // or just handle generic SNACK. 
                // Backend MealType is limited. Let's put SNACKs in AFTERNOON_SNACK for now unless we have more info.
                grouped['AFTERNOON_SNACK'] = [...grouped['AFTERNOON_SNACK'], ...pendingItems];
            } else {
                if (grouped[meal.mealType]) {
                    grouped[meal.mealType] = [...grouped[meal.mealType], ...pendingItems];
                }
            }
        });
        return grouped;
    }, [recommendations]);

    // Loading and error states are handled in children

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Dashboard — {date || (dailyLog ? dailyLog.date : new Date().toISOString().split('T')[0])}</h2>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    {onGeneratePlan && !recommendations && (
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={onGeneratePlan}
                            disabled={loading || isGeneratingPlan}
                        >
                            {isGeneratingPlan ? 'Generando...' : '✨ Generar Plan'}
                        </Button>
                    )}
                    {recommendations && Object.values(groupedRecommendations).some(arr => arr.length > 0) && onAcceptAll && (
                        <Button
                            size="sm"
                            variant="success"
                            onClick={onAcceptAll}
                            disabled={loading}
                        >
                            ✅ Aceptar todo el día
                        </Button>
                    )}
                    {onOpenFoods && (
                        <Button size="sm" variant="secondary" onClick={() => onOpenFoods()}>Ver alimentos</Button>
                    )}
                </div>
            </div>

            <DailyLogSummary dailyLog={dailyLog} loading={loading} error={error} />

            {recommendations && Object.values(groupedRecommendations).every(arr => arr.length === 0) && (
                <div className="p-4 mb-4 bg-green-50 text-green-700 rounded-md border border-green-200 flex items-center gap-2">
                    <span>✅</span>
                    <span>Plan generado. Has revisado todas las sugerencias pendientes.</span>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <MealSection
                    title="Desayuno"
                    mealType="BREAKFAST"
                    entries={groupedMeals.BREAKFAST}
                    recommendations={groupedRecommendations.BREAKFAST}
                    onUpdate={updateEntry}
                    onDelete={deleteEntry}
                    onCopy={() => onCopySection && onCopySection('BREAKFAST')}
                    onAcceptRecommendation={(item) => onAcceptRecommendation && onAcceptRecommendation(item, 'BREAKFAST')}
                    onRejectRecommendation={(item) => onRejectRecommendation && onRejectRecommendation(item, 'BREAKFAST')}
                    onAcceptAll={() => onAcceptMeal && onAcceptMeal('BREAKFAST')}
                />

                <MealSection
                    title="Media Mañana"
                    mealType="MORNING_SNACK"
                    entries={groupedMeals.MORNING_SNACK}
                    recommendations={groupedRecommendations.MORNING_SNACK}
                    onUpdate={updateEntry}
                    onDelete={deleteEntry}
                    onCopy={() => onCopySection && onCopySection('MORNING_SNACK')}
                    onAcceptRecommendation={(item) => onAcceptRecommendation && onAcceptRecommendation(item, 'MORNING_SNACK')}
                    onRejectRecommendation={(item) => onRejectRecommendation && onRejectRecommendation(item, 'MORNING_SNACK')}
                    onAcceptAll={() => onAcceptMeal && onAcceptMeal('MORNING_SNACK')}
                />

                <MealSection
                    title="Almuerzo"
                    mealType="LUNCH"
                    entries={groupedMeals.LUNCH}
                    recommendations={groupedRecommendations.LUNCH}
                    onUpdate={updateEntry}
                    onDelete={deleteEntry}
                    onCopy={() => onCopySection && onCopySection('LUNCH')}
                    onAcceptRecommendation={(item) => onAcceptRecommendation && onAcceptRecommendation(item, 'LUNCH')}
                    onRejectRecommendation={(item) => onRejectRecommendation && onRejectRecommendation(item, 'LUNCH')}
                    onAcceptAll={() => onAcceptMeal && onAcceptMeal('LUNCH')}
                />

                <MealSection
                    title="Merienda"
                    mealType="AFTERNOON_SNACK"
                    entries={groupedMeals.AFTERNOON_SNACK}
                    recommendations={groupedRecommendations.AFTERNOON_SNACK}
                    onUpdate={updateEntry}
                    onDelete={deleteEntry}
                    onCopy={() => onCopySection && onCopySection('AFTERNOON_SNACK')}
                    onAcceptRecommendation={(item) => onAcceptRecommendation && onAcceptRecommendation(item, 'AFTERNOON_SNACK')}
                    onRejectRecommendation={(item) => onRejectRecommendation && onRejectRecommendation(item, 'AFTERNOON_SNACK')}
                    onAcceptAll={() => onAcceptMeal && onAcceptMeal('SNACK')}
                />

                <MealSection
                    title="Cena"
                    mealType="DINNER"
                    entries={groupedMeals.DINNER}
                    recommendations={groupedRecommendations.DINNER}
                    onUpdate={updateEntry}
                    onDelete={deleteEntry}
                    onCopy={() => onCopySection && onCopySection('DINNER')}
                    onAcceptRecommendation={(item) => onAcceptRecommendation && onAcceptRecommendation(item, 'DINNER')}
                    onRejectRecommendation={(item) => onRejectRecommendation && onRejectRecommendation(item, 'DINNER')}
                    onAcceptAll={() => onAcceptMeal && onAcceptMeal('DINNER')}
                />
            </div>
        </div>
    );
};

export default Dashboard;
