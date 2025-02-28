import React from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search stocks..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      className="mb-4 w-full p-2 border rounded"
    />
  );
};

export default SearchBar;
