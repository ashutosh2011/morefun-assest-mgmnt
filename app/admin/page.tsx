import React from 'react';
import { Shield, Building2, Users2, Box, FileSpreadsheet, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Admin Dashboard</h1>
          <p className="text-gray-600">Manage system settings and configurations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/branches" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <Building2 className="text-[#18BC9C]" size={24} />
              <div>
                <h3 className="font-semibold text-[#2C3E50]">Manage Branches</h3>
                <p className="text-sm text-gray-600">Add and edit company branches</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/departments" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <Users2 className="text-[#18BC9C]" size={24} />
              <div>
                <h3 className="font-semibold text-[#2C3E50]">Manage Departments</h3>
                <p className="text-sm text-gray-600">Configure department settings</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/asset-types" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <Box className="text-[#18BC9C]" size={24} />
              <div>
                <h3 className="font-semibold text-[#2C3E50]">Asset Types</h3>
                <p className="text-sm text-gray-600">Manage asset types and categories</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/asset-categories" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <FileSpreadsheet className="text-[#18BC9C]" size={24} />
              <div>
                <h3 className="font-semibold text-[#2C3E50]">Asset Categories</h3>
                <p className="text-sm text-gray-600">Configure asset categories</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/approval-rules" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <Settings className="text-[#18BC9C]" size={24} />
              <div>
                <h3 className="font-semibold text-[#2C3E50]">Approval Rules</h3>
                <p className="text-sm text-gray-600">Set up approval workflows</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
} 