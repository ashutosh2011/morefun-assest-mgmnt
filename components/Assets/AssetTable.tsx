import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { AssetDetailsModal } from './AssetDetailsModal';

interface Asset {
  id: string;
  assetName: string;
  assetType: {
    assetTypeName: string;
  };
  assetUsageStatus: string;
  user: {
    fullName: string;
  };
  updatedAt: string;
}

interface AssetResponse {
  assets: Asset[];
  total: number;
  page: number;
  totalPages: number;
}

export function AssetTable() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetchWithAuth('/api/assets');
        if (!response.ok) {
          throw new Error('Failed to fetch assets');
        }
        const data: AssetResponse = await response.json();
        setAssets(data.assets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const handleViewAsset = async (assetId: string) => {
    try {
      const response = await fetchWithAuth(`/api/assets/${assetId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch asset details');
      }
      const assetData = await response.json();
      setSelectedAsset(assetData);
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

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
            {assets.map((asset, index) => (
              <tr key={asset.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9F9]'}>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">{asset.id}</td>
                <td className="px-6 py-4 text-sm text-[#2C3E50] font-medium">{asset.assetName}</td>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">{asset.assetType.assetTypeName}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    asset.assetUsageStatus === 'IN_USE' ? 'bg-green-100 text-green-800' :
                    asset.assetUsageStatus === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {asset.assetUsageStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">{asset.user?.fullName || 'Unassigned'}</td>
                <td className="px-6 py-4 text-sm text-[#2C3E50]">
                  {new Date(asset.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  {/* <button className="text-[#18BC9C] hover:text-[#18BC9C]/80">
                    <Pencil size={18} />
                  </button> */}
                  <button 
                    onClick={() => handleViewAsset(asset.id)}
                    className="text-[#E74C3C] hover:text-[#E74C3C]/80"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AssetDetailsModal
        asset={selectedAsset}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}