import { MealType } from './dailyLog';

export interface MealTemplate {
    id: number;
    name: string;
    description?: string;
    mealType?: MealType;
    isPublic: boolean;
    items: MealTemplateItem[];
}

export interface MealTemplateItem {
    id: number;
    foodId: number;
    foodName: string;
    brand?: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface CreateMealTemplateRequest {
    name: string;
    description?: string;
    mealType?: MealType;
    isPublic?: boolean;
    items: {
        foodId: number;
        quantity: number;
        unit: string;
    }[];
}
