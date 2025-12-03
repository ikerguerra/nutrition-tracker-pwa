import React, { useState } from 'react';
import { MealEntry } from '../../types/dailyLog';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import './MealEntryCard.css';

interface MealEntryCardProps {
    entry: MealEntry;
    onUpdate: (id: number, entry: { quantity: number; unit: string }) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

const MealEntryCard: React.FC<MealEntryCardProps> = ({ entry, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [quantity, setQuantity] = useState(entry.quantity);
    const [unit, setUnit] = useState(entry.unit || 'g');

    // Debug: log entry structure if macros is missing
    if (!entry.macros) {
        console.log('MealEntryCard: entry.macros is undefined', entry);
    }

    const handleSave = async () => {
        await onUpdate(entry.id, { quantity: Number(quantity), unit });
        setIsEditing(false);
    };

    return (
        <Card className="meal-entry-card" hover>
            <div className="meal-entry-body">
                <div className="meal-entry-left">
                    <div className="meal-entry-title">{entry.foodName || entry.food?.name || 'Alimento desconocido'}</div>
                    <div className="meal-entry-sub">{entry.brand || entry.food?.brand || ''}</div>
                </div>

                <div className="meal-entry-nutrition">
                    <div className="meal-entry-calories">{entry.calories || 0} kcal</div>
                    {entry.macros && (
                        <div className="meal-entry-macros">
                            P {entry.macros.protein || 0}g • C {entry.macros.carbohydrates || 0}g • F {entry.macros.fats || 0}g
                        </div>
                    )}
                </div>
            </div>

            <div className="meal-entry-actions">
                {isEditing ? (
                    <>
                        <input type="number" min={0.1} step={0.1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                        <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} />
                        <Button variant="primary" size="sm" onClick={handleSave}>Guardar</Button>
                        <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>Cancelar</Button>
                    </>
                ) : (
                    <>
                        <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>Editar</Button>
                        <Button variant="danger" size="sm" onClick={() => onDelete(entry.id)}>Eliminar</Button>
                    </>
                )}
            </div>
        </Card>
    );
};

export default MealEntryCard;