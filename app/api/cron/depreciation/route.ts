import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { batchUpdateDepreciation } from '@/lib/utils/depreciation';
import { CRON_CONFIG } from '@/lib/config/cron';

export async function POST(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_CONFIG.SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify if it's March 31st
    const today = new Date();
    const isMarch31 = today.getMonth() === 2 && today.getDate() === 31;

    // Only proceed if it's March 31st or if force=true is passed
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    if (!isMarch31 && !force) {
      return NextResponse.json({
        message: 'Skipped - Not March 31st',
        date: today.toISOString()
      });
    }

    // Proceed with depreciation update
    const result = await batchUpdateDepreciation(prisma);
    
    // Log the depreciation run
    await prisma.activity.create({
      data: {
        action: 'ANNUAL_DEPRECIATION',
        details: `Annual depreciation run completed. ${result.assetsUpdated} assets updated.`,
      }
    });

    return NextResponse.json({
      ...result,
      date: today.toISOString()
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to update depreciation values' },
      { status: 500 }
    );
  }
} 