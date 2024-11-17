/*
  Warnings:

  - A unique constraint covering the columns `[levelNumber]` on the table `approval_levels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "approval_levels_levelNumber_key" ON "approval_levels"("levelNumber");
