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
  // Get the initial values
  const totalValue = asset.openingBalance + asset.addition;
  const depreciationRate = asset.assetType.depreciationPercentage;
  
  // Calculate days since purchase or last depreciation
  const today = new Date();
  const billDate = new Date(asset.billDate);
  const daysSincePurchase = Math.floor(
    (today.getTime() - billDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If asset is less than a day old, return initial values
  if (daysSincePurchase < 1) {
    return {
      currentValue: totalValue,
      depreciationAmount: 0,
      cumulativeDepreciation: 0,
      wdv: totalValue
    };
  }

  // Calculate depreciation based on Indian accounting standards
  // Using Written Down Value (WDV) method
  const yearsElapsed = daysSincePurchase / 365;
  
  // Calculate depreciation amount for the period
  let wdv = totalValue;
  let totalDepreciation = 0;
  
  // Calculate year-wise depreciation
  for (let year = 0; year < Math.ceil(yearsElapsed); year++) {
    const yearFraction = year + 1 > yearsElapsed ? yearsElapsed % 1 : 1;
    const yearlyDepreciation = wdv * (depreciationRate / 100) * yearFraction;
    totalDepreciation += yearlyDepreciation;
    wdv -= yearlyDepreciation;
  }

  // Ensure WDV doesn't go below 5% of original value (as per Indian accounting practices)
  const minimumValue = totalValue * 0.05;
  if (wdv < minimumValue) {
    wdv = minimumValue;
    totalDepreciation = totalValue - minimumValue;
  }

  return {
    currentValue: wdv,
    depreciationAmount: totalDepreciation - (asset.depreciation || 0), // New depreciation for this period
    cumulativeDepreciation: totalDepreciation,
    wdv: wdv
  };
}

// Helper function to update asset depreciation values
export async function updateAssetDepreciation(
  prisma: any,
  asset: Asset & { assetType: AssetType }
) {
  if (asset.assetUsageStatus === 'SCRAPPED') {
    return null;
  }

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