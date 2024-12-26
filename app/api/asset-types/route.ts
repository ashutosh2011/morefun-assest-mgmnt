import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const user = await auth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assetTypes = await prisma.assetType.findMany({
      orderBy: {
        assetTypeName: 'asc'
      }
    });

    return NextResponse.json(assetTypes);
  } catch (error) {
    console.error('Error fetching asset types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset types' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.assetTypeName || data.depreciationPercentage === undefined) {
      return NextResponse.json(
        { error: 'Asset type name and depreciation percentage are required' },
        { status: 400 }
      );
    }

    // Check if asset type name already exists
    const existing = await prisma.assetType.findFirst({
      where: {
        assetTypeName: data.assetTypeName
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Asset type with this name already exists' },
        { status: 400 }
      );
    }

    const assetType = await prisma.assetType.create({
      data: {
        assetTypeName: data.assetTypeName,
        description: data.description,
        depreciationPercentage: data.depreciationPercentage
      }
    });

    return NextResponse.json(assetType);
  } catch (error) {
    console.error('Error creating asset type:', error);
    return NextResponse.json(
      { error: 'Failed to create asset type' },
      { status: 500 }
    );
  }
}