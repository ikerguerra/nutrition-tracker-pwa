import React, { useState, useEffect } from 'react';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Food } from '../../types/food';
import { MealType } from '../../types/dailyLog';
import { QuickFoodSuggestions } from './QuickFoodSuggestions';
import './AddEntryModal.css';

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
        setSelectedFood(null);
        setQuantity(100);
        setUnit('g');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={selectedFood ? `Agregar ${selectedFood.name} a ${mealType}` : 'Agregar alimento'} size="sm">
            {!selectedFood ? (
                <QuickFoodSuggestions onSelectFood={handleFoodSelect} />
            ) : (
                <div className="add-entry-modal-body">
                    <div className="field">
                        <label>Comida</label>
                        <div>{selectedFood.name} {selectedFood.brand && `- ${selectedFood.brand}`}</div>
                    </div>

                    <div className="field">
                        <label>Meal</label>
                        <select value={mealType} onChange={(e) => setMealType(e.target.value as MealType)}>
                            <option value="BREAKFAST">Desayuno</option>
                            <option value="LUNCH">Almuerzo</option>
                            <option value="DINNER">Cena</option>
                            <option value="SNACK">Snack</option>
                        </select>
                    </div>

                    <div className="field">
                        <label>Cantidad</label>
                        <input type="number" min={0.01} step={0.01} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                    </div>

                    <div className="field">
                        <label>Unidad</label>
                        <input value={unit} onChange={(e) => setUnit(e.target.value)} />
                    </div>

                    <div className="actions">
                        <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Agregando...' : 'Agregar'}</Button>
                        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default AddEntryModal;
