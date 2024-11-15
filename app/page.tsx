import { ArrowRight, BarChart2, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#18BC9C]/10 to-[#2C3E50]/10 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C3E50] leading-tight mb-6">
              Asset Management Portal
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your centralized platform for managing company assets, processing scrap requests, and generating detailed reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#18BC9C] text-white font-medium hover:bg-[#18BC9C]/90 transition-colors">
                Access Portal
                <ArrowRight className="ml-2" size={20} />
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#2C3E50] text-[#2C3E50] font-medium hover:bg-[#2C3E50] hover:text-white transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">
              Key Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to efficiently manage and track company assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-[#18BC9C]/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-[#18BC9C]" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                Asset Management
              </h3>
              <p className="text-gray-600">
                Track assets, manage inventory, and monitor asset lifecycle from purchase to retirement
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-[#18BC9C]/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-[#18BC9C]" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                Scrap Request System
              </h3>
              <p className="text-gray-600">
                Streamlined approval workflow for processing asset disposal requests
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-[#18BC9C]/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="text-[#18BC9C]" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                Reports & Analytics
              </h3>
              <p className="text-gray-600">
                Generate detailed reports on asset utilization, depreciation, and disposal status
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2C3E50] rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Access Your Dashboard
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Log in to manage assets, submit requests, or review pending approvals
            </p>
            <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#18BC9C] text-white font-medium hover:bg-[#18BC9C]/90 transition-colors">
              Login to Portal
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2024 Asset Management Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>

  );
}
