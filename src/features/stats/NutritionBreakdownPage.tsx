import React, { useState, useEffect } from 'react';
import { NutrientBreakdown, DailyLog } from '../../types/dailyLog';
import dailyLogService from '@services/dailyLogService';
import statsService, { RdaData } from '@services/statsService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Button } from '@components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useTranslation } from 'react-i18next';

const NutritionBreakdownPage: React.FC = () => {
    const { t } = useTranslation();
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0] || '');
    const [breakdown, setBreakdown] = useState<NutrientBreakdown[]>([]);
    const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
    const [rda, setRda] = useState<RdaData | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'macros' | 'food' | 'chart' | 'micros'>('macros');

    useEffect(() => {
        fetchData();
    }, [date]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [breakdownData, logData, rdaData] = await Promise.all([
                dailyLogService.getNutrientBreakdown(date),
                dailyLogService.getDailyLog(date),
                statsService.getRda()
            ]);
            setBreakdown(breakdownData);
            setDailyLog(logData);
            setRda(rdaData);
        } catch (error) {
            console.error('Failed to fetch data', error);
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
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <Button variant="secondary" onClick={() => handleDateChange(-1)}>← {t('breakdown.prev')}</Button>
                    <h1 className="text-2xl font-bold">{new Date(date).toLocaleDateString()}</h1>
                    <Button variant="secondary" onClick={() => handleDateChange(1)}>{t('breakdown.next')} →</Button>
                </div>

                <div className="flex space-x-4 mb-6 border-b overflow-x-auto">
                    <button
                        className={`pb-2 px-4 whitespace-nowrap ${activeTab === 'macros' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('macros')}
                    >
                        {t('breakdown.tabs.byMeal')}
                    </button>
                    <button
                        className={`pb-2 px-4 whitespace-nowrap ${activeTab === 'food' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('food')}
                    >
                        {t('breakdown.tabs.byFood')}
                    </button>
                    <button
                        className={`pb-2 px-4 whitespace-nowrap ${activeTab === 'chart' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('chart')}
                    >
                        {t('breakdown.tabs.macroChart')}
                    </button>
                    <button
                        className={`pb-2 px-4 whitespace-nowrap ${activeTab === 'micros' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('micros')}
                    >
                        {t('breakdown.tabs.micros')}
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <>
                        {activeTab === 'macros' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                                    <h2 className="text-xl font-bold mb-4">{t('breakdown.caloriesByMeal')}</h2>
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
                                                <h3 className="font-bold">{t(`dashboard.meals.${meal.mealType}`, meal.mealType)}</h3>
                                                <span className="text-sm font-semibold">{meal.calories} kcal ({meal.caloriesPercentage?.toFixed(1)}%)</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-sm">
                                                <div className="text-center bg-red-50 dark:bg-red-900/20 p-1 rounded">
                                                    <p className="text-xs text-secondary-text">{t('breakdown.macros.protein')}</p>
                                                    <p className="font-mono">{meal.protein}g</p>
                                                </div>
                                                <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-1 rounded">
                                                    <p className="text-xs text-secondary-text">{t('breakdown.macros.carbs')}</p>
                                                    <p className="font-mono">{meal.carbs}g</p>
                                                </div>
                                                <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-1 rounded">
                                                    <p className="text-xs text-secondary-text">{t('breakdown.macros.fat')}</p>
                                                    <p className="font-mono">{meal.fats}g</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'food' && dailyLog && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                                        <tr>
                                            <th className="p-4 font-semibold text-sm">{t('breakdown.table.food')}</th>
                                            <th className="p-4 font-semibold text-sm">{t('breakdown.table.meal')}</th>
                                            <th className="p-4 font-semibold text-sm text-right">{t('breakdown.table.calories')}</th>
                                            <th className="p-4 font-semibold text-sm text-right hidden sm:table-cell">{t('breakdown.table.protein')}</th>
                                            <th className="p-4 font-semibold text-sm text-right hidden sm:table-cell">{t('breakdown.table.carbs')}</th>
                                            <th className="p-4 font-semibold text-sm text-right hidden sm:table-cell">{t('breakdown.table.fat')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {Object.values(dailyLog.meals).flat().sort((a, b) => b.calories - a.calories).map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-900 dark:text-white">{item.foodName}</div>
                                                    <div className="text-xs text-gray-500">{item.brand}</div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-500">
                                                    <span className="badge badge-sm">{t(`dashboard.meals.${item.mealType}`, item.mealType)}</span>
                                                </td>
                                                <td className="p-4 text-right font-medium">{item.calories.toFixed(0)}</td>
                                                <td className="p-4 text-right text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{item.protein.toFixed(1)}g</td>
                                                <td className="p-4 text-right text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{item.carbs.toFixed(1)}g</td>
                                                <td className="p-4 text-right text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{item.fats.toFixed(1)}g</td>
                                            </tr>
                                        ))}
                                        {Object.values(dailyLog.meals).flat().length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-gray-500">{t('breakdown.table.noFood')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'chart' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col items-center">
                                    <h2 className="text-xl font-bold mb-4">{t('breakdown.charts.macroDistribution')}</h2>
                                    <div className="h-80 w-full max-w-md">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: t('breakdown.macros.protein'), value: dailyLog?.totals.protein || 0, fill: '#3b82f6' },
                                                        { name: t('breakdown.macros.carbs'), value: dailyLog?.totals.carbs || 0, fill: '#22c55e' },
                                                        { name: t('breakdown.macros.fat'), value: dailyLog?.totals.fats || 0, fill: '#eab308' },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                    outerRadius={100}
                                                    dataKey="value"
                                                >
                                                    <Cell fill="#3b82f6" />
                                                    <Cell fill="#22c55e" />
                                                    <Cell fill="#eab308" />
                                                </Pie>
                                                <Tooltip />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900">
                                        <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-1">{t('breakdown.macros.protein')}</h3>
                                        <p className="text-3xl font-bold">{dailyLog?.totals.protein.toFixed(1)}g</p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">{t('breakdown.macros.proteinDesc')}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900">
                                        <h3 className="font-bold text-green-800 dark:text-green-300 mb-1">{t('breakdown.macros.carbohydrates')}</h3>
                                        <p className="text-3xl font-bold">{dailyLog?.totals.carbs.toFixed(1)}g</p>
                                        <p className="text-sm text-green-600 dark:text-green-400">{t('breakdown.macros.carbsDesc')}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900">
                                        <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-1">{t('breakdown.macros.fats')}</h3>
                                        <p className="text-3xl font-bold">{dailyLog?.totals.fats.toFixed(1)}g</p>
                                        <p className="text-sm text-yellow-600 dark:text-yellow-400">{t('breakdown.macros.fatsDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'micros' && (
                            <div className="space-y-6">
                                <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                                    <h2 className="text-xl font-bold mb-4">{t('breakdown.micros.title')}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { label: t('breakdown.micros.fiber'), key: 'fiber', unit: 'g', isLimit: false },
                                            { label: t('breakdown.micros.sugar'), key: 'sugars', unit: 'g', isLimit: true },
                                            { label: t('breakdown.micros.satFat'), key: 'saturatedFats', unit: 'g', isLimit: true },
                                            { label: t('breakdown.micros.sodium'), key: 'sodium', unit: 'mg', isLimit: true },
                                            { label: t('breakdown.micros.calcium'), key: 'calcium', unit: 'mg', isLimit: false },
                                            { label: t('breakdown.micros.iron'), key: 'iron', unit: 'mg', isLimit: false },
                                            { label: t('breakdown.micros.potassium'), key: 'potassium', unit: 'mg', isLimit: false },
                                            { label: t('breakdown.micros.vitA'), key: 'vitaminA', unit: 'IU', isLimit: false },
                                            { label: t('breakdown.micros.vitC'), key: 'vitaminC', unit: 'mg', isLimit: false },
                                            { label: t('breakdown.micros.vitD'), key: 'vitaminD', unit: 'IU', isLimit: false },
                                            { label: t('breakdown.micros.vitE'), key: 'vitaminE', unit: 'mg', isLimit: false },
                                            { label: t('breakdown.micros.vitB12'), key: 'vitaminB12', unit: 'µg', isLimit: false },
                                            { label: t('breakdown.micros.magnesium'), key: 'magnesium', unit: 'mg', isLimit: false },
                                            { label: t('breakdown.micros.zinc'), key: 'zinc', unit: 'mg', isLimit: false },
                                            { label: t('breakdown.micros.vitK'), key: 'vitaminK', unit: 'µg', isLimit: false },
                                            { label: t('breakdown.micros.vitB1'), key: 'vitaminB1', unit: 'mg', isLimit: false },
                                            { label: t('breakdown.micros.vitB2'), key: 'vitaminB2', unit: 'mg', isLimit: false },
                                            { label: t('breakdown.micros.vitB3'), key: 'vitaminB3', unit: 'mg', isLimit: false },
                                            { label: t('breakdown.micros.vitB6'), key: 'vitaminB6', unit: 'mg', isLimit: false },
                                            { label: t('breakdown.micros.vitB9'), key: 'vitaminB9', unit: 'µg', isLimit: false },
                                        ].map((nutrient) => {
                                            // Sum up all meals
                                            const total = breakdown.reduce((sum, item) => sum + (item[nutrient.key as keyof NutrientBreakdown] as number || 0), 0);
                                            const rdaValue = rda ? (rda[nutrient.key as keyof RdaData] as number || 0) : 0;
                                            const percentage = rdaValue > 0 ? (total / rdaValue) * 100 : 0;

                                            let colorClass = 'bg-blue-500';
                                            if (rdaValue > 0) {
                                                if (nutrient.isLimit) {
                                                    // For limits: Green if < 100%, Yellow if < 120%, Red if > 120%
                                                    if (percentage <= 100) colorClass = 'bg-green-500';
                                                    else if (percentage <= 120) colorClass = 'bg-yellow-500';
                                                    else colorClass = 'bg-red-500';
                                                } else {
                                                    // For goals: Green if > 100%, Yellow if > 50%, Red if < 50%
                                                    if (percentage >= 100) colorClass = 'bg-green-500';
                                                    else if (percentage >= 50) colorClass = 'bg-yellow-500';
                                                    else colorClass = 'bg-red-500';
                                                }
                                            }

                                            return (
                                                <div key={nutrient.key} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                                    <div className="flex justify-between items-baseline mb-2">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">{nutrient.label}</span>
                                                        <div className="text-right">
                                                            <span className="text-lg font-bold mr-1">{total.toFixed(1)}</span>
                                                            <span className="text-xs text-gray-500">/ {rdaValue} {nutrient.unit}</span>
                                                        </div>
                                                    </div>

                                                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${colorClass} transition-all duration-500`}
                                                            style={{ width: `${Math.min(100, percentage)}%` }}
                                                        />
                                                    </div>
                                                    <div className="mt-1 text-right">
                                                        <span className={`text-xs font-medium ${rdaValue > 0 && ((nutrient.isLimit && percentage > 100) || (!nutrient.isLimit && percentage < 50)) ? 'text-red-500' : 'text-gray-500'}`}>
                                                            {percentage.toFixed(0)}{nutrient.isLimit ? t('breakdown.micros.rdaLimit') : t('breakdown.micros.rda')}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default NutritionBreakdownPage;
