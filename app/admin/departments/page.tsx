'use client';

import React, { useState, useEffect } from 'react';
import { ManagementTable } from '@/components/Admin/ManagementTable';
import { FormModal } from '@/components/Admin/FormModal';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BackButton } from '@/components/Admin/BackButton';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [loading, setLoading] = useState({
    table: true,
    form: false,
    delete: false
  });

  const columns = [
    { key: 'departmentName', label: 'Department Name' },
    { key: 'region', label: 'Region' },
  ];

  const fields = [
    { key: 'departmentName', label: 'Department Name (Unique)', type: 'text', required: true },
    { key: 'region', label: 'Region', type: 'text', required: true },
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      const response = await fetchWithAuth('/api/departments');
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  const handleAdd = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (department: any) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (department: any) => {
    if (!confirm('Are you sure you want to delete this department?')) return;

    try {
      setLoading(prev => ({ ...prev, delete: true }));
      const response = await fetchWithAuth(`/api/departments/${department.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete department');
      }
      
      toast.success('Department deleted successfully');
      fetchDepartments();
    } catch (error: any) {
      console.error('Error deleting department:', error);
      toast.error(error.message || 'Failed to delete department');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(prev => ({ ...prev, form: true }));
      const response = await fetchWithAuth(`/api/departments${editingDepartment ? `/${editingDepartment.id}` : ''}`, {
        method: editingDepartment ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save department');
      }

      toast.success(`Department ${editingDepartment ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchDepartments();
    } catch (error: any) {
      console.error('Error saving department:', error);
      toast.error(error.message || 'Failed to save department');
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Manage Departments</h1>
          <p className="text-gray-600">Add and edit company departments</p>
        </div>

        {loading.table ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#18BC9C]" />
          </div>
        ) : (
          <ManagementTable
            title="Manage Departments"
            description="Configure department settings"
            columns={columns}
            data={departments}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={!loading.delete ? handleDelete : undefined}
            loading={loading.delete}
          />
        )}

        <FormModal
          title={editingDepartment ? 'Edit Department' : 'Add Department'}
          fields={fields}
          isOpen={isModalOpen}
          onClose={() => !loading.form && setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingDepartment}
          loading={loading.form}
        />
      </main>
    </div>
  );
} 