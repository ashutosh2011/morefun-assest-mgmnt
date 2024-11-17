import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For admin, show all activities. For users, show only their activities
    const where = user.role === 'Admin' ? {} : { userId: user.id };

    const activities = await prisma.activity.findMany({
      where,
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            fullName: true
          }
        },
        asset: {
          select: {
            assetName: true
          }
        }
      }
    });

    return NextResponse.json(activities);

  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
} 