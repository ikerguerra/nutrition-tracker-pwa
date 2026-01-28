import React, { useState, useEffect } from 'react';
import { Layout } from '@components/layout/Layout';
import statsService, { WeightDataPoint, MacroTrendDataPoint, WeeklySummary, GoalAchievement } from '@services/statsService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { Button } from '@components/ui/Button';
import toast from 'react-hot-toast';

const StatsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'weight' | 'macros' | 'weekly' | 'goals'>('weight');
    const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('30');
    const [loading, setLoading] = useState(false);

    // Data states
    const [weightData, setWeightData] = useState<WeightDataPoint[]>([]);
    const [macroData, setMacroData] = useState<MacroTrendDataPoint[]>([]);
    const [weeklyData, setWeeklyData] = useState<WeeklySummary | null>(null);
    const [goalData, setGoalData] = useState<GoalAchievement | null>(null);

    const getDateRange = () => {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(dateRange));
        return { startDate: startDate.toISOString().split('T')[0], endDate };
    };

    useEffect(() => {
        fetchData();
    }, [dateRange, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { startDate, endDate } = getDateRange();

            if (activeTab === 'weight') {
                const data = await statsService.getWeightHistory(startDate, endDate);
                setWeightData(data);
            } else if (activeTab === 'macros') {
                const data = await statsService.getMacroTrends(startDate, endDate);
                setMacroData(data);
            } else if (activeTab === 'weekly') {
                const data = await statsService.getWeeklySummary(startDate);
                setWeeklyData(data);
            } else if (activeTab === 'goals') {
                const data = await statsService.getGoalAchievement(startDate, endDate);
                setGoalData(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            toast.error('Error al cargar estadísticas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">📊 Estadísticas</h1>

                {/* Date Range Selector */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={dateRange === '7' ? 'primary' : 'secondary'}
                        onClick={() => setDateRange('7')}
                    >
                        7 días
                    </Button>
                    <Button
                        variant={dateRange === '30' ? 'primary' : 'secondary'}
                        onClick={() => setDateRange('30')}
                    >
                        30 días
                    </Button>
                    <Button
                        variant={dateRange === '90' ? 'primary' : 'secondary'}
                        onClick={() => setDateRange('90')}
                    >
                        90 días
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b">
                    <button
                        className={`pb-2 px-4 ${activeTab === 'weight' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('weight')}
                    >
                        Peso
                    </button>
                    <button
                        className={`pb-2 px-4 ${activeTab === 'macros' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('macros')}
                    >
                        Macros
                    </button>
                    <button
                        className={`pb-2 px-4 ${activeTab === 'weekly' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('weekly')}
                    >
                        Semanal
                    </button>
                    <button
                        className={`pb-2 px-4 ${activeTab === 'goals' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('goals')}
                    >
                        Objetivos
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-10">Cargando...</div>
                ) : (
                    <>
                        {activeTab === 'weight' && (
                            <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                                <h2 className="text-xl font-bold mb-4">Progreso de Peso</h2>
                                {weightData.length === 0 ? (
                                    <p className="text-gray-500 text-center py-10">
                                        No hay datos de peso registrados. Añade tu peso en el registro diario.
                                    </p>
                                ) : (
                                    <div className="h-96">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={weightData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Peso" />
                                                <Line type="monotone" dataKey="movingAverage" stroke="#82ca9d" name="Media 7 días" strokeDasharray="5 5" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'macros' && (
                            <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                                <h2 className="text-xl font-bold mb-4">Tendencias de Macronutrientes</h2>
                                {macroData.length === 0 ? (
                                    <p className="text-gray-500 text-center py-10">
                                        No hay suficientes datos para mostrar tendencias.
                                    </p>
                                ) : (
                                    <div className="h-96">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={macroData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="calories" stroke="#ff7300" name="Calorías" />
                                                <Line type="monotone" dataKey="protein" stroke="#e74c3c" name="Proteína" />
                                                <Line type="monotone" dataKey="carbs" stroke="#3498db" name="Carbohidratos" />
                                                <Line type="monotone" dataKey="fats" stroke="#f39c12" name="Grasas" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'weekly' && weeklyData && (
                            <div className="space-y-6">
                                <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                                    <h2 className="text-xl font-bold mb-4">Comparación Semanal</h2>
                                    <div className="h-96">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { name: 'Semana Anterior', calories: weeklyData.previousWeek.avgCalories, protein: weeklyData.previousWeek.avgProtein, carbs: weeklyData.previousWeek.avgCarbs, fats: weeklyData.previousWeek.avgFats },
                                                { name: 'Semana Actual', calories: weeklyData.currentWeek.avgCalories, protein: weeklyData.currentWeek.avgProtein, carbs: weeklyData.currentWeek.avgCarbs, fats: weeklyData.currentWeek.avgFats }
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="calories" fill="#ff7300" name="Calorías" />
                                                <Bar dataKey="protein" fill="#e74c3c" name="Proteína" />
                                                <Bar dataKey="carbs" fill="#3498db" name="Carbohidratos" />
                                                <Bar dataKey="fats" fill="#f39c12" name="Grasas" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                                        <p className="text-sm text-gray-500">Cambio Calorías</p>
                                        <p className={`text-2xl font-bold ${weeklyData.changes.caloriesChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {weeklyData.changes.caloriesChange > 0 ? '+' : ''}{weeklyData.changes.caloriesChange.toFixed(1)}%
                                        </p>
                                    </div>
                                    <div className="card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                                        <p className="text-sm text-gray-500">Cambio Proteína</p>
                                        <p className={`text-2xl font-bold ${weeklyData.changes.proteinChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {weeklyData.changes.proteinChange > 0 ? '+' : ''}{weeklyData.changes.proteinChange.toFixed(1)}%
                                        </p>
                                    </div>
                                    <div className="card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                                        <p className="text-sm text-gray-500">Cambio Carbohidratos</p>
                                        <p className={`text-2xl font-bold ${weeklyData.changes.carbsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {weeklyData.changes.carbsChange > 0 ? '+' : ''}{weeklyData.changes.carbsChange.toFixed(1)}%
                                        </p>
                                    </div>
                                    <div className="card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                                        <p className="text-sm text-gray-500">Cambio Grasas</p>
                                        <p className={`text-2xl font-bold ${weeklyData.changes.fatsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {weeklyData.changes.fatsChange > 0 ? '+' : ''}{weeklyData.changes.fatsChange.toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'goals' && goalData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                                    <h2 className="text-xl font-bold mb-4">Logro de Objetivos</h2>
                                    <div className="flex items-center justify-center mb-6">
                                        <div className="relative w-48 h-48">
                                            <svg className="transform -rotate-90 w-48 h-48">
                                                <circle
                                                    cx="96"
                                                    cy="96"
                                                    r="80"
                                                    stroke="#e5e7eb"
                                                    strokeWidth="16"
                                                    fill="none"
                                                />
                                                <circle
                                                    cx="96"
                                                    cy="96"
                                                    r="80"
                                                    stroke="#10b981"
                                                    strokeWidth="16"
                                                    fill="none"
                                                    strokeDasharray={`${(goalData.achievementRate / 100) * 502.4} 502.4`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-4xl font-bold">{goalData.achievementRate.toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-center">
                                        <p className="text-lg">
                                            <span className="font-bold">{goalData.achievedDays}</span> de <span className="font-bold">{goalData.totalDays}</span> días cumplidos
                                        </p>
                                    </div>
                                </div>

                                <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                                    <h2 className="text-xl font-bold mb-4">Rachas</h2>
                                    <div className="space-y-6">
                                        <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-2">Racha Actual</p>
                                            <p className="text-5xl font-bold text-blue-600">{goalData.currentStreak}</p>
                                            <p className="text-sm text-gray-500 mt-2">días consecutivos</p>
                                        </div>
                                        <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-2">Mejor Racha</p>
                                            <p className="text-5xl font-bold text-green-600">{goalData.bestStreak}</p>
                                            <p className="text-sm text-gray-500 mt-2">días consecutivos</p>
                                        </div>
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

export default StatsPage;
