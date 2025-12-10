import axios from 'axios';
import authService from './authService';
import type { UserProfile, UserProfileUpdateRequest } from '../types/userProfile';

const API_URL = 'http://localhost:8080/api/v1/profile';

const getMyProfile = async (): Promise<UserProfile> => {
    const token = authService.getCurrentToken();
    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const updateMyProfile = async (profileData: UserProfileUpdateRequest): Promise<UserProfile> => {
    const token = authService.getCurrentToken();
    const response = await axios.put(API_URL, profileData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const userProfileService = {
    getMyProfile,
    updateMyProfile
};

export default userProfileService;
