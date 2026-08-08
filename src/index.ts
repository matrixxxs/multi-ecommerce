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
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
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

app.use(errorHandler);
app.listen(5000, () => {
  console.log("server is running on port 5000");
});
