import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("DB connection error:", err);
    process.exit(1);
  } else {
    console.log("connection is working", res?.rows[0].now);
  }
});
pool.on("error", (err) => {
  console.log("an unxpected error occured", err);
});
export default pool;
pool.query("SELECT current_database(), current_schema()", (err, res) => {
  console.log(res?.rows);
});
