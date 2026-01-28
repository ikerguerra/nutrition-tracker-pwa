import React, { useState, useEffect } from 'react';
import { Layout } from '@components/layout/Layout';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { toast } from 'react-hot-toast';
import recipeService from '@services/recipeService';
import { Recipe } from '../../types/recipe';
import './RecipesPage.css';

const RecipesPage: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [servingsMultiplier, setServingsMultiplier] = useState(1);

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
        } catch (error) {
            console.error('Error deleting recipe:', error);
            toast.error('Error al eliminar la receta');
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

    return (
        <Layout>
            <div className="recipes-header">
                <h1 className="text-2xl font-bold">Mis Recetas</h1>
                <Button onClick={() => toast('Funcionalidad de creación próximamente')}>
                    Nueva Receta
                </Button>
            </div>

            {loading ? (
                <div className="loading-state">Cargando recetas...</div>
            ) : recipes.length === 0 ? (
                <div className="empty-state">
                    <p>No tienes recetas guardadas.</p>
                </div>
            ) : (
                <div className="recipes-grid">
                    {recipes.map(recipe => (
                        <div key={recipe.id} className="recipe-card card" onClick={() => {
                            setSelectedRecipe(recipe);
                            setServingsMultiplier(1);
                            setShowDetailModal(true);
                        }}>
                            {recipe.imageUrl && (
                                <img src={recipe.imageUrl} alt={recipe.name} className="recipe-img" />
                            )}
                            <div className="recipe-info">
                                <h3>{recipe.name}</h3>
                                <div className="recipe-meta">
                                    <span>⏱️ {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                                    <span>🍽️ {recipe.servings} raciones</span>
                                </div>
                                <div className="recipe-nutrition-preview">
                                    <div className="nut-dot cals">{recipe.nutritionPerServing.calories.toFixed(0)} kcal</div>
                                    <div className="nut-dot prot">{recipe.nutritionPerServing.protein.toFixed(0)}g P</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title={selectedRecipe?.name || 'Detalle de Receta'}
                size="lg"
            >
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

                        <div className="modal-actions">
                            <Button variant="danger" onClick={() => {
                                handleDelete(selectedRecipe.id);
                                setShowDetailModal(false);
                            }}>
                                Eliminar Receta
                            </Button>
                            <Button onClick={() => toast('Funcionalidad de añadir al diario próximamente')}>
                                Añadir al Diario
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

export default RecipesPage;
