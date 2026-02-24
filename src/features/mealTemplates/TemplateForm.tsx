import React, { useState, useCallback } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { SearchBar } from '@features/foods/SearchBar';
import { useFoods } from '@hooks/useFoods';
import { MealType } from '../../types/dailyLog';
import { CreateMealTemplateRequest } from '../../types/mealTemplate';
import { Food } from '../../types/food';
import { toast } from 'react-hot-toast';

interface TemplateFormProps {
    onCancel: () => void;
    onSave: (data: CreateMealTemplateRequest) => Promise<void>;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({ onCancel, onSave }) => {
    const { foods, searchFoods } = useFoods();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [mealType, setMealType] = useState<MealType | ''>('');
    const [items, setItems] = useState<{ food: Food; quantity: number; unit: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const handleSearch = useCallback((query: string) => {
        if (query.trim().length > 2) {
            searchFoods(query);
            setShowSearchResults(true);
        } else {
            setShowSearchResults(false);
        }
    }, [searchFoods]);

    const handleAddFood = (food: Food) => {
        if (!food.id) return;
        // Check if already added
        if (items.some(item => item.food.id === food.id)) {
            toast.error('Este alimento ya está en la lista');
            return;
        }

        setItems([...items, {
            food,
            quantity: food.servingSize || 100,
            unit: food.servingUnit || 'g'
        }]);
        setShowSearchResults(false);
        toast.success('Alimento añadido');
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleUpdateItem = (index: number, field: 'quantity' | 'unit', value: string | number) => {
        const newItems = [...items];
        const item = { ...newItems[index] } as { food: Food; quantity: number; unit: string };

        if (field === 'quantity') {
            item.quantity = Number(value);
        } else if (field === 'unit') {
            item.unit = String(value);
        }

        newItems[index] = item;
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }
        if (items.length === 0) {
            toast.error('Añade al menos un alimento');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                name,
                description,
                mealType: mealType || undefined,
                items: items.map(item => ({
                    foodId: item.food.id!,
                    quantity: Number(item.quantity),
                    unit: item.unit
                }))
            });
        } catch (error) {
            console.error('Error saving template', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Nombre de la Plantilla</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Desayuno de Campeones"
                        required
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Descripción (Opcional)</label>
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Breve descripción de qué contiene..."
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Tipo de Comida Preferido</label>
                    <select
                        className="w-full px-3 py-2 border rounded-lg bg-background border-input focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200 outline-none"
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value as MealType)}
                    >
                        <option value="">-- Seleccionar (Opcional) --</option>
                        <option value="BREAKFAST">Desayuno</option>
                        <option value="LUNCH">Almuerzo</option>
                        <option value="DINNER">Cena</option>
                        <option value="SNACK">Snack</option>
                    </select>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Alimentos</h3>
                <div className="mb-4">
                    <SearchBar onSearch={handleSearch} placeholder="Buscar alimentos para añadir..." />

                    {showSearchResults && foods.length > 0 && (
                        <div className="mt-2 max-h-60 overflow-y-auto border border-border bg-card text-card-foreground z-10 relative">
                            {foods.map(food => (
                                <div
                                    key={food.id}
                                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center border-b last:border-0 border-gray-100 dark:border-gray-700 transition-colors"
                                    onClick={() => handleAddFood(food)}
                                >
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{food.name}</div>
                                        {food.brand && <div className="text-xs text-gray-500">{food.brand}</div>}
                                    </div>
                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20 transition-colors">
                                        + Añadir
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Lista de Alimentos <span className="text-gray-400 font-normal">({items.length})</span>
                        </label>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-border bg-muted/50">
                            <p className="text-sm text-gray-500">Busca y añade alimentos arriba para crear tu plantilla.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-card text-card-foreground border-border shadow-sm transition-all hover:shadow-md">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 dark:text-white truncate" title={item.food.name}>
                                            {item.food.name}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                            {item.food.nutritionalInfo?.calories} kcal / 100g
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="w-20 px-2 py-1.5 text-right border border-input bg-muted/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                value={item.quantity}
                                                onChange={(e) => handleUpdateItem(index, 'quantity', Number(e.target.value))}
                                                min="0"
                                                step="1"
                                                placeholder="Cant."
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-16 px-2 py-1.5 border border-input bg-muted/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                value={item.unit}
                                                onChange={(e) => handleUpdateItem(index, 'unit', e.target.value)}
                                                placeholder="Ud."
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                            onClick={() => handleRemoveItem(index)}
                                            title="Eliminar alimento"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 6 6 18" /><path d="m6 6 18 18" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="secondary" onClick={onCancel} type="button" className="px-6">
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={loading} className="px-6">
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span> Guardando...
                        </span>
                    ) : (
                        'Crear Plantilla'
                    )}
                </Button>
            </div>
        </form>
    );
};
