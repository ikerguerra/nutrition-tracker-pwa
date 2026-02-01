import React from 'react';
import { FoodCategory, FOOD_CATEGORY_LABELS, NutritionalFilters } from '../../../types/food';
import { X } from 'lucide-react';

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
            case 'minCalories': return `> ${value} kcal`;
            case 'maxCalories': return `< ${value} kcal`;
            case 'minProtein': return `Prot > ${value}g`;
            case 'maxProtein': return `Prot < ${value}g`;
            case 'minCarbs': return `Carb > ${value}g`;
            case 'maxCarbs': return `Carb < ${value}g`;
            case 'minFats': return `Grasas > ${value}g`;
            case 'maxFats': return `Grasas < ${value}g`;
            default: return `${key}: ${value}`;
        }
    };

    const hasFilters = selectedCategory || Object.values(filters).some(v => v !== undefined);

    if (!hasFilters) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6 animate-in fade-in duration-300">
            {selectedCategory && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    {FOOD_CATEGORY_LABELS[selectedCategory]}
                    <button
                        onClick={onRemoveCategory}
                        className="ml-1.5 p-0.5 rounded-full hover:bg-primary/20 text-primary/70 hover:text-primary transition-colors focus:outline-none"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </span>
            )}

            {Object.entries(filters).map(([key, value]) => {
                if (value === undefined) return null;
                return (
                    <span key={key} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-secondary/50">
                        {getFilterLabel(key as keyof NutritionalFilters, value)}
                        <button
                            onClick={() => onRemoveFilter(key as keyof NutritionalFilters)}
                            className="ml-1.5 p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                );
            })}

            <button
                onClick={onClearAll}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 ml-auto transition-colors"
            >
                Limpiar filtros
            </button>
        </div>
    );
};
