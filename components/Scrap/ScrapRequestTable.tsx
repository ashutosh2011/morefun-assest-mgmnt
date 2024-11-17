'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { ScrapRequestDetailsModal } from './ScrapRequestDetailsModal';

interface ScrapRequest {
  id: string;
  asset: {
    assetName: string;
    serialNumber: string;
  };
  requestedBy: {
    fullName: string;
    email: string;
  };
  status: string;
  createdAt: string;
  currentApprovalLevel: {
    levelNumber: number;
    role: {
      roleName: string;
    };
  };
}

interface ScrapRequestsResponse {
  scrapRequests: ScrapRequest[];
  total: number;
  page: number;
  totalPages: number;
}

export function ScrapRequestTable() {
  const [requests, setRequests] = useState<ScrapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    pendingApproval: false
  });
  const [selectedRequest, setSelectedRequest] = useState<ScrapRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchScrapRequests = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.pendingApproval && { pendingApproval: 'true' })
      });

      const response = await fetchWithAuth(`/api/scrap-requests?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch scrap requests');
      
      const data: ScrapRequestsResponse = await response.json();
      setRequests(data.scrapRequests);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScrapRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const handleFilterChange = (filterKey: keyof typeof filters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleApprove = async (requestId: string) => {
    const comments = window.prompt('Please enter approval comments:');
    if (comments === null) return; // User clicked Cancel
    
    try {
      const response = await fetchWithAuth(`/api/scrap-requests/${requestId}`, {
        method: 'PUT',
        body: JSON.stringify({
          action: 'APPROVED',
          comments
        })
      });

      if (!response.ok) throw new Error('Failed to approve request');
      
      // Refresh the requests list
      fetchScrapRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    const comments = window.prompt('Please enter rejection reason:');
    if (comments === null) return; // User clicked Cancel
    
    try {
      const response = await fetchWithAuth(`/api/scrap-requests/${requestId}`, {
        method: 'PUT',
        body: JSON.stringify({
          action: 'REJECTED',
          comments
        })
      });

      if (!response.ok) throw new Error('Failed to reject request');
      
      // Refresh the requests list
      fetchScrapRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject request');
    }
  };

  const handleViewDetails = async (requestId: string) => {
    try {
      const response = await fetchWithAuth(`/api/scrap-requests/${requestId}`);
      if (!response.ok) throw new Error('Failed to fetch request details');
      
      const data = await response.json();
      setSelectedRequest(data);
      setIsDetailsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch request details');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex gap-4">
          <select
            className="px-3 py-2 border rounded-md"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.pendingApproval}
              onChange={(e) => handleFilterChange('pendingApproval', e.target.checked)}
              className="rounded"
            />
            Assigned to Me
          </label>
        </div>
      </div>

      {/* Table */}
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Current Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request, index) => (
                <tr key={request.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9F9]'}>
                  <td className="px-6 py-4 text-sm text-[#2C3E50]">{request.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-[#2C3E50]">{request.asset.assetName}</p>
                      <p className="text-gray-500">{request.asset.serialNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#2C3E50]">{request.requestedBy.fullName}</td>
                  <td className="px-6 py-4 text-sm text-[#2C3E50]">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-[#2C3E50]">
                    Level {request.currentApprovalLevel.levelNumber} - {request.currentApprovalLevel.role.roleName}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {request.status === 'PENDING' && (
                      <>
                        <button 
                          className="text-[#18BC9C] hover:text-[#18BC9C]/80 p-1"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          className="text-[#E74C3C] hover:text-[#E74C3C]/80 p-1"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle size={20} />
                        </button>
                      </>
                    )}
                    <button 
                      className="text-gray-500 hover:text-gray-700 p-1"
                      onClick={() => handleViewDetails(request.id)}
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? 'bg-[#2C3E50] text-white'
                : 'bg-white text-[#2C3E50] hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <ScrapRequestDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        scrapRequest={selectedRequest}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[status as keyof typeof statusStyles]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}