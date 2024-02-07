import express from "express";
import cors from "cors";
import authRouter from "./routers/auth-router";
export const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use("/", authRouter);
