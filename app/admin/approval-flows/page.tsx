'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

export default function ManageApprovalFlows() {
  const [approvalFlows, setApprovalFlows] = useState([]);
  const [roles, setRoles] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlow, setEditingFlow] = useState(null);

  useEffect(() => {
    fetchApprovalFlows();
    fetchRoles();
    fetchAssetTypes();
  }, []);

  const fetchApprovalFlows = async () => {
    try {
      const response = await fetchWithAuth('/api/approval-flows');
      const data = await response.json();
      setApprovalFlows(data);
    } catch (error) {
      console.error('Error fetching approval flows:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetchWithAuth('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchAssetTypes = async () => {
    try {
      const response = await fetchWithAuth('/api/asset-types');
      const data = await response.json();
      setAssetTypes(data);
    } catch (error) {
      console.error('Error fetching asset types:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2C3E50]">Approval Workflows</h1>
            <p className="text-gray-600">Configure approval flows for different asset types</p>
          </div>
          <button
            onClick={() => {
              setEditingFlow(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90"
          >
            <Plus size={20} />
            <span>Create New Flow</span>
          </button>
        </div>

        <div className="grid gap-6">
          {assetTypes.map(assetType => {
            const typeFlows = approvalFlows.filter(flow => flow.assetTypeId === assetType.id);
            if (typeFlows.length === 0) return null;

            return (
              <div key={assetType.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
                  {assetType.typeName}
                </h2>
                <div className="flex items-center gap-4">
                  {typeFlows
                    .sort((a, b) => a.levelNumber - b.levelNumber)
                    .map((flow, index) => (
                      <React.Fragment key={flow.id}>
                        <div 
                          className="bg-gray-50 p-4 rounded-lg border"
                          onClick={() => {
                            setEditingFlow(flow);
                            setIsModalOpen(true);
                          }}
                        >
                          <p className="font-medium text-[#2C3E50]">Level {flow.levelNumber}</p>
                          <p className="text-sm text-gray-600">{flow.role.roleName}</p>
                        </div>
                        {index < typeFlows.length - 1 && (
                          <ArrowRight className="text-gray-400" />
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {isModalOpen && (
          <ApprovalFlowModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            roles={roles}
            assetTypes={assetTypes}
            initialData={editingFlow}
            onSubmit={async (data) => {
              try {
                await fetchWithAuth(`/api/approval-flows${editingFlow ? `/${editingFlow.id}` : ''}`, {
                  method: editingFlow ? 'PUT' : 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                });
                setIsModalOpen(false);
                fetchApprovalFlows();
              } catch (error) {
                console.error('Error saving approval flow:', error);
              }
            }}
          />
        )}
      </main>
    </div>
  );
} 