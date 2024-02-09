import express from "express";
import cors from "cors";
import authRouter from "./routers/auth-router";
import boardRouter from "./routers/board-router";
import errorHandler from "./middlewares/error";
export const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use("/", authRouter);
app.use("/", boardRouter);
app.use(errorHandler);
