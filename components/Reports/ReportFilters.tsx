import React from 'react';
import { Calendar, Download } from 'lucide-react';

export function ReportFilters() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Report Type
          </label>
          <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]">
            <option value="asset-summary">Asset Summary</option>
            <option value="scrap-history">Scrap History</option>
            <option value="maintenance">Maintenance History</option>
            <option value="user-assets">User Assets</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Date Range
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
            />
            <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Asset Type
          </label>
          <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]">
            <option value="">All Types</option>
            <option value="laptop">Laptops</option>
            <option value="desktop">Desktops</option>
            <option value="mobile">Mobile Devices</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button className="flex-1 bg-[#18BC9C] text-white px-4 py-2 rounded-lg hover:bg-[#18BC9C]/90">
            Generate Report
          </button>
          <button className="bg-[#2C3E50] text-white p-2 rounded-lg hover:bg-[#2C3E50]/90">
            <Download size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}