import React from 'react';
import type { Food } from '../../types/food';
import { FoodCard } from './FoodCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Button } from '@components/ui/Button';
import { useFoods } from '@hooks/useFoods';
import './FoodList.css';

interface FoodListProps {
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onAddToDailyLog?: (food: Food) => void;
}

export const FoodList: React.FC<FoodListProps> = ({ onEdit, onDelete, onAddToDailyLog }) => {
    const {
        foods,
        favoriteIds,
        loading,
        error,
        pagination,
        changePage,
        refresh,
        loadFavorites,
        loadRecent,
        loadFrequent,
        addFavorite,
        removeFavorite
    } = useFoods();

    const [activeTab, setActiveTab] = React.useState<'all' | 'favorites' | 'recent' | 'frequent'>('all');

    React.useEffect(() => {
        if (activeTab === 'all') refresh();
        else if (activeTab === 'favorites') loadFavorites();
        else if (activeTab === 'recent') loadRecent();
        else if (activeTab === 'frequent') loadFrequent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleToggleFavorite = async (id: number) => {
        if (favoriteIds.includes(id)) {
            await removeFavorite(id);
            if (activeTab === 'favorites') loadFavorites();
        } else {
            await addFavorite(id);
        }
    };

    const renderContent = () => {
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
                    <h3>No hay alimentos en esta lista</h3>
                    <p>Intenta cambiar de filtro o agrega nuevos alimentos.</p>
                </div>
            );
        }

        return (
            <>
                <div className="food-list-grid">
                    {foods.map((food) => (
                        <FoodCard
                            key={food.id}
                            food={food}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddToDailyLog={onAddToDailyLog ? (f) => onAddToDailyLog(f) : undefined}
                            isFavorite={food.id ? favoriteIds.includes(food.id) : false}
                            onToggleFavorite={handleToggleFavorite}
                        />
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
                        <span className="pagination-info">Página {pagination.page + 1} de {pagination.totalPages}</span>
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
            </>
        );
    };

    return (
        <div className="food-list-container">
            <div className="food-list-header">
                <h2>Alimentos</h2>
                <div className="food-list-tabs">
                    <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>Todos</button>
                    <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>Favoritos</button>
                    <button className={activeTab === 'recent' ? 'active' : ''} onClick={() => setActiveTab('recent')}>Recientes</button>
                    <button className={activeTab === 'frequent' ? 'active' : ''} onClick={() => setActiveTab('frequent')}>Frecuentes</button>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};
