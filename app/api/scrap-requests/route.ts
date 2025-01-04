import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { assetId, reason } = data;

    // Validate input
    if (!assetId || !reason) {
      return NextResponse.json({ error: 'Asset ID and reason are required' }, { status: 400 });
    }

    // First get the asset to determine its asset type
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: { assetType: true }
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    const existingScrapRequest = await prisma.scrapRequest.findFirst({
      where: {
        assetId,
        status: {
          in: ['PENDING', 'APPROVED'],
        },
      },
    });

    if (existingScrapRequest) {
      return NextResponse.json(
        { error: 'A scrap request for this asset is already pending or approved' },
        { status: 400 }
      );
    }

    // Get the first approval level for this asset type
    const firstApprovalLevel = await prisma.approvalLevel.findFirst({
      where: {
        assetTypeId: asset.assetTypeId,
        levelNumber: 1
      }
    });

    if (!firstApprovalLevel) {
      return NextResponse.json(
        { error: 'No approval workflow found for this asset type' },
        { status: 400 }
      );
    }

    // Create a new scrap request
    const scrapRequest = await prisma.scrapRequest.create({
      data: {
        asset: {
          connect: { id: assetId },
        },
        reason,
        status: 'PENDING',
        requestedBy: {
          connect: { id: user.id },
        },
        currentApprovalLevel: {
          connect: { 
            assetTypeId_levelNumber: {
              assetTypeId: asset.assetTypeId,
              levelNumber: 1
            }
          }
        },
      },
    });

    return NextResponse.json(scrapRequest);
  } catch (error) {
    console.error('Error creating scrap request:', error);
    return NextResponse.json(
      { error: 'Failed to create scrap request' },
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
    const status = searchParams.get('status');
    const pendingApproval = searchParams.get('pendingApproval') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause based on filters
    const where: Prisma.ScrapRequestWhereInput = {
      AND: [
        // Add status filter if provided
        status ? { status: status.toUpperCase() } : {},
        
        // Add pending approval filter if true
        pendingApproval ? {
          currentApprovalLevel: {
            role: {
              users: {
                some: {
                  id: user.id
                }
              }
            }
          }
        } : {},
      ]
    };

    // Get scrap requests with pagination
    const [scrapRequests, total] = await Promise.all([
      prisma.scrapRequest.findMany({
        where,
        include: {
          asset: {
            select: {
              id: true,
              assetName: true,
              billNumber: true,
            }
          },
          requestedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            }
          },
          currentApprovalLevel: {
            select: {
              id: true,
              levelNumber: true,
              role: {
                select: {
                  roleName: true
                }
              }
            }
          },
          approvals: {
            select: {
              id: true,
              status: true,
              comments: true,
              approver: {
                select: {
                  fullName: true
                }
              }
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.scrapRequest.count({ where })
    ]);

    return NextResponse.json({
      scrapRequests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error('Error fetching scrap requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scrap requests' },
      { status: 500 }
    );
  }
} 