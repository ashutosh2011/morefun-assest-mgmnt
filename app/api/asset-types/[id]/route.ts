import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id } = params;

    // Validate required fields
    if (!data.assetTypeName || data.depreciationPercentage === undefined) {
      return NextResponse.json(
        { error: 'Asset type name and depreciation percentage are required' },
        { status: 400 }
      );
    }

    // Check if asset type name already exists (excluding current record)
    const existing = await prisma.assetType.findFirst({
      where: {
        assetTypeName: data.assetTypeName,
        NOT: {
          id: id
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Asset type with this name already exists' },
        { status: 400 }
      );
    }

    const assetType = await prisma.assetType.update({
      where: { id },
      data: {
        assetTypeName: data.assetTypeName,
        description: data.description,
        depreciationPercentage: data.depreciationPercentage
      }
    });

    return NextResponse.json(assetType);
  } catch (error) {
    console.error('Error updating asset type:', error);
    return NextResponse.json(
      { error: 'Failed to update asset type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if there are any assets using this asset type
    const assetsUsingType = await prisma.asset.findFirst({
      where: { assetTypeId: id }
    });

    if (assetsUsingType) {
      return NextResponse.json(
        { error: 'Cannot delete asset type that is being used by assets' },
        { status: 400 }
      );
    }

    await prisma.assetType.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting asset type:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset type' },
      { status: 500 }
    );
  }
} 