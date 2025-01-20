// @ts-nocheck
import express from "express";
import { getUserProfile, loginUser, logoutUser, registerUser, } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = express.Router();
router.post("/register", registerUser);
router.post("/login",loginUser) 
router.get("/logout", authMiddleware,logoutUser)
router.get("/profile",authMiddleware,getUserProfile )

export default router;
