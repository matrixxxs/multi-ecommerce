import "dotenv/config";
import "./utils/nodeCorn";
import pool from "./config/db";
import express from "express";
import { errorHandler } from "./error/error";
import authRoutes from "./routes/auth.routes";
import resetRoutes from "./routes/reset.routes";
import crudRoutes from "./routes/CRUD.routes";
import orderRouter from "./routes/order.router";
import productRouter from "./routes/product.router";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/auth", resetRoutes);
app.use("/products", crudRoutes);
app.use("/stores", orderRouter);
app.use("/store", productRouter);

console.log(process.env.DB_PASSWORD);
app.use(errorHandler);
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
