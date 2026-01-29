import React from 'react';
import { NutritionalFilters as FiltersType } from '../../../types/food';
import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';

interface NutritionalFiltersProps {
    filters: FiltersType;
    onChange: (filters: FiltersType) => void;
    onClear: () => void;
}

const NutritionalFilters: React.FC<NutritionalFiltersProps> = ({ filters, onChange, onClear }) => {
    // Local state to handle inputs before applying (debounce or apply button)
    // For now, let's propagate changes immediately or maybe onBlur?
    // Immediate changes might trigger too many API calls if we rely on useEffect in parent.
    // Let's use local state and an "Apply" button or just debounce in parent.
    // Given the previous pattern, let's just use onChange directly but user might want debouncing.
    // For simplicity: Inputs trigger onChange. Parent (FoodList) should ideally debounce search.

    const handleChange = (field: keyof FiltersType, value: string) => {
        const numValue = value === '' ? undefined : Number(value);
        onChange({ ...filters, [field]: numValue });
    };

    const hasFilters = Object.values(filters).some(val => val !== undefined);

    const inputs = [
        { label: 'Protéina (g)', minKey: 'minProtein', maxKey: 'maxProtein', color: 'text-blue-600' },
        { label: 'Carboratos (g)', minKey: 'minCarbs', maxKey: 'maxCarbs', color: 'text-orange-600' },
        { label: 'Grasas (g)', minKey: 'minFats', maxKey: 'maxFats', color: 'text-yellow-600' },
        { label: 'Calorías (kcal)', minKey: 'minCalories', maxKey: 'maxCalories', color: 'text-gray-700 font-medium' },
    ] as const;

    return (
        <Card className="p-4 mb-4 bg-gray-50 border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-700">Filtros Nutricionales</h4>
                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={onClear} className="text-red-500 hover:text-red-700">
                        Limpiar filtros
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {inputs.map(({ label, minKey, maxKey, color }) => (
                    <div key={label} className="flex flex-col gap-1">
                        <label className={`text-xs ${color}`}>{label}</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                value={filters[minKey] ?? ''}
                                onChange={(e) => handleChange(minKey, e.target.value)}
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                value={filters[maxKey] ?? ''}
                                onChange={(e) => handleChange(maxKey, e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default NutritionalFilters;
