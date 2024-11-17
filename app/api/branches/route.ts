import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await auth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const branches = await prisma.branch.findMany({
      select: {
        id: true,
        branchName: true,
        location: true,
      },
      orderBy: {
        branchName: 'asc',
      },
    });

    return NextResponse.json(branches.map(branch => ({
      id: branch.id,
      name: branch.branchName,
      location: branch.location
    })));
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch branches', message: error },
      { status: 500 }
    );
  }
} 