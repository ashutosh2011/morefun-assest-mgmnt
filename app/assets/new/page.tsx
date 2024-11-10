import React from 'react';
import { AssetForm } from '@/components/Assets/AssetForm';

export default function CreateAsset() {
  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Create New Asset</h1>
          <p className="text-gray-600">Add a new asset to the inventory</p>
        </div>

        <AssetForm />
      </main>
    </div>
  );
}