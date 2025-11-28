import type { Food } from './food';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface MealEntry {
    id: number;
    food: Food;
    mealType: MealType;
    quantity: number;
    unit: string;
    calories: number;
    macros: {
        protein: number;
        carbohydrates: number;
        fats: number;
    };
}

export interface DailyLog {
    id: number;
    date: string;
    totalCalories: number;
    totalCarbs: number;
    totalProtein: number;
    totalFats: number;
    entries: MealEntry[];
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
