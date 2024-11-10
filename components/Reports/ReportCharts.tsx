import React from 'react';

export function ReportCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Asset Distribution</h3>
        <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Pie Chart Placeholder</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Monthly Trends</h3>
        <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Bar Chart Placeholder</p>
        </div>
      </div>
    </div>
  );
}