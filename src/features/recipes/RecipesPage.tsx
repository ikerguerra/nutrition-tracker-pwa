import React, { useState, useEffect } from 'react';
import { Layout } from '@components/layout/Layout';
import { Button } from '@components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@components/ui/dialog';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';
import { toast } from 'react-hot-toast';
import recipeService from '@services/recipeService';
import { dailyLogService } from '@services/dailyLogService';
import { Recipe, CreateRecipeRequest } from '../../types/recipe';
import { MealType } from '../../types/dailyLog';
import { RecipeForm } from './RecipeForm';
import { Card, CardContent } from '@components/ui/card';
import { Clock, Users, Flame, Utensils, Beef } from 'lucide-react';

const RecipesPage: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddLogModal, setShowAddLogModal] = useState(false);
    const [servingsMultiplier, setServingsMultiplier] = useState(1);
    const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
    const [logMealType, setLogMealType] = useState<MealType>('LUNCH');

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const data = await recipeService.getRecipes();
            setRecipes(data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            toast.error('Error al cargar las recetas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) return;

        try {
            await recipeService.deleteRecipe(id);
            setRecipes(prev => prev.filter(r => r.id !== id));
            toast.success('Receta eliminada');
            setShowDetailModal(false);
        } catch (error) {
            console.error('Error deleting recipe:', error);
            toast.error('Error al eliminar la receta');
        }
    };

    const handleCreateRecipe = async (data: CreateRecipeRequest) => {
        try {
            const newRecipe = await recipeService.createRecipe(data);
            setRecipes([...recipes, newRecipe]);
            toast.success('Receta creada exitosamente');
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating recipe:', error);
            toast.error('Error al crear la receta');
        }
    };

    const handleAddToLog = async () => {
        if (!selectedRecipe) return;

        try {
            const dateStr = logDate || new Date().toISOString().split('T')[0];

            // Iterate over ingredients and add them one by one
            const promises = selectedRecipe.ingredients.map(ing => {
                const quantity = (ing.quantity * servingsMultiplier) / selectedRecipe.servings;
                return dailyLogService.addEntry({
                    date: dateStr as string,
                    mealType: logMealType,
                    foodId: ing.foodId,
                    quantity: Number(quantity.toFixed(1)),
                    unit: (ing.unit || 'g') as string
                });
            });

            await Promise.all(promises);
            toast.success('Receta añadida al diario');
            setShowAddLogModal(false);
            setShowDetailModal(false);
        } catch (error) {
            console.error('Error adding recipe to log:', error);
            toast.error('Error al añadir la receta al diario');
        }
    };

    const scaleNutrition = (summary: Recipe['nutritionPerServing'], multiplier: number) => {
        return {
            calories: (summary.calories * multiplier).toFixed(1),
            protein: (summary.protein * multiplier).toFixed(1),
            carbs: (summary.carbs * multiplier).toFixed(1),
            fats: (summary.fats * multiplier).toFixed(1),
        };
    };

    const handleOpenChangeDetail = (open: boolean) => {
        if (!open) setShowDetailModal(false);
    };

    const handleOpenChangeCreate = (open: boolean) => {
        if (!open) setShowCreateModal(false);
    };

    const handleOpenChangeAddLog = (open: boolean) => {
        if (!open) setShowAddLogModal(false);
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Mis Recetas</h1>
                <Button onClick={() => setShowCreateModal(true)} className="gap-2 shadow-lg hover:shadow-primary/25">
                    <Utensils className="w-4 h-4" />
                    Nueva Receta
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-accent/20 rounded-xl border border-dashed border-border/50">
                    <p>No tienes recetas guardadas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map(recipe => (
                        <Card
                            key={recipe.id}
                            className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 overflow-hidden group"
                            onClick={() => {
                                setSelectedRecipe(recipe);
                                setServingsMultiplier(1);
                                setShowDetailModal(true);
                            }}
                        >
                            {recipe.imageUrl ? (
                                <div className="h-48 w-full overflow-hidden relative">
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                </div>
                            ) : (
                                <div className="h-32 w-full bg-secondary/10 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10"></div>
                                    <Utensils className="h-12 w-12 text-muted-foreground/20" />
                                </div>
                            )}

                            <CardContent className="p-5">
                                <h3 className="font-bold text-lg mb-3 line-clamp-1 group-hover:text-primary transition-colors">{recipe.name}</h3>

                                <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5 bg-secondary/20 px-2 py-1 rounded-md">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-secondary/20 px-2 py-1 rounded-md">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>{recipe.servings} rac.</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-orange-500/10 border border-orange-500/10">
                                        <div className="flex items-center gap-1 text-orange-500 text-xs font-bold uppercase tracking-wider mb-0.5">
                                            <Flame className="w-3 h-3" />
                                            <span>Kcal</span>
                                        </div>
                                        <span className="font-bold text-lg">{recipe.nutritionPerServing.calories.toFixed(0)}</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/10">
                                        <div className="flex items-center gap-1 text-blue-500 text-xs font-bold uppercase tracking-wider mb-0.5">
                                            <Beef className="w-3 h-3" />
                                            <span>Prot</span>
                                        </div>
                                        <span className="font-bold text-lg">{recipe.nutritionPerServing.protein.toFixed(0)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={showDetailModal} onOpenChange={handleOpenChangeDetail}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedRecipe?.name || 'Detalle de Receta'}</DialogTitle>
                    </DialogHeader>
                    {selectedRecipe && (
                        <div className="recipe-detail">
                            <div className="recipe-detail-header">
                                <div className="servings-selector">
                                    <label>Raciones a preparar:</label>
                                    <input
                                        type="number"
                                        min="0.5"
                                        step="0.5"
                                        value={servingsMultiplier}
                                        onChange={(e) => setServingsMultiplier(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="recipe-nutrition-banner">
                                {Object.entries(scaleNutrition(selectedRecipe.nutritionPerServing, servingsMultiplier)).map(([key, val]) => (
                                    <div key={key} className="nut-stat">
                                        <span className="nut-label">{key.toUpperCase()}</span>
                                        <span className="nut-val">{val}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="recipe-detail-body">
                                <div className="ingredients-section">
                                    <h4>Ingredientes</h4>
                                    <ul>
                                        {selectedRecipe.ingredients.map(ing => (
                                            <li key={ing.id}>
                                                {(ing.quantity * servingsMultiplier / selectedRecipe.servings).toFixed(1)} {ing.unit} {ing.foodName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="instructions-section">
                                    <h4>Instrucciones</h4>
                                    <p>{selectedRecipe.instructions}</p>
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="destructive" onClick={() => {
                                    if (selectedRecipe) handleDelete(selectedRecipe.id);
                                }}>
                                    Eliminar Receta
                                </Button>
                                <Button onClick={() => setShowAddLogModal(true)}>
                                    Añadir al Diario
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showCreateModal} onOpenChange={handleOpenChangeCreate}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Nueva Receta</DialogTitle>
                    </DialogHeader>
                    <RecipeForm
                        onCancel={() => setShowCreateModal(false)}
                        onSave={handleCreateRecipe}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={showAddLogModal} onOpenChange={handleOpenChangeAddLog}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Añadir al Diario</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="logDate">Fecha</Label>
                            <Input
                                id="logDate"
                                type="date"
                                value={logDate}
                                onChange={(e) => setLogDate(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="logMealType">Comida</Label>
                            <select
                                id="logMealType"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                value={logMealType}
                                onChange={(e) => setLogMealType(e.target.value as MealType)}
                            >
                                <option value="BREAKFAST">Desayuno</option>
                                <option value="LUNCH">Almuerzo</option>
                                <option value="DINNER">Cena</option>
                                <option value="SNACK">Snack</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddLogModal(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleAddToLog}>
                            Confirmar Añadir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default RecipesPage;
