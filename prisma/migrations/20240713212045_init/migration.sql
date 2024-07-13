/*
  Warnings:

  - The `keyCooldown` column on the `ApiKey` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `keyLimit` column on the `ApiKey` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "keyCooldown",
ADD COLUMN     "keyCooldown" INTEGER,
DROP COLUMN "keyLimit",
ADD COLUMN     "keyLimit" INTEGER;
