import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get admin stats
    const [
      itAssets,
      nonItAssets,
      pendingScrapRequests,
      activeAssets,
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
      })
    ]);

    return NextResponse.json({
      itAssets,
      nonItAssets,
      pendingScrapRequests,
      activeAssets,
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 