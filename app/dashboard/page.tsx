'use client';

import React, { useEffect, useState } from 'react';
import { Box, AlertTriangle, Clock, Package, Archive, Settings } from 'lucide-react';
import { StatCard } from '@/components/Dashboard/StatCard';
import { ActivityList } from '@/components/Dashboard/ActivityList';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import Link from 'next/link';

interface DashboardStats {
  user: {
    name: string;
    role: {id: string, roleName: string};
  };
  personal: {
    assignedAssets: number;
    pendingRequests: number;
  };
  overall?: {
    totalAssets: number;
    pendingApprovals: number;
    scrappedAssets: number;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#ECF0F1] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18BC9C]"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-[#ECF0F1] flex items-center justify-center">
      <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg">Error: {error}</div>
    </div>
  );
  
  if (!stats) return null;

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#2C3E50]">
              Welcome back, {stats.user.name}!
            </h1>
            <p className="text-gray-600">
              {stats.user.role.roleName !== 'User' 
                ? "Here's your management dashboard overview"
                : "Here's an overview of your assets and activities"}
            </p>
          </div>
          
          {/* Add Admin Settings Button */}
          {stats.user.role.roleName === 'Admin' && (
            <Link href="/admin">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#2C3E50]/90 transition-colors">
                <Settings size={20} />
                <span>System Settings</span>
              </button>
            </Link>
          )}
        </div>

        {/* User-specific stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="My Assets"
            value={stats.personal.assignedAssets}
            icon={Package}
            color="bg-[#18BC9C]"
          />
          <StatCard
            title="My Pending Requests"
            value={stats.personal.pendingRequests}
            icon={Clock}
            color="bg-[#2C3E50]"
          />
        </div>

        {/* Admin/Manager specific stats */}
        {stats.overall && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-6">Overall Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Active Assets"
                value={stats.overall.totalAssets}
                icon={Box}
                color="bg-[#27AE60]"
              />
              <StatCard
                title="Pending Approvals"
                value={stats.overall.pendingApprovals}
                icon={AlertTriangle}
                color="bg-[#E74C3C]"
              />
              <StatCard
                title="Scrapped Assets"
                value={stats.overall.scrappedAssets}
                icon={Archive}
                color="bg-[#8E44AD]"
              />
            </div>
          </div>
        )}

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