import React from 'react';
import { BulkUploadForm } from '@/components/Assets/BulkUploadForm';

export default function BulkUpload() {
  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Bulk Upload Assets</h1>
          <p className="text-gray-600">Upload multiple assets using Excel or CSV file</p>
        </div>

        <BulkUploadForm />
      </main>
    </div>
  );
} 