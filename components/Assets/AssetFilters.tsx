import React from 'react';
import { Search } from 'lucide-react';

type FilterKeys = 'status' | 'departmentId' | 'search';

interface Filters {
  status: string;
  departmentId: string;
  search: string;
}

interface AssetFiltersProps {
  filters: Filters;
  onFilterChange: (key: FilterKeys, value: string) => void;
}

export function AssetFilters({ 
  filters = { status: '', departmentId: '', search: '' }, 
  onFilterChange 
}: AssetFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search assets..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <div className="flex gap-4">
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
          >
            <option value="">All Status</option>
            <option value="IN_USE">In Use</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="SCRAPPED">Scrapped</option>
          </select>
          <select
            value={filters.departmentId || ''}
            onChange={(e) => onFilterChange('departmentId', e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
          >
            <option value="">All Departments</option>
            {/* We can add department options here later */}
          </select>
        </div>
      </div>
    </div>
  );
}