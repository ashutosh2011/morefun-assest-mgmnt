import React from 'react';
import { Calendar } from 'lucide-react';

export function AssetForm() {
  return (
    <form className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Asset Name
            <span className="text-[#E74C3C]">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Asset Type
              <span className="text-[#E74C3C]">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            >
              <option value="">Select Type</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile Device</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Serial Number
              <span className="text-[#E74C3C]">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Purchase Date
              <span className="text-[#E74C3C]">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Assigned User
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]">
              <option value="">Select User</option>
              <option value="john">John Doe</option>
              <option value="jane">Jane Smith</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Branch
              <span className="text-[#E74C3C]">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            >
              <option value="">Select Branch</option>
              {/* Fetch and map branches */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Asset Category
              <span className="text-[#E74C3C]">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            >
              <option value="">Select Category</option>
              <option value="IT">IT Asset</option>
              <option value="NON_IT">Non-IT Asset</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Purchase Value
              <span className="text-[#E74C3C]">*</span>
            </label>
            <input
              type="number"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Depreciation Rate (%)
              <span className="text-[#E74C3C]">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              max="100"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Useful Life (Years)
              <span className="text-[#E74C3C]">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C] text-[#2C3E50]"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-[#2C3E50] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90"
          >
            Create Asset
          </button>
        </div>
      </div>
    </form>
  );
}