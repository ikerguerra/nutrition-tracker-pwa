import React from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import type { Food } from '../../types/food';
import './FoodCard.css';

interface FoodCardProps {
    food: Food;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onAddToDailyLog?: (food: Food) => void;
    isFavorite?: boolean;
    onToggleFavorite?: (id: number) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
    food,
    onEdit,
    onDelete,
    onAddToDailyLog,
    isFavorite,
    onToggleFavorite
}) => {
    const { id, name, brand, nutritionalInfo, servingSize, servingUnit } = food;

    return (
        <Card className="food-card" hover>
            <div className="food-card-header">
                <div>
                    <h3 className="food-card-title">{name}</h3>
                    {brand && <p className="food-card-brand">{brand}</p>}
                </div>
                <div className="food-card-header-actions">
                    {servingSize && servingUnit && (
                        <span className="food-card-serving">
                            {servingSize}{servingUnit}
                        </span>
                    )}
                    {onToggleFavorite && id && (
                        <button
                            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(id);
                            }}
                            title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                        >
                            {isFavorite ? '❤️' : '🤍'}
                        </button>
                    )}
                </div>
            </div>

            <div className="food-card-nutrition">
                <div className="nutrition-item">
                    <span className="nutrition-label">Calorías</span>
                    <span className="nutrition-value calories">
                        {nutritionalInfo?.calories || 0} <span className="unit">kcal</span>
                    </span>
                </div>

                <div className="nutrition-grid">
                    <div className="nutrition-item-small">
                        <span className="nutrition-label">Proteínas</span>
                        <span className="nutrition-value">{nutritionalInfo?.protein || 0}g</span>
                    </div>
                    <div className="nutrition-item-small">
                        <span className="nutrition-label">Carbos</span>
                        <span className="nutrition-value">{nutritionalInfo?.carbohydrates || 0}g</span>
                    </div>
                    <div className="nutrition-item-small">
                        <span className="nutrition-label">Grasas</span>
                        <span className="nutrition-value">{nutritionalInfo?.fats || 0}g</span>
                    </div>
                    {nutritionalInfo?.fiber !== undefined && nutritionalInfo.fiber > 0 && (
                        <div className="nutrition-item-small">
                            <span className="nutrition-label">Fibra</span>
                            <span className="nutrition-value">{nutritionalInfo.fiber}g</span>
                        </div>
                    )}
                </div>
            </div>

            {(onEdit || onDelete || onAddToDailyLog) && (
                <div className="food-card-actions">
                    {onEdit && id && (
                        <Button variant="secondary" size="sm" onClick={() => onEdit(id)}>
                            Editar
                        </Button>
                    )}
                    {onDelete && id && (
                        <Button variant="danger" size="sm" onClick={() => onDelete(id)}>
                            Eliminar
                        </Button>
                    )}
                    {onAddToDailyLog && (
                        <Button variant="primary" size="sm" onClick={() => onAddToDailyLog(food)}>
                            Agregar hoy
                        </Button>
                    )}
                </div>
            )}
        </Card>
    );
};
