import React from 'react';
import { MealType, MealEntry } from '../../types/dailyLog';
import { Card } from '@components/ui/Card';
import MealEntryCard from './MealEntryCard';
import './MealSection.css';

interface MealSectionProps {
    mealType: MealType;
    title: string;
    entries: MealEntry[];
    onUpdate: (id: number, entry: { quantity: number; unit: string }) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

const MealSection: React.FC<MealSectionProps> = ({ mealType, title, entries, onUpdate, onDelete }) => {
    return (
        <Card className="meal-section">
            <div className="meal-header">
                <h3>{title}</h3>
                <span className="meal-count">{entries?.length || 0} items</span>
            </div>

            <div className="meal-entries">
                {entries?.length === 0 && (
                    <p className="meal-empty">Aún no hay alimentos asignados</p>
                )}

                {entries?.map(entry => (
                    <MealEntryCard key={entry.id} entry={entry} onUpdate={onUpdate} onDelete={onDelete} />
                ))}
            </div>
        </Card>
    );
};

export default MealSection;
