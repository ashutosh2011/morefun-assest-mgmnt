import React from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Column {
  key: string;
  label: string;
}

interface ManagementTableProps {
  title: string;
  description: string;
  columns: Column[];
  data: any[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export function ManagementTable({
  title,
  description,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete
}: ManagementTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-[#2C3E50]">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90"
          >
            <Plus size={20} />
            Add New
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-[#2C3E50] uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-[#2C3E50]">
                    {item[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-[#18BC9C] hover:text-[#18BC9C]/80"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-[#E74C3C] hover:text-[#E74C3C]/80"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 