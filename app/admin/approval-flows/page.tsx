'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { ApprovalFlowModal } from '@/components/Admin/ApprovalFlowModal';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { toast } from 'sonner';

export default function ManageApprovalFlows() {
  const [approvalFlows, setApprovalFlows] = useState([]);
  const [roles, setRoles] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlow, setEditingFlow] = useState(null);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [loading, setLoading] = useState({
    flows: false,
    roles: false,
    assetTypes: false,
    submit: false,
  });

  useEffect(() => {
    fetchApprovalFlows();
    fetchRoles();
    fetchAssetTypes();
  }, []);

  const fetchApprovalFlows = async () => {
    try {
      setLoading(prev => ({ ...prev, flows: true }));
      const response = await fetchWithAuth('/api/approval-flows');
      const data = await response.json();
      setApprovalFlows(data);
    } catch (error) {
      toast.error('Failed to fetch approval flows');
      console.error('Error fetching approval flows:', error);
    } finally {
      setLoading(prev => ({ ...prev, flows: false }));
    }
  };

  const fetchRoles = async () => {
    try {
      setLoading(prev => ({ ...prev, roles: true }));
      const response = await fetchWithAuth('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      toast.error('Failed to fetch roles');
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(prev => ({ ...prev, roles: false }));
    }
  };

  const fetchAssetTypes = async () => {
    try {
      setLoading(prev => ({ ...prev, assetTypes: true }));
      const response = await fetchWithAuth('/api/asset-types');
      const data = await response.json();
      setAssetTypes(data);
    } catch (error) {
      toast.error('Failed to fetch asset types');
      console.error('Error fetching asset types:', error);
    } finally {
      setLoading(prev => ({ ...prev, assetTypes: false }));
    }
  };

  const handleCreateFlow = (assetType) => {
    setSelectedAssetType(assetType);
    setEditingFlow(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2C3E50]">Approval Workflows</h1>
            <p className="text-gray-600">Configure approval flows for different asset types</p>
          </div>
        </div>

        {loading.flows || loading.assetTypes ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#18BC9C]" />
          </div>
        ) : (
          <div className="grid gap-6">
            {assetTypes.map(assetType => {
              const typeFlows = approvalFlows.filter(flow => flow.assetTypeId === assetType.id);

              return (
                <div key={assetType.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#2C3E50]">
                      {assetType.assetTypeName}
                    </h2>
                    <button
                      onClick={() => handleCreateFlow(assetType)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#18BC9C] text-white rounded-lg hover:bg-[#18BC9C]/90 text-sm"
                    >
                      <Plus size={16} />
                      <span>Add Level</span>
                    </button>
                  </div>
                  
                  {typeFlows.length > 0 ? (
                    <div className="flex items-center gap-4">
                      {typeFlows
                        .sort((a, b) => a.levelNumber - b.levelNumber)
                        .map((flow, index) => (
                          <React.Fragment key={flow.id}>
                            <div 
                              className="bg-gray-50 p-4 rounded-lg border cursor-pointer hover:border-[#18BC9C] transition-colors"
                              onClick={() => {
                                setEditingFlow(flow);
                                setSelectedAssetType(assetType);
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
                  ) : (
                    <p className="text-gray-500 text-sm">No approval levels configured</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isModalOpen && (
          <ApprovalFlowModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedAssetType(null);
            }}
            roles={roles}
            assetType={selectedAssetType}
            initialData={editingFlow}
            onSubmit={async (data) => {
              try {
                setLoading(prev => ({ ...prev, submit: true }));
                await fetchWithAuth(`/api/approval-flows${editingFlow ? `/${editingFlow.id}` : ''}`, {
                  method: editingFlow ? 'PUT' : 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...data, assetTypeId: selectedAssetType.id }),
                });
                setIsModalOpen(false);
                setSelectedAssetType(null);
                await fetchApprovalFlows();
                toast.success(editingFlow ? 'Approval level updated' : 'Approval level created');
              } catch (error) {
                console.error('Error saving approval flow:', error);
                toast.error('Failed to save approval level');
              } finally {
                setLoading(prev => ({ ...prev, submit: false }));
              }
            }}
            isSubmitting={loading.submit}
          />
        )}
      </main>
    </div>
  );
} 