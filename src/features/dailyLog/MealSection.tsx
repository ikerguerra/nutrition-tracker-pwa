import React from 'react';
import { MealType, MealEntry } from '../../types/dailyLog';
import { RecommendationItem } from '../../types/recommendation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Copy, Check, Plus } from 'lucide-react';
import MealEntryCard from './MealEntryCard';
import RecommendedEntryCard from './components/RecommendedEntryCard';

interface MealSectionProps {
    mealType: MealType;
    title: string;
    entries: MealEntry[];
    recommendations?: RecommendationItem[];
    onUpdate: (id: number, entry: { quantity: number; unit: string }) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onCopy?: () => void;
    onAcceptRecommendation?: (item: RecommendationItem) => void;
    onRejectRecommendation?: (item: RecommendationItem) => void;
    onAcceptAll?: () => void;
    onAdd?: () => void;
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
    onAcceptAll,
    onAdd
}) => {
    const hasItems = (entries && entries.length > 0) || (recommendations && recommendations.length > 0);

    return (
        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md border-border/60">
            <CardHeader className="pb-3 grid grid-cols-[1fr_auto] items-center space-y-0">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold">{title}</CardTitle>
                    {(entries?.length || 0) > 0 && (
                        <span className="inline-flex items-center justify-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                            {entries.length}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {onAcceptAll && recommendations && recommendations.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                            onClick={onAcceptAll}
                            title="Aceptar todas las recomendaciones"
                        >
                            <Check className="mr-1 size-3" />
                            Aceptar todo
                        </Button>
                    )}
                    {onAdd && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={onAdd}
                            title={`Añadir a ${title}`}
                        >
                            <Plus className="size-4" />
                        </Button>
                    )}
                    {onCopy && entries?.length > 0 && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCopy} title={`Copiar ${title}`}>
                            <Copy className="size-3.5" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {!hasItems && (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground bg-muted/20">
                        <p>Sin planificar</p>
                    </div>
                )}

                <div className="divide-y">
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
            </CardContent>
        </Card>
    );
};

export default MealSection;
