import React, { useState, useRef, useEffect } from "react";
import SearchInput from "./SearchInput";

interface TableSearchProps<T> {
  data: T[];
  onFilteredDataChange: (filteredData: T[]) => void;
  searchFields: (keyof T)[];
  placeholder?: string;
  debounceDelay?: number;
  additionalFilters?: React.ReactNode;
  onSearch?: (searchTerm: string) => Promise<T[]> | T[];
}

function TableSearch<T extends Record<string, any>>({
  data,
  onFilteredDataChange,
  searchFields,
  placeholder = "Tìm kiếm...",
  debounceDelay = 300,
  additionalFilters,
  onSearch
}: TableSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(async () => {
      await performSearch(searchTerm);
    }, debounceDelay);

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, data]);

  const performSearch = async (term: string) => {
    setIsLoading(true);
    try {
      let filteredData: T[];

      if (onSearch) {
        // Use custom search function if provided
        filteredData = await onSearch(term);
      } else {
        // Default client-side filtering
        if (!term.trim()) {
          filteredData = data;
        } else {
          filteredData = data.filter((item) =>
            searchFields.some((field) => {
              const value = item[field];
              if (value == null) return false;
              return String(value)
                .toLowerCase()
                .includes(term.toLowerCase());
            })
          );
        }
      }

      onFilteredDataChange(filteredData);
    } catch (error) {
      console.error("Error during search:", error);
      onFilteredDataChange([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch(searchTerm);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    onFilteredDataChange(data);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <SearchInput
          inputRef={inputRef}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
        {searchTerm && !isLoading && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 7.293l2.146-2.147a.5.5 0 01.708.708L8.707 8l2.147 2.146a.5.5 0 01-.708.708L8 8.707l-2.146 2.147a.5.5 0 01-.708-.708L7.293 8 5.146 5.854a.5.5 0 01.708-.708L8 7.293z"/>
            </svg>
          </button>
        )}
      </div>
      
      {additionalFilters}

      <button
        onClick={() => performSearch(searchTerm)}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M10.442 10.442a1 1 0 011.415 0l3.85 3.85a1 1 0 01-1.414 1.415l-3.85-3.85a1 1 0 010-1.415z"/>
          <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 6.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"/>
        </svg>
        {isLoading ? "Đang tìm..." : "Tìm kiếm"}
      </button>
    </div>
  );
}

export default TableSearch;
