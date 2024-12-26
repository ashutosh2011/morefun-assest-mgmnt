import React from 'react';
import { X, Loader2 } from 'lucide-react';

interface Field {
  key: string;
  label: string;
  type: string;
  required?: boolean;
}

interface FormModalProps {
  title: string;
  fields: Field[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  loading?: boolean;
}

export function FormModal({
  title,
  fields,
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading
}: FormModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#2C3E50]">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                    {field.label}
                    {field.required && <span className="text-[#E74C3C]">*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.key}
                    defaultValue={initialData?.[field.key] || ''}
                    required={field.required}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#18BC9C] text-white px-4 py-2 rounded-lg hover:bg-[#18BC9C]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 