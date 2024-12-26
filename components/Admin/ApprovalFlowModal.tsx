import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface ApprovalFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: any[];
  assetTypes: any[];
  initialData?: any;
  onSubmit: (data: any) => void;
}

export function ApprovalFlowModal({
  isOpen,
  onClose,
  roles,
  assetTypes,
  initialData,
  onSubmit
}: ApprovalFlowModalProps) {
  const [levels, setLevels] = useState(initialData ? [initialData] : [{ levelNumber: 1 }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ levels });
  };

  const addLevel = () => {
    setLevels([...levels, { levelNumber: levels.length + 1 }]);
  };

  const removeLevel = (index: number) => {
    setLevels(levels.filter((_, i) => i !== index));
    // Update level numbers
    setLevels(prev => prev.map((level, i) => ({ ...level, levelNumber: i + 1 })));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#2C3E50]">
            {initialData ? 'Edit Approval Flow' : 'Create New Approval Flow'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {levels.map((level, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Level {level.levelNumber}</h3>
                {levels.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLevel(index)}
                    className="text-[#E74C3C]"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Type
                  </label>
                  <select
                    required
                    value={level.assetTypeId || ''}
                    onChange={(e) => {
                      const newLevels = [...levels];
                      newLevels[index] = { ...level, assetTypeId: e.target.value };
                      setLevels(newLevels);
                    }}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Asset Type</option>
                    {assetTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.typeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approver Role
                  </label>
                  <select
                    required
                    value={level.roleId || ''}
                    onChange={(e) => {
                      const newLevels = [...levels];
                      newLevels[index] = { ...level, roleId: e.target.value };
                      setLevels(newLevels);
                    }}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={level.description || ''}
                    onChange={(e) => {
                      const newLevels = [...levels];
                      newLevels[index] = { ...level, description: e.target.value };
                      setLevels(newLevels);
                    }}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Optional description"
                  />
                </div>
              </div>
            </div>
          ))}

          {!initialData && (
            <button
              type="button"
              onClick={addLevel}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 mb-6"
            >
              <Plus size={20} className="inline mr-2" />
              Add Another Level
            </button>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90"
            >
              {initialData ? 'Save Changes' : 'Create Flow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 