import { useState, useEffect } from 'react';
import { Food } from '../../types/food';
import foodService from '../../services/foodService';
import './QuickFoodSuggestions.css';

interface QuickFoodSuggestionsProps {
    onSelectFood: (food: Food) => void;
}

export const QuickFoodSuggestions: React.FC<QuickFoodSuggestionsProps> = ({ onSelectFood }) => {
    const [suggestions, setSuggestions] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        try {
            setLoading(true);
            // Try recent foods first
            const recentFoods = await foodService.getRecentFoods();
            if (recentFoods.length > 0) {
                setSuggestions(recentFoods.slice(0, 5));
            } else {
                // Fallback to frequent foods
                const frequentFoods = await foodService.getFrequentFoods(5);
                setSuggestions(frequentFoods);
            }
        } catch (error) {
            console.error('Error loading suggestions:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="suggestions-loading">
                Cargando sugerencias...
            </div>
        );
    }

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="quick-food-suggestions">
            <h3>Sugerencias Rápidas</h3>
            <div className="suggestions-grid">
                {suggestions.map((food) => (
                    <div
                        key={food.id}
                        className="suggestion-card"
                        onClick={() => onSelectFood(food)}
                    >
                        <div className="suggestion-name">{food.name}</div>
                        <div className="suggestion-macros">
                            <span>{food.nutritionalInfo?.calories || 0} kcal</span>
                            <span>P: {food.nutritionalInfo?.protein || 0}g</span>
                        </div>
                        <button className="suggestion-add-btn" type="button">
                            + Agregar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
