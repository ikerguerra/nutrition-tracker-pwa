import React from 'react';
import { FoodCard } from './FoodCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Button } from '@components/ui/Button';
import { useFoods } from '@hooks/useFoods';
import './FoodList.css';

interface FoodListProps {
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export const FoodList: React.FC<FoodListProps> = ({ onEdit, onDelete }) => {
    const { foods, loading, error, pagination, changePage } = useFoods();

    if (loading && foods.length === 0) {
        return (
            <div className="food-list-loading">
                <LoadingSpinner size="lg" />
                <p>Cargando alimentos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="food-list-error">
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>{error}</p>
            </div>
        );
    }

    if (foods.length === 0) {
        return (
            <div className="food-list-empty">
                <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                >
                    <path d="M3 3h18v18H3z" />
                    <path d="M9 9h6v6H9z" />
                </svg>
                <h3>No hay alimentos registrados</h3>
                <p>Comienza agregando tu primer alimento</p>
            </div>
        );
    }

    return (
        <div className="food-list-container">
            <div className="food-list-header">
                <h2>Alimentos</h2>
                <span className="food-count">{pagination.totalElements} alimentos</span>
            </div>

            <div className="food-list-grid">
                {foods.map((food) => (
                    <FoodCard key={food.id} food={food} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </div>

            {pagination.totalPages > 1 && (
                <div className="food-list-pagination">
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={pagination.page === 0}
                        onClick={() => changePage(pagination.page - 1)}
                    >
                        ← Anterior
                    </Button>

                    <span className="pagination-info">
                        Página {pagination.page + 1} de {pagination.totalPages}
                    </span>

                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={pagination.page >= pagination.totalPages - 1}
                        onClick={() => changePage(pagination.page + 1)}
                    >
                        Siguiente →
                    </Button>
                </div>
            )}
        </div>
    );
};
