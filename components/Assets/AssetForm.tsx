'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
  customAssetId: string;
  name: string;
  company: string;
  location: string;
  assetCategory: string;
  vendorName: string;
  billDate: string;
  billNumber: string;
  openingBalance: string;
  addition: string;
  assetUsage: string;
  description: string;
  departmentId: string;
  remarks: string;
  assetTypeId: string;
  branchId: string;
  assignedUserId: string;
  assetUsageStatus: string;
}

interface Department {
  id: string;
  departmentName: string;
}

interface AssetFormProps {
  assetId?: string;
}

export function AssetForm({ assetId }: AssetFormProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAsset, setLoadingAsset] = useState(assetId ? true : false);

  const [formData, setFormData] = useState<AssetFormData>({
    customAssetId: '',
    name: '',
    description: '',
    departmentId: '',
    assetUsage: '',
    company: '',
    location: '',
    assetCategory: '',
    vendorName: '',
    billDate: '',
    billNumber: '',
    openingBalance: '',
    addition: '',
    remarks: '',
    assetTypeId: '',
    branchId: '',
    assignedUserId: '',
    assetUsageStatus: '',
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

  useEffect(() => {
    if (assetId) {
      const fetchAsset = async () => {
        try {
          const response = await fetchWithAuth(`/api/assets/${assetId}`);
          if (!response.ok) throw new Error('Failed to fetch asset');
          const asset = await response.json();
          
          setFormData({
            customAssetId: asset.customAssetId || '',
            name: asset.assetName || '',
            description: asset.description || '',
            departmentId: asset.departmentId || '',
            assetUsage: asset.assetUsage || '',
            company: asset.company || '',
            location: asset.location || '',
            assetCategory: asset.assetCategory || '',
            vendorName: asset.vendorName || '',
            billDate: asset.billDate ? new Date(asset.billDate).toISOString().split('T')[0] : '',
            billNumber: asset.billNumber || '',
            openingBalance: asset.openingBalance?.toString() || '',
            addition: asset.addition?.toString() || '',
            remarks: asset.remarks || '',
            assetTypeId: asset.assetTypeId || '',
            branchId: asset.branchId || '',
            assignedUserId: asset.userId || '',
            assetUsageStatus: asset.assetUsageStatus || '',
          });
        } catch (error) {
          console.error('Error fetching asset:', error);
          toast.error('Failed to fetch asset details');
        } finally {
          setLoadingAsset(false);
        }
      };

      fetchAsset();
    }
  }, [assetId]);

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
      setIsSubmitting(true);
      
      const submitData = {
        ...formData,
        assetName: formData.name,
        branchId: formData.location,
        openingBalance: parseFloat(formData.openingBalance),
        addition: parseFloat(formData.addition),
      };

      const response = await fetchWithAuth(`/api/assets${assetId ? `/${assetId}` : ''}`, {
        method: assetId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${assetId ? 'update' : 'create'} asset`);
      }

      toast.success(`Asset ${assetId ? 'updated' : 'created'} successfully`);
      router.push('/assets');
    } catch (error) {
      console.error(`Error ${assetId ? 'updating' : 'creating'} asset:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to ${assetId ? 'update' : 'create'} asset`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || loadingAsset) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
      <div className="space-y-8">
        {/* Basic Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Custom Asset ID
              </label>
              <input
                type="text"
                name="customAssetId"
                value={formData.customAssetId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Asset Name <span className="text-[#E74C3C]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Company <span className="text-[#E74C3C]">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              />
            </div>
          </div>
        </div>

        {/* Classification Section */}
        <div>
          <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Asset Category <span className="text-[#E74C3C]">*</span>
              </label>
              <select
                name="assetTypeId"
                value={formData.assetTypeId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              >
                <option value="">Select Category</option>
                {assetTypes?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.assetTypeName}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Department <span className="text-[#E74C3C]">*</span>
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              >
                <option value="">Select Department</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div> */}
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Location <span className="text-[#E74C3C]">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              >
                <option value="">Select Location</option>
                {branches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Purchase Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Purchase Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Purchase Date <span className="text-[#E74C3C]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="billDate"
                  value={formData.billDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
                />
                <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Bill Number <span className="text-[#E74C3C]">*</span>
              </label>
              <input
                type="text"
                name="billNumber"
                value={formData.billNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Vendor Name <span className="text-[#E74C3C]">*</span>
              </label>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Opening Balance <span className="text-[#E74C3C]">*</span>
              </label>
              <input
                type="number"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Addition <span className="text-[#E74C3C]">*</span>
              </label>
              <input
                type="number"
                name="addition"
                value={formData.addition}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              />
            </div>  
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Useage Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Asset Usage <span className="text-[#E74C3C]">*</span>
              </label>
              <input
                type="text"
                name="assetUsage"
                value={formData.assetUsage}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">Assigned User</label>
              <select
                name="assignedUserId"
                value={formData.assignedUserId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              >
                <option value="">Select User</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>{user.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">Use Department</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              >
                <option value="">Select Department</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">Status</label>
              <select
                name="assetUsageStatus"
                value={formData.assetUsageStatus}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-[#2C3E50] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{assetId ? 'Updating...' : 'Creating...'}</span>
              </>
            ) : (
              <span>{assetId ? 'Update Asset' : 'Create Asset'}</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}