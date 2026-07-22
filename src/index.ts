import dotenv from "dotenv";
dotenv.config();
import pool from "./config/db";
import express from "express";

const app = express();
app.use(express.json());
console.log(pool);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
