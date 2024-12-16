/*
  Warnings:

  - Added the required column `addition` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetCategory` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billDate` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billNumber` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cumulativeDepreciation` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depreciation` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingBalance` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorName` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wdv` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "addition" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "assetCategory" TEXT NOT NULL,
ADD COLUMN     "billDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "billNumber" TEXT NOT NULL,
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "cumulativeDepreciation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "depreciation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "openingBalance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "vendorName" TEXT NOT NULL,
ADD COLUMN     "wdv" DOUBLE PRECISION NOT NULL;
