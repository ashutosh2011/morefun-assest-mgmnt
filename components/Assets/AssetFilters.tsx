import React from 'react';
import { Search, Filter } from 'lucide-react';

export function AssetFilters() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search assets..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <div className="flex gap-4">
          <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]">
            <option value="">All Types</option>
            <option value="laptop">Laptop</option>
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
            <option value="other">Other</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#2C3E50]/90">
            <Filter size={20} />
            <span className="hidden md:inline">More Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}