"use client"
import React from 'react';
import { Plus, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { AssetFilters } from '@/components/Assets/AssetFilters';
import { AssetTable } from '@/components/Assets/AssetTable';
import Link from 'next/link';

export default function AssetList() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2C3E50]">Asset Inventory</h1>
            <p className="text-gray-600">Manage and track all company assets</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/assets/bulk-upload"
              className="flex items-center gap-2 px-4 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#2C3E50]/90"
            >
              <Upload size={20} />
              <span>Bulk Upload</span>
            </Link>
            <button 
              onClick={() => router.push('/assets/new')}
              className="flex items-center gap-2 px-4 py-2 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90"
            >
              <Plus size={20} />
              <span>Add New Asset</span>
            </button>
          </div>
        </div>

        {/* <AssetFilters /> */}
        <AssetTable />
      </main>
    </div>
  );
}