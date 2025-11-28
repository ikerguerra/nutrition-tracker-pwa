import api from './api';
import type { DailyLog, AddEntryRequest, UpdateEntryRequest } from '../types/dailyLog';

export const dailyLogService = {
    getDailyLog: async (date: string): Promise<DailyLog> => {
        const response = await api.get<DailyLog>(`/daily-log?date=${date}`);
        return response.data;
    },

    addEntry: async (entry: AddEntryRequest): Promise<DailyLog> => {
        const response = await api.post<DailyLog>('/daily-log/entries', entry);
        return response.data;
    },

    updateEntry: async (id: number, entry: UpdateEntryRequest): Promise<DailyLog> => {
        const response = await api.put<DailyLog>(`/daily-log/entries/${id}`, entry);
        return response.data;
    },

    deleteEntry: async (id: number): Promise<DailyLog> => {
        const response = await api.delete<DailyLog>(`/daily-log/entries/${id}`);
        return response.data;
    }
};

export default dailyLogService;
