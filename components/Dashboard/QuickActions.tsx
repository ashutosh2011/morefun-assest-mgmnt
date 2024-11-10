'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => router.push('/assets/new')}
          className="flex items-center justify-center space-x-2 bg-[#18BC9C] text-white px-4 py-2 rounded-lg hover:bg-[#18BC9C]/90 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Asset</span>
        </button>
        <button 
          onClick={() => router.push('/scrap-request')}
          className="flex items-center justify-center space-x-2 bg-[#E74C3C] text-white px-4 py-2 rounded-lg hover:bg-[#E74C3C]/90 transition-colors"
        >
          <Trash2 size={20} />
          <span>Submit Scrap Request</span>
        </button>
      </div>
    </div>
  );
}

export default QuickActions;
