import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import stockRoutes from "./routes/stock.routes";


const app = express();
app.use(cors({
    origin: ["http://localhost:5173" , "http://192.168.0.108:5173" ,"http://192.168.0.104:5173","http://192.168.56.1:5173"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


// app.use("/auth", authRouter);
app.use("/user", userRoutes);
app.use("/stocks", stockRoutes);

export default app;