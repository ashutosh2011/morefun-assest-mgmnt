import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { AssetFilters } from '../Assets/AssetFilters';

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
  downloadEndpoint?: string;
  filters?: Record<string, string>;
  showFilters?: boolean;
  onFilterChange?: (key: string, value: string) => void;
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
  hideAddButton,
  downloadEndpoint,
  filters,
  showFilters = false,
  onFilterChange
}: ManagementTableProps) {
  const [downloading, setDownloading] = useState(false);

  const renderCell = (row: any, column: Column) => {
    if (column.render) {
      return column.render(row);
    }
    
    const value = column.key.split('.').reduce((obj, key) => obj?.[key], row);
    return value ?? 'N/A';
  };

  const handleDownload = async (type: 'excel' | 'csv') => {
    if (!downloadEndpoint || downloading) return;

    try {
      setDownloading(true);
      const queryParams = new URLSearchParams({
        ...(filters || {}),
        type
      });

      const response = await fetchWithAuth(`${downloadEndpoint}?${queryParams}`, {
        method: 'GET'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${type === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
    } catch (err) {
      console.error('Download error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-[#2C3E50]">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="flex gap-2">
            {downloadEndpoint && (
              <>
                <button
                  onClick={() => handleDownload('excel')}
                  disabled={downloading}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-[#18BC9C] text-[#18BC9C] rounded-lg hover:bg-[#18BC9C]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileDown size={16} />
                  )}
                  Export Excel
                </button>
                <button
                  onClick={() => handleDownload('csv')}
                  disabled={downloading}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-[#18BC9C] text-[#18BC9C] rounded-lg hover:bg-[#18BC9C]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileDown size={16} />
                  )}
                  Export CSV
                </button>
              </>
            )}
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
      </div>

      {showFilters && filters && onFilterChange && (
        <div className="px-6">
          <AssetFilters 
            filters={filters} 
            onFilterChange={onFilterChange} 
          />
        </div>
      )}

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