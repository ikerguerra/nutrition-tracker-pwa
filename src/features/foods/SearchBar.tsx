import React, { useState } from 'react';
import { Input } from '@components/ui/input';
import { useDebounce } from '@hooks/useDebounce';
import { Search, X } from 'lucide-react';

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
        <div className="relative w-full group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary pointer-events-none">
                <Search className="h-5 w-5" />
            </div>
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10 h-11 rounded-full border-muted-foreground/20 bg-background shadow-sm hover:border-primary/50 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
            />
            {query && (
                <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                    onClick={handleClear}
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};
