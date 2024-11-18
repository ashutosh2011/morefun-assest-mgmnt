import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current date and first day of month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get asset distribution
    const [inUseAssets, scrapRequestedAssets, scrappedAssets] = await Promise.all([
      prisma.asset.count({
        where: { assetUsageStatus: 'IN_USE' }
      }),
      prisma.asset.count({
        where: { assetUsageStatus: 'SCRAP_REQUESTED' }
      }),
      prisma.asset.count({
        where: { assetUsageStatus: 'SCRAPPED' }
      })
    ]);

    // Get monthly trends
    const [newAssetsThisMonth, newScrapRequestsThisMonth, scrappedThisMonth] = await Promise.all([
      prisma.asset.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth
          }
        }
      }),
      prisma.scrapRequest.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth
          }
        }
      }),
      prisma.asset.count({
        where: {
          assetUsageStatus: 'SCRAPPED',
          updatedAt: {
            gte: firstDayOfMonth
          }
        }
      })
    ]);

    // Get category-wise distribution
    const categoryDistribution = await prisma.asset.groupBy({
      by: ['assetTypeId'],
      _count: true,
      where: {
        assetUsageStatus: {
          in: ['IN_USE', 'SCRAP_REQUESTED', 'SCRAPPED']
        }
      }
    });

    return NextResponse.json({
      assetDistribution: {
        inUse: inUseAssets,
        scrapRequested: scrapRequestedAssets,
        scrapped: scrappedAssets
      },
      monthlyTrends: {
        newAssets: newAssetsThisMonth,
        newScrapRequests: newScrapRequestsThisMonth,
        scrappedAssets: scrappedThisMonth
      },
      categoryWise: categoryDistribution
    });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Error fetching reports:', error.message);
    } else {
      console.error('Error fetching reports:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
} 