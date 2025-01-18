import express from "express";
import { getUserProfile, loginUser, logoutUser, registerUser, } from "../controllers/user.controller";


const router = express.Router();
// @ts-ignore
router.post("/register", registerUser);
router.post("/login",loginUser) 
router.get("/logout", logoutUser)
router.get("/profile",getUserProfile )

export default router;
