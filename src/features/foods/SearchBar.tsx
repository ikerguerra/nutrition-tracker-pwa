import React, { useState } from 'react';
import { Input } from '@components/ui/input';
import { useDebounce } from '@hooks/useDebounce';
import './SearchBar.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = 'Buscar alimentos por nombre o marca...',
}) => {
    const [query, setQuery] = useState('');
    const lastSearch = React.useRef(query);
    const debouncedQuery = useDebounce(query, 500);

    React.useEffect(() => {
        // Only search if query is not empty and has changed or if onSearch reference changed (unlikely with fix) used defensively
        if (debouncedQuery && debouncedQuery !== lastSearch.current) {
            onSearch(debouncedQuery);
            lastSearch.current = debouncedQuery;
        } else if (debouncedQuery && lastSearch.current === debouncedQuery) {
            // This path means onSearch changed but query didn't. 
            // In a loop scenario, we want to AVOID calling onSearch again.
            // So we do nothing.
        }
    }, [debouncedQuery, onSearch]);

    const handleClear = () => {
        setQuery('');
        lastSearch.current = '';
        onSearch('');
    };

    return (
        <div className="search-bar">
            <div className="relative w-full">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </div>
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9"
                />
            </div>
            {query && (
                <button className="search-clear" onClick={handleClear} aria-label="Clear search">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </div>
    );
};
