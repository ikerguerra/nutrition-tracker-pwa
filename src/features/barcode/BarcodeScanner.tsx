import React, { useState } from 'react';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { useBarcodeSearch } from '@hooks/useBarcodeSearch';
import './BarcodeScanner.css';

interface BarcodeScannerProps {
    onFoodFound?: (food: any) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onFoodFound }) => {
    const [barcode, setBarcode] = useState('');
    const { result, loading, error, searchByBarcode, reset } = useBarcodeSearch();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcode.trim()) return;

        try {
            const data = await searchByBarcode(barcode);
            onFoodFound?.(data);
        } catch (err) {
            console.error('Error searching barcode:', err);
        }
    };

    const handleClear = () => {
        setBarcode('');
        reset();
    };

    return (
        <Card className="barcode-scanner">
            <h2 className="scanner-title">Buscar por Código de Barras</h2>

            <form onSubmit={handleSearch} className="scanner-form">
                <Input
                    type="text"
                    placeholder="Ingresa el código de barras"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    disabled={loading}
                    icon={
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <line x1="7" y1="9" x2="7" y2="15" />
                            <line x1="11" y1="9" x2="11" y2="15" />
                            <line x1="15" y1="9" x2="15" y2="15" />
                        </svg>
                    }
                />

                <div className="scanner-actions">
                    <Button type="submit" disabled={loading || !barcode.trim()} loading={loading}>
                        Buscar
                    </Button>
                    {result && (
                        <Button type="button" variant="secondary" onClick={handleClear}>
                            Limpiar
                        </Button>
                    )}
                </div>
            </form>

            {error && (
                <div className="scanner-error">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="scanner-result">
                    <div className={`result-badge ${result.foundInDatabase ? 'badge-success' : 'badge-info'}`}>
                        {result.foundInDatabase ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Encontrado en base de datos local
                            </>
                        ) : result.source === 'openfoodfacts' ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                Encontrado en Open Food Facts
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                No encontrado
                            </>
                        )}
                    </div>

                    {result.food && (
                        <div className="result-food">
                            <h3>{result.food.name}</h3>
                            {result.food.brand && <p className="result-brand">{result.food.brand}</p>}

                            <div className="result-nutrition">
                                <div className="nutrition-item">
                                    <span>Calorías</span>
                                    <strong>{result.food.nutritionalInfo?.calories || 0} kcal</strong>
                                </div>
                                <div className="nutrition-item">
                                    <span>Proteínas</span>
                                    <strong>{result.food.nutritionalInfo?.protein || 0}g</strong>
                                </div>
                                <div className="nutrition-item">
                                    <span>Carbohidratos</span>
                                    <strong>{result.food.nutritionalInfo?.carbohydrates || 0}g</strong>
                                </div>
                                <div className="nutrition-item">
                                    <span>Grasas</span>
                                    <strong>{result.food.nutritionalInfo?.fats || 0}g</strong>
                                </div>
                            </div>

                            {result.source === 'openfoodfacts' && (
                                <Button variant="primary" className="save-button">
                                    Guardar en mi base de datos
                                </Button>
                            )}
                        </div>
                    )}

                    {result.message && !result.food && (
                        <p className="result-message">{result.message}</p>
                    )}
                </div>
            )}
        </Card>
    );
};
