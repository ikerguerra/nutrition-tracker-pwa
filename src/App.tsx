import React, { useState } from 'react';
import type { Food } from '@types/food';
import { Layout } from '@components/layout/Layout';
import { FoodList } from '@features/foods/FoodList';
import { SearchBar } from '@features/foods/SearchBar';
import { BarcodeScanner } from '@features/barcode/BarcodeScanner';
import { FoodForm } from '@features/foods/FoodForm';
import { Modal } from '@components/ui/Modal';
import { Toaster, toast } from 'react-hot-toast';
import { useFoods } from '@hooks/useFoods';
import '@styles/global.css';

function App() {
    const [showScanner, setShowScanner] = useState(false);
    const [showAddFood, setShowAddFood] = useState(false);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                    <SearchBar onSearch={handleSearch} />
                    <FoodList onEdit={handleEdit} onDelete={handleDelete} />
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
                        setShowScanner(false);
                        if (data.foundInDatabase) {
                            toast.success('Alimento encontrado en base de datos');
                        } else if (data.source === 'openfoodfacts') {
                            toast.success('Alimento encontrado en OpenFoodFacts');
                        } else {
                            toast.error('Alimento no encontrado');
                        }
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
                    initialData={editingFood}
                    onSuccess={() => {
                        handleCloseModal();
                        toast.success(editingFood ? 'Alimento actualizado' : 'Alimento creado exitosamente');
                        refresh();
                    }}
                    onCancel={handleCloseModal}
                />
            </Modal>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--color-bg-elevated)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                    },
                    success: {
                        iconTheme: {
                            primary: 'var(--color-success)',
                            secondary: 'var(--color-bg-elevated)',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: 'var(--color-error)',
                            secondary: 'var(--color-bg-elevated)',
                        },
                    },
                }}
            />
        </>
    );
}

export default App;
