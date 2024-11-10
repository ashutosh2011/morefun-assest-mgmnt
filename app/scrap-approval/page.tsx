import React from 'react';
import { ScrapRequestTable } from '@/components/Scrap/ScrapRequestTable';

export default function ScrapApproval() {
  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Scrap Request Approval</h1>
          <p className="text-gray-600">Review and manage asset scrap requests</p>
        </div>

        <ScrapRequestTable />
      </main>
    </div>
  );
}