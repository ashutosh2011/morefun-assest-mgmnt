import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { updateAssetDepreciation } from '@/lib/utils/depreciation';

export async function POST(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    console.log(data);
    data.branchId = data.location
    data.location = await prisma.branch.findUnique({where: {id: data.branchId}})
    data.location = data.location.branchName
    // Input validation
    if (!data.name || !data.assetTypeId || !data.branchId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate WDV and cumulative depreciation based on opening balance and addition
    const openingBalance = parseFloat(data.openingBalance) || 0;
    const addition = parseFloat(data.addition) || 0;
    const wdv = openingBalance + addition;

    const asset = await prisma.asset.create({
      data: {
        customAssetId: data.customAssetId,
        assetName: data.name,
        description: data.description,
        assetUsage: data.assetUsage,
        company: data.company,
        location: data.location,
        assetCategory: data.assetCategory,
        vendorName: data.vendorName,
        billDate: data.billDate ? new Date(data.billDate) : null,
        billNumber: data.billNumber,
        openingBalance: openingBalance,
        addition: addition,
        depreciation: 0,
        wdv: wdv,
        cumulativeDepreciation: 0,
        remarks: data.remarks,
        assetUsageStatus: 'IN_USE', // Set default status
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
        // purchaseValue: parseFloat(data.purchaseValue) || 0,
        // depreciationRate: parseFloat(data.depreciationRate) || 0,
        // usefulLife: parseInt(data.usefulLife) || 0,
        quantity: 1,
      },
      include: {
        assetType: true
      }
    });

    // Calculate and update depreciation values
    const updatedAsset = await updateAssetDepreciation(prisma, asset);

    return NextResponse.json(updatedAsset);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error creating asset:', error.message);
      return NextResponse.json(
        { error: 'Database error while creating asset' },
        { status: 400 }
      );
    }
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