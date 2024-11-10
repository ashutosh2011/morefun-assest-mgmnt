import React from 'react';
import Link from 'next/link';
import {Menu, User, LayoutDashboard, Box, FileText, Trash2 } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Assets', href: '/assets', icon: Box },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Scrap Requests', href: '/scrap-approval', icon: Trash2 },
];

function Navbar() {
  return (
    <nav className="bg-[#2C3E50] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <button className="text-xl font-semibold hover:text-[#18BC9C] transition-colors">
                Asset Manager Portal
              </button>
            </Link>
          </div>

          {/* Desktop Navigation */}
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
            {/* <button className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-[#E74C3C] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button> */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#18BC9C] rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <span className="hidden md:inline">John Doe</span>
            </div>
            <Link href="/menu">
              <button className="md:hidden">
                <Menu size={24} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;