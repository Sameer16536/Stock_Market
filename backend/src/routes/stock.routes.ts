//@ts-nocheck
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  buyStock,
  sellStock,
  getRecentHistoryForAllStocks,
  getSingleStockData,
  getStockHistoryData,
} from "../controllers/stock.controller";

const router = express.Router();

// Routes for stock data
router.get("/recent-history", authMiddleware, getRecentHistoryForAllStocks);
router.get("/:symbol", authMiddleware, getSingleStockData);
router.get("/:symbol/history", authMiddleware, getStockHistoryData);

// Routes for stock trading
router.post("/:symbol/buy", authMiddleware, buyStock);
router.post("/:symbol/sell", authMiddleware, sellStock);

export default router;

