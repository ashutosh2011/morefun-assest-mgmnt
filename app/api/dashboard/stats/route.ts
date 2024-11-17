import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get overall stats
    const [
      itAssets,
      nonItAssets,
      pendingScrapRequests,
      activeAssets,
      userAssets,
      userPendingScrapRequests
    ] = await Promise.all([
      // Count IT assets
      prisma.asset.count({
        where: {
          assetType: {
            assetTypeName: 'IT Asset'
          }
        }
      }),

      // Count Non-IT assets
      prisma.asset.count({
        where: {
          assetType: {
            assetTypeName: 'Non-IT Asset'
          }
        }
      }),

      // Count all pending scrap requests
      prisma.scrapRequest.count({
        where: {
          status: 'PENDING'
        }
      }),

      // Count active assets
      prisma.asset.count({
        where: {
          assetUsageStatus: 'IN_USE'
        }
      }),

      // Count assets assigned to current user
      prisma.asset.count({
        where: {
          userId: userId
        }
      }),

      // Count pending scrap requests by current user
      prisma.scrapRequest.count({
        where: {
          requestedById: userId,
          status: 'PENDING'
        }
      })
    ]);

    return NextResponse.json({
      overall: {
        itAssets,
        nonItAssets,
        pendingScrapRequests,
        activeAssets,
      },
      personal: {
        assignedAssets: userAssets,
        pendingRequests: userPendingScrapRequests
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 