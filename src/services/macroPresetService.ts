import apiClient from './apiClient';

export interface MacroPreset {
    id: number;
    name: string;
    proteinPercentage: number;
    carbsPercentage: number;
    fatsPercentage: number;
    isDefault: boolean;
    createdAt: string;
}

export interface CreateMacroPresetRequest {
    name: string;
    proteinPercentage: number;
    carbsPercentage: number;
    fatsPercentage: number;
}

const macroPresetService = {
    getPresets: async (): Promise<MacroPreset[]> => {
        const response = await apiClient.get<MacroPreset[]>('/macro-presets');
        return response.data;
    },

    createPreset: async (request: CreateMacroPresetRequest): Promise<MacroPreset> => {
        const response = await apiClient.post<MacroPreset>('/macro-presets', request);
        return response.data;
    },

    updatePreset: async (id: number, request: CreateMacroPresetRequest): Promise<MacroPreset> => {
        const response = await apiClient.put<MacroPreset>(`/macro-presets/${id}`, request);
        return response.data;
    },

    deletePreset: async (id: number): Promise<void> => {
        await apiClient.delete(`/macro-presets/${id}`);
    },

    setDefaultPreset: async (id: number): Promise<MacroPreset> => {
        const response = await apiClient.post<MacroPreset>(`/macro-presets/${id}/set-default`);
        return response.data;
    },

    applyPreset: async (id: number): Promise<void> => {
        await apiClient.post(`/macro-presets/${id}/apply`);
    }
};

export default macroPresetService;
