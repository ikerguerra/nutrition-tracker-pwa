import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { useBarcodeSearch } from '@hooks/useBarcodeSearch';
import { externalFoodService } from '@services/externalFoodService';
import { toast } from 'react-hot-toast';
import './BarcodeScanner.css';

interface BarcodeScannerProps {
    onFoodFound?: (food: any) => void;
    onFoodImported?: (food: any) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onFoodFound, onFoodImported }) => {
    const [barcode, setBarcode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const { result, loading, error, searchByBarcode, reset } = useBarcodeSearch();

    useEffect(() => {
        return () => {
            if (scannerRef.current && isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, [isScanning]);

    const startScanning = async () => {
        setCameraError(null);
        setIsScanning(true);
        reset();

        try {
            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length) {
                // Use back camera if available
                if (!scannerRef.current) {
                    scannerRef.current = new Html5Qrcode("reader", {
                        verbose: false,
                        formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8, Html5QrcodeSupportedFormats.UPC_A, Html5QrcodeSupportedFormats.UPC_E]
                    });
                }

                await scannerRef.current.start(
                    { facingMode: "environment" }, // Prefer back camera
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    (decodedText) => {
                        // Success callback
                        handleScanSuccess(decodedText);
                    },
                    () => {
                        // Error callback (ignore for scanning in progress)
                    }
                );
            } else {
                setCameraError("No se detectaron cámaras.");
                setIsScanning(false);
            }
        } catch (err) {
            console.error("Error starting scanner", err);
            setCameraError("Error al acceder a la cámara. Verifica los permisos.");
            setIsScanning(false);
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                setIsScanning(false);
            } catch (err) {
                console.error("Error stopping scanner", err);
            }
        }
    };

    const handleScanSuccess = async (decodedText: string) => {
        await stopScanning();
        setBarcode(decodedText);
        handleSearch(decodedText);
    };

    const handleSearch = async (code: string | React.FormEvent) => {
        if (typeof code !== 'string') {
            code.preventDefault();
            code = barcode;
        }

        if (!code || typeof code !== 'string' || !code.trim()) return;

        try {
            const data = await searchByBarcode(code);
            onFoodFound?.(data);
        } catch (err) {
            console.error('Error searching barcode:', err);
        }
    };

    const handleImport = async () => {
        if (!result?.food?.barcode) return;

        setImporting(true);
        try {
            const importedFood = await externalFoodService.importProduct(result.food.barcode);
            toast.success('Producto importado correctamente');
            onFoodImported?.(importedFood);
            // Optionally reset or update UI to show it's now local
            // For now, we rely on parent to maybe close modal or refresh
        } catch (err) {
            console.error('Error importing product:', err);
            toast.error('Error al importar el producto');
        } finally {
            setImporting(false);
        }
    };

    const handleClear = () => {
        setBarcode('');
        reset();
        setCameraError(null);
    };

    return (
        <Card className="barcode-scanner">
            <h2 className="scanner-title">Buscar por Código de Barras</h2>

            <div className="scanner-controls">
                {!isScanning ? (
                    <Button onClick={startScanning} variant="secondary" className="scan-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                        Escanear con Cámara
                    </Button>
                ) : (
                    <Button onClick={stopScanning} variant="danger" className="scan-btn">
                        Detener Escaneo
                    </Button>
                )}
            </div>

            {isScanning && (
                <div id="reader" className="scanner-viewport"></div>
            )}

            {cameraError && (
                <div className="scanner-error-msg">
                    {cameraError}
                </div>
            )}

            <div className="scanner-divider">
                <span>o ingresa el código manual</span>
            </div>

            <form onSubmit={(e) => handleSearch(e)} className="scanner-form">
                <div className="relative">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <line x1="7" y1="9" x2="7" y2="15" />
                            <line x1="11" y1="9" x2="11" y2="15" />
                            <line x1="15" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <Input
                        type="text"
                        placeholder="Ingresa el código de barras"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        disabled={loading || isScanning}
                        className="pl-9"
                    />
                </div>

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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                                <Button
                                    variant="primary"
                                    className="save-button"
                                    onClick={handleImport}
                                    loading={importing}
                                    disabled={importing}
                                >
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
