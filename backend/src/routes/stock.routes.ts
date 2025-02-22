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
router.get("/singleHistory", authMiddleware, getSingleStockData);
router.get("/history", authMiddleware, getStockHistoryData);

// Routes for stock trading
router.post("/buy", authMiddleware, buyStock);
router.post("/sell", authMiddleware, sellStock);


export default router;

