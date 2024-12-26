import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

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

    // Validate required fields
    if (!data.branchName || !data.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.update({
      where: { id: params.id },
      data: {
        branchName: data.branchName,
        location: data.location,
      },
    });

    return NextResponse.json(branch);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A branch with this name already exists' },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { error: 'Failed to update branch' },
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

    // Check if branch has associated assets
    const branchWithAssets = await prisma.branch.findFirst({
      where: { id: params.id },
      include: { assets: { take: 1 } }
    });

    if (branchWithAssets?.assets.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete branch with associated assets' },
        { status: 400 }
      );
    }

    await prisma.branch.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete branch' },
      { status: 500 }
    );
  }
}