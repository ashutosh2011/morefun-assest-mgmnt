import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface ScrapRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrapRequest: any; // TODO: Add proper type
}

export function ScrapRequestDetailsModal({ isOpen, onClose, scrapRequest }: ScrapRequestDetailsModalProps) {
  if (!scrapRequest) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <Dialog.Title className="text-lg font-semibold text-[#2C3E50]">
              Scrap Request Details
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Asset Information */}
            <div>
              <h3 className="font-semibold mb-2">Asset Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Asset Name</p>
                  <p className="font-medium">{scrapRequest.asset.assetName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Serial Number</p>
                  <p className="font-medium">{scrapRequest.asset.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Asset Type</p>
                  <p className="font-medium">{scrapRequest.asset.assetType.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{scrapRequest.asset.department.name}</p>
                </div>
              </div>
            </div>

            {/* Request Information */}
            <div>
              <h3 className="font-semibold mb-2">Request Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Requested By</p>
                  <p className="font-medium">{scrapRequest.requestedBy.fullName}</p>
                  <p className="text-sm text-gray-500">{scrapRequest.requestedBy.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Request Date</p>
                  <p className="font-medium">
                    {new Date(scrapRequest.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Reason for Scrapping</p>
                  <p className="font-medium">{scrapRequest.reason}</p>
                </div>
              </div>
            </div>

            {/* Approval History */}
            <div>
              <h3 className="font-semibold mb-2">Approval History</h3>
              <div className="space-y-3">
                {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                scrapRequest.approvals.map((approval: any) => (
                  <div key={approval.id} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          Level {approval.approvalLevel.levelNumber} - {approval.approvalLevel.role.roleName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {approval.approver.fullName} ({approval.approver.email})
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={approval.status} />
                        <p className="text-sm text-gray-500">
                          {new Date(approval.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {approval.comments && (
                      <p className="text-sm text-gray-600 mt-1">{approval.comments}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// Reuse the StatusBadge component from ScrapRequestTable
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