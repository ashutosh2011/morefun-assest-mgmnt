'use client'
import React, { useState, useEffect } from 'react';
// import { Upload } from 'lucide-react';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

export function ScrapRequestForm() {
  const [formData, setFormData] = useState({
    assetId: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetchWithAuth('/api/assets?status=IN_USE');
        if (!response.ok) {
          throw new Error('Failed to fetch assets');
        }
        const data = await response.json();
        console.log(data);
        setAssets(data.assets);
      } catch (err) {
        console.error(err);
        setError('Failed to load assets');
      }
    };

    fetchAssets();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/scrap-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json();
          if (data.error) {
            setError(data.error);
          } else {
            setError('Failed to create scrap request');
          }
        } else {
          throw new Error('Failed to create scrap request');
        }
      }

      // Handle successful response (e.g., show a success message or reset the form)
      console.log('Scrap request created successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create scrap request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Select Asset
            <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            name="assetId"
            value={formData.assetId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
          >
            <option value="">Choose an asset</option>
            {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            assets && assets.length > 0 && assets.map((asset: any) => (
              <option key={asset.id} value={asset.id}>
                {asset.assetName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2C3E50] mb-1">
            Reason for Scrapping
            <span className="text-[#E74C3E]">*</span>
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#18BC9C]"
            placeholder="Please provide detailed reason for scrapping this asset..."
          ></textarea>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-end space-x-4">
          <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg text-[#2C3E50] hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </form>
  );
}