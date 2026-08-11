import "dotenv/config";
import "./utils/nodeCorn";
import morgan from "morgan";
import helmet from "helmet";
import pool from "./config/db";
import express from "express";
import { errorHandler } from "./error/error";
import authRoutes from "./routes/auth.routes";
import resetRoutes from "./routes/reset.routes";
import crudRoutes from "./routes/CRUD.routes";
import orderRouter from "./routes/order.router";
import productRouter from "./routes/product.router";
import dashboardRouter from "./routes/dashboard";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/auth", resetRoutes);
app.use("/store", crudRoutes);
app.use("/store", orderRouter);
app.use("/store", productRouter);
app.use("/dashboard", dashboardRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
