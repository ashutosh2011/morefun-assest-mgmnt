import React from 'react';
import { X } from 'lucide-react';

interface AssetDetailsModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asset: any; // You can create a more specific type based on your API response
  isOpen: boolean;
  onClose: () => void;
}

export function AssetDetailsModal({ asset, isOpen, onClose }: AssetDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#2C3E50]">Asset Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Asset Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">System ID:</span> {asset.id}</p>
                <p><span className="font-medium">Custom ID:</span> {asset.customAssetId || 'N/A'}</p>
                <p><span className="font-medium">Name:</span> {asset.assetName}</p>
                <p><span className="font-medium">Description:</span> {asset.description}</p>
                <p><span className="font-medium">Category:</span> {asset.assetType.assetTypeName}</p>
                <p><span className="font-medium">Location:</span> {asset.branch.location}</p>
                <p><span className="font-medium">Department:</span> {asset.department.departmentName}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Assignment Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Department:</span> {asset.department?.departmentName}</p>
                <p><span className="font-medium">Branch:</span> {asset.branch?.branchName}</p>
                <p><span className="font-medium">Assigned To:</span> {asset.user?.fullName}</p>
                <p><span className="font-medium">User Email:</span> {asset.user?.email}</p>
                <p><span className="font-medium">Asset Status:</span> {asset.assetUsageStatus}</p>
                <p><span className="font-medium">Asset Usage:</span> {asset.assetUsage}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Company Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Company:</span> {asset.company}</p>
                <p><span className="font-medium">Location:</span> {asset.location}</p>
                <p><span className="font-medium">Asset Category:</span> {asset.assetCategory}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Vendor Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Vendor Name:</span> {asset.vendorName}</p>
                <p><span className="font-medium">Bill Date:</span> {new Date(asset.billDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Bill Number:</span> {asset.billNumber}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Financial Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Opening Balance:</span> Rs.{asset.openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><span className="font-medium">Addition:</span> Rs.{asset.addition.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><span className="font-medium">Depreciation Rate:</span> {asset.assetType.depreciationPercentage.toFixed(2)}%</p>
                <p><span className="font-medium">Depreciation:</span> Rs.{asset.depreciation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><span className="font-medium">Written Down Value:</span> Rs.{asset.wdv.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><span className="font-medium">Cumulative Depreciation:</span> Rs.{asset.cumulativeDepreciation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Additional Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Created:</span> {new Date(asset.createdAt).toLocaleString()}</p>
                <p><span className="font-medium">Last Updated:</span> {new Date(asset.updatedAt).toLocaleString()}</p>
                <p><span className="font-medium">Last Depreciation Date:</span> {new Date(asset.lastDepreciationDate).toLocaleDateString()}</p>
                {asset.assetUsageStatus === 'SCRAPPED' && asset.scrappedAtDate && (
                  <p><span className="font-medium">Scrapped At:</span> {new Date(asset.scrappedAtDate).toLocaleDateString()}</p>
                )}
                <p><span className="font-medium">Remarks:</span> {asset.remarks || 'N/A'}</p>
              </div>
            </div>
          </div>

          {asset.activities && asset.activities.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Activity History</h3>
              <div className="space-y-2">
                {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                asset.activities.map((activity: any) => (
                  <div key={activity.id} className="border-b pb-2">
                    <p className="text-sm">
                      <span className="font-medium">{new Date(activity.createdAt).toLocaleString()}</span>: {activity.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}