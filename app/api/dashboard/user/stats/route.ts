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

    return NextResponse.json({
      assignedAssets: userAssets,
      pendingRequests: userPendingScrapRequests
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 