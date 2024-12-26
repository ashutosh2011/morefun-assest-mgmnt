/*
  Warnings:

  - A unique constraint covering the columns `[assetTypeId,levelNumber]` on the table `approval_levels` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "approval_levels_levelNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "approval_levels_assetTypeId_levelNumber_key" ON "approval_levels"("assetTypeId", "levelNumber");
