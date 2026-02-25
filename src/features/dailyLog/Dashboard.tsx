import React, { useMemo } from 'react';
import { DailyLog, MealEntry } from '../../types/dailyLog';
import { DietPlan, RecommendationItem } from '../../types/recommendation';
import { Button } from '@/components/ui/button';
import MealSection from './MealSection';
import DailyLogSummary from './DailyLogSummary';

interface DashboardProps {
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
    onAcceptRecommendation?: (item: RecommendationItem, mealType: string) => void;
    onRejectRecommendation?: (item: RecommendationItem) => void;
    onGeneratePlan?: () => void;
    isGeneratingPlan?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
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
                MORNING_SNACK: [], // Ensure all keys are present
                AFTERNOON_SNACK: []
            };
        }
        const grouped: Record<string, RecommendationItem[]> = {
            BREAKFAST: [],
            LUNCH: [],
            DINNER: [],
            SNACK: [],
            MORNING_SNACK: [],
            AFTERNOON_SNACK: []
        };

        recommendations.meals.forEach(meal => {
            const pendingItems = (meal.items || []).filter(i => !i.status || i.status === 'PENDING');

            if (meal.mealType === 'SNACK') {
                grouped['AFTERNOON_SNACK'] = [...(grouped['AFTERNOON_SNACK'] || []), ...pendingItems];
            } else {
                if (grouped[meal.mealType]) {
                    grouped[meal.mealType] = [...(grouped[meal.mealType] || []), ...pendingItems];
                }
            }
        });
        return grouped;
    }, [recommendations]);

    // Calculate Plan Totals (Projected)
    const planTotals = useMemo(() => {
        const totals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
        Object.values(groupedRecommendations).forEach(items => {
            items.forEach(item => {
                // Backend calculates nutrition for the specific quantity and puts it in nutritionalInfo
                if (item.nutritionalInfo) {
                    totals.calories += (item.nutritionalInfo.calories || 0);
                    totals.protein += (item.nutritionalInfo.protein || 0);
                    totals.carbs += (item.nutritionalInfo.carbs || 0);
                    totals.fats += (item.nutritionalInfo.fats || 0);
                }
            });
        });
        return totals;
    }, [groupedRecommendations]);

    const hasPendingRecommendations = recommendations && Object.values(groupedRecommendations).some(arr => arr.length > 0);

    return (
        <div className="flex flex-col gap-6">
            <DailyLogSummary
                dailyLog={dailyLog}
                loading={loading}
                error={error}
                planTotals={hasPendingRecommendations ? planTotals : null}
            />

            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    {onGeneratePlan && !recommendations && (
                        <Button
                            size="sm"
                            onClick={onGeneratePlan}
                            disabled={loading || isGeneratingPlan}
                        >
                            {isGeneratingPlan ? 'Generando...' : '✨ Generar Plan'}
                        </Button>
                    )}
                    {hasPendingRecommendations && onAcceptAll && (
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={onAcceptAll}
                            disabled={loading}
                        >
                            ✅ Aceptar todo
                        </Button>
                    )}
                    {onOpenFoods && (
                        <Button size="sm" variant="outline" onClick={() => onOpenFoods()}>Ver alimentos</Button>
                    )}
                </div>
            </div>

            {recommendations && Object.values(groupedRecommendations).every(arr => arr.length === 0) && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md border border-green-200 dark:border-green-800 flex items-center gap-2">
                    <span>✅</span>
                    <span>Plan generado. Has revisado todas las sugerencias pendientes.</span>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-full md:col-span-2 lg:col-span-3 space-y-6">
                    <MealSection
                        title="Desayuno"
                        mealType="BREAKFAST"
                        entries={groupedMeals.BREAKFAST || []}
                        recommendations={groupedRecommendations.BREAKFAST}
                        onUpdate={updateEntry}
                        onDelete={deleteEntry}
                        onCopy={() => onCopySection && onCopySection('BREAKFAST')}
                        onAcceptRecommendation={(item) => onAcceptRecommendation && onAcceptRecommendation(item, 'BREAKFAST')}
                        onRejectRecommendation={(item) => onRejectRecommendation && onRejectRecommendation(item)}
                        onAcceptAll={() => onAcceptMeal && onAcceptMeal('BREAKFAST')}
                    />

                    <MealSection
                        title="Media Mañana"
                        mealType="MORNING_SNACK"
                        entries={groupedMeals.MORNING_SNACK || []}
                        recommendations={groupedRecommendations.MORNING_SNACK}
                        onUpdate={updateEntry}
                        onDelete={deleteEntry}
                        onCopy={() => onCopySection && onCopySection('MORNING_SNACK')}
                        onAcceptRecommendation={(item) => onAcceptRecommendation && onAcceptRecommendation(item, 'MORNING_SNACK')}
                        onRejectRecommendation={(item) => onRejectRecommendation && onRejectRecommendation(item)}
                        onAcceptAll={() => onAcceptMeal && onAcceptMeal('MORNING_SNACK')}
                    />

                    <MealSection
                        title="Almuerzo"
                        mealType="LUNCH"
                        entries={groupedMeals.LUNCH || []}
                        recommendations={groupedRecommendations.LUNCH}
                        onUpdate={updateEntry}
                        onDelete={deleteEntry}
                        onCopy={() => onCopySection && onCopySection('LUNCH')}
                        onAcceptRecommendation={(item) => onAcceptRecommendation && onAcceptRecommendation(item, 'LUNCH')}
                        onRejectRecommendation={(item) => onRejectRecommendation && onRejectRecommendation(item)}
                        onAcceptAll={() => onAcceptMeal && onAcceptMeal('LUNCH')}
                    />

                    <MealSection
                        title="Merienda"
                        mealType="AFTERNOON_SNACK"
                        entries={groupedMeals.AFTERNOON_SNACK || []}
                        recommendations={groupedRecommendations.AFTERNOON_SNACK}
                        onUpdate={updateEntry}
                        onDelete={deleteEntry}
                        onCopy={() => onCopySection && onCopySection('AFTERNOON_SNACK')}
                        onAcceptRecommendation={(item) => onAcceptRecommendation && onAcceptRecommendation(item, 'AFTERNOON_SNACK')}
                        onRejectRecommendation={(item) => onRejectRecommendation && onRejectRecommendation(item)}
                        onAcceptAll={() => onAcceptMeal && onAcceptMeal('SNACK')}
                    />

                    <MealSection
                        title="Cena"
                        mealType="DINNER"
                        entries={groupedMeals.DINNER || []}
                        recommendations={groupedRecommendations.DINNER}
                        onUpdate={updateEntry}
                        onDelete={deleteEntry}
                        onCopy={() => onCopySection && onCopySection('DINNER')}
                        onAcceptRecommendation={(item) => onAcceptRecommendation && onAcceptRecommendation(item, 'DINNER')}
                        onRejectRecommendation={(item) => onRejectRecommendation && onRejectRecommendation(item)}
                        onAcceptAll={() => onAcceptMeal && onAcceptMeal('DINNER')}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
