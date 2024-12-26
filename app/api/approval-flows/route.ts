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
      orderBy: [
        {
          assetType: {
            assetTypeName: 'asc'
          }
        },
        {
          levelNumber: 'asc'
        }
      ],
    });

    return NextResponse.json(approvalLevels);
  } catch (error) {
    console.error('Error fetching approval flows:', error);
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
    
    // Check if a level with this number already exists for this asset type
    const existingLevel = await prisma.approvalLevel.findFirst({
      where: {
        assetTypeId: data.assetTypeId,
        levelNumber: data.levelNumber,
      },
    });

    if (existingLevel) {
      return NextResponse.json(
        { error: 'An approval level with this number already exists for this asset type' },
        { status: 400 }
      );
    }

    // Find the previous level (if any) based on level number
    const previousLevel = await prisma.approvalLevel.findFirst({
      where: {
        assetTypeId: data.assetTypeId,
        levelNumber: {
          lt: data.levelNumber
        },
        nextLevelId: null // Only get the one that doesn't have a next level
      },
      orderBy: {
        levelNumber: 'desc'
      }
    });

    // Create the new approval level
    const approvalLevel = await prisma.approvalLevel.create({
      data: {
        levelNumber: data.levelNumber,
        description: data.description,
        roleId: data.roleId,
        assetTypeId: data.assetTypeId,
      },
      include: {
        role: true,
        assetType: true,
      },
    });

    // If there was a previous level, update its nextLevelId
    if (previousLevel) {
      await prisma.approvalLevel.update({
        where: { id: previousLevel.id },
        data: { nextLevelId: approvalLevel.id }
      });
    }

    return NextResponse.json(approvalLevel);
  } catch (error) {
    console.error('Error creating approval flow:', error);
    return NextResponse.json(
      { error: 'Failed to create approval flow' },
      { status: 500 }
    );
  }
} 