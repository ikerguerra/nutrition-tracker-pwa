import React from 'react';
import type { Food, FoodCategory, NutritionalFilters } from '../../types/food';
import { FoodCard } from './FoodCard';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Button } from '@components/ui/button';
import { useFoods } from '@hooks/useFoods';
import { ChevronLeft, ChevronRight, PackageOpen } from 'lucide-react';

import { FilterPanel } from './components/FilterPanel';
import { ActiveFilters } from './components/ActiveFilters';

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
        searchFoods,
        loadFavorites,
        loadRecent,
        loadFrequent,
        addFavorite,
        removeFavorite
    } = useFoods();

    const [activeTab, setActiveTab] = React.useState<'all' | 'favorites' | 'recent' | 'frequent'>('all');
    const [selectedCategory, setSelectedCategory] = React.useState<FoodCategory | undefined>(undefined);
    const [filters, setFilters] = React.useState<NutritionalFilters>({});
    const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

    React.useEffect(() => {
        if (activeTab === 'all') refresh();
        else if (activeTab === 'favorites') loadFavorites();
        else if (activeTab === 'recent') loadRecent();
        else if (activeTab === 'frequent') loadFrequent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // Trigger search when category or filters change
    React.useEffect(() => {
        if (activeTab === 'all') {
            const hasFilters = Object.values(filters).some(val => val !== undefined);
            if (selectedCategory || hasFilters) {
                // Debounce could be useful here, but for now direct call
                const handler = setTimeout(() => {
                    searchFoods('', selectedCategory, filters);
                }, 300); // 300ms debounce
                return () => clearTimeout(handler);
            } else if (!selectedCategory && !hasFilters) {
                refresh();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, filters]);

    const handleToggleFavorite = async (id: number) => {
        if (favoriteIds.includes(id)) {
            await removeFavorite(id);
            if (activeTab === 'favorites') loadFavorites();
        } else {
            await addFavorite(id);
        }
    };

    const handleClearAll = () => {
        setSelectedCategory(undefined);
        setFilters({});
    };

    const handleRemoveFilter = (key: keyof NutritionalFilters) => {
        const newFilters = { ...filters };
        delete newFilters[key];
        setFilters(newFilters);
    };

    const renderContent = () => {
        if (loading && foods.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-4">
                    <LoadingSpinner size="lg" />
                    <p>Cargando alimentos...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-12 text-destructive bg-destructive/5 rounded-xl border border-destructive/20 mx-auto max-w-lg">
                    <p>{error}</p>
                </div>
            );
        }

        if (foods.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <div className="bg-muted/50 p-4 rounded-full mb-4">
                        <PackageOpen className="h-10 w-10 opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No hay alimentos en esta lista</h3>
                    <p className="max-w-xs text-sm">Intenta cambiar de filtro o agrega nuevos alimentos.</p>
                </div>
            );
        }

        return (
            <>
                <div className="flex flex-col gap-3 max-w-3xl mx-auto animate-in fade-in duration-500">
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
                    <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-border/50">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page === 0}
                            onClick={() => changePage(pagination.page - 1)}
                            className="gap-1 min-w-[100px]"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Anterior
                        </Button>
                        <span className="text-sm font-medium text-muted-foreground">
                            Página {pagination.page + 1} de {pagination.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page >= pagination.totalPages - 1}
                            onClick={() => changePage(pagination.page + 1)}
                            className="gap-1 min-w-[100px]"
                        >
                            Siguiente
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </>
        );
    };

    const tabs = [
        { id: 'all', label: 'Todos' },
        { id: 'favorites', label: 'Favoritos' },
        { id: 'recent', label: 'Recientes' },
        { id: 'frequent', label: 'Frecuentes' },
    ] as const;

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">Alimentos</h2>
                <div className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === tab.id
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'hover:bg-background/50 hover:text-foreground'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'all' && (
                <>
                    <FilterPanel
                        isOpen={isFiltersOpen}
                        onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        filters={filters}
                        onFiltersChange={setFilters}
                        onClear={handleClearAll}
                    />

                    <ActiveFilters
                        selectedCategory={selectedCategory}
                        filters={filters}
                        onRemoveCategory={() => setSelectedCategory(undefined)}
                        onRemoveFilter={handleRemoveFilter}
                        onClearAll={handleClearAll}
                    />
                </>
            )}

            {renderContent()}
        </div>
    );
};
