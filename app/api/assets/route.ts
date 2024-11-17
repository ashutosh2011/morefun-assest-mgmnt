import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const asset = await prisma.asset.create({
      data: {
        assetName: data.assetName,
        description: data.description,
        serialNumber: data.serialNumber,
        quantity: parseInt(data.quantity),
        dateOfPurchase: new Date(data.dateOfPurchase),
        purchaseValue: parseFloat(data.purchaseValue),
        depreciationRate: parseFloat(data.depreciationRate),
        usefulLife: parseInt(data.usefulLife),
        salvageValue: parseFloat(data.salvageValue),
        currentValue: parseFloat(data.purchaseValue),
        lastDepreciationDate: new Date(data.dateOfPurchase),
        assetUsageStatus: 'IN_USE',
        remarks: data.remarks,
        departmentId: data.departmentId,
        branchId: data.branchId,
        userId: user.id,
        assetTypeId: data.assetTypeId,
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        action: 'ASSET_CREATED',
        details: `Created new asset: ${asset.assetName}`,
        userId: user.id,
        assetId: asset.id,
      }
    });

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId');
    const assetTypeId = searchParams.get('assetTypeId');
    const status = searchParams.get('status');

    const where = {
      AND: [
        search ? {
          OR: [
            { assetName: { contains: search, mode: 'insensitive' } },
            { serialNumber: { contains: search, mode: 'insensitive' } },
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
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
} 