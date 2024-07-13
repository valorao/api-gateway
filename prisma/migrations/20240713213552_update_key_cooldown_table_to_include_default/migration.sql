/*
  Warnings:

  - Made the column `keyCooldown` on table `ApiKey` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ApiKey" ALTER COLUMN "keyCooldown" SET NOT NULL,
ALTER COLUMN "keyCooldown" SET DEFAULT '1 hour',
ALTER COLUMN "keyCooldown" SET DATA TYPE TEXT;
