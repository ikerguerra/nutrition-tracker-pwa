import apiClient from './apiClient';
import type { Food, FoodRequest, Page, BarcodeSearchResponse } from '../types/food';

interface GetAllFoodsParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
}

interface SearchFoodsParams {
    page?: number;
    size?: number;
}

const foodService = {
    /**
     * Create a new food item
     */
    createFood: async (foodData: FoodRequest): Promise<Food> => {
        try {
            const response = await apiClient.post<{ data: Food }>('/foods', foodData);
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get food by ID
     */
    getFoodById: async (id: number): Promise<Food> => {
        try {
            const response = await apiClient.get<{ data: Food }>(`/foods/${id}`);
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get all foods with pagination
     */
    getAllFoods: async ({
        page = 0,
        size = 20,
        sortBy = 'name',
        direction = 'asc'
    }: GetAllFoodsParams = {}): Promise<Page<Food>> => {
        try {
            const response = await apiClient.get<{ data: Page<Food> }>('/foods', {
                params: { page, size, sortBy, direction }
            });
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    /**
     * Search foods by name or brand
     */
    searchFoods: async (
        query: string,
        { page = 0, size = 20 }: SearchFoodsParams = {}
    ): Promise<Page<Food>> => {
        try {
            const response = await apiClient.get<{ data: Page<Food> }>('/foods/search', {
                params: { query, page, size }
            });
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    /**
     * Search food by barcode
     */
    searchByBarcode: async (barcode: string): Promise<BarcodeSearchResponse> => {
        try {
            const response = await apiClient.get<{ data: BarcodeSearchResponse }>(
                `/foods/barcode/${barcode}`
            );
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    /**
     * Update an existing food item
     */
    updateFood: async (id: number, foodData: FoodRequest): Promise<Food> => {
        try {
            const response = await apiClient.put<{ data: Food }>(`/foods/${id}`, foodData);
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    /**
     * Delete a food item
     */
    deleteFood: async (id: number): Promise<void> => {
        try {
            await apiClient.delete(`/foods/${id}`);
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get total count of foods
     */
    getTotalCount: async (): Promise<number> => {
        try {
            const response = await apiClient.get<{ data: number }>('/foods/stats/count');
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
};

export default foodService;
