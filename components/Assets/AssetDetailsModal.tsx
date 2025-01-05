import React from 'react';
import { X } from 'lucide-react';

interface Depreciation {
  id: string;
  year: number;
  openingBalance: number;
  addition: number;
  depreciation: number;
  wdv: number;
  cumulativeDepreciation: number;
}

interface Asset {
  id: string;
  customAssetId: string | null;
  assetName: string;
  description: string | null;
  assetUsage: string | null;
  company: string;
  location: string;
  assetCategory: string;
  vendorName: string | null;
  billNumber: string | null;
  billDate: string | null;
  openingBalance: number | null;
  addition: number | null;
  depreciation: number | null;
  wdv: number | null;
  cumulativeDepreciation: number | null;
  remarks: string | null;
  assetUsageStatus: string;
  createdAt: string;
  updatedAt: string;
  lastDepreciationDate: string;
  scrappedAtDate?: string;
  assetType: {
    assetTypeName: string;
    depreciationPercentage: number;
  } | null;
  branch: {
    location: string;
    branchName: string;
  } | null;
  department: {
    departmentName: string;
  } | null;
  user: {
    fullName: string;
    email: string;
  } | null;
  depreciations?: Depreciation[];
  activities?: Array<{
    id: string;
    createdAt: string;
    details: string;
  }>;
}

interface AssetDetailsModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssetDetailsModal({ asset, isOpen, onClose }: AssetDetailsModalProps) {
  if (!isOpen || !asset) return null;

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return value.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return value.toFixed(2) + '%';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#2C3E50]">Asset Details</h2>
              <p className="text-gray-600">Asset ID: {asset.customAssetId || asset.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-[#2C3E50] border-b pb-2">Asset Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {asset.assetName}</p>
                <p><span className="font-medium">Description:</span> {asset.description || 'N/A'}</p>
                <p><span className="font-medium">Category:</span> {asset.assetType?.assetTypeName || 'N/A'}</p>
                <p><span className="font-medium">Company:</span> {asset.company || 'N/A'}</p>
                <p><span className="font-medium">Location:</span> {asset.branch?.location || 'N/A'}</p>
                <p><span className="font-medium">Department:</span> {asset.department?.departmentName || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-[#2C3E50] border-b pb-2">Financial Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Opening Balance:</span> Rs.{formatCurrency(asset.openingBalance)}</p>
                <p><span className="font-medium">Addition:</span> Rs.{formatCurrency(asset.addition)}</p>
                <p><span className="font-medium">Depreciation Rate:</span> {formatPercentage(asset.assetType?.depreciationPercentage)}</p>
                <p><span className="font-medium">Current Depreciation:</span> Rs.{formatCurrency(asset.depreciation)}</p>
                <p><span className="font-medium">Written Down Value:</span> Rs.{formatCurrency(asset.wdv)}</p>
                <p><span className="font-medium">Cumulative Depreciation:</span> Rs.{formatCurrency(asset.cumulativeDepreciation)}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-[#2C3E50] border-b pb-2">Purchase Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Vendor:</span> {asset.vendorName || 'N/A'}</p>
                <p><span className="font-medium">Bill Number:</span> {asset.billNumber || 'N/A'}</p>
                <p><span className="font-medium">Bill Date:</span> {asset.billDate ? new Date(asset.billDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-[#2C3E50] border-b pb-2">Usage Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    asset.assetUsageStatus === 'IN_USE' ? 'bg-green-100 text-green-800' :
                    asset.assetUsageStatus === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {asset.assetUsageStatus}
                  </span>
                </p>
                <p><span className="font-medium">Assigned To:</span> {asset.user?.fullName || 'Unassigned'}</p>
                <p><span className="font-medium">User Email:</span> {asset.user?.email || 'N/A'}</p>
                <p><span className="font-medium">Usage:</span> {asset.assetUsage || 'N/A'}</p>
                <p><span className="font-medium">Remarks:</span> {asset.remarks || 'N/A'}</p>
              </div>
            </div>
          </div>

          {asset.depreciations && asset.depreciations.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-4 text-[#2C3E50] border-b pb-2">Depreciation History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Addition</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depreciation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WDV</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cumulative Depreciation</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {asset.depreciations.sort((a, b) => b.year - a.year).map((dep) => (
                      <tr key={dep.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{dep.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Rs.{formatCurrency(dep.openingBalance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Rs.{formatCurrency(dep.addition)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Rs.{formatCurrency(dep.depreciation)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Rs.{formatCurrency(dep.wdv)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Rs.{formatCurrency(dep.cumulativeDepreciation)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {asset.activities && asset.activities.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-4 text-[#2C3E50] border-b pb-2">Activity History</h3>
              <div className="space-y-3">
                {asset.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                    <div className="w-32 flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-sm flex-grow">{activity.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500 border-t pt-4">
            <p>Created: {new Date(asset.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(asset.updatedAt).toLocaleString()}</p>
            <p>Last Depreciation: {new Date(asset.lastDepreciationDate).toLocaleDateString()}</p>
            {asset.assetUsageStatus === 'SCRAPPED' && asset.scrappedAtDate && (
              <p>Scrapped At: {new Date(asset.scrappedAtDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}