import React, { useEffect, useState } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { AssetDetailsModal } from './AssetDetailsModal';
import { ManagementTable } from '../Admin/ManagementTable';
import { toast } from 'sonner';

// Define the Filters type
interface Filters {
  status: string;
  departmentId: string;
  search: string;
}

interface Asset {
  id: string;
  assetName: string;
  customAssetId: string;
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
  const [filters, setFilters] = useState<Filters>({
    status: '',
    departmentId: '',
    search: ''
  });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          ...(filters.status && { status: filters.status }),
          ...(filters.departmentId && { departmentId: filters.departmentId }),
          ...(filters.search && { search: filters.search })
        });

        const response = await fetchWithAuth(`/api/assets?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assets');
        }
        const data: AssetResponse = await response.json();
        setAssets(data.assets);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      key: 'customAssetId',
      label: 'Asset ID'
    },
    {
      key: 'assetName',
      label: 'Name'
    },
    {
      key: 'assetType.assetTypeName',
      label: 'Type'
    },
    {
      key: 'assetUsageStatus',
      label: 'Status',
      render: (row: Asset) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.assetUsageStatus === 'IN_USE' ? 'bg-green-100 text-green-800' :
          row.assetUsageStatus === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.assetUsageStatus}
        </span>
      )
    },
    {
      key: 'user.fullName',
      label: 'Assigned To',
      render: (row: Asset) => row.user?.fullName || 'Unassigned'
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      render: (row: Asset) => new Date(row.updatedAt).toLocaleDateString()
    }
  ];

  const handleEdit = (asset: Asset) => {
    // Implement edit functionality if needed
    console.log('Edit asset:', asset);
  };

  const handleDelete = (asset: Asset) => {
    // Implement delete functionality if needed
    console.log('Delete asset:', asset);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#18BC9C]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <ManagementTable
        title="Assets"
        description="Manage your organization's assets"
        columns={columns}
        data={assets}
        onEdit={handleViewAsset}
        loading={loading}
        downloadEndpoint="/api/assets/bulk-download"
        filters={filters}
        onFilterChange={handleFilterChange}
        showFilters={true}
      />
      
      <AssetDetailsModal
        asset={selectedAsset}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}