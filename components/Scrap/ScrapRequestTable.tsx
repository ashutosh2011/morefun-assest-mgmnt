import React from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

interface ScrapRequest {
  id: string;
  assetId: string;
  assetName: string;
  requester: string;
  submitDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockRequests: ScrapRequest[] = [
  {
    id: "SCR001",
    assetId: "AST001",
    assetName: "MacBook Pro 16\"",
    requester: "John Doe",
    submitDate: "2024-03-10",
    reason: "Device is outdated and repair costs exceed value",
    status: 'pending'
  },
  {
    id: "SCR002",
    assetId: "AST002",
    assetName: "Dell XPS Desktop",
    requester: "Jane Smith",
    submitDate: "2024-03-09",
    reason: "Hardware failure, beyond repair",
    status: 'pending'
  }
];

export function ScrapRequestTable() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#2C3E50] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Request ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Asset</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Requester</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Submit Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockRequests.map((request, index) => (
              <tr key={request.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9F9]'}>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">{request.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="font-medium text-[#2C3E50]">{request.assetName}</p>
                    <p className="text-gray-500">{request.assetId}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">{request.requester}</td>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">{request.submitDate}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-[#18BC9C] hover:text-[#18BC9C]/80 p-1">
                    <CheckCircle size={20} />
                  </button>
                  <button className="text-[#E74C3C] hover:text-[#E74C3C]/80 p-1">
                    <XCircle size={20} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 p-1">
                    <Eye size={20} />
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