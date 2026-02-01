import React from 'react';
import { FoodCategory, NutritionalFilters as NutritionalFiltersType } from '../../../types/food';
import { CategoryFilter } from '../CategoryFilter';
import NutritionalFilters from './NutritionalFilters';
import { Button } from '@components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

interface FilterPanelProps {
    isOpen: boolean;
    onToggle: () => void;
    selectedCategory?: FoodCategory;
    onCategoryChange: (category: FoodCategory | undefined) => void;
    filters: NutritionalFiltersType;
    onFiltersChange: (filters: NutritionalFiltersType) => void;
    onClear: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
    isOpen,
    onToggle,
    selectedCategory,
    onCategoryChange,
    filters,
    onFiltersChange,
    onClear
}) => {
    return (
        <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
                <Button
                    variant={isOpen ? "secondary" : "outline"}
                    size="sm"
                    onClick={onToggle}
                    className="flex items-center gap-2 font-medium"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    {isOpen ? 'Ocultar Filtros' : 'Filtros Avanzados'}
                </Button>

                {(isOpen || selectedCategory || Object.values(filters).some(v => v !== undefined)) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
                    >
                        Limpiar todo
                    </Button>
                )}
            </div>

            {isOpen && (
                <div className="p-5 bg-card border border-border/50 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-foreground mb-3">Categoría</label>
                        <CategoryFilter
                            selectedCategory={selectedCategory}
                            onCategoryChange={onCategoryChange}
                        />
                    </div>

                    <div className="border-t border-border/50 pt-5">
                        <NutritionalFilters
                            filters={filters}
                            onChange={onFiltersChange}
                            onClear={() => { }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
