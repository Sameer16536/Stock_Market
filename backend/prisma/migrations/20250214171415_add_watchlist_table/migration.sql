-- CreateTable
CREATE TABLE "UserStockWatchlist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "stockId" INTEGER NOT NULL,

    CONSTRAINT "UserStockWatchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStockWatchlist_userId_stockId_key" ON "UserStockWatchlist"("userId", "stockId");

-- AddForeignKey
ALTER TABLE "UserStockWatchlist" ADD CONSTRAINT "UserStockWatchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStockWatchlist" ADD CONSTRAINT "UserStockWatchlist_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
