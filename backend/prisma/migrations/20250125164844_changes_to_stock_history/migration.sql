-- AlterTable
ALTER TABLE "StockHistory" ADD COLUMN     "priceInfo" JSONB,
ADD COLUMN     "securitiesInfo" JSONB,
ADD COLUMN     "tradeInfo" JSONB;
