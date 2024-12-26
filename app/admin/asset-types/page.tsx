'use client';

import React, { useState, useEffect } from 'react';
import { ManagementTable } from '@/components/Admin/ManagementTable';
import { FormModal } from '@/components/Admin/FormModal';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ManageAssetTypes() {
  const [assetTypes, setAssetTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssetType, setEditingAssetType] = useState(null);
  const [loading, setLoading] = useState({
    table: true,
    form: false,
    delete: false
  });

  const columns = [
    { key: 'assetTypeName', label: 'Asset Type Name' },
    { key: 'description', label: 'Description' },
    { key: 'depreciationPercentage', label: 'Depreciation %' },
  ];

  const fields = [
    { key: 'assetTypeName', label: 'Asset Type Name', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'text', required: false },
    { 
      key: 'depreciationPercentage', 
      label: 'Depreciation Percentage', 
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      step: 0.01
    },
  ];

  useEffect(() => {
    fetchAssetTypes();
  }, []);

  const fetchAssetTypes = async () => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      const response = await fetchWithAuth('/api/asset-types');
      if (!response.ok) {
        throw new Error('Failed to fetch asset types');
      }
      const data = await response.json();
      setAssetTypes(data);
    } catch (error) {
      console.error('Error fetching asset types:', error);
      toast.error('Failed to fetch asset types');
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  const handleAdd = () => {
    setEditingAssetType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (assetType: any) => {
    setEditingAssetType(assetType);
    setIsModalOpen(true);
  };

  const handleDelete = async (assetType: any) => {
    if (!confirm('Are you sure you want to delete this asset type?')) return;

    try {
      setLoading(prev => ({ ...prev, delete: true }));
      const response = await fetchWithAuth(`/api/asset-types/${assetType.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete asset type');
      }
      
      toast.success('Asset type deleted successfully');
      fetchAssetTypes();
    } catch (error) {
      console.error('Error deleting asset type:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete asset type');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(prev => ({ ...prev, form: true }));
      const response = await fetchWithAuth(`/api/asset-types${editingAssetType ? `/${editingAssetType.id}` : ''}`, {
        method: editingAssetType ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          depreciationPercentage: parseFloat(data.depreciationPercentage)
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save asset type');
      }

      toast.success(`Asset type ${editingAssetType ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchAssetTypes();
    } catch (error) {
      console.error('Error saving asset type:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save asset type');
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading.table ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#18BC9C]" />
          </div>
        ) : (
          <ManagementTable
            title="Manage Asset Types"
            description="Configure asset types and their depreciation rates"
            columns={columns}
            data={assetTypes}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={!loading.delete ? handleDelete : undefined}
            loading={loading.delete}
          />
        )}

        <FormModal
          title={editingAssetType ? 'Edit Asset Type' : 'Add Asset Type'}
          fields={fields}
          isOpen={isModalOpen}
          onClose={() => !loading.form && setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingAssetType}
          loading={loading.form}
        />
      </main>
    </div>
  );
} 