import React from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface ManagementTableProps {
  title: string;
  description: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  loading?: boolean;
  hideAddButton?: boolean;
}

export function ManagementTable({
  title,
  description,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  loading,
  hideAddButton
}: ManagementTableProps) {
  const renderCell = (row: any, column: Column) => {
    if (column.render) {
      return column.render(row);
    }
    
    const value = column.key.split('.').reduce((obj, key) => obj?.[key], row);
    return value ?? 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-[#2C3E50]">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
          {!hideAddButton && onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90"
            >
              <Plus size={20} />
              Add New
            </button>
          )}
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
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                    {renderCell(row, column)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-[#18BC9C] hover:text-[#18BC9C]/80"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                    {onDelete && !loading && (
                      <button
                        onClick={() => onDelete(row)}
                        className="text-[#E74C3C] hover:text-[#E74C3C]/80"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    {onDelete && loading && (
                      <Loader2 className="inline w-4 h-4 animate-spin text-gray-400" />
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 