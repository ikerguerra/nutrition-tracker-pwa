import React, { useState, useEffect } from 'react';
import { NutrientBreakdown } from '../../types/dailyLog';
import dailyLogService from '@services/dailyLogService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '@components/ui/button';

const NutritionBreakdownPage: React.FC = () => {
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0] || '');
    const [breakdown, setBreakdown] = useState<NutrientBreakdown[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'macros' | 'micros'>('macros');

    useEffect(() => {
        fetchBreakdown();
    }, [date]);

    const fetchBreakdown = async () => {
        setLoading(true);
        try {
            const data = await dailyLogService.getNutrientBreakdown(date);
            setBreakdown(data);
        } catch (error) {
            console.error('Failed to fetch breakdown', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (days: number) => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + days);
        setDate(currentDate.toISOString().split('T')[0] || '');
    };

    const COLORS: Record<string, string> = {
        BREAKFAST: '#E29578',
        LUNCH: '#83C5BE',
        DINNER: '#006D77',
        SNACK: '#FFDDD2'
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <Button variant="secondary" onClick={() => handleDateChange(-1)}>← Prev</Button>
                <h1 className="text-2xl font-bold">{new Date(date).toLocaleDateString()}</h1>
                <Button variant="secondary" onClick={() => handleDateChange(1)}>Next →</Button>
            </div>

            <div className="flex space-x-4 mb-6 border-b">
                <button
                    className={`pb-2 px-4 ${activeTab === 'macros' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('macros')}
                >
                    By Meal (Macros)
                </button>
                <button
                    className={`pb-2 px-4 ${activeTab === 'micros' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('micros')}
                >
                    Micronutrients
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : activeTab === 'macros' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Calories by Meal</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={breakdown}>
                                    <XAxis dataKey="mealType" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="calories">
                                        {breakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[entry.mealType] || '#8884d8'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {breakdown.map(meal => (
                            <div key={meal.mealType} className="card p-4 bg-white dark:bg-gray-800 rounded-lg shadow border-l-4" style={{ borderColor: COLORS[meal.mealType] || '#ccc' }}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold">{meal.mealType}</h3>
                                    <span className="text-sm font-semibold">{meal.calories} kcal ({meal.caloriesPercentage?.toFixed(1)}%)</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="text-center bg-red-50 dark:bg-red-900/20 p-1 rounded">
                                        <p className="text-xs text-secondary-text">Protein</p>
                                        <p className="font-mono">{meal.protein}g</p>
                                    </div>
                                    <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-1 rounded">
                                        <p className="text-xs text-secondary-text">Carbs</p>
                                        <p className="font-mono">{meal.carbs}g</p>
                                    </div>
                                    <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-1 rounded">
                                        <p className="text-xs text-secondary-text">Fat</p>
                                        <p className="font-mono">{meal.fats}g</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Micronutrient Totals</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Fiber', key: 'fiber', unit: 'g' },
                                { label: 'Sugar', key: 'sugars', unit: 'g' },
                                { label: 'Sat. Fat', key: 'saturatedFats', unit: 'g' },
                                { label: 'Sodium', key: 'sodium', unit: 'mg' },
                                { label: 'Calcium', key: 'calcium', unit: 'mg' },
                                { label: 'Iron', key: 'iron', unit: 'mg' },
                                { label: 'Potassium', key: 'potassium', unit: 'mg' },
                                { label: 'Vit A', key: 'vitaminA', unit: 'IU' },
                                { label: 'Vit C', key: 'vitaminC', unit: 'mg' },
                                { label: 'Vit D', key: 'vitaminD', unit: 'IU' },
                                { label: 'Vit E', key: 'vitaminE', unit: 'mg' },
                                { label: 'Vit B12', key: 'vitaminB12', unit: 'µg' },
                            ].map((nutrient) => {
                                // Sum up all meals
                                const total = breakdown.reduce((sum, item) => sum + (item[nutrient.key as keyof NutrientBreakdown] as number || 0), 0);
                                return (
                                    <div key={nutrient.key} className="p-3 border rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">{nutrient.label}</p>
                                        <p className="text-lg font-bold">{total.toFixed(1)} <span className="text-sm font-normal text-gray-400">{nutrient.unit}</span></p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NutritionBreakdownPage;
