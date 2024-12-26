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
    const { id } = params;

    // Check if a different level with this number already exists for this asset type
    const existingLevel = await prisma.approvalLevel.findFirst({
      where: {
        assetTypeId: data.assetTypeId,
        levelNumber: data.levelNumber,
        NOT: {
          id: id
        }
      },
    });

    if (existingLevel) {
      return NextResponse.json(
        { error: 'An approval level with this number already exists for this asset type' },
        { status: 400 }
      );
    }

    // Get the current level to check its relationships
    const currentLevel = await prisma.approvalLevel.findUnique({
      where: { id },
      include: {
        previousLevel: true,
        nextLevel: true
      }
    });

    if (!currentLevel) {
      return NextResponse.json({ error: 'Approval level not found' }, { status: 404 });
    }

    // Update the approval level
    const updatedLevel = await prisma.approvalLevel.update({
      where: { id },
      data: {
        levelNumber: data.levelNumber,
        description: data.description,
        roleId: data.roleId,
      },
      include: {
        role: true,
        assetType: true,
        nextLevel: {
          include: {
            role: true
          }
        }
      },
    });

    // Reorder the chain if level number changed
    if (currentLevel.levelNumber !== data.levelNumber) {
      // Find the new previous level based on the new level number
      const newPreviousLevel = await prisma.approvalLevel.findFirst({
        where: {
          assetTypeId: currentLevel.assetTypeId,
          levelNumber: {
            lt: data.levelNumber
          },
          NOT: {
            id: currentLevel.id
          }
        },
        orderBy: {
          levelNumber: 'desc'
        }
      });

      // Update the relationships
      await prisma.$transaction([
        // Clear old relationships
        prisma.approvalLevel.update({
          where: { id: currentLevel.id },
          data: { nextLevelId: null }
        }),
        
        // Update previous level's next level if it exists
        ...(currentLevel.previousLevel ? [
          prisma.approvalLevel.update({
            where: { id: currentLevel.previousLevel.id },
            data: { nextLevelId: currentLevel.nextLevel?.id || null }
          })
        ] : []),

        // Set new relationships
        prisma.approvalLevel.update({
          where: { id: currentLevel.id },
          data: {
            nextLevelId: null // Clear any existing next level
          }
        }),
        
        // Update the new previous level if it exists
        ...(newPreviousLevel ? [
          prisma.approvalLevel.update({
            where: { id: newPreviousLevel.id },
            data: { nextLevelId: currentLevel.id }
          })
        ] : [])
      ]);
    }

    return NextResponse.json(updatedLevel);
  } catch (error) {
    console.error('Error updating approval flow:', error);
    return NextResponse.json(
      { error: 'Failed to update approval flow' },
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

    // Get the current level to check its relationships
    const currentLevel = await prisma.approvalLevel.findUnique({
      where: { id },
      include: {
        previousLevel: true,
        nextLevel: true
      }
    });

    if (!currentLevel) {
      return NextResponse.json({ error: 'Approval level not found' }, { status: 404 });
    }

    // Update the relationships before deleting
    if (currentLevel.previousLevel && currentLevel.nextLevel) {
      await prisma.approvalLevel.update({
        where: { id: currentLevel.previousLevel.id },
        data: { nextLevelId: currentLevel.nextLevel.id }
      });
    }

    // Delete the approval level
    await prisma.approvalLevel.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting approval flow:', error);
    return NextResponse.json(
      { error: 'Failed to delete approval flow' },
      { status: 500 }
    );
  }
} 