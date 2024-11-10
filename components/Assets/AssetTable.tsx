import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: string;
  status: string;
  assignedUser: string;
  lastUpdated: string;
}

const mockAssets: Asset[] = [
  {
    id: "AST001",
    name: "MacBook Pro 16\"",
    type: "Laptop",
    status: "Active",
    assignedUser: "John Doe",
    lastUpdated: "2024-03-10"
  },
  {
    id: "AST002",
    name: "Dell XPS Desktop",
    type: "Desktop",
    status: "Maintenance",
    assignedUser: "Jane Smith",
    lastUpdated: "2024-03-09"
  },
  // Add more mock data as needed
];

export function AssetTable() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#2C3E50] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Asset ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Assigned To</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Last Updated</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockAssets.map((asset, index) => (
              <tr key={asset.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9F9]'}>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">{asset.id}</td>
                <td className="px-6 py-4 text-sm text-[#2C3E50] font-medium">{asset.name}</td>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">{asset.type}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    asset.status === 'Active' ? 'bg-green-100 text-green-800' :
                    asset.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">{asset.assignedUser}</td>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">{asset.lastUpdated}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-[#18BC9C] hover:text-[#18BC9C]/80">
                    <Pencil size={18} />
                  </button>
                  <button className="text-[#E74C3C] hover:text-[#E74C3C]/80">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}