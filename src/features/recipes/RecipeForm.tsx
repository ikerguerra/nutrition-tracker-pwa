import React, { useState, useCallback } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { SearchBar } from '@features/foods/SearchBar';
import { useFoods } from '@hooks/useFoods';
import { CreateRecipeRequest } from '../../types/recipe';
import { Food } from '../../types/food';
import { toast } from 'react-hot-toast';

interface RecipeFormProps {
    onCancel: () => void;
    onSave: (data: CreateRecipeRequest) => Promise<void>;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ onCancel, onSave }) => {
    const { foods, searchFoods } = useFoods();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [servings, setServings] = useState<number>(1);
    const [prepTime, setPrepTime] = useState<number>(0);
    const [cookTime, setCookTime] = useState<number>(0);
    const [instructions, setInstructions] = useState('');

    // Ingredients state
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
            toast.error('Este ingrediente ya está en la lista');
            return;
        }

        setItems([...items, {
            food,
            quantity: food.servingSize || 100,
            unit: food.servingUnit || 'g'
        }]);
        setShowSearchResults(false);
        toast.success('Ingrediente añadido');
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
            toast.error('Añade al menos un ingrediente');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                name,
                description,
                servings: Number(servings),
                prepTime: Number(prepTime),
                cookTime: Number(cookTime),
                instructions,
                ingredients: items.map(item => ({
                    foodId: item.food.id!, // asserted as we check on add
                    quantity: Number(item.quantity),
                    unit: item.unit
                }))
            });
        } catch (error) {
            console.error('Error saving recipe', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Nombre de la Receta</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Pollo al Curry"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Breve descripción..."
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Raciones</label>
                    <Input
                        type="number"
                        min="1"
                        value={servings}
                        onChange={(e) => setServings(Number(e.target.value))}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Prep (min)</label>
                    <Input
                        type="number"
                        min="0"
                        value={prepTime}
                        onChange={(e) => setPrepTime(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Cocción (min)</label>
                    <Input
                        type="number"
                        min="0"
                        value={cookTime}
                        onChange={(e) => setCookTime(Number(e.target.value))}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Instrucciones</label>
                <textarea
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 min-h-[100px]"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Pasos para preparar la receta..."
                />
            </div>

            <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium mb-2">Añadir Ingredientes</label>
                <SearchBar onSearch={handleSearch} placeholder="Buscar ingredientes..." />

                {showSearchResults && foods.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto border rounded-md shadow-sm bg-white dark:bg-gray-800">
                        {foods.map(food => (
                            <div
                                key={food.id}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                                onClick={() => handleAddFood(food)}
                            >
                                <span>{food.name} {food.brand && <small className="text-gray-500">({food.brand})</small>}</span>
                                <span className="text-xs font-bold text-primary">+ Añadir</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2 mt-4">
                <label className="block text-sm font-medium">Ingredientes ({items.length})</label>
                {items.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No hay ingredientes añadidos.</p>
                ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-md border text-sm">
                                <div className="flex-1 font-medium truncate">
                                    {item.food.name}
                                </div>
                                <input
                                    type="number"
                                    className="w-16 p-1 border rounded text-right"
                                    value={item.quantity}
                                    onChange={(e) => handleUpdateItem(index, 'quantity', Number(e.target.value))}
                                    min="0"
                                    step="0.1"
                                />
                                <input
                                    type="text"
                                    className="w-14 p-1 border rounded"
                                    value={item.unit}
                                    onChange={(e) => handleUpdateItem(index, 'unit', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 px-2"
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="secondary" onClick={onCancel} type="button">Cancelar</Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Receta'}
                </Button>
            </div>
        </form>
    );
};
