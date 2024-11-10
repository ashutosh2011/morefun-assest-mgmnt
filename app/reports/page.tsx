import React from 'react';
import { ReportCharts } from '@/components/Reports/ReportCharts';
import { ReportFilters } from '@/components/Reports/ReportFilters';
import { ReportTable } from '@/components/Reports/ReportTable';

export default function Reports() {
  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Reports</h1>
          <p className="text-gray-600">Generate and view asset management reports</p>
        </div>

        <ReportFilters />
        <ReportCharts />
        <ReportTable />
      </main>
    </div>
  );
}