import React from 'react';
import { Upload } from 'lucide-react';

export function ScrapRequestForm() {
  return (
    <form className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Select Asset
            <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
          >
            <option value="">Choose an asset</option>
            <option value="ast001">AST001 - MacBook Pro 16&quot;</option>
            <option value="ast002">AST002 - Dell XPS Desktop</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Reason for Scrapping
            <span className="text-[#E74C3C]">*</span>
          </label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
            placeholder="Please provide detailed reason for scrapping this asset..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Supporting Documents
          </label>
          <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex flex-col items-center">
              <Upload className="text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-600">
                Drag and drop files here, or{" "}
                <button type="button" className="text-[#18BC9C] hover:text-[#18BC9C]/80">
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, PNG, JPG up to 10MB each
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Request Process</h3>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>Submit scrap request with required details</li>
            <li>Manager reviews the request</li>
            <li>If approved, asset will be marked for disposal</li>
            <li>IT team handles the physical disposal process</li>
          </ol>
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
            Submit Request
          </button>
        </div>
      </div>
    </form>
  );
}