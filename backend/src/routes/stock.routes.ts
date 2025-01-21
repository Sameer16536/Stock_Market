//@ts-nocheck
import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { buyStock, getStockHistory, sellStock } from "../controllers/stock.controller";


const router = express.Router();
router.get("/stocks", authMiddleware,getStockHistory )
router.post("/stocks/:symbol/buy", buyStock)
router.post("/stocks/:symbol/sell",sellStock)

export default router;
