import { Asset, AssetType, AssetDepreciation } from '@prisma/client';

interface DepreciationResult {
  openingBalance: number;
  addition: number;
  depreciation: number;
  wdv: number;
  cumulativeDepreciation: number;
  year: number;
}

export function calculateDepreciation(
  asset: Asset & { assetType: AssetType; depreciations?: AssetDepreciation[] }
): DepreciationResult {
  // If asset is scrapped, calculate depreciation until scrap date
  const calculationDate = asset.assetUsageStatus === 'SCRAPPED' 
    ? asset.scrappedAtDate || new Date()
    : new Date();

  const currentYear = calculationDate.getFullYear();
  
  // Get the latest depreciation record
  const lastDepreciation = asset.depreciations?.sort((a, b) => b.year - a.year)[0];
  
  // Calculate opening balance for current year
  const openingBalance = lastDepreciation 
    ? lastDepreciation.wdv 
    : asset.openingBalance;

  // Calculate depreciation
  const totalValue = openingBalance + asset.addition;
  const depreciationRate = asset.assetType.depreciationPercentage / 100;
  
  // Calculate days in current year
  const yearStartDate = new Date(currentYear, 0, 1);
  const daysInYear = Math.floor(
    (calculationDate.getTime() - yearStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate depreciation for current year
  const depreciation = totalValue * depreciationRate * (daysInYear / 365);
  
  // Calculate WDV
  const wdv = totalValue - depreciation;

  // Ensure WDV doesn't go below 5% of original value
  const minimumValue = totalValue * 0.05;
  const finalWdv = Math.max(wdv, minimumValue);
  const finalDepreciation = totalValue - finalWdv;

  // Calculate cumulative depreciation
  const previousCumulativeDepreciation = lastDepreciation?.cumulativeDepreciation || 0;
  const cumulativeDepreciation = previousCumulativeDepreciation + finalDepreciation;

  return {
    openingBalance,
    addition: asset.addition,
    depreciation: finalDepreciation,
    wdv: finalWdv,
    cumulativeDepreciation,
    year: currentYear
  };
}

export async function updateAssetDepreciation(
  prisma: any,
  asset: Asset & { assetType: AssetType }
) {
  const depreciation = calculateDepreciation(asset);

  // Create new depreciation record
  await prisma.assetDepreciation.create({
    data: {
      year: depreciation.year,
      openingBalance: depreciation.openingBalance,
      addition: depreciation.addition,
      depreciation: depreciation.depreciation,
      wdv: depreciation.wdv,
      cumulativeDepreciation: depreciation.cumulativeDepreciation,
      asset: { connect: { id: asset.id } }
    }
  });

  // Update asset's current WDV
  return await prisma.asset.update({
    where: { id: asset.id },
    data: {
      wdv: depreciation.wdv,
      lastDepreciationDate: new Date()
    }
  });
}

export async function batchUpdateDepreciation(prisma: any) {
  try {
    const assets = await prisma.asset.findMany({
      where: {
        assetUsageStatus: {
          not: 'SCRAPPED'
        }
      },
      include: {
        assetType: true,
        depreciations: true
      }
    });

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