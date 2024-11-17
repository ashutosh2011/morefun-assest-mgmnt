import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user-specific stats
    const [userAssets, userPendingScrapRequests] = await Promise.all([
      // Count assets assigned to current user
      prisma.asset.count({
        where: {
          userId: user.id
        }
      }),
      // Count pending scrap requests by current user
      prisma.scrapRequest.count({
        where: {
          requestedById: user.id,
          status: 'PENDING'
        }
      })
    ]);

    // If user is admin or manager, get additional stats
    let overallStats = null;
    //TODO: fetch roleId via roleName

    if (user.role.roleName !== 'User') {
      const [totalAssets, pendingApprovals, scrappedAssets] = await Promise.all([
        // Count all assets
        prisma.asset.count({
          where: {
            assetUsageStatus: 'IN_USE'
          }
        }),
        // Count pending approvals for their role
        prisma.scrapRequest.count({
          where: {
            status: 'PENDING',
            currentApprovalLevel: {
              role: {
                roleName: user.role.roleName
              }
            }
          }
        }),
        // Count scrapped assets
        prisma.asset.count({
          where: {
            assetUsageStatus: 'SCRAPPED'
          }
        })
      ]);

      overallStats = {
        totalAssets,
        pendingApprovals,
        scrappedAssets
      };
    }

    return NextResponse.json({
      user: {
        name: user.fullName,
        role: user.role
      },
      personal: {
        assignedAssets: userAssets,
        pendingRequests: userPendingScrapRequests
      },
      overall: overallStats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 