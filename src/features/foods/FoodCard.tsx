import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@components/ui/card';
import { Button } from '@components/ui/button';
import type { Food } from '../../types/food';
import { Heart, Edit2, Trash2, Plus, Flame } from 'lucide-react';

interface FoodCardProps {
    food: Food;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onAddToDailyLog?: (food: Food) => void;
    isFavorite?: boolean;
    onToggleFavorite?: (id: number) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
    food,
    onEdit,
    onDelete,
    onAddToDailyLog,
    isFavorite,
    onToggleFavorite
}) => {
    const { id, name, brand, nutritionalInfo, servingSize, servingUnit } = food;

    return (
        <Card className="flex flex-col w-full hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm group">
            <CardHeader className="p-4 pb-2 flex-row items-center justify-between space-y-0 gap-3">
                <div className="space-y-1 overflow-hidden">
                    <h3 className="font-semibold text-lg leading-snug truncate text-foreground group-hover:text-primary transition-colors" title={name}>{name}</h3>
                    {brand && <p className="text-sm text-muted-foreground truncate font-medium">{brand}</p>}
                </div>
                {onToggleFavorite && id && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 shrink-0 transition-all ${isFavorite ? 'text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600' : 'text-muted-foreground/50 hover:text-red-500 hover:bg-red-50/50'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(id);
                        }}
                    >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                )}
            </CardHeader>

            <CardContent className="p-4 pt-3 flex-1 flex flex-col gap-4">
                {/* Calories & Serving - Highlighted */}
                <div className="flex items-center justify-between bg-secondary/30 p-2.5 rounded-lg border border-secondary/20">
                    <div className="flex items-center gap-2">
                        <div className="bg-background p-1.5 rounded-md shadow-sm">
                            <Flame className="h-4 w-4 text-orange-500 fill-orange-500/20" />
                        </div>
                        <div>
                            <span className="text-base font-bold tabular-nums block leading-none">{nutritionalInfo?.calories || 0}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">kcal</span>
                        </div>
                    </div>
                    {servingSize && servingUnit && (
                        <div className="text-right border-l border-border/50 pl-3">
                            <span className="text-sm font-semibold block leading-none tabular-nums text-foreground/80">{servingSize} <span className="text-xs font-normal text-muted-foreground">{servingUnit}</span></span>
                        </div>
                    )}
                </div>

                {/* Macros - Clean Minimalist */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="space-y-1">
                        <span className="block text-sm font-bold text-foreground tabular-nums">{nutritionalInfo?.protein || 0}g</span>
                        <div className="h-1 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Prot</span>
                    </div>
                    <div className="space-y-1">
                        <span className="block text-sm font-bold text-foreground tabular-nums">{nutritionalInfo?.carbohydrates || 0}g</span>
                        <div className="h-1 w-full bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Carbs</span>
                    </div>
                    <div className="space-y-1">
                        <span className="block text-sm font-bold text-foreground tabular-nums">{nutritionalInfo?.fats || 0}g</span>
                        <div className="h-1 w-full bg-yellow-100 dark:bg-yellow-900/30 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 w-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Fat</span>
                    </div>
                </div>
            </CardContent>

            {(onEdit || onDelete || onAddToDailyLog) && (
                <CardFooter className="p-4 pt-0 gap-2">
                    {onAddToDailyLog && (
                        <Button
                            className="flex-1 gap-2 h-10 font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                            onClick={() => onAddToDailyLog(food)}
                        >
                            <Plus className="h-4 w-4" />
                            Añadir
                        </Button>
                    )}
                    {(onEdit || onDelete) && (
                        <div className="flex gap-2 ml-auto">
                            {onEdit && id && (
                                <Button variant="outline" size="icon" className="h-10 w-10 border-input bg-background/50" onClick={() => onEdit(id)} title="Editar">
                                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            )}
                            {onDelete && id && (
                                <Button variant="outline" size="icon" className="h-10 w-10 border-input bg-background/50 hover:border-destructive/50 hover:text-destructive hover:bg-destructive/5" onClick={() => onDelete(id)} title="Eliminar">
                                    <Trash2 className="h-4 w-4 text-muted-foreground transition-colors" />
                                </Button>
                            )}
                        </div>
                    )}
                </CardFooter>
            )}
        </Card>
    );
};
