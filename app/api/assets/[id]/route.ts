import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await auth(request);
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    await params; 
    const asset = await prisma.asset.findUnique({
      where: { id: params.id },
      include: {
        assetType: true,
        department: true,
        user: true,
        activities: true,
        scrapRequests: true,
        branch: true,
      },
    });

    if (!asset) {
      return new NextResponse('Asset not found', { status: 404 });
    }

    return NextResponse.json(asset);
  } catch (error) {
    return NextResponse.json(
        { error: 'Failed to fetch asset', message: error },
        { status: 500 }
      );
  }
} 