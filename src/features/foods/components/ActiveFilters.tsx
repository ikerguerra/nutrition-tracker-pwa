import React from 'react';
import { FoodCategory, FOOD_CATEGORY_LABELS, NutritionalFilters } from '../../../types/food';


interface ActiveFiltersProps {
    selectedCategory?: FoodCategory;
    filters: NutritionalFilters;
    onRemoveCategory: () => void;
    onRemoveFilter: (key: keyof NutritionalFilters) => void;
    onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
    selectedCategory,
    filters,
    onRemoveCategory,
    onRemoveFilter,
    onClearAll
}) => {
    // Helper to format filter label
    const getFilterLabel = (key: keyof NutritionalFilters, value: number) => {
        switch (key) {
            case 'minCalories': return `Calorías > ${value}`;
            case 'maxCalories': return `Calorías < ${value}`;
            case 'minProtein': return `Proteína > ${value}g`;
            case 'maxProtein': return `Proteína < ${value}g`;
            case 'minCarbs': return `Carbohidratos > ${value}g`;
            case 'maxCarbs': return `Carbohidratos < ${value}g`;
            case 'minFats': return `Grasas > ${value}g`;
            case 'maxFats': return `Grasas < ${value}g`;
            default: return `${key}: ${value}`;
        }
    };

    const hasFilters = selectedCategory || Object.values(filters).some(v => v !== undefined);

    if (!hasFilters) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Filtros:</span>

            {selectedCategory && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {FOOD_CATEGORY_LABELS[selectedCategory]}
                    <button
                        onClick={onRemoveCategory}
                        className="ml-1.5 inline-flex items-center justify-center p-0.5 rounded-full text-indigo-400 hover:text-indigo-600 hover:bg-indigo-200 focus:outline-none"
                    >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </span>
            )}

            {Object.entries(filters).map(([key, value]) => {
                if (value === undefined) return null;
                return (
                    <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {getFilterLabel(key as keyof NutritionalFilters, value)}
                        <button
                            onClick={() => onRemoveFilter(key as keyof NutritionalFilters)}
                            className="ml-1.5 inline-flex items-center justify-center p-0.5 rounded-full text-green-400 hover:text-green-600 hover:bg-green-200 focus:outline-none"
                        >
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </span>
                );
            })}

            <button
                onClick={onClearAll}
                className="text-xs text-gray-500 hover:text-gray-700 underline ml-auto"
            >
                Limpiar todo
            </button>
        </div>
    );
};
