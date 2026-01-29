import React, { useState } from 'react';
import { MealEntry } from '../../types/dailyLog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Check, X, Copy, Pencil, Trash2 } from 'lucide-react';

interface MealEntryCardProps {
    entry: MealEntry;
    onUpdate: (id: number, entry: { quantity: number; unit: string }) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onCopy?: (entry: MealEntry) => void; // Added missing prop def from usage
}

const MealEntryCard: React.FC<MealEntryCardProps> = ({ entry, onUpdate, onDelete, onCopy }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [quantity, setQuantity] = useState(entry.quantity);
    const [unit, setUnit] = useState(entry.unit || 'g');

    const handleSave = async () => {
        await onUpdate(entry.id, { quantity: Number(quantity), unit });
        setIsEditing(false);
    };

    return (
        <div className="group flex flex-col gap-2 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between border-b last:border-0 border-border/50">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="font-medium truncate">{entry.foodName}</span>
                <span className="text-xs text-muted-foreground truncate">
                    {entry.brand && <span>{entry.brand} • </span>}
                    {entry.quantity} {entry.unit}
                </span>
            </div>

            <div className="flex items-center gap-2">
                {isEditing ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Input
                            type="number"
                            min={0.1}
                            step={0.1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="h-8 we-20 w-20"
                        />
                        {/* Native select for simplicity or Shadcn Select if imported. Using native for speed/robustness here unless Select is confirmed. */}
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="h-8 rounded-md border border-input bg-background px-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="g">g</option>
                            <option value="ml">ml</option>
                            <option value="unidad">ud</option>
                            <option value="porción">porción</option>
                        </select>
                        <Button size="icon" variant="default" className="h-8 w-8" onClick={handleSave} title="Guardar">
                            <Check className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditing(false)} title="Cancelar">
                            <X className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col items-end gap-0.5 text-right min-w-[100px]">
                            <span className="font-semibold text-sm">{entry.calories || 0} kcal</span>
                            <span className="text-xs text-muted-foreground">
                                P {entry.protein || 0} • C {entry.carbs || 0} • F {entry.fats || 0}
                            </span>
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 sm:ml-2">
                            {onCopy && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onCopy(entry)} title="Copiar">
                                    <Copy className="size-4" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsEditing(true)} title="Editar">
                                <Pencil className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(entry.id)} title="Eliminar">
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MealEntryCard;