import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { batchUpdateDepreciation } from '@/lib/utils/depreciation';

export async function POST(request: Request) {
  try {
    // Verify cron job secret if needed
    const result = await batchUpdateDepreciation(prisma);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to update depreciation values' },
      { status: 500 }
    );
  }
} 