import React from 'react';
import { Box, AlertTriangle, Clock } from 'lucide-react';
import { StatCard } from '@/components/Dashboard/StatCard';
import { ActivityList } from '@/components/Dashboard/ActivityList';
import { QuickActions } from '@/components/Dashboard/QuickActions';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Welcome back, John!</h1>
          <p className="text-gray-600">Here&apos;s an overview of your assets and recent activities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Active Assets"
            value={42}
            icon={Box}
            color="bg-[#18BC9C]"
          />
          <StatCard
            title="Pending Requests"
            value={3}
            icon={Clock}
            color="bg-[#2C3E50]"
          />
          <StatCard
            title="Alerts"
            value={2}
            icon={AlertTriangle}
            color="bg-[#E74C3C]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityList />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}