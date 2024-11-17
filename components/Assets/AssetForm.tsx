'use client';

import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
interface User {
  id: string;
  fullName: string;
  email: string;
}

interface Branch {
  id: string;
  name: string;
  code: string;
}

interface AssetType {
  id: string;
  assetTypeName: string;
}

interface AssetCategory {
  id: string;
  name: string;
}

interface AssetFormData {
  name: string;
  assetTypeId: string;
  serialNumber: string;
  purchaseDate: string;
  assignedUserId: string;
  description: string;
  branchId: string;
  departmentId: string;
  assetCategoryId: string;
  purchaseValue: string;
  depreciationRate: string;
  usefulLife: string;
}

interface Department {
  id: string;
  departmentName: string;
}

export function AssetForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    assetTypeId: '',
    serialNumber: '',
    purchaseDate: '',
    assignedUserId: '',
    description: '',
    branchId: '',
    departmentId: '',
    assetCategoryId: '',
    purchaseValue: '',
    depreciationRate: '',
    usefulLife: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, branchesRes, typesRes, categoriesRes, departmentsRes] = await Promise.all([
          fetchWithAuth('/api/users'),
          fetchWithAuth('/api/branches'),
          fetchWithAuth('/api/asset-types'),
          fetchWithAuth('/api/asset-categories'),
          fetchWithAuth('/api/departments'),
        ]);

        const [usersData, branchesData, typesData, categoriesData, departmentsData] = await Promise.all([
          usersRes.json(),
          branchesRes.json(),
          typesRes.json(),
          categoriesRes.json(),
          departmentsRes.json(),
        ]);

        setUsers(usersData);
        setBranches(branchesData);
        setAssetTypes(typesData);
        setAssetCategories(categoriesData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create asset');
      }

      // Reset form after successful submission
      setFormData({
        name: '',
        assetTypeId: '',
        serialNumber: '',
        purchaseDate: '',
        assignedUserId: '',
        description: '',
        branchId: '',
        departmentId: '',
        assetCategoryId: '',
        purchaseValue: '',
        depreciationRate: '',
        usefulLife: '',
      });

      // You might want to add a success message or redirect here
    } catch (error) {
      console.error('Error creating asset:', error);
      // Handle error (show error message to user)
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Asset Name
            <span className="text-[#E74C3C]">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Asset Type
              <span className="text-[#E74C3C]">*</span>
            </label>
            <select
              name="assetTypeId"
              value={formData.assetTypeId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            >
              <option value="">Select Type</option>
              {assetTypes && assetTypes.length > 0 && assetTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.assetTypeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Serial Number
              <span className="text-[#E74C3C]">*</span>
            </label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Purchase Date
              <span className="text-[#E74C3C]">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Assigned User
            </label>
            <select
              name="assignedUserId"
              value={formData.assignedUserId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            >
              <option value="">Select User</option>
              {users && users.length > 0 && users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Branch
              <span className="text-[#E74C3C]">*</span>
            </label>
            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            >
              <option value="">Select Branch</option>
              {branches && branches.length > 0 && branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Department
              <span className="text-[#E74C3C]">*</span>
            </label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            >
              <option value="">Select Department</option>
              {departments && departments.length > 0 && departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Asset Category
              <span className="text-[#E74C3C]">*</span>
            </label>
            <select
              name="assetCategoryId"
              value={formData.assetCategoryId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            >
              <option value="">Select Category</option>
              {assetCategories && assetCategories.length > 0 && assetCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Purchase Value
              <span className="text-[#E74C3C]">*</span>
            </label>
            <input
              type="number"
              name="purchaseValue"
              value={formData.purchaseValue}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Depreciation Rate (%)
              <span className="text-[#E74C3C]">*</span>
            </label>
            <input
              type="number"
              name="depreciationRate"
              value={formData.depreciationRate}
              onChange={handleChange}
              required
              min="0"
              max="100"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Useful Life (Years)
              <span className="text-[#E74C3C]">*</span>
            </label>
            <input
              type="number"
              name="usefulLife"
              value={formData.usefulLife}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-[#2C3E50] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90"
          >
            Create Asset
          </button>
        </div>
      </div>
    </form>
  );
}