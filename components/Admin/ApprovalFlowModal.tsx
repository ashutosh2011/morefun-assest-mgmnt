import React, { useState } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ApprovalFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: any[];
  assetType: any;
  initialData: any;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function ApprovalFlowModal({
  isOpen,
  onClose,
  roles,
  assetType,
  initialData,
  onSubmit,
  isSubmitting
}: ApprovalFlowModalProps) {
  const [formData, setFormData] = useState({
    levelNumber: initialData?.levelNumber || '',
    roleId: initialData?.roleId || '',
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Approval Level' : 'Add Approval Level'}
          </DialogTitle>
          <DialogDescription>
            Configure approval level for {assetType.assetTypeName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level Number
              </label>
              <input
                type="number"
                value={formData.levelNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, levelNumber: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approver Role
              </label>
              <select
                value={formData.roleId}
                onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#18BC9C] text-white rounded-md disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 