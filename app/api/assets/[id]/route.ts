import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;

    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        department: true,
        branch: true,
        assetType: true,
        user: true,
        depreciations: true
      }
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
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
      where: { id },
      data: updateData,
      include: {
        department: true,
        branch: true,
        assetType: true,
        user: true
      }
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 }
    );
  }
} 