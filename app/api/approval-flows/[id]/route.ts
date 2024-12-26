import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

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
    
    const approvalLevel = await prisma.approvalLevel.update({
      where: { id: params.id },
      data: {
        levelNumber: data.levelNumber,
        description: data.description,
        role: { connect: { id: data.roleId } },
        assetType: { connect: { id: data.assetTypeId } },
        nextLevel: data.nextLevelId ? 
          { connect: { id: data.nextLevelId } } : 
          { disconnect: true }
      },
    });

    return NextResponse.json(approvalLevel);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update approval level' },
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

    // First disconnect any related levels
    await prisma.approvalLevel.update({
      where: { id: params.id },
      data: {
        nextLevel: { disconnect: true },
        previousLevel: { disconnect: true }
      }
    });

    // Then delete the level
    await prisma.approvalLevel.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete approval level' },
      { status: 500 }
    );
  }
} 