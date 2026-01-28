import { MealType } from '../../types/dailyLog';

export interface DietRecommendation {
    id: number;
    userId: number;
    date: string;
    mealType: MealType;
    foodId: number;
    suggestedQuantity: number;
    reason: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
