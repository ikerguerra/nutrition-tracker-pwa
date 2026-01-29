import React, { useState } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { useFoods } from '@hooks/useFoods';
import type { FoodRequest } from '../../types/food';
import './FoodForm.css';

import type { Food } from '../../types/food';

interface FoodFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: Food;
}

export const FoodForm: React.FC<FoodFormProps> = ({ onSuccess, onCancel, initialData }) => {
    const { createFood, updateFood, loading, error } = useFoods();

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        brand: initialData?.brand || '',
        barcode: initialData?.barcode || '',
        servingSize: initialData?.servingSize?.toString() || '',
        servingUnit: initialData?.servingUnit || 'g',
        nutritionalInfo: {
            calories: initialData?.nutritionalInfo?.calories?.toString() || '',
            protein: initialData?.nutritionalInfo?.protein?.toString() || '',
            carbohydrates: initialData?.nutritionalInfo?.carbohydrates?.toString() || '',
            fats: initialData?.nutritionalInfo?.fats?.toString() || '',
            fiber: initialData?.nutritionalInfo?.fiber?.toString() || '',
            sugars: initialData?.nutritionalInfo?.sugars?.toString() || '',
            saturatedFats: initialData?.nutritionalInfo?.saturatedFats?.toString() || '',
            sodium: initialData?.nutritionalInfo?.sodium?.toString() || '',
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('nutrition.')) {
            const nutritionField = name.split('.')[1] as string;
            setFormData(prev => ({
                ...prev,
                nutritionalInfo: {
                    ...prev.nutritionalInfo,
                    [nutritionField as keyof typeof prev.nutritionalInfo]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const foodData: FoodRequest = {
                name: formData.name,
                brand: formData.brand || undefined,
                barcode: formData.barcode || undefined,
                servingSize: parseFloat(formData.servingSize) || undefined,
                servingUnit: formData.servingUnit,
                nutritionalInfo: {
                    calories: parseFloat(formData.nutritionalInfo.calories) || undefined,
                    protein: parseFloat(formData.nutritionalInfo.protein) || undefined,
                    carbohydrates: parseFloat(formData.nutritionalInfo.carbohydrates) || undefined,
                    fats: parseFloat(formData.nutritionalInfo.fats) || undefined,
                    fiber: parseFloat(formData.nutritionalInfo.fiber) || undefined,
                    sugars: parseFloat(formData.nutritionalInfo.sugars) || undefined,
                    saturatedFats: parseFloat(formData.nutritionalInfo.saturatedFats) || undefined,
                    sodium: parseFloat(formData.nutritionalInfo.sodium) || undefined,
                }
            };

            if (initialData?.id) {
                await updateFood(initialData.id, foodData);
            } else {
                await createFood(foodData);
            }
            onSuccess?.();
        } catch (err) {
            console.error('Error saving food:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="food-form">
            {error && (
                <div className="form-error">
                    <p>{error}</p>
                </div>
            )}

            <div className="form-section">
                <h3>Información Básica</h3>
                <div className="form-grid">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ej. Manzana Roja"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="brand">Marca</Label>
                        <Input
                            id="brand"
                            name="brand"
                            placeholder="Ej. Natural"
                            value={formData.brand}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="barcode">Código de Barras</Label>
                        <Input
                            id="barcode"
                            name="barcode"
                            placeholder="Escanear o escribir"
                            value={formData.barcode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="serving-input-group">
                        <div className="grid gap-2 flex-1">
                            <Label htmlFor="servingSize">Porción</Label>
                            <Input
                                id="servingSize"
                                name="servingSize"
                                type="number"
                                step="0.01"
                                placeholder="100"
                                value={formData.servingSize}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="select-wrapper">
                            <Label htmlFor="servingUnit" className="mb-2 block">Unidad</Label>
                            <select
                                id="servingUnit"
                                name="servingUnit"
                                value={formData.servingUnit}
                                onChange={handleChange}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="g">g</option>
                                <option value="ml">ml</option>
                                <option value="oz">oz</option>
                                <option value="cup">taza</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Macronutrientes (por porción)</h3>
                <div className="form-grid cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="nutrition.calories">Calorías (kcal)</Label>
                        <Input
                            id="nutrition.calories"
                            name="nutrition.calories"
                            type="number"
                            step="0.01"
                            value={formData.nutritionalInfo.calories}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nutrition.protein">Proteínas (g)</Label>
                        <Input
                            id="nutrition.protein"
                            name="nutrition.protein"
                            type="number"
                            step="0.01"
                            value={formData.nutritionalInfo.protein}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nutrition.carbohydrates">Carbohidratos (g)</Label>
                        <Input
                            id="nutrition.carbohydrates"
                            name="nutrition.carbohydrates"
                            type="number"
                            step="0.01"
                            value={formData.nutritionalInfo.carbohydrates}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nutrition.fats">Grasas (g)</Label>
                        <Input
                            id="nutrition.fats"
                            name="nutrition.fats"
                            type="number"
                            step="0.01"
                            value={formData.nutritionalInfo.fats}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Otros (Opcional)</h3>
                <div className="form-grid cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="nutrition.fiber">Fibra (g)</Label>
                        <Input
                            id="nutrition.fiber"
                            name="nutrition.fiber"
                            type="number"
                            step="0.01"
                            value={formData.nutritionalInfo.fiber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nutrition.sugars">Azúcares (g)</Label>
                        <Input
                            id="nutrition.sugars"
                            name="nutrition.sugars"
                            type="number"
                            step="0.01"
                            value={formData.nutritionalInfo.sugars}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="form-actions">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" loading={loading} disabled={!formData.name}>
                    {loading ? 'Guardando...' : 'Guardar Alimento'}
                </Button>
            </div>
        </form>
    );
};
