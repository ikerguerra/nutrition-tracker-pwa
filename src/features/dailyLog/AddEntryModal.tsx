import React, { useState } from 'react';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Food } from '../../types/food';
import { MealType } from '../../types/dailyLog';
import './AddEntryModal.css';

interface AddEntryModalProps {
    isOpen: boolean;
    food: Food | null;
    onClose: () => void;
    onSubmit: (payload: { date: string; mealType: MealType; foodId: number; quantity: number; unit: string }) => Promise<void>;
    date?: string;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, food, onClose, onSubmit, date }) => {
    const [mealType, setMealType] = useState<MealType>('BREAKFAST');
    const [quantity, setQuantity] = useState<number>(food?.servingSize || 100);
    const [unit, setUnit] = useState<string>(food?.servingUnit || 'g');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!food) return;
        setLoading(true);
        try {
            await onSubmit({ date: (date ?? new Date().toISOString().split('T')[0]) as string, mealType, foodId: Number(food.id), quantity: Number(quantity), unit });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={food ? `Agregar ${food.name} a ${mealType}` : 'Agregar alimento'} size="sm">
            {food ? (
                <div className="add-entry-modal-body">
                    <div className="field">
                        <label>Comida</label>
                        <div>{food.name} {food.brand && `- ${food.brand}`}</div>
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
                        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    </div>
                </div>
            ) : (
                <div>No hay alimento seleccionado.</div>
            )}
        </Modal>
    );
};

export default AddEntryModal;
