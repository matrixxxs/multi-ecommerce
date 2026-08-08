import express from "express";
const router = express.Router();
import { ValidateBody } from "../middleware/validat";
import { admin_user_schema, admin_login_schema } from "../schemas/auth.schemas";
import { signup, login, logOut } from "../controler/auth/auth.controler";
router.post("/signup", ValidateBody(admin_user_schema), signup);
router.post("/login", ValidateBody(admin_login_schema), login);
router.post("/logout", logOut);
export default router;
