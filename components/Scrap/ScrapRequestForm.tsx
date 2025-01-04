'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

// Define proper types for the asset
interface Asset {
  id: string;
  assetName: string;
  billNumber: string;
  assetType: {
    assetTypeName: string;
  };
}

interface SelectedAsset {
  id: string;
  assetName: string;
  billNumber: string;
  assetTypeName: string;
}

export function ScrapRequestForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    reason: ''
  });
  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(null);

  // Specify the type for assets
  const [assets, setAssets] = useState<Asset[]>([]);
  
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetchWithAuth('/api/assets?status=IN_USE');
        if (!response.ok) throw new Error('Failed to fetch assets');
        const data = await response.json();
        setAssets(data.assets);
      } catch (err) {
        toast.error('Failed to load assets');
      }
    };
    fetchAssets();
  }, []);

  const handleAssetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const asset = assets.find(a => a.id === e.target.value);
    if (asset) {
      setSelectedAsset({
        id: asset.id,
        assetName: asset.assetName,
        billNumber: asset.billNumber,
        assetTypeName: asset.assetType.assetTypeName
      });
      setFormData(prev => ({ ...prev, assetId: asset.id }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetchWithAuth('/api/scrap-requests', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit request');
      }

      toast.success('Scrap request submitted successfully');
      
      // Clear form
      setFormData({ assetId: '', reason: '' });
      setSelectedAsset(null);
      
      // Optionally redirect to scrap requests list
      router.push('/scrap-approval');
    } catch (error) {
      console.log(error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        {/* Asset Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Asset*
          </label>
          <select
            value={formData.assetId}
            onChange={handleAssetSelect}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">Choose an asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.assetName} - {asset.billNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Asset Details */}
        {selectedAsset && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Asset Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Asset Name</p>
                <p className="font-medium">{selectedAsset.assetName}</p>
              </div>
              <div>
                <p className="text-gray-600">Bill Number</p>
                <p className="font-medium">{selectedAsset.billNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Asset Type</p>
                <p className="font-medium">{selectedAsset.assetTypeName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reason Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Scrapping*
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg p-2 min-h-[100px]"
            required
            placeholder="Please provide a detailed reason for scrapping this asset"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-[#2C3E50] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </form>
  );
}