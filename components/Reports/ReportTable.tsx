import React from 'react';

const mockData = [
  { id: 1, assetType: 'Laptop', total: 45, active: 42, maintenance: 2, scrapped: 1 },
  { id: 2, assetType: 'Desktop', total: 30, active: 28, maintenance: 1, scrapped: 1 },
  { id: 3, assetType: 'Mobile', total: 25, active: 23, maintenance: 1, scrapped: 1 },
];

export function ReportTable() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#2C3E50] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Asset Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Active</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Maintenance</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Scrapped</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockData.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9F9]'}>
                <td className="px-6 py-4 text-sm font-medium text-[#2C3E50]">{row.assetType}</td>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">{row.total}</td>
                <td className="px-6 py-4 text-sm text-green-600">{row.active}</td>
                <td className="px-6 py-4 text-sm text-yellow-600">{row.maintenance}</td>
                <td className="px-6 py-4 text-sm text-red-600">{row.scrapped}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}