import axios from './apiClient';
import type { AchievementDto, AchievementsSummary } from '../types/achievement';

export const achievementService = {
    getAll: async (): Promise<AchievementDto[]> => {
        const response = await axios.get('/achievements');
        return response.data;
    },

    getSummary: async (): Promise<AchievementsSummary> => {
        const response = await axios.get('/achievements/summary');
        return response.data;
    },
};
