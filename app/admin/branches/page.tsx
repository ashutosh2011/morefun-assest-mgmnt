'use client';

import React, { useState, useEffect } from 'react';
import { ManagementTable } from '@/components/Admin/ManagementTable';
import { FormModal } from '@/components/Admin/FormModal';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BackButton } from '@/components/Admin/BackButton';

export default function ManageBranches() {
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [loading, setLoading] = useState({
    table: true,
    form: false,
    delete: false
  });

  const columns = [
    { key: 'branchName', label: 'Branch Name' },
    { key: 'location', label: 'Location' },
  ];

  const fields = [
    { key: 'branchName', label: 'Branch Name (Unique)', type: 'text', required: true },
    { key: 'location', label: 'Location', type: 'text', required: true },
  ];

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      const response = await fetchWithAuth('/api/branches');
      if (!response.ok) {
        throw new Error('Failed to fetch branches');
      }
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to fetch branches');
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  const handleAdd = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: any) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleDelete = async (branch: any) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;

    try {
      setLoading(prev => ({ ...prev, delete: true }));
      const response = await fetchWithAuth(`/api/branches/${branch.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Branch deleted successfully');
        fetchBranches();
      }
    } catch (error: any) {
      console.error('Error deleting branch:', error);
      if (error.response) {
        const errorData = await error.response.json();
        toast.error(errorData.error || 'Failed to delete branch');
      } else {
        toast.error('Failed to delete branch');
      }
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(prev => ({ ...prev, form: true }));
      const response = await fetchWithAuth(`/api/branches${editingBranch ? `/${editingBranch.id}` : ''}`, {
        method: editingBranch ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branchName: data.branchName,
          location: data.location,
        }),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        toast.success(`Branch ${editingBranch ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        fetchBranches();
      }
    } catch (error: any) {
      console.error('Error saving branch:', error);
      if (error.response) {
        const errorData = await error.response.json();
        toast.error(errorData.error || 'Failed to save branch');
      } else {
        toast.error('Failed to save branch');
      }
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Manage Branches</h1>
          <p className="text-gray-600">Add and edit company branches</p>
        </div>

        {loading.table ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#18BC9C]" />
          </div>
        ) : (
          <ManagementTable
            title="Manage Branches"
            description="Add and edit company branches"
            columns={columns}
            data={branches}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={!loading.delete ? handleDelete : undefined}
            loading={loading.delete}
          />
        )}

        <FormModal
          title={editingBranch ? 'Edit Branch' : 'Add Branch'}
          fields={fields}
          isOpen={isModalOpen}
          onClose={() => !loading.form && setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingBranch}
          loading={loading.form}
        />
      </main>
    </div>
  );
} 