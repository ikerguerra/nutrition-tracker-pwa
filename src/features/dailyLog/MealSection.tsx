import React from 'react';
import { MealType, MealEntry } from '../../types/dailyLog';
import { RecommendationItem } from '../../types/recommendation';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import MealEntryCard from './MealEntryCard';
import RecommendedEntryCard from './components/RecommendedEntryCard';
import './MealSection.css';

interface MealSectionProps {
    mealType: MealType;
    title: string;
    entries: MealEntry[];
    recommendations?: RecommendationItem[];
    onUpdate: (id: number, entry: { quantity: number; unit: string }) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onCopy?: () => void;
    onAcceptRecommendation?: (item: RecommendationItem) => void;
    onAcceptAll?: () => void;
}

const MealSection: React.FC<MealSectionProps> = ({
    title,
    entries,
    recommendations = [],
    onUpdate,
    onDelete,
    onCopy,
    onAcceptRecommendation,
    onRejectRecommendation,
    onAcceptAll
}) => {
    const hasItems = (entries && entries.length > 0) || (recommendations && recommendations.length > 0);

    return (
        <Card className="meal-section">
            <div className="meal-header">
                <div>
                    <h3>{title}</h3>
                    <span className="meal-count">{entries?.length || 0} items</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {onAcceptAll && recommendations && recommendations.length > 0 && (
                        <Button variant="success" size="sm" onClick={onAcceptAll} title="Aceptar todas las recomendaciones">
                            Aceptar todo
                        </Button>
                    )}
                    {onCopy && entries?.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={onCopy} title={`Copiar ${title}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </Button>
                    )}
                </div>
            </div>

            <div className="meal-entries">
                {!hasItems && (
                    <p className="meal-empty">Aún no hay alimentos asignados</p>
                )}

                {/* Render recommendations first */}
                {recommendations?.map(rec => (
                    <RecommendedEntryCard
                        key={`rec-${rec.id}`}
                        item={rec}
                        onAccept={() => onAcceptRecommendation && onAcceptRecommendation(rec)}
                        onReject={() => onRejectRecommendation && onRejectRecommendation(rec)}
                    />
                ))}

                {/* Render actual entries */}
                {entries?.map(entry => (
                    <MealEntryCard key={entry.id} entry={entry} onUpdate={onUpdate} onDelete={onDelete} />
                ))}
            </div>
        </Card>
    );
};

export default MealSection;
