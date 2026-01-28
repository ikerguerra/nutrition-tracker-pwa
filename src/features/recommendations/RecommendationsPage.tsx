import React, { useState, useEffect } from 'react';
import { Button } from '@components/ui/Button';
import RecommendationCard from './components/RecommendationCard';
import { DietRecommendation } from './types';
import toast from 'react-hot-toast';
import api from '@services/api';

const RecommendationsPage: React.FC = () => {
    const [recommendations, setRecommendations] = useState<DietRecommendation[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const date = new Date().toISOString().split('T')[0];
            const response = await api.get<DietRecommendation[]>(`/recommendations/${date}`);
            setRecommendations(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load recommendations');
        } finally {
            setLoading(false);
        }
    };

    const generateRecommendations = async () => {
        setLoading(true);
        try {
            const date = new Date().toISOString().split('T')[0];
            const response = await api.post<DietRecommendation[]>(`/recommendations/generate?date=${date}`);
            setRecommendations(response.data);
            toast.success('Recommendations generated!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate recommendations');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id: number) => {
        try {
            await api.patch(`/recommendations/${id}/accept`);

            setRecommendations(prev => prev.map(rec =>
                rec.id === id ? { ...rec, status: 'ACCEPTED' } : rec
            ));
            toast.success('Recommendation accepted!');
        } catch (error) {
            toast.error('Failed to accept recommendation');
        }
    };

    const handleReject = (id: number) => {
        // Implement reject logic (maybe just hide locally or call API if exists)
        toast('Rejected (Local only for now)');
        setRecommendations(prev => prev.filter(rec => rec.id !== id));
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Daily Recommendations</h1>
                <Button onClick={generateRecommendations} loading={loading}>
                    Generate for Today
                </Button>
            </div>

            {loading && recommendations.length === 0 ? (
                <div className="text-center py-10">Loading...</div>
            ) : recommendations.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No recommendations found. Click "Generate" to start.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map(rec => (
                        <RecommendationCard
                            key={rec.id}
                            recommendation={rec}
                            foodName={`Food #${rec.foodId}`} // Placeholder until we fetch names
                            onAccept={handleAccept}
                            onReject={handleReject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecommendationsPage;
