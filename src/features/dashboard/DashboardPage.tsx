import { useState } from 'react';
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

const DashboardPage = () => {
    const [showScanner, setShowScanner] = useState(false);
    const [showAddFood, setShowAddFood] = useState(false);
    const [showExternalSearch, setShowExternalSearch] = useState(false);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
    const [showAddEntryModal, setShowAddEntryModal] = useState(false);
    const [selectedFoodForEntry, setSelectedFoodForEntry] = useState<Food | null>(null);
    const { dailyLog, addEntry, updateEntry, deleteEntry, loading: dailyLogLoading, error: dailyLogError } = useDailyLog();
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
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: 'var(--spacing-xl)',
                    alignItems: 'start'
                }}>
                    <div style={{ minWidth: 0 }}>
                        <Dashboard
                            dailyLog={dailyLog}
                            loading={dailyLogLoading}
                            error={dailyLogError}
                            updateEntry={updateEntry}
                            deleteEntry={deleteEntry}
                            onOpenFoods={() => {
                                // Scroll to food list on mobile or focus search
                                document.querySelector('.food-list-section')?.scrollIntoView({ behavior: 'smooth' });
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
                </div>
            </Layout>

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
        </>
    );
};

export default DashboardPage;
