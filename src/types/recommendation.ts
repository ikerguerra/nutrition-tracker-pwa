export interface DietPlan {
    id: number;
    date: string; // ISO date format
    version: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    meals: RecommendedMeal[];
    planTotals: NutritionalTotals;
    dailyGoal: NutritionalTotals;
}

export interface RecommendedMeal {
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
    items: RecommendationItem[];
    mealTotals: NutritionalTotals;
}

export interface RecommendationItem {
    id: number;
    foodId: number;
    foodName: string;
    suggestedQuantity: number;
    unit?: string;
    reason?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    nutritionalInfo: NutritionalInfo;
}

export interface NutritionalTotals {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface NutritionalInfo {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
}

export const MEAL_TYPE_LABELS: Record<string, string> = {
    BREAKFAST: 'Desayuno',
    LUNCH: 'Almuerzo',
    DINNER: 'Cena',
    SNACK: 'Snack',
};

export const MEAL_TYPE_ICONS: Record<string, string> = {
    BREAKFAST: '🌅',
    LUNCH: '🍽️',
    DINNER: '🌙',
    SNACK: '🍎',
};
