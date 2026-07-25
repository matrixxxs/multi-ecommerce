import "dotenv/config";
import pool from "./config/db";
import express from "express";
import { errorHandler } from "./error/error";
import authRoutes from "./routes/auth.routes";
import resetRoutes from "./routes/reset.routes";
import crudRoutes from "./routes/CRUD.routes";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/auth", resetRoutes);
app.use("/products", crudRoutes);

console.log(process.env.DB_PASSWORD);
app.use(errorHandler);
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
