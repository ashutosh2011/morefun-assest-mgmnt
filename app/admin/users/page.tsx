'use client';

import React, { useState, useEffect } from 'react';
import { ManagementTable } from '@/components/Admin/ManagementTable';
import { UserFormModal } from '@/components/Admin/UserFormModal';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { BackButton } from '@/components/Admin/BackButton';
import { BulkUserUploadModal } from '@/components/Admin/BulkUserUploadModal';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: {
    id: string;
    roleName: string;
  };
  department: {
    id: string;
    departmentName: string;
  } | null;
}

interface Role {
  id: string;
  roleName: string;
  description?: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState({
    table: true,
    form: false,
  });
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'role.roleName', 
      label: 'Role'
    },
    { 
      key: 'department.departmentName', 
      label: 'Department'
    },
  ];

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      const response = await fetchWithAuth('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetchWithAuth('/api/roles');
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetchWithAuth('/api/departments');
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      setLoading(prev => ({ ...prev, form: true }));
      const response = await fetchWithAuth(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      toast.success('User updated successfully');
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.message);
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  const handleBulkUpload = async (data: { type: 'file' | 'text', content: File | string }) => {
    try {
      setLoading(prev => ({ ...prev, form: true }));
      
      const formData = new FormData();
      if (data.type === 'file') {
        formData.append('file', data.content as File);
      } else {
        formData.append('names', data.content as string);
      }
      formData.append('type', data.type);
      
      const response = await fetchWithAuth('/api/users/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create users');
      }

      toast.success('Users created successfully');
      setIsBulkUploadOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating users:', error);
      toast.error(error.message || 'Failed to create users');
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Manage Users</h1>
          <p className="text-gray-600">Configure user roles and passwords</p>
        </div>

        {loading.table ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#18BC9C]" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setIsBulkUploadOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90"
              >
                <Upload size={20} />
                Bulk Upload Users
              </button>
            </div>

            <ManagementTable
              title="Users"
              description="Manage user roles and passwords"
              columns={columns}
              data={users}
              onEdit={handleEdit}
              hideAddButton
            />
          </div>
        )}

        <UserFormModal
          isOpen={isModalOpen}
          onClose={() => !loading.form && setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingUser}
          roles={roles}
          departments={departments}
          loading={loading.form}
        />

        <BulkUserUploadModal
          isOpen={isBulkUploadOpen}
          onClose={() => !loading.form && setIsBulkUploadOpen(false)}
          onUpload={handleBulkUpload}
          loading={loading.form}
        />
      </main>
    </div>
  );
} 