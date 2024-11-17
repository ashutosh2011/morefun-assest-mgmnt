import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const user = await auth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assetTypes = await prisma.assetType.findMany({
      select: {
        id: true,
        assetTypeName: true,
        description: true
      },
      orderBy: {
        assetTypeName: 'asc'
      }
    });

    return NextResponse.json(assetTypes);
  } catch (error) {
    console.error('Error fetching asset types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset types' },
      { status: 500 }
    );
  }
}