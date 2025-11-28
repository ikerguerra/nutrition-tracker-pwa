import React, { useState } from 'react';
import { Input } from '@components/ui/Input';
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
    const debouncedQuery = useDebounce(query, 500);

    React.useEffect(() => {
        if (debouncedQuery) {
            onSearch(debouncedQuery);
        }
    }, [debouncedQuery, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className="search-bar">
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                icon={
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
                }
            />
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
