'use client';

import React from 'react';
import Link from 'next/link';
import {Menu, User, LayoutDashboard, Box, FileText, Trash2, LogOut } from 'lucide-react';

const baseNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Assets', href: '/assets', icon: Box },
  { name: 'Scrap Requests', href: '/scrap-approval', icon: Trash2 },
];

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Call logout API endpoint to clear the HTTP-only cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // Important for cookie handling
      });
      
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Compute navigation items based on user role
  const navigation = React.useMemo(() => {
    if (user?.role && user.role !== 'User') {
      return [
        ...baseNavigation,
        { name: 'Reports', href: '/reports', icon: FileText },
      ];
    }
    return baseNavigation;
  }, [user?.role]);

  return (
    <nav className="bg-[#2C3E50] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={isAuthenticated ? '/dashboard' : '/'}>
              <button className="text-xl font-semibold hover:text-[#18BC9C] transition-colors">
                Asset Management Portal
              </button>
            </Link>
          </div>

          {isAuthenticated ? (
            <>
              {/* Desktop Navigation for authenticated users */}
              <div className="hidden md:flex items-center space-x-4">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-[#2C3E50]/50">
                      <item.icon size={18} />
                      <span>{item.name}</span>
                    </button>
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#18BC9C] rounded-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <span className="hidden md:inline">{user?.fullName || 'User'}</span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-[#2C3E50]/50"
                  >
                    <LogOut size={18} />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
                <Link href="/menu">
                  <button className="md:hidden">
                    <Menu size={24} />
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <button className="px-4 py-2 rounded-md text-sm font-medium bg-[#18BC9C] hover:bg-[#18BC9C]/90 transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-4 py-2 rounded-md text-sm font-medium hover:bg-[#2C3E50]/50">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;