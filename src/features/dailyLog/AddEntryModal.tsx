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
    onSubmit: (payload: { date: string; mealType: MealType; foodId: number; quantity: number; unit: string }) => Promise<void>;
    date?: string;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, food, onClose, onSubmit, date }) => {
    const [selectedFood, setSelectedFood] = useState<Food | null>(food);
    const [mealType, setMealType] = useState<MealType>('BREAKFAST');
    const [quantity, setQuantity] = useState<number>(100);
    const [unit, setUnit] = useState<string>('g');
    const [loading, setLoading] = useState(false);

    // Update selected food when prop changes
    useEffect(() => {
        setSelectedFood(food);
        if (food) {
            setQuantity(food.servingSize || 100);
            setUnit(food.servingUnit || 'g');
        }
    }, [food]);

    const handleFoodSelect = (food: Food) => {
        setSelectedFood(food);
        setQuantity(food.servingSize || 100);
        setUnit(food.servingUnit || 'g');
    };

    const handleSubmit = async () => {
        if (!selectedFood) return;
        setLoading(true);
        try {
            await onSubmit({ date: (date ?? new Date().toISOString().split('T')[0]) as string, mealType, foodId: Number(selectedFood.id), quantity: Number(quantity), unit });
            onClose();
            // Reset state
            setSelectedFood(null);
            setQuantity(100);
            setUnit('g');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Delay resetting state slightly to avoid flicker during close animation if needed, 
        // or just reset on next open. For now, simple close.
        setTimeout(() => {
            setSelectedFood(null);
            setQuantity(100);
            setUnit('g');
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
                            <Input
                                id="unit"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                            />
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
