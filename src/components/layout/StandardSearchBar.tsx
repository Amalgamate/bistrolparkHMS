import React, { useState } from 'react';
import { Search, Filter, X, PlusCircle, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface FilterOption {
  id: string;
  label: string;
  options?: { value: string; label: string }[];
  type?: 'select' | 'date-range';
}

interface StandardSearchBarProps {
  title?: string;
  description?: string;
  badges?: Array<{
    text: string;
    color: string;
  }>;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
  onFilter?: (filters: Record<string, any>) => void;
  filterOptions?: FilterOption[];
  showFilterButton?: boolean;
  showAddButton?: boolean;
  showExportButton?: boolean;
  onAdd?: () => void;
  onExport?: () => void;
  className?: string;
  additionalControls?: React.ReactNode;
}

export const StandardSearchBar: React.FC<StandardSearchBarProps> = ({
  title,
  description,
  badges = [],
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  onClear,
  onFilter,
  filterOptions = [],
  showFilterButton = true,
  showAddButton = false,
  showExportButton = false,
  onAdd,
  onExport,
  className,
  additionalControls
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (filterId: string, value: string) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterId]: value
    });
  };

  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleApplyFilters = () => {
    if (onFilter) {
      const filters = {
        ...selectedFilters,
        dateRange: startDate || endDate ? { start: startDate, end: endDate } : undefined
      };
      onFilter(filters);
    }
    setShowFilters(false);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Header with title and description */}
      {(title || description) && (
        <div className="bg-white p-4 rounded-t-md shadow-sm border-b">
          <div className="flex justify-between items-center">
            <div>
              {title && <h2 className="text-xl font-semibold text-[#2B4F60]">{title}</h2>}
              {description && <p className="text-sm text-muted">{description}</p>}
              {badges.length > 0 && (
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  {badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`bg-${badge.color}-100 text-${badge.color}-800 px-2 py-0.5 rounded ${index > 0 ? 'ml-2' : ''}`}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search bar and controls */}
      <div className={cn(
        "flex items-center gap-2 p-4 bg-white",
        (title || description) ? "rounded-b-md" : "rounded-md",
        "shadow-sm"
      )}>
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={handleKeyDown}
          />
          {value && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={handleClear}
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>

      {showFilterButton && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFilters}
          className={showFilters ? "bg-blue-50 text-blue-600" : ""}
        >
          <Filter className="h-5 w-5" />
        </Button>
      )}

      {showAddButton && onAdd && (
        <Button
          onClick={onAdd}
          className="bg-[#0100F6] hover:bg-blue-700 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      )}

      {showExportButton && onExport && (
        <Button
          variant="outline"
          onClick={onExport}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
          <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      )}

      {additionalControls}
      </div>

      {/* Filter Dropdown */}
      {showFilters && filterOptions.length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          {filterOptions.map(filter => (
            <div key={filter.id} className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-700 mb-2">{filter.label}</h3>

              {filter.type === 'date-range' ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>
                  <button
                    onClick={handleClearDates}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear Dates
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {filter.options?.map(option => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`${filter.id}-${option.value}`}
                        name={filter.id}
                        value={option.value}
                        checked={selectedFilters[filter.id] === option.value}
                        onChange={() => handleFilterChange(filter.id, option.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`${filter.id}-${option.value}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="p-3 bg-gray-50 flex justify-end">
            <Button
              onClick={handleApplyFilters}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandardSearchBar;
