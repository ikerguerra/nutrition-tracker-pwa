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
    macros: {
        protein: number;
        carbohydrates: number;
        fats: number;
    };
    // Legacy or optional if backend still sends it sometimes? Logs show it's not there.
    food?: Food;
}

export interface DailyLog {
    id: number;
    date: string;
    meals: Record<MealType, MealEntry[]>;
    totals: {
        calories: number;
        protein: number;
        carbohydrates: number; // Note: API might return 'carbs' or 'carbohydrates', checking logs it says 'carbs' in totals but let's be careful. Logs say: totals: {calories: 672, protein: 44.35, carbs: 81.95, fats: 17.5}
        fats: number;
        carbs: number; // Adding both to be safe or I should check logs again. Logs: carbs: 81.95.
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
