import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import stockRoutes from "./routes/stock.routes";


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


// app.use("/auth", authRouter);
app.use("/user", userRoutes);
app.use("/stocks", stockRoutes);

export default app;