import dotenv from "dotenv";
dotenv.config();
import pool from "./config/db";
import express from "express";
import { errorHandler } from "./error/error";
const app = express();
app.use(express.json());
app.use(errorHandler);
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
