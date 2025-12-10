import apiClient from './apiClient';

export interface CalendarDay {
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
    isGoalMet: boolean;
    calorieGoal: number;
}

const calendarService = {
    /**
     * Get monthly summary
     */
    getMonthlySummary: async (year: number, month: number): Promise<CalendarDay[]> => {
        try {
            const response = await apiClient.get<{ data: CalendarDay[] }>('/calendar/summary', {
                params: { year, month }
            });
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
};

export default calendarService;
