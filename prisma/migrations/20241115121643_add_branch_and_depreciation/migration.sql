/*
  Warnings:

  - You are about to drop the column `depreciationValue` on the `assets` table. All the data in the column will be lost.
  - Added the required column `branchId` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentValue` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depreciationRate` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastDepreciationDate` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salvageValue` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usefulLife` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "branches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "branchName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_assets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetName" TEXT NOT NULL,
    "description" TEXT,
    "serialNumber" TEXT,
    "quantity" INTEGER NOT NULL,
    "dateOfPurchase" DATETIME NOT NULL,
    "purchaseValue" REAL NOT NULL,
    "depreciationRate" REAL NOT NULL,
    "usefulLife" INTEGER NOT NULL,
    "salvageValue" REAL NOT NULL,
    "currentValue" REAL NOT NULL,
    "lastDepreciationDate" DATETIME NOT NULL,
    "assetUsageStatus" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "departmentId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetTypeId" TEXT NOT NULL,
    CONSTRAINT "assets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assets_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assets_assetTypeId_fkey" FOREIGN KEY ("assetTypeId") REFERENCES "asset_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_assets" ("assetName", "assetTypeId", "assetUsageStatus", "createdAt", "dateOfPurchase", "departmentId", "description", "id", "purchaseValue", "quantity", "remarks", "updatedAt", "userId") SELECT "assetName", "assetTypeId", "assetUsageStatus", "createdAt", "dateOfPurchase", "departmentId", "description", "id", "purchaseValue", "quantity", "remarks", "updatedAt", "userId" FROM "assets";
DROP TABLE "assets";
ALTER TABLE "new_assets" RENAME TO "assets";
CREATE UNIQUE INDEX "assets_serialNumber_key" ON "assets"("serialNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "branches_branchName_key" ON "branches"("branchName");
