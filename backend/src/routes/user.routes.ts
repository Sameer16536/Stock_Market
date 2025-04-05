// @ts-nocheck
import express from "express";
import { getUserProfile, loginUser, logoutUser, registerUser,getUserStockWatchlist,postUserStockWatchlist,deleteUserStockWatchlist, refreshAccessToken } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getTransactionsForUser } from "../controllers/stock.controller";


const router = express.Router();
router.post("/register", registerUser);
router.post("/login",loginUser) 
router.get("/logout", authMiddleware,logoutUser)
router.get("/profile",authMiddleware,getUserProfile )
router.get("/:userId/transactions", authMiddleware, getTransactionsForUser);
router.get("/refresh-token",refreshAccessToken)
//stocks watchlist
router.get('/watchlist', authMiddleware, getUserStockWatchlist);
router.post('/watchlist', authMiddleware, postUserStockWatchlist);
router.delete('/watchlist', authMiddleware, deleteUserStockWatchlist);

export default router;
