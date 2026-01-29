import React from 'react';
import { ExternalFood } from '../../types/externalFood';
import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';
import './ExternalFoodCard.css';

interface ExternalFoodCardProps {
    food: ExternalFood;
    onImport: (barcode: string) => void;
    importing: boolean;
}

export const ExternalFoodCard: React.FC<ExternalFoodCardProps> = ({ food, onImport, importing }) => {
    return (
        <Card className="external-food-card">
            <div className="external-food-image-container">
                {food.imageUrl ? (
                    <img src={food.imageUrl} alt={food.name} className="external-food-image" />
                ) : (
                    <div className="external-food-placeholder">No Image</div>
                )}
            </div>
            <div className="external-food-details">
                <h3 className="external-food-name">{food.name}</h3>
                <p className="external-food-brand">{food.brand || 'Unknown Brand'}</p>
                <div className="external-food-macros">
                    <span>{Math.round(food.calories)} kcal</span>
                    <span>P: {food.protein}g</span>
                    <span>C: {food.carbs}g</span>
                    <span>F: {food.fats}g</span>
                </div>
            </div>
            <div className="external-food-actions">
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onImport(food.barcode)}
                    disabled={importing}
                >
                    {importing ? 'Importing...' : 'Import'}
                </Button>
            </div>
        </Card>
    );
};
