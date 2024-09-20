import React from "react";
import "../styles/SortDropDate.css";

interface SortDropDateProps {
  onSortChange: (sortOption: string) => void;
  currentSortOption: string;
}

const SortDropDate: React.FC<SortDropDateProps> = ({
  onSortChange,
  currentSortOption,
}) => {
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value);
  };

  return (
    <div className="sort-dropdate">
      <label htmlFor="sort">Sort by: </label>
      <select
        id="sortdate"
        value={currentSortOption}
        onChange={handleSortChange}
      >
        <option value="most-recently-created">Most Recently Created</option>
        <option value="least-recently-created">Least Recently Created</option>
        <option value="most-recently-updated">Most Recently Updated</option>
        <option value="least-recently-updated">Least Recently Updated</option>
      </select>
    </div>
  );
};

export default SortDropDate;
