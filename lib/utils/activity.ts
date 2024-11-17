import { prisma } from '@/lib/prisma';

export async function logActivity(data: {
  userId: string;
  action: string;
  details?: string;
  assetId?: string;
}) {
  try {
    await prisma.activity.create({
      data: {
        action: data.action,
        details: data.details,
        user: { connect: { id: data.userId } },
        ...(data.assetId && {
          asset: { connect: { id: data.assetId } }
        })
      }
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

export const ActivityType = {
  ASSET_CREATED: 'ASSET_CREATED',
  ASSET_UPDATED: 'ASSET_UPDATED',
  ASSET_DELETED: 'ASSET_DELETED',
  SCRAP_REQUESTED: 'SCRAP_REQUESTED',
  SCRAP_APPROVED: 'SCRAP_APPROVED',
  SCRAP_REJECTED: 'SCRAP_REJECTED'
} as const; 