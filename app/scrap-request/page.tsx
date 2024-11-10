import React from 'react';
import { ScrapRequestForm } from '@/components/Scrap/ScrapRequestForm';

export default function CreateScrapRequest() {
  return (
    <div className="min-h-screen bg-[#ECF0F1]">

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Submit Scrap Request</h1>
          <p className="text-gray-600">Request to remove an asset from inventory</p>
        </div>

        <ScrapRequestForm />
      </main>
    </div>
  );
}