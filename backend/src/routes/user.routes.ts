import express from "express";
import { registerUser } from "../controllers/user.controller";

const router = express.Router();
// @ts-ignore
router.post("/register", registerUser);

export default router;
