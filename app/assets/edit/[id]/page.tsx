'use client';

import React from 'react';
import { AssetForm } from '@/components/Assets/AssetForm';
import { useParams } from 'next/navigation';

export default function EditAsset() {
  const params = useParams();
  const assetId = params.id as string;

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Edit Asset</h1>
          <p className="text-gray-600">Update asset information</p>
        </div>

        <AssetForm assetId={assetId} />
      </main>
    </div>
  );
} 