import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Food } from '../../types/food';
import { Layout } from '@components/layout/Layout';
import { FoodList } from '@features/foods/FoodList';
import { SearchBar } from '@features/foods/SearchBar';
import { BarcodeScanner } from '@features/barcode/BarcodeScanner';
import { FoodForm } from '@features/foods/FoodForm';
import { Modal } from '@components/ui/Modal';
import { toast } from 'react-hot-toast';
import { Dashboard } from '@features/dailyLog/Dashboard';
import AddEntryModal from '@features/dailyLog/AddEntryModal';
import useDailyLog from '@hooks/useDailyLog';
import { useFoods } from '@hooks/useFoods';
import { ExternalFoodSearch } from '@features/external/ExternalFoodSearch';
import { Button } from '@components/ui/Button';
import { DateCarousel } from '@components/ui/DateCarousel';
import { WeightWidget } from './WeightWidget';
import { NutritionCharts } from '@features/stats/NutritionCharts';
import { CopyDayModal } from './CopyDayModal';
import { CopyMealSectionModal } from './CopyEntryModal';
import { DietPlan, RecommendationItem } from '../../types/recommendation';
import recommendationService from '@services/recommendationService';

const DashboardPage = () => {
    const [showScanner, setShowScanner] = useState(false);
    const [showAddFood, setShowAddFood] = useState(false);
    const [showExternalSearch, setShowExternalSearch] = useState(false);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
    const [showAddEntryModal, setShowAddEntryModal] = useState(false);
    const [selectedFoodForEntry, setSelectedFoodForEntry] = useState<Food | null>(null);
    const [showCharts, setShowCharts] = useState(false);
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [copyingSection, setCopyingSection] = useState<{ date: string; mealType: string; title: string } | null>(null);
    const [recommendations, setRecommendations] = useState<DietPlan | null>(null);
    const [recLoading, setRecLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Date state
    const [searchParams, setSearchParams] = useSearchParams();
    const dateParam = searchParams.get('date');

    const [selectedDate, setSelectedDate] = useState(() => {
        if (dateParam) {
            const date = new Date(dateParam);
            return isNaN(date.getTime()) ? new Date() : date;
        }
        return new Date();
    });

    // Update URL when date changes
    useEffect(() => {
        const dateStr = formatDateForApi(selectedDate);
        setSearchParams({ date: dateStr });
    }, [selectedDate, setSearchParams]);

    // Format date as YYYY-MM-DD for API
    const formatDateForApi = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const dateString = formatDateForApi(selectedDate);

    // Fetch recommendations
    useEffect(() => {
        const fetchRecommendations = async () => {
            setRecLoading(true);
            try {
                const plan = await recommendationService.getDailyPlan(dateString);
                setRecommendations(plan);
            } catch (error) {
                setRecommendations(null);
            } finally {
                setRecLoading(false);
            }
        };
        fetchRecommendations();
    }, [dateString]);

    const handleGeneratePlan = async () => {
        setIsGenerating(true);
        try {
            const plan = await recommendationService.generateDailyPlan(dateString);
            setRecommendations(plan);
            toast.success('¡Plan diario generado!');
        } catch (error) {
            console.error('Error generating plan', error);
            toast.error('No se pudo generar el plan');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAcceptRecommendation = async (item: RecommendationItem, mealType: string) => {
        try {
            await addEntry({
                date: dateString,
                mealType: mealType as any,
                foodId: item.foodId,
                quantity: item.suggestedQuantity,
                unit: item.unit || 'g'
            });
            toast.success(`Añadido: ${item.foodName}`);

            // Optimistically remove from list
            setRecommendations(prev => {
                if (!prev) return null;
                const newMeals = prev.meals.map(m => ({
                    ...m,
                    items: m.items.filter(i => i.id !== item.id)
                }));
                return { ...prev, meals: newMeals };
            });
        } catch (error) {
            console.error('Error accepting recommendation', error);
            toast.error('Error al añadir alimento recomendado');
        }
    };

    const handleRejectRecommendation = (item: RecommendationItem) => {
        setRecommendations(prev => {
            if (!prev) return null;
            const newMeals = prev.meals.map(m => ({
                ...m,
                items: m.items.filter(i => i.id !== item.id)
            }));
            return { ...prev, meals: newMeals };
        });
        toast('Sugerencia descartada', { icon: '👋' });
    };

    const handleAcceptAll = async () => {
        if (!recommendations?.id) return;
        try {
            await recommendationService.acceptPlan(recommendations.id);
            toast.success('¡Todo el plan aceptado!');
            // Refresh logic:
            // 1. Fetch Plan again (to see updated status)
            // 2. Fetch Daily Log again (to see new entries)
            // Or optimistically update. Let's refresh to be safe.
            const [plan, log] = await Promise.all([
                recommendationService.getDailyPlan(dateString),
                dailyLog.meals ? Promise.resolve(null) : Promise.resolve(null) // hack: actually use refresh from useDailyLog
            ]);

            // To properly refresh daily log, we need to call useDailyLog's refresh or rely on SWR/React Query if used.
            // Here useDailyLog exposes... loading, error, addEntry... but not refresh explicitly?
            // Actually useDailyLog likely re-fetches if date changes. We can force it?
            // Let's modify useDailyLog to expose refresh or just rely on manual optimistic?
            // Ideally we re-fetch.
            // DashboardPage receives "addEntry" from useDailyLog...
            // Let's assume we need to reload the page or hook.
            // Wait, useDailyLog is a custom hook. Let's see if it returns 'refresh'.
            // In line 135: const { dailyLog ... } = useDailyLog(dateString).
            // It doesn't seem to return refresh.
            // But we can trigger it by toggling date? No.
            // Let's reload window? No.

            // Best effort: Update recommendations state (clear pending)
            // And hope user manually refreshes if they want to see log.
            // OR: use addEntry multiple times? No.
            // We really need to refresh the DailyLog.

            window.location.reload(); // Temporary solution for immediate consistency
        } catch (error) {
            console.error('Error accepting plan', error);
            toast.error('Error al aceptar el plan');
        }
    };

    const handleAcceptMeal = async (mealType: string) => {
        if (!recommendations?.id) return;
        try {
            await recommendationService.acceptMeal(recommendations.id, mealType);
            toast.success(`¡${mealType} aceptado!`);
            window.location.reload();
        } catch (error) {
            console.error(`Error accepting ${mealType}`, error);
            toast.error('Error al aceptar comida');
        }
    };

    const { dailyLog, addEntry, updateEntry, deleteEntry, updateWeight, loading: dailyLogLoading, error: dailyLogError } = useDailyLog(dateString);
    const { searchFoods, refresh, deleteFood, foods } = useFoods();

    const minWidthForWidgets = '300px';

    const handleSearch = (query: string) => {
        if (query) {
            searchFoods(query);
        } else {
            refresh();
        }
    };

    const handleEdit = (id: number) => {
        const foodToEdit = foods.find(f => f.id === id);
        if (foodToEdit) {
            setEditingFood(foodToEdit);
            setShowAddFood(true);
        }
    };

    const handleCloseModal = () => {
        setShowAddFood(false);
        setEditingFood(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este alimento?')) {
            try {
                await deleteFood(id);
                toast.success('Alimento eliminado correctamente');
            } catch (error) {
                console.error('Error deleting food:', error);
                toast.error('Error al eliminar el alimento');
            }
        }
    };

    return (
        <>
            <Layout
                onAddFood={() => setShowAddFood(true)}
                onScanBarcode={() => setShowScanner(true)}
            >
                <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <DateCarousel
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCopyModal(true)}
                        className="whitespace-nowrap"
                        title="Copiar todas las comidas de este día a otro"
                    >
                        📋 Copiar Día
                    </Button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: 'var(--spacing-xl)',
                    alignItems: 'start'
                }}>
                    <div style={{ minWidth: 0 }}>
                        <Dashboard
                            date={dateString}
                            dailyLog={dailyLog}
                            recommendations={recommendations}
                            loading={dailyLogLoading || recLoading}
                            error={dailyLogError}
                            updateEntry={updateEntry}
                            deleteEntry={deleteEntry}
                            onAcceptRecommendation={handleAcceptRecommendation}
                            onRejectRecommendation={handleRejectRecommendation}
                            onAcceptAll={handleAcceptAll}
                            onAcceptMeal={handleAcceptMeal}
                            onGeneratePlan={handleGeneratePlan}
                            isGeneratingPlan={isGenerating}
                            onOpenFoods={() => {
                                // Scroll to food list on mobile or focus search
                                document.querySelector('.food-list-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            onCopySection={(mealType) => {
                                const titleMap: Record<string, string> = {
                                    'BREAKFAST': 'Desayuno',
                                    'MORNING_SNACK': 'Media Mañana',
                                    'LUNCH': 'Almuerzo',
                                    'AFTERNOON_SNACK': 'Merienda',
                                    'DINNER': 'Cena'
                                };
                                setCopyingSection({
                                    date: dateString,
                                    mealType,
                                    title: titleMap[mealType] || mealType
                                });
                            }}
                        />
                    </div>

                    <div className="food-list-section" style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                            <div style={{ flex: 1 }}>
                                <SearchBar onSearch={handleSearch} />
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => setShowExternalSearch(true)}
                                title="Buscar en OpenFoodFacts"
                            >
                                🌐
                            </Button>
                        </div>

                        <FoodList onEdit={handleEdit} onDelete={handleDelete} onAddToDailyLog={(food) => {
                            setSelectedFoodForEntry(food);
                            setShowAddEntryModal(true);
                        }} />
                    </div>

                    <div style={{ minWidth: minWidthForWidgets }}>
                        <WeightWidget dailyLog={dailyLog} onUpdateWeight={updateWeight} />

                        <div className="mt-4">
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => setShowCharts(true)}
                            >
                                📊 Ver Estadísticas
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout >

            <Modal
                isOpen={showCharts}
                onClose={() => setShowCharts(false)}
                title={`Estadísticas: ${new Date(selectedDate).toLocaleDateString()}`}
                size="lg"
            >
                <NutritionCharts dailyLog={dailyLog} />
            </Modal>

            <Modal
                isOpen={showScanner}
                onClose={() => setShowScanner(false)}
                title="Buscar por Código de Barras"
                size="md"
            >
                <BarcodeScanner
                    onFoodFound={(data) => {
                        console.log('Food found:', data);
                        if (data.foundInDatabase) {
                            toast.success('Alimento encontrado en base de datos');
                            // Optionally close modal and select food
                            // setShowScanner(false);
                            // setSelectedFoodForEntry(data.food);
                            // setShowAddEntryModal(true);
                        } else if (data.source === 'openfoodfacts') {
                            toast.success('Alimento encontrado en OpenFoodFacts. Puedes importarlo.');
                        } else {
                            toast.error('Alimento no encontrado');
                        }
                    }}
                    onFoodImported={() => {
                        refresh();
                        setShowScanner(false);
                        // Optionally open add entry modal immediately
                        // setSelectedFoodForEntry(food);
                        // setShowAddEntryModal(true);
                    }}
                />
            </Modal>

            <Modal
                isOpen={showAddFood}
                onClose={handleCloseModal}
                title={editingFood ? "Editar Alimento" : "Agregar Alimento"}
                size="lg"
            >
                <FoodForm
                    initialData={editingFood ?? undefined}
                    onSuccess={() => {
                        handleCloseModal();
                        toast.success(editingFood ? 'Alimento actualizado' : 'Alimento creado exitosamente');
                        refresh();
                    }}
                    onCancel={handleCloseModal}
                />
            </Modal>

            <Modal
                isOpen={showExternalSearch}
                onClose={() => setShowExternalSearch(false)}
                title="Buscar en OpenFoodFacts"
                size="lg"
            >
                <ExternalFoodSearch
                    onFoodImported={() => {
                        refresh(); // Refresh local list to show imported food
                        // Optionally close modal or keep open for more searches
                        toast.success('Producto importado a tu lista');
                    }}
                />
            </Modal>

            <AddEntryModal
                isOpen={showAddEntryModal}
                food={selectedFoodForEntry}
                onClose={() => { setShowAddEntryModal(false); setSelectedFoodForEntry(null); }}
                onSubmit={async (payload) => {
                    try {
                        await addEntry(payload);
                        toast.success('Entrada agregada');
                    } catch (err) {
                        console.error('Error adding entry', err);
                        toast.error('Error al agregar entrada');
                    }
                }}
            />

            <CopyDayModal
                isOpen={showCopyModal}
                onClose={() => setShowCopyModal(false)}
                sourceDate={dateString}
                onSuccess={() => {
                    // Optional: if target is today, validation might need reload, but usually user copies TO another day.
                }}
            />

            <CopyMealSectionModal
                isOpen={!!copyingSection}
                onClose={() => setCopyingSection(null)}
                source={copyingSection as any}
                onSuccess={() => {
                    // Optional: refresh logic if needed
                }}
            />
        </>
    );
};

export default DashboardPage;
