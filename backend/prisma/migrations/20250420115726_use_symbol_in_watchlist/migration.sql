-- Step 1: Add column as nullable
ALTER TABLE "UserStockWatchlist" ADD COLUMN "stockSymbol" TEXT;

-- Step 2: Populate from existing stockId
UPDATE "UserStockWatchlist" uw
SET "stockSymbol" = s."symbol"
FROM "Stock" s
WHERE uw."stockId" = s."id";

-- Step 3: Make it NOT NULL
ALTER TABLE "UserStockWatchlist" ALTER COLUMN "stockSymbol" SET NOT NULL;

-- Step 4: Add foreign key and unique index
ALTER TABLE "UserStockWatchlist"
ADD CONSTRAINT "UserStockWatchlist_stockSymbol_fkey" FOREIGN KEY ("stockSymbol") REFERENCES "Stock"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "UserStockWatchlist_userId_stockSymbol_key" ON "UserStockWatchlist"("userId", "stockSymbol");
