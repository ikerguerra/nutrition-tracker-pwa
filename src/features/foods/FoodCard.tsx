import React from 'react';
import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';
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
                    <span className="nutrition-label">Energía</span>
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
                </div>
                {servingSize && servingUnit && (
                    <div className="food-card-header" style={{ marginTop: 'auto', paddingTop: 'var(--spacing-sm)' }}>
                        <span className="food-card-serving">
                            Porción: {servingSize}{servingUnit}
                        </span>
                    </div>
                )}
            </div>

            {(onEdit || onDelete || onAddToDailyLog) && (
                <div className="food-card-actions">
                    {onEdit && id && (
                        <Button variant="secondary" size="sm" onClick={() => onEdit(id)} title="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </Button>
                    )}
                    {onDelete && id && (
                        <Button variant="secondary" size="sm" onClick={() => onDelete(id)} title="Eliminar">
                            <span style={{ color: 'var(--color-error)' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </span>
                        </Button>
                    )}
                    {onAddToDailyLog && (
                        <Button variant="primary" size="sm" onClick={() => onAddToDailyLog(food)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Agregar
                        </Button>
                    )}
                </div>
            )}
        </Card>
    );
};
