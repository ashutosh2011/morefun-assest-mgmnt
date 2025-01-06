import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return new Response(JSON.stringify({ error: 'Asset ID is required' }), {
        status: 400,
      });
    }

    const asset = await prisma.asset.findUnique({
      where: { id: params.id },
      include: {
        department: true,
        branch: true,
        assetType: true,
        user: true,
        depreciations: true
      }
    });

    if (!asset) {
      return new Response(JSON.stringify({ error: 'Asset not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(asset));
  } catch (error) {
    console.error('Error fetching asset:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch asset' }), {
      status: 500,
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return new Response(JSON.stringify({ error: 'Asset ID is required' }), {
        status: 400,
      });
    }

    const data = await request.json();

    // Transform the data if needed
    const updateData = {
      assetName: data.assetName,
      description: data.description,
      assetUsage: data.assetUsage,
      company: data.company,
      location: data.location,
      assetCategory: data.assetCategory,
      vendorName: data.vendorName,
      billDate: new Date(data.billDate),
      billNumber: data.billNumber,
      openingBalance: parseFloat(data.openingBalance),
      addition: parseFloat(data.addition),
      remarks: data.remarks,
      assetTypeId: data.assetTypeId,
      branchId: data.branchId,
      userId: data.assignedUserId,
      departmentId: data.departmentId,
      assetUsageStatus: data.assetUsageStatus,
      customAssetId: data.customAssetId,
    };

    const asset = await prisma.asset.update({
      where: { id: params.id },
      data: updateData,
      include: {
        department: true,
        branch: true,
        assetType: true,
        user: true
      }
    });

    return new Response(JSON.stringify(asset));
  } catch (error) {
    console.error('Error updating asset:', error);
    return new Response(JSON.stringify({ error: 'Failed to update asset' }), {
      status: 500,
    });
  }
} 