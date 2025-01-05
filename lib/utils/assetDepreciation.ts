import { Asset, AssetType, AssetDepreciation } from '@prisma/client';
import { calculateDepreciation } from './depreciation';

interface CalculateHistoricalDepreciationParams {
  asset: Asset & { assetType: AssetType };
  startDate: Date;
  endDate?: Date;
}

export function calculateHistoricalDepreciation({ 
  asset, 
  startDate, 
  endDate = new Date() 
}: CalculateHistoricalDepreciationParams) {
  const depreciations: Omit<AssetDepreciation, 'id' | 'assetId' | 'calculatedAt'>[] = [];
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  
  let currentBalance = asset.openingBalance;
  let cumulativeDepreciation = 0;
  
  for (let year = startYear; year <= endYear; year++) {
    const isFirstYear = year === startYear;
    const isLastYear = year === endYear;
    
    // For first year, consider only months after purchase
    const monthsInYear = isFirstYear 
      ? 12 - startDate.getMonth() 
      : isLastYear 
        ? endDate.getMonth() + 1 
        : 12;

    const yearDepreciation = calculateDepreciation({
      ...asset,
      depreciations: depreciations,
      openingBalance: currentBalance,
      // Only apply addition in the first year
      addition: isFirstYear ? asset.addition : 0
    });

    // Adjust depreciation amount based on number of months
    const adjustedDepreciation = (yearDepreciation.depreciation * monthsInYear) / 12;

    depreciations.push({
      year,
      openingBalance: yearDepreciation.openingBalance,
      addition: yearDepreciation.addition,
      depreciation: adjustedDepreciation,
      wdv: yearDepreciation.wdv - adjustedDepreciation,
      cumulativeDepreciation: cumulativeDepreciation + adjustedDepreciation
    });

    currentBalance = depreciations[depreciations.length - 1].wdv;
    cumulativeDepreciation += adjustedDepreciation;
  }

  return depreciations;
}

export async function createAssetWithDepreciation(
  prisma: any,
  assetData: any,
  assetType: AssetType
) {
  // Create the initial asset
  const asset = await prisma.asset.create({
    data: {
      ...assetData,
      wdv: assetData.openingBalance + assetData.addition,
      cumulativeDepreciation: 0,
      lastDepreciationDate: new Date(),
    },
    include: {
      assetType: true,
    }
  });

  // Calculate historical depreciation
  const depreciations = calculateHistoricalDepreciation({
    asset: { ...asset, assetType },
    startDate: new Date(assetData.billDate),
  });

  // Create depreciation records
  await prisma.assetDepreciation.createMany({
    data: depreciations.map(dep => ({
      ...dep,
      assetId: asset.id,
      calculatedAt: new Date()
    }))
  });

  // Update asset with latest depreciation values
  const lastDepreciation = depreciations[depreciations.length - 1];
  const updatedAsset = await prisma.asset.update({
    where: { id: asset.id },
    data: {
      wdv: lastDepreciation.wdv,
      cumulativeDepreciation: lastDepreciation.cumulativeDepreciation
    },
    include: {
      assetType: true,
      depreciations: true,
      department: true,
      branch: true,
      user: true
    }
  });

  return updatedAsset;
} 