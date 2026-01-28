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

    const handleSave = async () => {
        await onUpdate(entry.id, { quantity: Number(quantity), unit });
        setIsEditing(false);
    };

    return (
        <Card className="meal-entry-card" hover>
            <div className="meal-entry-header">
                <div className="meal-entry-info">
                    <span className="meal-entry-name">{entry.foodName}</span>
                    <span className="meal-entry-details">
                        {entry.brand && <span>{entry.brand} • </span>}
                        {entry.quantity} {entry.unit}
                    </span>
                </div>
            </div>

            <div className="meal-entry-actions">
                {isEditing ? (
                    <div className="edit-mode">
                        <input
                            type="number"
                            min={0.1}
                            step={0.1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="input-sm"
                        />
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="input-sm"
                        >
                            <option value="g">g</option>
                            <option value="ml">ml</option>
                            <option value="unidad">unidad</option>
                            <option value="porción">porción</option>
                        </select>
                        <Button variant="primary" size="sm" onClick={handleSave} title="Guardar">
                            ✓
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)} title="Cancelar">
                            ✕
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="meal-entry-nutrition">
                            <div className="meal-entry-calories">{entry.calories || 0} kcal</div>
                            <div className="meal-entry-macros">
                                P {entry.protein || 0}g • C {entry.carbs || 0}g • F {entry.fats || 0}g
                            </div>
                        </div>
                        <div className="action-buttons">
                            <Button variant="ghost" size="sm" onClick={() => onCopy && onCopy(entry)} title="Copiar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} title="Editar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onDelete(entry.id)} title="Eliminar">
                                <span style={{ color: 'var(--color-error)' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </span>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};

export default MealEntryCard;