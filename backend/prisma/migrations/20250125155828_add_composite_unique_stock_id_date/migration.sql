/*
  Warnings:

  - A unique constraint covering the columns `[stockId,date]` on the table `StockHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StockHistory_stockId_date_key" ON "StockHistory"("stockId", "date");
