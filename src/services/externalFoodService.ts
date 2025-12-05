import axios from 'axios';
import { ExternalFood, ExternalFoodSearchResponse } from '../types/externalFood';
import { Food } from '../types/food';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'}/external/foods`;

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const externalFoodService = {
    search: async (query: string, page: number = 1, size: number = 20): Promise<ExternalFood[]> => {
        const response = await axios.get<ExternalFoodSearchResponse>(`${API_URL}/search`, {
            params: { query, page, size },
            headers: getAuthHeader()
        });
        return response.data.data;
    },

    getByBarcode: async (barcode: string): Promise<ExternalFood | null> => {
        try {
            const response = await axios.get<{ data: ExternalFood }>(`${API_URL}/barcode/${barcode}`, {
                headers: getAuthHeader()
            });
            return response.data.data;
        } catch (error) {
            return null;
        }
    },

    importProduct: async (barcode: string): Promise<Food> => {
        const response = await axios.post<{ data: Food }>(`${API_URL}/${barcode}/import`, {}, {
            headers: getAuthHeader()
        });
        return response.data.data;
    }
};
