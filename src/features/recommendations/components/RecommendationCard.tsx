import React from 'react';
import { DietRecommendation } from '../types';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';

interface RecommendationCardProps {
    recommendation: DietRecommendation;
    foodName: string; // Passed from parent or fetched
    onAccept: (id: number) => void;
    onReject: (id: number) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, foodName, onAccept, onReject }) => {
    return (
        <Card className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-lg">{foodName}</h4>
                    <p className="text-sm text-gray-500 capitalize">{recommendation.mealType}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {recommendation.suggestedQuantity}g
                </span>
            </div>

            <p className="text-sm text-gray-600 italic">"{recommendation.reason}"</p>

            <div className="flex gap-2 mt-auto">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onAccept(recommendation.id)}
                    disabled={recommendation.status === 'ACCEPTED'}
                >
                    {recommendation.status === 'ACCEPTED' ? 'Accepted' : 'Accept'}
                </Button>
                {recommendation.status === 'PENDING' && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => onReject(recommendation.id)}
                    >
                        Reject
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default RecommendationCard;
