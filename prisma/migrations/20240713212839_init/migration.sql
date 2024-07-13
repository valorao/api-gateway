/*
  Warnings:

  - Made the column `keyLimit` on table `ApiKey` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ApiKey" ALTER COLUMN "keyLimit" SET NOT NULL,
ALTER COLUMN "keyLimit" SET DEFAULT 30;
