import type { Food } from './food';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface MealEntry {
    id: number;
    foodId: number;
    foodName: string;
    brand?: string;
    mealType: MealType;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    // Legacy or optional
    food?: Food;
}

export interface DailyLog {
    id: number;
    date: string;
    dailyWeight?: number;
    meals: Record<MealType, MealEntry[]>;
    totals: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    goals?: {
        calorieGoal: number;
        proteinGoal: number;
        carbsGoal: number;
        fatsGoal: number;
    };
}

export interface AddEntryRequest {
    date: string;
    mealType: MealType;
    foodId: number;
    quantity: number;
    unit: string;
}

export interface UpdateEntryRequest {
    quantity: number;
    unit: string;
}

// Breakdown Interface
export interface NutrientBreakdown {
    mealType: MealType;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    caloriesPercentage: number;
    proteinPercentage: number;
    carbsPercentage: number;
    fatsPercentage: number;
    fiber: number;
    sugars: number;
    saturatedFats: number;
    sodium: number;
    calcium: number;
    iron: number;
    potassium: number;
    vitaminA: number;
    vitaminC: number;
    vitaminD: number;
    vitaminE: number;
    vitaminB12: number;
}
