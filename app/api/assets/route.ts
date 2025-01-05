import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { createAssetWithDepreciation } from '@/lib/utils/assetDepreciation';
import { AssetUsageStatus } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Input validation
    if (!data.name || !data.assetTypeId || !data.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get branch details
    data.branchId = data.location;
    const branch = await prisma.branch.findUnique({
      where: { id: data.branchId }
    });
    if (!branch) {
      return NextResponse.json(
        { error: 'Invalid branch selected' },
        { status: 400 }
      );
    }
    data.location = branch.branchName;

    // Get asset type for depreciation calculation
    const assetType = await prisma.assetType.findUnique({
      where: { id: data.assetTypeId }
    });
    if (!assetType) {
      return NextResponse.json(
        { error: 'Invalid asset type selected' },
        { status: 400 }
      );
    }

    // Prepare asset data
    const assetData = {
      customAssetId: data.customAssetId,
      assetName: data.name,
      description: data.description,
      assetUsage: data.assetUsage,
      company: data.company,
      location: data.location,
      assetCategory: data.assetCategory,
      vendorName: data.vendorName,
      billDate: data.billDate ? new Date(data.billDate) : new Date(),
      billNumber: data.billNumber,
      openingBalance: parseFloat(data.openingBalance) || 0,
      addition: parseFloat(data.addition) || 0,
      remarks: data.remarks,
      assetUsageStatus: AssetUsageStatus.IN_USE,
      scrappedAtDate: null,
      department: data.departmentId ? {
        connect: { id: data.departmentId }
      } : undefined,
      branch: {
        connect: { id: data.branchId }
      },
      user: data.assignedUserId ? {
        connect: { id: data.assignedUserId }
      } : undefined,
      assetType: {
        connect: { id: data.assetTypeId }
      },
      serialNumber: data.serialNumber,
      quantity: 1,
    };

    // Create asset with historical depreciation
    const asset = await createAssetWithDepreciation(prisma, assetData, assetType);
    return NextResponse.json(asset);

  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { error: 'Failed to create asset' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const search = searchParams.get('search')?.trim() || '';
    const departmentId = searchParams.get('departmentId');
    const assetTypeId = searchParams.get('assetTypeId');
    const status = searchParams.get('status');

    const where = {
      AND: [
        search ? {
          OR: [
            { assetName: { contains: search } },
          ],
        } : {},
        departmentId ? { departmentId } : {},
        assetTypeId ? { assetTypeId } : {},
        status ? { assetUsageStatus: status } : {},
      ],
    };

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        include: {
          department: true,
          branch: true,
          user: true,
          assetType: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asset.count({ where }),
    ]);

    return NextResponse.json({
      assets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Error fetching assets:', error.message);
    } else {
      console.error('Error fetching assets:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch assets', message: error },
      { status: 500 }
    );
  }
} 