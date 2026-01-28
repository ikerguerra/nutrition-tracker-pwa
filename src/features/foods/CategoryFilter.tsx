import React from 'react';
import { FoodCategory, FOOD_CATEGORY_LABELS } from '../../types/food';
import './CategoryFilter.css';

interface CategoryFilterProps {
    selectedCategory?: FoodCategory;
    onCategoryChange: (category?: FoodCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    selectedCategory,
    onCategoryChange,
}) => {
    const categories = Object.values(FoodCategory);

    return (
        <div className="category-filter">
            <label htmlFor="category-select" className="category-filter-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
                </svg>
                Categoría:
            </label>
            <select
                id="category-select"
                className="category-select"
                value={selectedCategory || ''}
                onChange={(e) => onCategoryChange(e.target.value as FoodCategory || undefined)}
            >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {FOOD_CATEGORY_LABELS[category]}
                    </option>
                ))}
            </select>
        </div>
    );
};
