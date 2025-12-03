import { useState, useEffect, useCallback } from 'react';
import dailyLogService from '@services/dailyLogService';
import { DailyLog, AddEntryRequest, UpdateEntryRequest } from '../types/dailyLog';

interface UseDailyLogReturn {
    dailyLog: DailyLog | null;
    loading: boolean;
    error: string | null;
    loadDailyLog: (date?: string) => Promise<void>;
    addEntry: (entry: AddEntryRequest) => Promise<void>;
    updateEntry: (id: number, entry: UpdateEntryRequest) => Promise<void>;
    deleteEntry: (id: number) => Promise<void>;
}

export const useDailyLog = (initialDate?: string): UseDailyLogReturn => {
    const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadDailyLog = useCallback(async (date?: string) => {
        setLoading(true);
        setError(null);
        try {
            const fetchDate = (date ?? new Date().toISOString().split('T')[0]) as string;
            const response = await dailyLogService.getDailyLog(fetchDate);
            console.log('useDailyLog response:', response);
            setDailyLog(response);
        } catch (err: any) {
            setError(err.message || 'Error loading daily log');
        } finally {
            setLoading(false);
        }
    }, []);

    const addEntry = useCallback(async (entry: AddEntryRequest) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await dailyLogService.addEntry(entry);
            setDailyLog(updated);
        } catch (err: any) {
            setError(err.message || 'Error adding entry to daily log');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateEntry = useCallback(async (id: number, entry: UpdateEntryRequest) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await dailyLogService.updateEntry(id, entry);
            setDailyLog(updated);
        } catch (err: any) {
            setError(err.message || 'Error updating entry');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteEntry = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await dailyLogService.deleteEntry(id);
            setDailyLog(updated);
        } catch (err: any) {
            setError(err.message || 'Error deleting entry');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDailyLog(initialDate);
    }, [initialDate, loadDailyLog]);

    return { dailyLog, loading, error, loadDailyLog, addEntry, updateEntry, deleteEntry };
};

export default useDailyLog;
