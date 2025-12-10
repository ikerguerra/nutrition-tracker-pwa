import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { DailyLog } from '../../types/dailyLog';

interface NutritionChartsProps {
    dailyLog: DailyLog | null;
}

export const NutritionCharts = ({ dailyLog }: NutritionChartsProps) => {
    if (!dailyLog) return <div style={{ textAlign: 'center', padding: '1rem' }}>No hay datos para mostrar gráficos</div>;

    const { totals, meals } = dailyLog;

    // Data for Pie Chart
    const macroData = [
        { name: 'Proteína', value: totals.protein, color: '#10B981' }, // Green-500
        { name: 'Carbohidratos', value: totals.carbs, color: '#3B82F6' }, // Blue-500
        { name: 'Grasas', value: totals.fats, color: '#F59E0B' }, // Amber-500
    ].filter(item => item.value > 0);

    // Data for Bar Chart (Calories per Meal)
    const mealData = Object.entries(meals).map(([mealType, entries]) => {
        const totalCals = entries.reduce((sum, entry) => sum + entry.calories, 0);
        return {
            name: formatMealType(mealType),
            calories: totalCals
        };
    });

    if (macroData.length === 0) {
        return <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>Registra alimentos para ver estadísticas</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
            {/* Pie Chart */}
            <div style={{ height: '300px', width: '100%' }}>
                <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '0.5rem' }}>Distribución de Macronutrientes (g)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={macroData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {macroData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value}g`, 'Cantidad']} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div style={{ height: '300px', width: '100%' }}>
                <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '0.5rem' }}>Calorías por Comida</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mealData}>
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip formatter={(value: number) => [`${value} kcal`, 'Calorías']} />
                        <Bar dataKey="calories" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const formatMealType = (type: string) => {
    switch (type) {
        case 'BREAKFAST': return 'Desayuno';
        case 'LUNCH': return 'Almuerzo';
        case 'DINNER': return 'Cena';
        case 'SNACK': return 'Snack';
        default: return type;
    }
};
