import { useState, useEffect, useCallback } from 'react';
import foodService from '@services/foodService';
import type { Food, FoodRequest, Page } from '../types/food';

interface UseFoodsReturn {
    foods: Food[];
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
    createFood: (foodData: FoodRequest) => Promise<Food>;
    updateFood: (id: number, foodData: FoodRequest) => Promise<Food>;
    deleteFood: (id: number) => Promise<void>;
    searchFoods: (query: string) => Promise<void>;
    changePage: (newPage: number) => void;
    refresh: () => Promise<void>;
}

export const useFoods = (
    initialPage: number = 0,
    initialSize: number = 20
): UseFoodsReturn => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: initialPage,
        size: initialSize,
        totalElements: 0,
        totalPages: 0,
    });

    // Load foods
    const loadFoods = useCallback(
        async (page: number = pagination.page, size: number = pagination.size) => {
            setLoading(true);
            setError(null);
            try {
                const response: Page<Food> = await foodService.getAllFoods({ page, size });
                setFoods(response.content);
                setPagination({
                    page: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                });
            } catch (err: any) {
                setError(err.message || 'Error loading foods');
            } finally {
                setLoading(false);
            }
        },
        [pagination.page, pagination.size]
    );

    // Create food
    const createFood = async (foodData: FoodRequest): Promise<Food> => {
        setLoading(true);
        setError(null);
        try {
            const newFood = await foodService.createFood(foodData);
            await loadFoods();
            return newFood;
        } catch (err: any) {
            setError(err.message || 'Error creating food');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update food
    const updateFood = async (id: number, foodData: FoodRequest): Promise<Food> => {
        setLoading(true);
        setError(null);
        try {
            const updatedFood = await foodService.updateFood(id, foodData);
            await loadFoods();
            return updatedFood;
        } catch (err: any) {
            setError(err.message || 'Error updating food');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete food
    const deleteFood = async (id: number): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await foodService.deleteFood(id);
            await loadFoods();
        } catch (err: any) {
            setError(err.message || 'Error deleting food');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Search foods
    const searchFoods = async (query: string): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await foodService.searchFoods(query);
            setFoods(response.content);
            setPagination({
                page: response.number,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
            });
        } catch (err: any) {
            setError(err.message || 'Error searching foods');
        } finally {
            setLoading(false);
        }
    };

    // Change page
    const changePage = (newPage: number) => {
        loadFoods(newPage, pagination.size);
    };

    // Load on mount
    useEffect(() => {
        loadFoods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        foods,
        loading,
        error,
        pagination,
        createFood,
        updateFood,
        deleteFood,
        searchFoods,
        changePage,
        refresh: loadFoods,
    };
};
