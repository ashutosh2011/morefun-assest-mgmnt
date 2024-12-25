import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { batchUpdateDepreciation } from '@/lib/utils/depreciation';

export async function POST(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await batchUpdateDepreciation(prisma);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating depreciation:', error);
    return NextResponse.json(
      { error: 'Failed to update depreciation values' },
      { status: 500 }
    );
  }
} 