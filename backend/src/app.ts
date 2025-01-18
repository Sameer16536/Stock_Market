import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import exp from "constants";


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/stocks", stockRouter);

export default app;