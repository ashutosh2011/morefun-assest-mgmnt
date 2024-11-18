import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logActivity, ActivityType } from '@/lib/utils/activity';

export async function PUT(
  request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = request.url;
    const id = url.split('/').pop();


    const { action, comments } = await request.json();
    const scrapRequestId = id;

    // Fetch the scrap request with its current approval level
    const scrapRequest = await prisma.scrapRequest.findUnique({
      where: { id: scrapRequestId },
      include: {
        currentApprovalLevel: {
          include: {
            role: true,
            nextLevel: true
          }
        },
        asset: true
      }
    });

    if (!scrapRequest) {
      return NextResponse.json({ error: 'Scrap request not found' }, { status: 404 });
    }

    // Check if user has permission to approve/reject
    const userRole = await prisma.role.findFirst({
      where: {
        users: { some: { id: user.id } }
      }
    });

    if (!userRole || userRole.id !== scrapRequest.currentApprovalLevel.roleId) {
      return NextResponse.json({ error: 'Not authorized to approve/reject this request' }, { status: 403 });
    }

    // Create the approval record
    const approval = await prisma.approval.create({
      data: {
        status: action,
        comments,
        scrapRequest: { connect: { id: scrapRequestId } },
        approver: { connect: { id: user.id } },
        approvalLevel: { connect: { id: scrapRequest.currentApprovalLevelId } }
      }
    });

    console.log('Approval created:', approval);

    let updatedScrapRequest;

    if (action === 'REJECTED') {
      // If rejected, update scrap request status to rejected
      updatedScrapRequest = await prisma.scrapRequest.update({
        where: { id: scrapRequestId },
        data: { status: 'REJECTED' }
      });

      // Log activity
      await logActivity({
        userId: user.id,
        action: ActivityType.SCRAP_REJECTED,
        details: `Scrap request for ${scrapRequest.asset.assetName} was rejected`,
        assetId: scrapRequest.assetId
      });

    } else if (action === 'APPROVED') {
      if (scrapRequest.currentApprovalLevel.nextLevel) {
        // If there's a next level, update the current approval level
        updatedScrapRequest = await prisma.scrapRequest.update({
          where: { id: scrapRequestId },
          data: {
            currentApprovalLevel: {
              connect: { id: scrapRequest.currentApprovalLevel.nextLevel.id }
            }
          }
        });
      } else {
        // If this was the final approval, mark as approved and update asset status
        updatedScrapRequest = await prisma.$transaction([
          prisma.scrapRequest.update({
            where: { id: scrapRequestId },
            data: { status: 'APPROVED' }
          }),
          prisma.asset.update({
            where: { id: scrapRequest.assetId },
            data: { assetUsageStatus: 'SCRAPPED' }
          })
        ]);

        // Log activity
        await logActivity({
          userId: user.id,
          action: ActivityType.SCRAP_APPROVED,
          details: `Scrap request for ${scrapRequest.asset.assetName} was approved`,
          assetId: scrapRequest.assetId
        });
      }
    }

    return NextResponse.json(updatedScrapRequest);

  } catch (error) {
    console.error('Error processing scrap request:', error);
    return NextResponse.json(
      { error: 'Failed to process scrap request' },
      { status: 500 }
    );
  }
}

// GET endpoint for viewing scrap request details
export async function GET(
  request: Request
) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = request.url;
    const id = url.split('/').pop();

    const scrapRequest = await prisma.scrapRequest.findUnique({
      where: { id: id },
      include: {
        asset: {
          select: {
            id: true,
            assetName: true,
            serialNumber: true,
            assetType: true,
            department: true
          }
        },
        requestedBy: {
          select: {
            fullName: true,
            email: true
          }
        },
        currentApprovalLevel: {
          include: {
            role: true
          }
        },
        approvals: {
          include: {
            approver: {
              select: {
                fullName: true,
                email: true
              }
            },
            approvalLevel: {
              include: {
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!scrapRequest) {
      return NextResponse.json({ error: 'Scrap request not found' }, { status: 404 });
    }

    return NextResponse.json(scrapRequest);

  } catch (error) {
    console.error('Error fetching scrap request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scrap request details' },
      { status: 500 }
    );
  }
} 