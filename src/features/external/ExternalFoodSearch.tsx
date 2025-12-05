import React, { useState, useEffect } from 'react';
import { ExternalFood } from '../../types/externalFood';
import { externalFoodService } from '../../services/externalFoodService';
import { ExternalFoodCard } from './ExternalFoodCard';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { toast } from 'react-hot-toast';
import './ExternalFoodSearch.css';

interface ExternalFoodSearchProps {
    onFoodImported: () => void;
}

export const ExternalFoodSearch: React.FC<ExternalFoodSearchProps> = ({ onFoodImported }) => {
    const [query, setQuery] = useState('');
    const [foods, setFoods] = useState<ExternalFood[]>([]);
    const [loading, setLoading] = useState(false);
    const [importingId, setImportingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                handleSearch(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = async (pageNum: number) => {
        if (!query) return;

        setLoading(true);
        try {
            const results = await externalFoodService.search(query, pageNum);
            if (pageNum === 1) {
                setFoods(results);
            } else {
                setFoods(prev => [...prev, ...results]);
            }
            setHasMore(results.length === 20); // Assuming page size is 20
            setPage(pageNum);
        } catch (error) {
            console.error('Error searching foods:', error);
            toast.error('Error searching OpenFoodFacts');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (barcode: string) => {
        setImportingId(barcode);
        try {
            await externalFoodService.importProduct(barcode);
            toast.success('Product imported successfully');
            onFoodImported();
        } catch (error) {
            console.error('Error importing product:', error);
            toast.error('Failed to import product');
        } finally {
            setImportingId(null);
        }
    };

    return (
        <div className="external-food-search">
            <div className="search-header">
                <Input
                    placeholder="Search OpenFoodFacts (e.g. Coca Cola, Oreo)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                    autoFocus
                />
            </div>

            <div className="search-results">
                {foods.length === 0 && !loading && query.length >= 2 && (
                    <div className="no-results">No products found</div>
                )}

                {foods.map((food) => (
                    <ExternalFoodCard
                        key={food.barcode}
                        food={food}
                        onImport={handleImport}
                        importing={importingId === food.barcode}
                    />
                ))}

                {loading && <div className="loading-indicator">Searching...</div>}

                {hasMore && foods.length > 0 && !loading && (
                    <Button
                        variant="secondary"
                        onClick={() => handleSearch(page + 1)}
                        className="load-more-btn"
                    >
                        Load More
                    </Button>
                )}
            </div>

            <div className="attribution">
                Data provided by <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener noreferrer">OpenFoodFacts</a>
            </div>
        </div>
    );
};
