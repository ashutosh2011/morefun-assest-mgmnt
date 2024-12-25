import { Asset, AssetType } from '@prisma/client';

interface DepreciationResult {
  currentValue: number;
  depreciationAmount: number;
  cumulativeDepreciation: number;
  wdv: number; // Written Down Value
}

export function calculateDepreciation(
  asset: Asset & { assetType: AssetType }
): DepreciationResult {
  // If asset is scrapped, calculate depreciation until scrap date
  const calculationDate = asset.assetUsageStatus === 'SCRAPPED' 
    ? asset.scrappedAtDate || new Date()
    : new Date();

  // Get the initial values
  const totalValue = asset.openingBalance + asset.addition;
  const depreciationRate = asset.assetType.depreciationPercentage / 100;
  
  // Calculate days in use
  const billDate = new Date(asset.billDate);
  const daysInUse = Math.floor(
    (calculationDate.getTime() - billDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If asset is less than a day old, return initial values
  if (daysInUse < 1) {
    return {
      currentValue: totalValue,
      depreciationAmount: 0,
      cumulativeDepreciation: 0,
      wdv: totalValue
    };
  }

  // Calculate depreciation
  const depreciation = totalValue * depreciationRate * (daysInUse / 365);
  
  // Calculate WDV
  const wdv = totalValue - depreciation;

  // Ensure WDV doesn't go below 5% of original value (as per Indian accounting practices)
  const minimumValue = totalValue * 0.05;
  const finalWdv = Math.max(wdv, minimumValue);
  const finalDepreciation = totalValue - finalWdv;

  return {
    currentValue: finalWdv,
    depreciationAmount: finalDepreciation - (asset.depreciation || 0), // New depreciation for this period
    cumulativeDepreciation: finalDepreciation,
    wdv: finalWdv
  };
}

// Helper function to update asset depreciation values
export async function updateAssetDepreciation(
  prisma: any,
  asset: Asset & { assetType: AssetType }
) {
  const depreciation = calculateDepreciation(asset);

  return await prisma.asset.update({
    where: { id: asset.id },
    data: {
      depreciation: depreciation.depreciationAmount,
      cumulativeDepreciation: depreciation.cumulativeDepreciation,
      wdv: depreciation.wdv
    }
  });
}

// Batch update function for cron job
export async function batchUpdateDepreciation(prisma: any) {
  try {
    // Get all active assets with their asset types
    const assets = await prisma.asset.findMany({
      where: {
        assetUsageStatus: {
          not: 'SCRAPPED'
        }
      },
      include: {
        assetType: true
      }
    });

    // Update depreciation for each asset
    const updates = assets.map(asset => updateAssetDepreciation(prisma, asset));
    await Promise.all(updates);

    return {
      success: true,
      assetsUpdated: updates.length
    };
  } catch (error) {
    console.error('Error in batch depreciation update:', error);
    throw error;
  }
}