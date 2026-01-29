import apiClient from './apiClient';

export interface WeightDataPoint {
    date: string;
    weight: number;
    weightChange: number;
    movingAverage: number;
}

export interface MacroTrendDataPoint {
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    goalCalories: number;
    goalProtein: number;
    goalCarbs: number;
    goalFats: number;
    adherencePercentage: number;
}

export interface WeekData {
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFats: number;
    daysLogged: number;
}

export interface WeekComparison {
    caloriesChange: number;
    proteinChange: number;
    carbsChange: number;
    fatsChange: number;
}

export interface WeeklySummary {
    currentWeek: WeekData;
    previousWeek: WeekData;
    changes: WeekComparison;
}

export interface GoalAchievement {
    totalDays: number;
    achievedDays: number;
    achievementRate: number;
    currentStreak: number;
    bestStreak: number;
}

export interface RdaData {
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
    magnesium: number;
    zinc: number;
    vitaminK: number;
    vitaminB1: number;
    vitaminB2: number;
    vitaminB3: number;
    vitaminB6: number;
    vitaminB9: number;
}

const statsService = {
    getWeightHistory: async (startDate: string, endDate: string): Promise<WeightDataPoint[]> => {
        const response = await apiClient.get<any>(`/stats/weight-history?startDate=${startDate}&endDate=${endDate}`);
        return response.data.data;
    },

    getMacroTrends: async (startDate: string, endDate: string): Promise<MacroTrendDataPoint[]> => {
        const response = await apiClient.get<any>(`/stats/macro-trends?startDate=${startDate}&endDate=${endDate}`);
        return response.data.data;
    },

    getWeeklySummary: async (startDate: string): Promise<WeeklySummary> => {
        const response = await apiClient.get<any>(`/stats/weekly-summary?startDate=${startDate}`);
        return response.data.data;
    },

    getGoalAchievement: async (startDate: string, endDate: string): Promise<GoalAchievement> => {
        const response = await apiClient.get<any>(`/stats/goal-achievement?startDate=${startDate}&endDate=${endDate}`);
        return response.data.data;
    },

    getRda: async (): Promise<RdaData> => {
        const response = await apiClient.get<any>('/stats/rda');
        return response.data.data;
    }
};

export default statsService;
