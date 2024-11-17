import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    data.salvageValue = 0;
    data.remarks = data.remarks || "";

    console.log("received data",data);
    
    const asset = await prisma.asset.create({
      data: {
        assetName: data.name,
        description: data.description,
        serialNumber: data.serialNumber,
        dateOfPurchase: new Date(data.purchaseDate),
        purchaseValue: parseFloat(data.purchaseValue),
        depreciationRate: parseFloat(data.depreciationRate),
        usefulLife: parseInt(data.usefulLife),
        salvageValue: parseFloat(data.salvageValue),
        currentValue: parseFloat(data.purchaseValue),
        lastDepreciationDate: new Date(data.purchaseDate),
        assetUsageStatus: 'IN_USE',
        remarks: data.remarks,
        department: {
          connect: {
            id: data.departmentId
          }
        },
        branch: {
          connect: {
            id: data.branchId
          }
        },
        user: {
          connect: {
            id: user.id
          }
        },
        assetType: {
          connect: {
            id: data.assetTypeId
          }
        },
        quantity: 1
      }
    });

    console.log("asset created",asset);

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
    if(error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Error creating asset:', error.message);
    } else {
      console.error('Error creating asset:', error);
    }
    return NextResponse.json(
      { error: 'Failed to create asset', message: error },
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