import apiClient from './apiClient';
import type { UserProfile, UserProfileUpdateRequest } from '../types/userProfile';

const userProfileService = {
    /**
     * Get current user's profile
     */
    getMyProfile: async (): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>('/profile');
        return response.data;
    },

    /**
     * Update current user's profile
     */
    updateMyProfile: async (data: UserProfileUpdateRequest): Promise<UserProfile> => {
        const response = await apiClient.put<UserProfile>('/profile', data);
        return response.data;
    }
};

export default userProfileService;
