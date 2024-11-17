import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { assetId, reason } = data;

    // Validate input
    if (!assetId || !reason) {
      return NextResponse.json({ error: 'Asset ID and reason are required' }, { status: 400 });
    }

    // Create a new scrap request
    const scrapRequest = await prisma.scrapRequest.create({
      data: {
        asset: {
          connect: { id: assetId },
        },
        reason,
        status: 'PENDING',
        requestedBy: {
          connect: { id: user.id },
        },
        currentApprovalLevel: {
            connect: {
                levelNumber: 1
            }
        },
      },
    });

    return NextResponse.json(scrapRequest);
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Error creating asset:', error.message);
      } else {
        console.error('Error creating asset:', error.message);
      }
    return NextResponse.json({ error: 'Failed to create scrap request', message: error }, { status: 500 });
  }
} 