'use client';

import React, { useState, useEffect } from 'react';
import { ManagementTable } from '@/components/Admin/ManagementTable';
import { FormModal } from '@/components/Admin/FormModal';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { BackButton } from '@/components/Admin/BackButton';

export default function ManageRoles() {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const columns = [
    { key: 'roleName', label: 'Role Name' },
    { key: 'description', label: 'Description' },
  ];

  const fields = [
    { key: 'roleName', label: 'Role Name', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'text', required: false },
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetchWithAuth('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleAdd = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = async (role: any) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      await fetchWithAuth(`/api/roles/${role.id}`, {
        method: 'DELETE',
      });
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await fetchWithAuth(`/api/roles${editingRole ? `/${editingRole.id}` : ''}`, {
        method: editingRole ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setIsModalOpen(false);
      fetchRoles();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <BackButton />
        <ManagementTable
          title="Manage Roles"
          description="Configure user roles and permissions"
          columns={columns}
          data={roles}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <FormModal
          title={editingRole ? 'Edit Role' : 'Add Role'}
          fields={fields}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingRole}
        />
      </main>
    </div>
  );
} 