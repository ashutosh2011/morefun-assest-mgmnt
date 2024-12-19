'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileDown, AlertCircle, CheckCircle2, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

interface ReferenceData {
  branches: Array<{ id: string; branchName: string, name: string }>;
  departments: Array<{ id: string; departmentName: string }>;
  users: Array<{ id: string; fullName: string }>;
  assetTypes: Array<{ id: string; assetTypeName: string }>;
}

export function BulkUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorFile, setErrorFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [referenceData, setReferenceData] = useState<ReferenceData | null>(null);
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    branches: false,
    departments: false,
    users: false,
    assetTypes: false,
  });

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [branches, departments, users, assetTypes] = await Promise.all([
          fetchWithAuth('/api/branches').then(res => res.json()),
          fetchWithAuth('/api/departments').then(res => res.json()),
          fetchWithAuth('/api/users').then(res => res.json()),
          fetchWithAuth('/api/asset-types').then(res => res.json()),
        ]);

        setReferenceData({ branches, departments, users, assetTypes });
      } catch (error) {
        console.error('Failed to fetch reference data:', error);
      }
    };

    fetchReferenceData();
  }, []);

  const toggleTable = (tableName: keyof ReferenceData) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  const downloadSampleFile = async (type: 'csv' | 'excel') => {
    try {
      const response = await fetchWithAuth(`/api/assets/sample-template?type=${type}`);
      if (!response.ok) throw new Error('Failed to download template');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'csv' ? 'asset-template.csv' : 'asset-template.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download template file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
        'application/vnd.ms-excel', // xls
        'text/csv' // csv
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a valid Excel or CSV file');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setSuccessMessage(null);
      setErrorFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccessMessage(null);
    setErrorFile(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetchWithAuth('/api/assets/bulk-upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const data = await response.json();
      
      // Update progress and handle error file if any
      if (data.results && data.results.length > 0) {
        const lastResult = data.results[data.results.length - 1];
        setProgress(lastResult.progress);
        
        if (lastResult.errorFile) {
          setErrorFile(lastResult.errorFile);
        }
      }

      // Show success message with summary
      setSuccessMessage(
        `Successfully processed ${data.totalProcessed - data.errorsCount} out of ${data.totalProcessed} assets.`
      );

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Template Downloads */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Download Template</h3>
        <div className="flex gap-4">
          <button
            onClick={() => downloadSampleFile('excel')}
            className="flex items-center gap-2 px-4 py-2 border border-[#18BC9C] text-[#18BC9C] rounded-lg hover:bg-[#18BC9C]/10"
          >
            <FileDown size={20} />
            Excel Template
          </button>
          <button
            onClick={() => downloadSampleFile('csv')}
            className="flex items-center gap-2 px-4 py-2 border border-[#18BC9C] text-[#18BC9C] rounded-lg hover:bg-[#18BC9C]/10"
          >
            <FileDown size={20} />
            CSV Template
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Upload File</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload size={40} className="text-gray-400" />
            <span className="text-gray-600">
              {file ? file.name : 'Click to upload or drag and drop'}
            </span>
            <span className="text-sm text-gray-500">
              Supported formats: Excel, CSV
            </span>
          </label>
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
            !file || uploading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#18BC9C] hover:bg-[#18BC9C]/90'
          } text-white transition-colors`}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="mt-6">
          <div className="flex justify-between text-sm text-[#2C3E50] mb-2">
            <span>Processing...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#18BC9C] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle2 size={20} />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Error File Download */}
      {errorFile && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700 mb-2">
            <AlertCircle size={20} />
            Some rows could not be processed
          </div>
          <a
            href={errorFile}
            download
            className="flex items-center gap-2 text-[#18BC9C] hover:text-[#18BC9C]/80"
          >
            <FileDown size={20} />
            Download error report
          </a>
        </div>
      )}

      {/* Reference Tables */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Reference IDs</h3>
        <div className="space-y-4">
          {/* Branches Table */}
          <div className="border rounded-lg">
            <button
              onClick={() => toggleTable('branches')}
              className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <span className="font-medium text-[#2C3E50]">Branch IDs</span>
              {expandedTables.branches ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {expandedTables.branches && (
              <div className="p-4 border-t">
                <div className="max-h-60 overflow-y-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#2C3E50]">Branch Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#2C3E50]">ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {referenceData?.branches.map(branch => (
                        <tr key={branch.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">{branch.name}</td>
                          <td className="px-4 py-2 text-sm font-mono">{branch.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Departments Table */}
          <div className="border rounded-lg">
            <button
              onClick={() => toggleTable('departments')}
              className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <span className="font-medium text-[#2C3E50]">Department IDs</span>
              {expandedTables.departments ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {expandedTables.departments && (
              <div className="p-4 border-t">
                <div className="max-h-60 overflow-y-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#2C3E50]">Department Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#2C3E50]">ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {referenceData?.departments.map(dept => (
                        <tr key={dept.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">{dept.departmentName}</td>
                          <td className="px-4 py-2 text-sm font-mono">{dept.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <button
              onClick={() => toggleTable('users')}
              className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <span className="font-medium text-[#2C3E50]">User IDs</span>
              {expandedTables.users ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {expandedTables.users && (
              <div className="p-4 border-t">
                <div className="max-h-60 overflow-y-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#2C3E50]">User Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#2C3E50]">ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {referenceData?.users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">{user.fullName}</td>
                          <td className="px-4 py-2 text-sm font-mono">{user.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Asset Types Table */}
          <div className="border rounded-lg">
            <button
              onClick={() => toggleTable('assetTypes')}
              className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <span className="font-medium text-[#2C3E50]">Asset Type IDs</span>
              {expandedTables.assetTypes ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {expandedTables.assetTypes && (
              <div className="p-4 border-t">
                <div className="max-h-60 overflow-y-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#2C3E50]">Asset Type</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#2C3E50]">ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {referenceData?.assetTypes.map(type => (
                        <tr key={type.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">{type.assetTypeName}</td>
                          <td className="px-4 py-2 text-sm font-mono">{type.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 