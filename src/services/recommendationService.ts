import apiClient from './api';
import { DietPlan } from '../types/recommendation';

export const recommendationService = {
    /**
     * Get the latest plan for a specific date
     * Returns null if no plan exists (204 No Content)
     */
    getDailyPlan: async (date: string): Promise<DietPlan | null> => {
        try {
            const response = await apiClient.get<DietPlan>(
                '/recommendations/daily',
                { params: { date } }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 204) {
                return null; // No plan exists for this date
            }
            throw error;
        }
    },

    /**
     * Generate or regenerate a plan for a specific date
     * @param date - ISO date string (YYYY-MM-DD)
     * @param forceNew - If true, generates a new plan even if one exists
     */
    generateDailyPlan: async (
        date: string,
        forceNew: boolean = false
    ): Promise<DietPlan> => {
        const response = await apiClient.post<DietPlan>(
            '/recommendations/daily',
            null,
            { params: { date, forceNew } }
        );
        return response.data;
    },

    /**
     * Accept an entire plan
     * This will add all recommendations to the user's daily log
     */
    acceptPlan: async (planId: number): Promise<void> => {
        await apiClient.post(`/recommendations/${planId}/accept`);
    },

    /**
     * Accept all recommendations for a specific meal type
     */
    acceptMeal: async (planId: number, mealType: string): Promise<void> => {
        await apiClient.post(`/recommendations/${planId}/accept-meal`, null, {
            params: { mealType }
        });
    },
};

export default recommendationService;
