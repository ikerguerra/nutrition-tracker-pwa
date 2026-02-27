import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Food } from '../../types/food';
import { Layout } from '@components/layout/Layout';
import { FoodList } from '@features/foods/FoodList';
import { SearchBar } from '@features/foods/SearchBar';
import { BarcodeScanner } from '@features/barcode/BarcodeScanner';
import { FoodForm } from '@features/foods/FoodForm';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog';
import { toast } from 'react-hot-toast';
import { Dashboard } from '@features/dailyLog/Dashboard';
import AddEntryModal from '@features/dailyLog/AddEntryModal';
import useDailyLog from '@hooks/useDailyLog';
import { useFoods } from '@hooks/useFoods';
import { ExternalFoodSearch } from '@features/external/ExternalFoodSearch';
import { Button } from '@components/ui/button';
import { DateCarousel } from '@components/ui/DateCarousel';
import { WeightWidget } from './WeightWidget';
import { NutritionCharts } from '@features/stats/NutritionCharts';
import { CopyDayModal } from './CopyDayModal';
import { CopyMealSectionModal } from './CopyEntryModal';
import { DietPlan, RecommendationItem } from '../../types/recommendation';
import recommendationService from '@services/recommendationService';
import { Search } from 'lucide-react';

const DashboardPage = () => {
    const { t } = useTranslation();
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
    const [showFoodSearchModal, setShowFoodSearchModal] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

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
            toast.success(t('dashboard.planGenerated'));
        } catch (error) {
            console.error('Error generating plan', error);
            toast.error(t('dashboard.planError'));
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
            toast.success(`Añadido: ${item.foodName}`); // Keep content dynamic

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
            toast.error(t('dashboard.entryError'));
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
        toast(t('dashboard.recommendationDismissed'), { icon: '👋' });
    };

    const handleAcceptAll = async () => {
        if (!recommendations?.id) return;
        try {
            await recommendationService.acceptPlan(recommendations.id);
            toast.success('¡Todo el plan aceptado!');
            await Promise.all([
                recommendationService.getDailyPlan(dateString),
                dailyLog?.meals ? Promise.resolve(null) : Promise.resolve(null) // hack: actually use refresh from useDailyLog
            ]);
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
            toast.success(`¡${mealType} aceptado!`); // Could translate
            window.location.reload();
        } catch (error) {
            console.error(`Error accepting ${mealType}`, error);
            toast.error('Error al aceptar comida');
        }
    };

    const { dailyLog, addEntry, updateEntry, deleteEntry, updateWeight, loading: dailyLogLoading, error: dailyLogError } = useDailyLog(dateString);
    const { searchFoods, refresh, deleteFood, foods } = useFoods();

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
        if (window.confirm(t('dashboard.deleteFoodConfirm'))) {
            try {
                await deleteFood(id);
                toast.success(t('dashboard.foodDeleted'));
            } catch (error) {
                console.error('Error deleting food:', error);
                toast.error('Error al eliminar el alimento');
            }
        }
    };

    const handleOpenChangeCharts = (open: boolean) => {
        if (!open) setShowCharts(false);
    };

    const handleOpenChangeScanner = (open: boolean) => {
        if (!open) setShowScanner(false);
    };

    const handleOpenChangeFood = (open: boolean) => {
        if (!open) handleCloseModal();
    };

    const handleOpenChangeExternal = (open: boolean) => {
        if (!open) setShowExternalSearch(false);
    };

    return (
        <>
            <Layout
                onAddFood={() => setShowAddFood(true)}
                onScanBarcode={() => setShowScanner(true)}
            >
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <DateCarousel
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        onCopy={() => setShowCopyModal(true)}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
                        <Dashboard
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
                            onAddEntry={(mealType) => {
                                setSelectedMealType(mealType);
                                setShowFoodSearchModal(true);
                            }}
                            // Removing onOpenFoods from here as it's not needed directly inside the daily log anymore
                            onCopySection={(mealType) => {
                                const titleMap: Record<string, string> = {
                                    'BREAKFAST': t('dashboard.meals.BREAKFAST'),
                                    'LUNCH': t('dashboard.meals.LUNCH'),
                                    'SNACK': t('dashboard.meals.SNACK'),
                                    'DINNER': t('dashboard.meals.DINNER')
                                };
                                setCopyingSection({
                                    date: dateString,
                                    mealType,
                                    title: titleMap[mealType] || mealType
                                });
                            }}
                        />
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6 sticky top-6">
                        <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
                            <h3 className="text-lg font-semibold mb-4 text-center">{t('dashboard.addFoodTitle', '¿Qué has comido hoy?')}</h3>
                            <Button
                                className="w-full h-12 text-base rounded-full shadow-md"
                                onClick={() => setShowFoodSearchModal(true)}
                            >
                                <Search className="w-5 h-5 mr-3" />
                                {t('dashboard.searchFoodBtn', 'Buscar alimento...')}
                            </Button>
                        </div>

                        <WeightWidget dailyLog={dailyLog} onUpdateWeight={updateWeight} />

                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => setShowCharts(true)}
                        >
                            📊 {t('dashboard.viewStats')}
                        </Button>
                    </div>
                </div>
            </Layout >

            <Dialog open={showFoodSearchModal} onOpenChange={setShowFoodSearchModal}>
                <DialogContent className="sm:max-w-2xl h-[85vh] flex flex-col p-6">
                    <DialogHeader className="mb-2">
                        <DialogTitle className="text-2xl">{t('dashboard.addFood')}</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <SearchBar onSearch={handleSearch} />
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setShowFoodSearchModal(false);
                                    setShowExternalSearch(true);
                                }}
                                title={t('dashboard.searchOff')}
                            >
                                🌐
                            </Button>
                        </div>

                        <div className="flex-1 overflow-auto rounded-md border border-border min-h-0">
                            <FoodList onEdit={handleEdit} onDelete={handleDelete} onAddToDailyLog={(food) => {
                                setSelectedFoodForEntry(food);
                                // Don't close search modal here to allow cumulative adding
                                setShowAddEntryModal(true);
                            }} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showCharts} onOpenChange={handleOpenChangeCharts}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{t('dashboard.statsTitle', { date: new Date(selectedDate).toLocaleDateString() })}</DialogTitle>
                    </DialogHeader>
                    <NutritionCharts dailyLog={dailyLog} />
                </DialogContent>
            </Dialog>

            <Dialog open={showScanner} onOpenChange={handleOpenChangeScanner}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('dashboard.barcodeSearch')}</DialogTitle>
                    </DialogHeader>
                    <BarcodeScanner
                        onFoodFound={(data) => {
                            console.log('Food found:', data);
                            if (data.foundInDatabase) {
                                toast.success(t('dashboard.foodFoundDb'));
                                // Optionally close modal and select food
                                // setShowScanner(false);
                                // setSelectedFoodForEntry(data.food);
                                // setShowAddEntryModal(true);
                            } else if (data.source === 'openfoodfacts') {
                                toast.success(t('dashboard.foodFoundOff'));
                            } else {
                                toast.error(t('dashboard.foodNotFound'));
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
                </DialogContent>
            </Dialog>

            <Dialog open={showAddFood} onOpenChange={handleOpenChangeFood}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingFood ? t('dashboard.editFood') : t('dashboard.addFood')}</DialogTitle>
                    </DialogHeader>
                    <FoodForm
                        initialData={editingFood ?? undefined}
                        onSuccess={() => {
                            handleCloseModal();
                            toast.success(editingFood ? 'Alimento actualizado' : 'Alimento creado exitosamente');
                            refresh();
                        }}
                        onCancel={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={showExternalSearch} onOpenChange={handleOpenChangeExternal}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{t('dashboard.searchOff')}</DialogTitle>
                    </DialogHeader>
                    <ExternalFoodSearch
                        onFoodImported={() => {
                            refresh(); // Refresh local list to show imported food
                            // Optionally close modal or keep open for more searches
                            toast.success(t('dashboard.foodImported'));
                        }}
                    />
                </DialogContent>
            </Dialog>

            <AddEntryModal
                isOpen={showAddEntryModal}
                food={selectedFoodForEntry}
                date={dateString}
                initialMealType={selectedMealType as any}
                onClose={() => { setShowAddEntryModal(false); setSelectedFoodForEntry(null); }}
                onSubmit={async (payload) => {
                    try {
                        await addEntry(payload);
                        toast.success(t('dashboard.entryAdded'));
                        // No need to close search modal, it stays open for next food
                    } catch (err) {
                        console.error('Error adding entry', err);
                        toast.error(t('dashboard.entryError'));
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
