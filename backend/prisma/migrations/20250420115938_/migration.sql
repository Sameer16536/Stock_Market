/*
  Warnings:

  - You are about to drop the column `stockId` on the `UserStockWatchlist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserStockWatchlist" DROP CONSTRAINT "UserStockWatchlist_stockId_fkey";

-- DropIndex
DROP INDEX "UserStockWatchlist_userId_stockId_key";

-- AlterTable
ALTER TABLE "UserStockWatchlist" DROP COLUMN "stockId";
