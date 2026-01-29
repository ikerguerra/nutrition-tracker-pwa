import React from 'react';
import { FoodCategory, NutritionalFilters as NutritionalFiltersType } from '../../../types/food';
import { CategoryFilter } from '../CategoryFilter';
import NutritionalFilters from './NutritionalFilters';
import { Button } from '@components/ui/button';

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
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onToggle}
                    className="flex items-center gap-2"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    {isOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                </Button>

                {isOpen && (
                    <Button variant="ghost" size="sm" onClick={onClear} className="text-sm text-gray-500">
                        Restablecer
                    </Button>
                )}
            </div>

            {isOpen && (
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm animate-in slide-in-from-top-2 duration-200">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                        <CategoryFilter
                            selectedCategory={selectedCategory}
                            onCategoryChange={onCategoryChange}
                        />
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <NutritionalFilters
                            filters={filters}
                            onChange={onFiltersChange}
                            onClear={() => { }} // Create handles clear internally for the panel via prop onClear if needed, but here we reuse the clear all logic mainly
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
