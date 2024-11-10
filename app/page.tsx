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
              Manage Your Assets<br />with Confidence
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Streamline your asset management process with our powerful and intuitive platform. Track, manage, and optimize your resources effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#18BC9C] text-white font-medium hover:bg-[#18BC9C]/90 transition-colors">
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#2C3E50] text-[#2C3E50] font-medium hover:bg-[#2C3E50] hover:text-white transition-colors">
                Learn More
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
              Why Choose Asset Manager Pro?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive solution provides everything you need to manage your assets effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-[#18BC9C]/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-[#18BC9C]" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Quick and responsive interface ensures smooth operation and real-time updates
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-[#18BC9C]/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-[#18BC9C]" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Enterprise-grade security ensures your asset data is always protected
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-[#18BC9C]/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="text-[#18BC9C]" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                Detailed Analytics
              </h3>
              <p className="text-gray-600">
                Comprehensive reporting and analytics to make informed decisions
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
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of companies that trust Asset Manager Pro for their asset management needs
            </p>
            <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#18BC9C] text-white font-medium hover:bg-[#18BC9C]/90 transition-colors">
              Start Free Trial
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2024 Asset Manager Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>

  );
}
