import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Food } from '../../types/food';
import { MealType } from '../../types/dailyLog';
import { QuickFoodSuggestions } from './QuickFoodSuggestions';

interface AddEntryModalProps {
    isOpen: boolean;
    food: Food | null;
    onClose: () => void;
    onSubmit: (payload: { date: string; mealType: MealType; foodId: number; quantity: number; unit: string; servingUnitId?: number }) => Promise<void>;
    date?: string;
    initialMealType?: MealType;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, food, onClose, onSubmit, date, initialMealType }) => {
    const [selectedFood, setSelectedFood] = useState<Food | null>(food);
    const [mealType, setMealType] = useState<MealType>(initialMealType || 'BREAKFAST');
    const [quantity, setQuantity] = useState<number>(100);
    const [unit, setUnit] = useState<string>('g');
    const [selectedServingUnitId, setSelectedServingUnitId] = useState<number | null>(null); // null means default (g/ml)
    const [loading, setLoading] = useState(false);

    // Update meal type when prop changes
    useEffect(() => {
        if (initialMealType) {
            setMealType(initialMealType);
        }
    }, [initialMealType]);

    // Update selected food when prop changes
    useEffect(() => {
        setSelectedFood(food);
        if (food) {
            setQuantity(food.servingSize || 100);
            setUnit(food.servingUnit || 'g');
            setSelectedServingUnitId(null);

            // Auto-select default serving unit if available
            if (food.servingUnits?.some(u => u.isDefault)) {
                const defaultUnit = food.servingUnits.find(u => u.isDefault);
                if (defaultUnit) {
                    setSelectedServingUnitId(defaultUnit.id!);
                    setQuantity(1); // Default to 1 count of the unit
                    setUnit(defaultUnit.label);
                }
            }
        }
    }, [food]);

    const handleFoodSelect = (food: Food) => {
        setSelectedFood(food);

        let initialQty = food.servingSize || 100;
        let initialUnit = food.servingUnit || 'g';
        let initialServingUnitId: number | null = null;

        if (food.servingUnits?.find(u => u.isDefault)) {
            const defOption = food.servingUnits.find(u => u.isDefault)!;
            initialQty = 1;
            initialUnit = defOption.label;
            initialServingUnitId = defOption.id!;
        }

        setQuantity(initialQty);
        setUnit(initialUnit);
        setSelectedServingUnitId(initialServingUnitId);
    };

    const handleUnitChange = (val: string) => {
        if (val === 'default') {
            setSelectedServingUnitId(null);
            setUnit(selectedFood?.servingUnit || 'g');
            setQuantity(100); // Reset to standard 100g base
        } else {
            const unitId = Number(val);
            const sUnit = selectedFood?.servingUnits?.find(u => u.id === unitId);
            if (sUnit) {
                setSelectedServingUnitId(unitId);
                setUnit(sUnit.label);
                setQuantity(1); // Reset to 1 count of that unit
            }
        }
    };

    const handleSubmit = async () => {
        if (!selectedFood) return;
        setLoading(true);
        try {
            let finalQuantity = quantity;
            let finalUnit = unit;
            let finalServingUnitId: number | undefined = undefined;

            // If a specific serving unit is selected, send the ID to the backend
            // The backend preserves the unit name (e.g., "Slice") and quantity (e.g., 2)
            // while performing the nutritional calculation correctly.
            if (selectedServingUnitId !== null && selectedFood.servingUnits) {
                const sUnit = selectedFood.servingUnits.find(u => u.id === selectedServingUnitId);
                if (sUnit) {
                    finalServingUnitId = sUnit.id;
                    finalUnit = sUnit.label;
                    finalQuantity = Number(quantity); // Send raw quantity (e.g., 2 slices)
                }
            }

            await onSubmit({
                date: (date ?? new Date().toISOString().split('T')[0]) as string,
                mealType,
                foodId: Number(selectedFood.id),
                quantity: Number(finalQuantity),
                unit: finalUnit,
                servingUnitId: finalServingUnitId
            });

            onClose();
            // Reset state
            setSelectedFood(null);
            setQuantity(100);
            setUnit('g');
            setSelectedServingUnitId(null);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setSelectedFood(null);
            setQuantity(100);
            setUnit('g');
            setSelectedServingUnitId(null);
        }, 150);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            handleClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {selectedFood ? `Agregar ${selectedFood.name} a ${mealType}` : 'Agregar alimento'}
                    </DialogTitle>
                </DialogHeader>

                {!selectedFood ? (
                    <div className="py-4">
                        <QuickFoodSuggestions onSelectFood={handleFoodSelect} />
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Comida</Label>
                            <div className="text-sm font-medium">
                                {selectedFood.name} {selectedFood.brand && `- ${selectedFood.brand}`}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="mealType">Momento</Label>
                            <select
                                id="mealType"
                                value={mealType}
                                onChange={(e) => setMealType(e.target.value as MealType)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            >
                                <option value="BREAKFAST">Desayuno</option>
                                <option value="LUNCH">Almuerzo</option>
                                <option value="DINNER">Cena</option>
                                <option value="SNACK">Snack</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="quantity">Cantidad</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min={0.01}
                                    step={0.01}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="unit">Unidad</Label>
                                {selectedFood.servingUnits && selectedFood.servingUnits.length > 0 ? (
                                    <select
                                        id="unit"
                                        value={selectedServingUnitId ?? 'default'}
                                        onChange={(e) => handleUnitChange(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    >
                                        <option value="default">{selectedFood.servingUnit || 'g'} (100g base)</option>
                                        {selectedFood.servingUnits.map(u => (
                                            <option key={u.id} value={u.id}>
                                                {u.label} ({u.weightGrams}g)
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <Input
                                        id="unit"
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        disabled={true} // Default to base unit if no dynamic units
                                        className="bg-muted"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    {selectedFood && (
                        <>
                            <Button variant="outline" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSubmit} loading={loading}>
                                Agregar
                            </Button>
                        </>
                    )}
                    {!selectedFood && (
                        <Button variant="outline" onClick={handleClose}>
                            Cerrar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddEntryModal;
