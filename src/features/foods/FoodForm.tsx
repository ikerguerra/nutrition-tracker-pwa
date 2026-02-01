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

    const [servingUnits, setServingUnits] = useState<import('../../types/food').ServingUnit[]>(initialData?.servingUnits || []);
    const [newUnit, setNewUnit] = useState({ label: '', weightGrams: '', isDefault: false });

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

    const handleAddUnit = () => {
        if (!newUnit.label || !newUnit.weightGrams) return;
        const weight = parseFloat(newUnit.weightGrams);
        if (isNaN(weight) || weight <= 0) return;

        // If this new unit is set as default, unset others
        let updatedUnits = [...servingUnits];
        if (newUnit.isDefault) {
            updatedUnits = updatedUnits.map(u => ({ ...u, isDefault: false }));
        }

        updatedUnits.push({
            label: newUnit.label,
            weightGrams: weight,
            isDefault: newUnit.isDefault
        });

        setServingUnits(updatedUnits);
        setNewUnit({ label: '', weightGrams: '', isDefault: false });
    };

    const handleRemoveUnit = (index: number) => {
        setServingUnits(prev => prev.filter((_, i) => i !== index));
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
                },
                servingUnits: servingUnits.length > 0 ? servingUnits : undefined
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
                            <Label htmlFor="servingSize">Porción base</Label>
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
                            <Label htmlFor="servingUnit" className="mb-2 block">Unidad base</Label>
                            <select
                                id="servingUnit"
                                name="servingUnit"
                                value={formData.servingUnit}
                                onChange={handleChange}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="g">g</option>
                                <option value="ml">ml</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Unidades de Medida Personalizadas</h3>
                <div className="p-4 border rounded-md bg-muted/20 space-y-4">
                    <div className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                            <Label htmlFor="newUnitLabel" className="text-xs">Nombre (ej. Rebanada)</Label>
                            <Input
                                id="newUnitLabel"
                                value={newUnit.label}
                                onChange={e => setNewUnit(prev => ({ ...prev, label: e.target.value }))}
                                placeholder="Nombre unidad"
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="col-span-3">
                            <Label htmlFor="newUnitWeight" className="text-xs">Peso (g)</Label>
                            <Input
                                id="newUnitWeight"
                                type="number"
                                value={newUnit.weightGrams}
                                onChange={e => setNewUnit(prev => ({ ...prev, weightGrams: e.target.value }))}
                                placeholder="g"
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="col-span-2 flex items-center h-8 pb-1">
                            <label className="text-xs flex items-center gap-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newUnit.isDefault}
                                    onChange={e => setNewUnit(prev => ({ ...prev, isDefault: e.target.checked }))}
                                />
                                Default
                            </label>
                        </div>
                        <div className="col-span-2">
                            <Button type="button" size="sm" onClick={handleAddUnit} disabled={!newUnit.label || !newUnit.weightGrams} className="w-full h-8">
                                + Añadir
                            </Button>
                        </div>
                    </div>

                    {servingUnits.length > 0 && (
                        <div className="space-y-2 mt-2">
                            <Label className="text-xs text-muted-foreground">Unidades añadidas:</Label>
                            <div className="grid gap-2">
                                {servingUnits.map((u, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-background p-2 rounded border text-sm">
                                        <span>
                                            <span className="font-medium">{u.label}</span> = {u.weightGrams}g
                                            {u.isDefault && <span className="ml-2 text-xs bg-primary/10 text-primary px-1 rounded">Default</span>}
                                        </span>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveUnit(idx)} className="h-6 w-6 p-0 text-destructive">
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="form-section">
                <h3>Macronutrientes (por porción base de 100g/ml)</h3>
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
