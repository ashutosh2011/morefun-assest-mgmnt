'use client';

import React, { useState, useEffect } from 'react';
import { ManagementTable } from '@/components/Admin/ManagementTable';
import { FormModal } from '@/components/Admin/FormModal';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

export default function ManageBranches() {
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const columns = [
    { key: 'branchName', label: 'Branch Name' },
    { key: 'location', label: 'Location' },
    { key: 'code', label: 'Branch Code' },
  ];

  const fields = [
    { key: 'branchName', label: 'Branch Name', type: 'text', required: true },
    { key: 'location', label: 'Location', type: 'text', required: true },
    { key: 'code', label: 'Branch Code', type: 'text', required: true },
  ];

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetchWithAuth('/api/branches');
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
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
      await fetchWithAuth(`/api/branches/${branch.id}`, {
        method: 'DELETE',
      });
      fetchBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await fetchWithAuth(`/api/branches${editingBranch ? `/${editingBranch.id}` : ''}`, {
        method: editingBranch ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setIsModalOpen(false);
      fetchBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <ManagementTable
          title="Manage Branches"
          description="Add and edit company branches"
          columns={columns}
          data={branches}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <FormModal
          title={editingBranch ? 'Edit Branch' : 'Add Branch'}
          fields={fields}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingBranch}
        />
      </main>
    </div>
  );
} 