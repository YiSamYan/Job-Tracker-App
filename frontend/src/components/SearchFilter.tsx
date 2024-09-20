import React, { useState } from "react";
import "../styles/SearchFilter.css";

interface SearchFilterProps {
  onFilterChange: (filters: string[]) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onFilterChange }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleAddFilter = () => {
    if (searchInput.trim() && !filters.includes(searchInput.trim())) {
      const updatedFilters = [...filters, searchInput.trim()];
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    }
    setSearchInput("");
  };

  const handleRemoveFilter = (filterToRemove: string) => {
    const updatedFilters = filters.filter(
      (filter) => filter !== filterToRemove
    );
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="search-filter">
      <label htmlFor="search">Search: </label>
      <div className="search-container">
        <input
          type="text"
          id="search"
          value={searchInput}
          onChange={handleInputChange}
        />
        <button onClick={handleAddFilter}>Search</button>
      </div>

      <div className="filter-tags">
        {filters.map((filter) => (
          <span
            key={filter}
            className="filter-tag"
            onClick={() => handleRemoveFilter(filter)}
          >
            {filter} &#x2715;
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
