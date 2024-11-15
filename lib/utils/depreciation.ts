import { Asset } from '@prisma/client';

export function calculateDepreciation(asset: Asset): number {
  const today = new Date();
  const purchaseDate = new Date(asset.dateOfPurchase);
  
  // If last depreciation was calculated today, return current value
  if (asset.lastDepreciationDate && 
      asset.lastDepreciationDate.toDateString() === today.toDateString()) {
    return asset.currentValue;
  }

  const yearsSincePurchase = (today.getTime() - purchaseDate.getTime()) / 
                            (365 * 24 * 60 * 60 * 1000);

  // Using Straight Line Depreciation method
  const annualDepreciation = (asset.purchaseValue - asset.salvageValue) / asset.usefulLife;
  const totalDepreciation = Math.min(
    annualDepreciation * yearsSincePurchase,
    asset.purchaseValue - asset.salvageValue
  );

  return Math.max(
    asset.purchaseValue - totalDepreciation,
    asset.salvageValue
  );
}