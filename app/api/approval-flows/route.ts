import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await auth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const approvalLevels = await prisma.approvalLevel.findMany({
      include: {
        role: true,
        assetType: true,
        nextLevel: {
          include: {
            role: true
          }
        }
      },
      orderBy: {
        assetType: {
          typeName: 'asc'
        }
      },
    });

    return NextResponse.json(approvalLevels);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch approval flows' },
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
    const { levels } = data;

    // Create approval levels in sequence
    let previousLevel = null;
    for (const level of levels) {
      const approvalLevel = await prisma.approvalLevel.create({
        data: {
          levelNumber: level.levelNumber,
          description: level.description,
          role: { connect: { id: level.roleId } },
          assetType: { connect: { id: level.assetTypeId } },
          ...(previousLevel && { previousLevel: { connect: { id: previousLevel.id } } })
        },
      });
      previousLevel = approvalLevel;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create approval flow' },
      { status: 500 }
    );
  }
} 